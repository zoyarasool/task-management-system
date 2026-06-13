const Task = require("../models/Task");
const Notification = require("../models/Notification");

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TASKS (only tasks owned by logged-in user)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE TASK
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Notify all users this task is shared with
    if (updatedTask.sharedWith.length > 0) {
      for (const recipientId of updatedTask.sharedWith) {
        // Save notification to DB
        const notification = await Notification.create({
          recipient: recipientId,
          sender: req.user._id,
          task: updatedTask._id,
          message: `Task "${updatedTask.title}" status was updated to "${updatedTask.status}" by ${req.user.name}`,
        });

        // Send real-time notification if user is online
        const recipientSocketId = req.connectedUsers[recipientId.toString()];
        if (recipientSocketId) {
          req.io.to(recipientSocketId).emit("notification", {
            message: notification.message,
            task: updatedTask,
          });
        }
      }
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SHARE TASK
const shareTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    const { userId } = req.body;

    // Don't share with yourself
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot share a task with yourself" });
    }

    // Don't add duplicate
    if (task.sharedWith.includes(userId)) {
      return res.status(400).json({ message: "Task already shared with this user" });
    }

    task.sharedWith.push(userId);
    await task.save();

    // Save notification to DB
    const notification = await Notification.create({
      recipient: userId,
      sender: req.user._id,
      task: task._id,
      message: `${req.user.name} shared a task "${task.title}" with you`,
    });

    // Send real-time notification if recipient is online
    const recipientSocketId = req.connectedUsers[userId];
    if (recipientSocketId) {
      req.io.to(recipientSocketId).emit("notification", {
        message: notification.message,
        task: task,
      });
    }

    res.json({ message: "Task shared successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TASKS SHARED WITH ME
const getSharedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ sharedWith: req.user._id })
      .populate("owner", "name email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  shareTask,
  getSharedTasks,
};