import axiosInstance from "/js/utils/axiosInstance.js"; // Ensure correct path
const baseURL = "api/rel-user-access/";

// Function to get all user accesses
export const getAllTasks = async () => {
  try {
    const response = await axiosInstance.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all user accesses:", error);
    throw error;
  }
};

// Function to get user access by composite key (userId & accessId)
export const getTaskById = async (userId, accessId) => {
  try {
    const response = await axiosInstance.get(`${baseURL}${userId}/${accessId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching user access for userId: ${userId}, accessId: ${accessId}:`,
      error
    );
    throw error;
  }
};

// Function to create a new user access
export const createTask = async (userAccessData) => {
  try {
    const response = await axiosInstance.post(`${baseURL}`, userAccessData);
    return response.data;
  } catch (error) {
    console.error("Error creating user access:", error);
    throw error;
  }
};

// Function to update an existing user access
export const updateTask = async (userId, accessId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `${baseURL}${userId}/${accessId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating user access for userId: ${userId}, accessId: ${accessId}:`,
      error
    );
    throw error;
  }
};

// Function to delete a user access
export const deleteTask = async (userId, accessId) => {
  try {
    const response = await axiosInstance.delete(
      `${baseURL}${userId}/${accessId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting user access for userId: ${userId}, accessId: ${accessId}:`,
      error
    );
    throw error;
  }
};
