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
  const [dueDate, setDueDate] = useState("");

  // Fill form when editing
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
      setDueDate(
        editingTask.dueDate.split("T")[0]
      );
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      status,
      dueDate,
    };

    try {
      if (editingTask) {
        await updateTask(
          editingTask._id,
          taskData
        );
        setEditingTask(null);
      } else {
        await createTask(taskData);
      }

      fetchTasks();

      // reset form
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setDueDate("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card shadow p-4 mb-4">
      <h2 className="mb-3">
        {editingTask
          ? "Edit Task"
          : "Add New Task"}
      </h2>

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
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {/* DUE DATE */}
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