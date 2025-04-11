import axiosInstance from "/js/utils/axiosInstance.js"; // Adjust if needed

const baseURL = "api/user-emp-view/";

export const getAllUserEmployees = async () => {
  try {
    const response = await axiosInstance.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

export const getUserEmployeeByUserId = async (userId) => {
  try {
     const response = await axiosInstance.get(`${baseURL}userid/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

export const getUserEmployeeByEmployeeId = async (eid) => {
  try {
    const response = await axiosInstance.get(`${baseURL}eid/${eid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

export const getUserEmployeeByUsername = async (username) => {
  try {
    const response = await axiosInstance.get(`${baseURL}username/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

export const getUserEmployeeByEmployeeStatus = async (status) => {
  try {
    const response = await axiosInstance.get(`${baseURL}status/${status}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};
