import { useEffect, useState } from "react";

import {
  getTasks,
  deleteTask,
} from "../services/taskService";

import TaskForm from "./TaskForm";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  // EDITING TASK STATE
  const [editingTask, setEditingTask] =
    useState(null);

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
    try {
      await deleteTask(id);

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* TASK FORM */}
      <TaskForm
        fetchTasks={fetchTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />

      <h2>All Tasks</h2>

      {/* DISPLAY TASKS */}
      {tasks.map((task) => (
        <div key={task._id}>
          <h3>{task.title}</h3>

          <p>{task.description}</p>

          <p>Status: {task.status}</p>

          <p>
            Due Date:{" "}
            {new Date(
              task.dueDate
            ).toLocaleDateString()}
          </p>

          {/* EDIT BUTTON */}
          <button
            onClick={() =>
              setEditingTask(task)
            }
          >
            Edit
          </button>

          {/* DELETE BUTTON */}
          <button
            onClick={() =>
              handleDelete(task._id)
            }
          >
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default TaskList;