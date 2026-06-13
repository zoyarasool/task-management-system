import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// REGISTER
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// LOGIN
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("user");
};

// GET LOGGED IN USER
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};