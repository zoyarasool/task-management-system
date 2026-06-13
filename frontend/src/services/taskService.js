import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

// GET TOKEN FROM LOCALSTORAGE
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// GET TASKS
export const getTasks = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// CREATE TASK
export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// DELETE TASK
export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// UPDATE TASK
export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// SHARE TASK
export const shareTask = async (id, userId) => {
  const response = await axios.put(
    `${API_URL}/${id}/share`,
    { userId },
    { headers: getAuthHeader() }
  );
  return response.data;
};

// GET SHARED TASKS
export const getSharedTasks = async () => {
  const response = await axios.get(`${API_URL}/shared`, {
    headers: getAuthHeader(),
  });
  return response.data;
};