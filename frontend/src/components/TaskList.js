import { useEffect, useState } from "react";
import {
  getTasks,
  deleteTask,
} from "../services/taskService";

import TaskForm from "./TaskForm";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] =
    useState(null);

  // fetch tasks
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

  // delete task
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* FORM */}
      <TaskForm
        fetchTasks={fetchTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />

      <h2 className="mb-3">All Tasks</h2>

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="card shadow-sm p-3 mb-3"
          >
            <h4>{task.title}</h4>

            <p>{task.description}</p>

            <p>
              <b>Status:</b> {task.status}
            </p>

            <p>
              <b>Due Date:</b>{" "}
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