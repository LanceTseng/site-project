// utils/axiosInstance.js
const BASE_URL = "https://hrproject-rosz.onrender.com";
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Adjust if necessary
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;