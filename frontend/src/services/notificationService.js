import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

// GET TOKEN FROM LOCALSTORAGE
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// GET ALL NOTIFICATIONS
export const getNotifications = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// MARK NOTIFICATION AS READ
export const markAsRead = async (id) => {
  const response = await axios.put(
    `${API_URL}/${id}/read`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};