import { useEffect, useState } from "react";
import axios from "axios";
import { getTasks, deleteTask, shareTask } from "../services/taskService";
import TaskForm from "./TaskForm";

function TaskList({ darkMode }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // SHARE MODAL STATE
  const [sharingTaskId, setSharingTaskId] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [shareMessageType, setShareMessageType] = useState("danger");

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

// HANDLE SHARE
  const handleShare = async (taskId) => {
    if (!shareEmail) {
      setShareMessage("Please enter an email address");
      setShareMessageType("danger");
      return;
    }

    try {
      // STEP 1: Find user by email
      const response = await axios.get(
        `http://localhost:5000/api/users/search?email=${shareEmail}`,
        { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}` } }
      );

      const foundUser = response.data;

      // STEP 2: Share task with that user's ID
      await shareTask(taskId, foundUser._id);
      setShareMessageType("success");
      setShareMessage(`Task shared with ${foundUser.name} successfully!`);
      setShareEmail("");
      setTimeout(() => {
        setSharingTaskId(null);
        setShareMessage("");
      }, 2000);
    } catch (error) {
      setShareMessageType("danger");
      setShareMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;

  const cardClass = darkMode
    ? "card bg-secondary text-light shadow p-3"
    : "card shadow p-3";

  return (
    <div>
      {/* DASHBOARD */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className={cardClass}>
            <h5>Total Tasks</h5>
            <h2>{totalTasks}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className={cardClass}>
            <h5>Completed</h5>
            <h2>{completedTasks}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className={cardClass}>
            <h5>Pending</h5>
            <h2>{pendingTasks}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className={cardClass}>
            <h5>In Progress</h5>
            <h2>{inProgressTasks}</h2>
          </div>
        </div>
      </div>

      {/* FORM */}
      <TaskForm
        fetchTasks={fetchTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        darkMode={darkMode}
      />

      {/* SEARCH + FILTER */}
      <div className={`${cardClass} mb-4`}>
        <h3 className="mb-3">Search & Filter</h3>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* TASKS */}
      <h2 className="mb-3">All Tasks</h2>

      {filteredTasks.length === 0 ? (
        <div className="alert alert-warning">No tasks found</div>
      ) : (
        filteredTasks.map((task) => (
          <div key={task._id} className={`${cardClass} mb-3`}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(task.dueDate).toLocaleDateString()}
            </p>

            {/* BUTTONS */}
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-warning"
                onClick={() => setEditingTask(task)}
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>

              {/* SHARE BUTTON */}
              <button
                className="btn btn-info"
                onClick={() => {
                  setSharingTaskId(task._id);
                  setShareMessage("");
                  setShareEmail("");
                }}
              >
                Share
              </button>
            </div>

            {/* SHARE FORM (shows below the task when Share is clicked) */}
            {sharingTaskId === task._id && (
              <div className="mt-3 p-3 border rounded">
                <h6>Share this task</h6>
                <p className="text-muted small">
  Enter the email address of the person to share with
</p>

                {shareMessage && (
  <div className={`alert alert-${shareMessageType} py-1`}>
    {shareMessage}
  </div>
)}

                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter email address."
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => handleShare(task._id)}
                  >
                    Send
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSharingTaskId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;