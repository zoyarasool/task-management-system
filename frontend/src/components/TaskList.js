import { useEffect, useState } from "react";
import axios from "axios";
import { getTasks, deleteTask, shareTask } from "../services/taskService";
import TaskForm from "./TaskForm";

function TaskList({ darkMode }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [uploadingTaskId, setUploadingTaskId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadMessageType, setUploadMessageType] = useState("success");

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
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = async (taskId) => {
    if (!shareEmail) {
      setShareMessage("Please enter an email address");
      setShareMessageType("danger");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        "http://localhost:5000/api/users/search?email=" + shareEmail,
        { headers: { Authorization: "Bearer " + user.token } }
      );
      const foundUser = response.data;
      await shareTask(taskId, foundUser._id);
      setShareMessageType("success");
      setShareMessage("Task shared with " + foundUser.name + " successfully!");
      setShareEmail("");
      setTimeout(() => {
        setSharingTaskId(null);
        setShareMessage("");
      }, 2000);
    } catch (error) {
      setShareMessageType("danger");
      setShareMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleUpload = async (taskId) => {
    if (!selectedFile) {
      setUploadMessage("Please select a file");
      setUploadMessageType("danger");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        "http://localhost:5000/api/tasks/" + taskId + "/attachments",
        formData,
        {
          headers: {
            Authorization: "Bearer " + user.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadMessageType("success");
      setUploadMessage("File uploaded successfully!");
      setSelectedFile(null);
      setTimeout(() => {
        setUploadingTaskId(null);
        setUploadMessage("");
      }, 2000);
      fetchTasks();
    } catch (error) {
      setUploadMessageType("danger");
      setUploadMessage(error.response?.data?.message || "Upload failed");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;

  const cardClass = darkMode
    ? "card bg-secondary text-light shadow p-3"
    : "card shadow p-3";

  const renderAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) return null;
    return (
      <div className="mt-2">
        <small><strong>Attached files:</strong></small>
        <div className="mt-1">
          {attachments.map((att, index) => {
            const fileUrl = "http://localhost:5000/" + att.path;
            const fileSize = (att.size / 1024).toFixed(1) + " KB";
            return (
              <div key={index} className="mb-1">
                <span
                  style={{ color: "#0d6efd", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => window.open(fileUrl, "_blank")}
                >
                  {att.originalname}
                </span>
                <small className="text-muted ms-2">({fileSize})</small>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
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

      <TaskForm
        fetchTasks={fetchTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        darkMode={darkMode}
      />

      <div className={cardClass + " mb-4"}>
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

      <h2 className="mb-3">All Tasks</h2>

      {filteredTasks.length === 0 ? (
        <div className="alert alert-warning">No tasks found</div>
      ) : (
        filteredTasks.map((task) => (
          <div key={task._id} className={cardClass + " mb-3"}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(task.dueDate).toLocaleDateString()}
            </p>

            {task.attachments && task.attachments.length > 0 && (
              <p><strong>Attachments:</strong> {task.attachments.length} file(s)</p>
            )}

            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-warning" onClick={() => setEditingTask(task)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(task._id)}>
                Delete
              </button>
              <button
                className="btn btn-info"
                onClick={() => {
                  setSharingTaskId(task._id);
                  setShareMessage("");
                  setShareEmail("");
                  setUploadingTaskId(null);
                }}
              >
                Share
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setUploadingTaskId(task._id);
                  setUploadMessage("");
                  setSelectedFile(null);
                  setSharingTaskId(null);
                }}
              >
                Attach
              </button>
            </div>

            {sharingTaskId === task._id && (
              <div className="mt-3 p-3 border rounded">
                <h6>Share this task</h6>
                <p className="text-muted small">
                  Enter the email address of the person to share with
                </p>
                {shareMessage && (
                  <div className={"alert alert-" + shareMessageType + " py-1"}>
                    {shareMessage}
                  </div>
                )}
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter email address..."
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                  <button className="btn btn-success" onClick={() => handleShare(task._id)}>
                    Send
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSharingTaskId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {uploadingTaskId === task._id && (
              <div className="mt-3 p-3 border rounded">
                <h6>Add Attachment</h6>
                <p className="text-muted small">
                  Supported: Images, PDF, Word, TXT (max 5MB)
                </p>
                {uploadMessage && (
                  <div className={"alert alert-" + uploadMessageType + " py-1"}>
                    {uploadMessage}
                  </div>
                )}
                <div className="d-flex gap-2 mb-2">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <button className="btn btn-success" onClick={() => handleUpload(task._id)}>
                    Upload
                  </button>
                  <button className="btn btn-secondary" onClick={() => setUploadingTaskId(null)}>
                    Cancel
                  </button>
                </div>
                {renderAttachments(task.attachments)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;