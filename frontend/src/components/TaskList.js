import { useEffect, useState } from "react";

import {
  getTasks,
  deleteTask,
} from "../services/taskService";

import TaskForm from "./TaskForm";

function TaskList() {
  // TASKS
  const [tasks, setTasks] = useState([]);

  // EDIT TASK
  const [editingTask, setEditingTask] =
    useState(null);

  // SEARCH
  const [searchTerm, setSearchTerm] =
    useState("");

  // FILTER
  const [statusFilter, setStatusFilter] =
    useState("All");

  // FETCH TASKS
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE TASK
const handleDelete = async (id) => {
  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this task?"
    );

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteTask(id);

    fetchTasks();
  } catch (error) {
    console.log(error);
  }
};

  // FILTERED TASKS
  const filteredTasks = tasks.filter(
    (task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    }
  );

  return (
    <div>
      {/* TASK FORM */}
      <TaskForm
        fetchTasks={fetchTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />

      {/* SEARCH + FILTER */}
      <div className="card p-3 shadow-sm mb-4">
        <h3 className="mb-3">
          Search & Filter
        </h3>

        {/* SEARCH INPUT */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />
        </div>

        {/* FILTER */}
        <div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Tasks
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>
      </div>

      {/* TASK LIST */}
      <h2 className="mb-3">
        All Tasks
      </h2>

      {filteredTasks.length === 0 ? (
        <div className="alert alert-warning">
          No tasks found
        </div>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task._id}
            className="card shadow-sm p-3 mb-3"
          >
            <h4>{task.title}</h4>

            <p>{task.description}</p>

            <p>
              <strong>Status:</strong>{" "}
              {task.status}
            </p>

            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(
                task.dueDate
              ).toLocaleDateString()}
            </p>

            {/* BUTTONS */}
            <div>
              <button
                className="btn btn-warning me-2"
                onClick={() =>
                  setEditingTask(task)
                }
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={() =>
                  handleDelete(task._id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;