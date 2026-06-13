import { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead,
} from "../services/notificationService";

function NotificationSidebar({ darkMode, onClose }) {
  const [notifications, setNotifications] = useState([]);

  const cardClass = darkMode
    ? "bg-secondary text-light"
    : "bg-white text-dark";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(
        notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "350px",
        height: "100vh",
        zIndex: 1000,
        boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
        overflowY: "auto",
      }}
      className={cardClass}
    >
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">
          🔔 Notifications
          {unreadCount > 0 && (
            <span className="badge bg-danger ms-2">{unreadCount}</span>
          )}
        </h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="p-3">
        {notifications.length === 0 ? (
          <p className="text-center text-muted mt-4">No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 mb-2 rounded border ${
                n.isRead ? "opacity-50" : ""
              } ${darkMode ? "border-light" : "border-secondary"}`}
            >
              <p className="mb-1">{n.message}</p>
              <small className="text-muted">
                {new Date(n.createdAt).toLocaleString()}
              </small>

              {!n.isRead && (
                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleMarkAsRead(n._id)}
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationSidebar;