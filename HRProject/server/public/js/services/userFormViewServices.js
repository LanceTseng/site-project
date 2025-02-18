import axiosInstance from "/js/utils/axiosInstance.js"; // Adjust if needed
const baseURL = "api/user-form-view/";

export const getAllUserTasks = async () => {
  try {
    const response = await axiosInstance.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

export const getAllUserTasksByUserId = async (id) => {
  try {
    const response = await axiosInstance.get(`${baseURL}userid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

//userChildTaskId(LineId)
export const getAllUserTasksByLineId = async (id) => {
  try {
    const response = await axiosInstance.get(`${baseURL}lineid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};