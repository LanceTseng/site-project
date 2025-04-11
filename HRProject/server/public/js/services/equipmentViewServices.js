import axiosInstance from "/js/utils/axiosInstance.js"; // Absolute path for browser
const baseURL = "api/";
// Function to create a new task

class View {
  equiptment = `${baseURL}equipmentview/`;
  eqpt_occupied_his = `${baseURL}eqptoccupiedview/`;
}

const view = new View();

//---------------------------equiptment
// Function to get all tasks
export const getEqpts = async () => {
  try {
    const response = await axiosInstance.get(`${view.equiptment}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Function to get a specific task by ID
export const getEqptByUserId = async (taskId) => {
  try {
    const response = await axiosInstance.get(
      `${view.equiptment}userid/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

export const getEqptByEqptId = async (taskId) => {
  try {
    const response = await axiosInstance.get(
      `${view.equiptment}eqptid/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

export const getEqptByStatus = async (status) => {
  try {
    const response = await axiosInstance.get(
      `${view.equiptment}status/${status}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${status}:`, error);
    throw error;
  }
};

export const getEqptByEqptName = async (name) => {
  try {
    const response = await axiosInstance.get(
      `${view.equiptment}eqptname/${name}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${name}:`, error);
    throw error;
  }
};

//---------------------------eqpt_occupied_his

// Function to get a specific task by ID
export const getEqptOccupiedByUserId = async (taskId) => {
  try {
    const response = await axiosInstance.get(
      `${view.eqpt_occupied_his}userid/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

export const getEqptOccupiedByEqptId = async (eqptId) => {
  try {
    const response = await axiosInstance.get(
      `${view.eqpt_occupied_his}eqptid/${eqptId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${eqptId}:`, error);
    throw error;
  }
};