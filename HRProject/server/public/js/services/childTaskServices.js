// services/taskApi.js

import axiosInstance from "/js/utils/axiosInstance.js"; // Absolute path for browser
const baseURL = "api/";

// Function to create a new task
export const createTask = async (taskData) => {
  try {
    const response = await axiosInstance.post(
      `${baseURL}/child-tasks`,
      taskData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error; // Re-throw error to be handled by the calling function
  }
};

// Function to get all tasks
export const getTasks = async () => {
  try {
    const response = await axiosInstance.get(`${baseURL}/child-tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Function to get a specific task by ID
export const getTaskById = async (taskId) => {
  try {
    const response = await axiosInstance.get(
      `${baseURL}/child-tasks/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

// Function to get a specific task by ID
export const getTaskByParentTaskId = async (taskId) => {
  try {
    const response = await axiosInstance.get(
      `${baseURL}/child-tasks/parent-task-id/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

// Function to update a task
export const updateTask = async (taskId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `${baseURL}/child-tasks/${taskId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};

// Function to delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(
      `${baseURL}/child-tasks/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};
