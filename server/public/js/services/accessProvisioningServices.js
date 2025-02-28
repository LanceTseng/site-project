import axiosInstance from "/js/utils/axiosInstance.js"; // Ensure correct path
const baseURL = "api/access-provisioning/";

// Function to create a new access provisioning record
export const createTask = async (data) => {
  try {
    const response = await axiosInstance.post(`${baseURL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating access provisioning record:", error);
    throw error;
  }
};

// Function to get all access provisioning records
export const getAllTask = async () => {
  try {
    const response = await axiosInstance.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching access provisioning records:", error);
    throw error;
  }
};

// Function to get a specific access provisioning record by ID
export const getTaskById = async (id) => {
  try {
    const response = await axiosInstance.get(`${baseURL}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching access provisioning record with ID ${id}:`, error);
    throw error;
  }
};

// Function to get a specific access provisioning record by Name
export const getTaskgByName = async (name) => {
  try {
    const response = await axiosInstance.get(`${baseURL}name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching access provisioning record with name ${name}:`, error);
    throw error;
  }
};

// Function to update an access provisioning record
export const updateTask = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`${baseURL}${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating access provisioning record with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete an access provisioning record
export const deleteTask = async (id) => {
  try {
    const response = await axiosInstance.delete(`${baseURL}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting access provisioning record with ID ${id}:`, error);
    throw error;
  }
};
