import axios from "axios";

const API_URL = "http://localhost:5000/api/analytics";

// GET TOKEN
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// GET OVERVIEW
export const getOverview = async () => {
  const response = await axios.get(`${API_URL}/overview`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// GET TRENDS
export const getTrends = async (type = "monthly") => {
  const response = await axios.get(`${API_URL}/trends?type=${type}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};