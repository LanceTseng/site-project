// utils/axiosInstance.js
const BASE_URL = "http://localhost:3000/";
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Adjust if necessary
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;