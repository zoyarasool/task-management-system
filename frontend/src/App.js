import { useState } from "react";

import TaskList from "./components/TaskList";

function App() {
  // DARK MODE STATE
  const [darkMode, setDarkMode] =
    useState(false);

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
          <h1>
            Task Management System
          </h1>

          {/* DARK MODE BUTTON */}
          <button
            className={
              darkMode
                ? "btn btn-light"
                : "btn btn-dark"
            }
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode
              ? "Light Mode"
              : "Dark Mode"}
          </button>
        </div>

        {/* TASK LIST */}
        <TaskList darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;