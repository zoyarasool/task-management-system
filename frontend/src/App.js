import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import TaskList from "./components/TaskList";
import AuthPage from "./pages/AuthPage";
import NotificationSidebar from "./components/NotificationSidebar";
import { getCurrentUser, logout } from "./services/authService";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState("tasks");

  // CHECK IF USER IS ALREADY LOGGED IN
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // FETCH UNREAD NOTIFICATION COUNT
  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const unread = response.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.log(error);
    }
  };
  // SETUP SOCKET.IO WHEN USER LOGS IN
  useEffect(() => {
    if (!user) return;

    const socket = io("http://localhost:5000");

    // Register user with their ID
    socket.on("connect", () => {
      socket.emit("register", user._id);
    });

    // Listen for real-time notifications
    socket.on("notification", (data) => {
      setNewNotification(data.message);
      setUnreadCount((prev) => prev + 1);

      // Clear notification popup after 5 seconds
      setTimeout(() => {
        setNewNotification(null);
      }, 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // HANDLE LOGIN
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // HANDLE LOGOUT
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div
      className={
        darkMode
          ? "bg-dark text-light min-vh-100"
          : "bg-light text-dark min-vh-100"
      }
    >
      <div className="container py-5">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Task Management System</h1>

          <div className="d-flex gap-2 align-items-center">
            {/* SHOW USERNAME IF LOGGED IN */}
            {user && (
              <>
                <span className="me-2">👋 {user.name}</span>

                {/* NOTIFICATION BELL */}
                <button
                  className="btn btn-outline-warning position-relative"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setUnreadCount(0);
                  }}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* LOGOUT BUTTON */}
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

            {/* DARK MODE BUTTON */}
            <button
              className={darkMode ? "btn btn-light" : "btn btn-dark"}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        {/* REAL-TIME NOTIFICATION POPUP */}
        {newNotification && (
          <div
            className="alert alert-success alert-dismissible"
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 9999,
              maxWidth: "350px",
            }}
          >
            🔔 {newNotification}
            <button
              className="btn-close"
              onClick={() => setNewNotification(null)}
            />
          </div>
        )}

        {/* NAVIGATION TABS */}
        {user && (
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "tasks" ? "active" : ""}`}
                onClick={() => setActiveTab("tasks")}
              >
                📋 Tasks
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "analytics" ? "active" : ""}`}
                onClick={() => setActiveTab("analytics")}
              >
                📊 Analytics
              </button>
            </li>
          </ul>
        )}

        {/* SHOW AUTH PAGE OR TASK LIST OR ANALYTICS */}
        {!user ? (
          <AuthPage onLogin={handleLogin} darkMode={darkMode} />
        ) : activeTab === "tasks" ? (
          <TaskList darkMode={darkMode} />
        ) : (
          <AnalyticsDashboard darkMode={darkMode} />
        )}
        

        {/* NOTIFICATION SIDEBAR */}
        {showNotifications && (
          <NotificationSidebar
            darkMode={darkMode}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;