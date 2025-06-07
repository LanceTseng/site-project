// utils/axiosInstance.js
const BASE_URL = process.env.BASE_URL;
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Adjust if necessary
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;