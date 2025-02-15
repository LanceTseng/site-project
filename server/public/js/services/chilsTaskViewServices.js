import axiosInstance from "/js/utils/axiosInstance.js"; // Absolute path for browser
const baseURL = "api/child-task-view/";

// Function to get all tasks
export const getAllChildTasks = async () => {
  try {
    const response = await axiosInstance.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Function to get a specific task by ID
export const getChildTaskById = async (taskId) => {
  try {
    const response = await axiosInstance.get(`${baseURL}${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

export const getChildTaskByParentId = async (taskId) => {
  try {
    const response = await axiosInstance.get(`${baseURL}parent/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};
