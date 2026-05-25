import { useState, useEffect } from "react";

import {
  createTask,
  updateTask,
} from "../services/taskService";

function TaskForm({
  fetchTasks,
  editingTask,
  setEditingTask,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("Pending");

  const [dueDate, setDueDate] =
    useState("");

  // ALERT MESSAGE
  const [message, setMessage] =
    useState("");

  // FILL FORM WHEN EDITING
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);

      setDescription(
        editingTask.description
      );

      setStatus(editingTask.status);

      setDueDate(
        editingTask.dueDate.split("T")[0]
      );
    }
  }, [editingTask]);

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (
      !title ||
      !description ||
      !dueDate
    ) {
      setMessage(
        "Please fill all fields"
      );

      return;
    }

    const taskData = {
      title,
      description,
      status,
      dueDate,
    };

    try {
      // UPDATE
      if (editingTask) {
        await updateTask(
          editingTask._id,
          taskData
        );

        setMessage(
          "Task updated successfully"
        );

        setEditingTask(null);
      }

      // CREATE
      else {
        await createTask(taskData);

        setMessage(
          "Task added successfully"
        );
      }

      // REFRESH TASKS
      fetchTasks();

      // RESET FORM
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setDueDate("");

      // CLEAR MESSAGE AFTER 3 SECONDS
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.log(error);

      setMessage("Something went wrong");
    }
  };

  return (
    <div className="card shadow p-4 mb-4">
      <h2 className="mb-3">
        {editingTask
          ? "Edit Task"
          : "Add New Task"}
      </h2>

      {/* ALERT */}
      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* TITLE */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Task Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Task Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        {/* STATUS */}
        <div className="mb-3">
          <select
            className="form-select"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option>Pending</option>

            <option>
              In Progress
            </option>

            <option>Completed</option>
          </select>
        </div>

        {/* DATE */}
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="btn btn-primary"
        >
          {editingTask
            ? "Update Task"
            : "Add Task"}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;