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

  // FILL FORM WHEN EDIT BUTTON CLICKED
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

  // FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      status,
      dueDate,
    };

    try {
      // UPDATE TASK
      if (editingTask) {
        await updateTask(
          editingTask._id,
          taskData
        );

        setEditingTask(null);
      }

      // CREATE TASK
      else {
        await createTask(taskData);
      }

      // REFRESH TASK LIST
      fetchTasks();

      // CLEAR FORM
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setDueDate("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>
        {editingTask
          ? "Edit Task"
          : "Add New Task"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* TITLE */}
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <br />
        <br />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <br />
        <br />

        {/* STATUS */}
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option>Pending</option>

          <option>In Progress</option>

          <option>Completed</option>
        </select>

        <br />
        <br />

        {/* DUE DATE */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />

        <br />
        <br />

        {/* BUTTON */}
        <button type="submit">
          {editingTask
            ? "Update Task"
            : "Add Task"}
        </button>
      </form>

      <hr />
    </div>
  );
}

export default TaskForm;