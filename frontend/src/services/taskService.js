import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

// GET TASKS
export const getTasks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// CREATE TASK
export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

// DELETE TASK
export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// UPDATE TASK
export const updateTask = async (id, taskData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    taskData
  );

  return response.data;
};