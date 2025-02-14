import axiosInstance from "/js/utils/axiosInstance.js"; // Adjust if needed

const baseURL = "api/";

class View {
  userTask = `${baseURL}user-task-view/`;
  parentTask = `${baseURL}user-parent-task-view/`;
  childTask = `${baseURL}user-child-task-view/`;
}

const view = new View(); // Create an instance

// Function to get all user tasks
export const getAllUserTasks = async () => {
  try {
    const response = await axiosInstance.get(`${view.userTask}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

// Function to get a specific user task by ID
export const getUserTaskByUserId = async (id) => {
  try {
    const response = await axiosInstance.get(`${view.userTask}userid/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user task with ID ${id}:`, error);
    throw error;
  }
};

// Function to get a specific user task by ID - head
export const getUserTaskByHeadId = async (id) => {
  try {
    const response = await axiosInstance.get(`${view.userTask}head/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user task with ID ${id}:`, error);
    throw error;
  }
};

//line
export const getUserTaskByLineId = async (id) => {
  try {
    const response = await axiosInstance.get(`${view.userTask}line/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user task with ID ${id}:`, error);
    throw error;
  }
};


// Function to get all parent tasks
export const getAllUserParentTasks = async () => {
  try {
    const response = await axiosInstance.get(`${view.parentTask}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching parent tasks:", error);
    throw error;
  }
};

// Function to get a specific parent task by ID
export const getUserParentTaskByUserId = async (id) => {
  try {
    const response = await axiosInstance.get(`${view.parentTask}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching parent task with ID ${id}:`, error);
    throw error;
  }
};

// Function to get all child tasks
export const getAllUserChildTasks = async () => {
  try {
    const response = await axiosInstance.get(`${view.childTask}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching child tasks:", error);
    throw error;
  }
};

// Function to get a specific child task by task ID
export const getUserChildTaskByTaskId = async (id) => {
  try {
    const response = await axiosInstance.get(`${view.childTask}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching child task with ID ${id}:`, error);
    throw error;
  }
};
