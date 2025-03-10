import axiosInstance from "/js/utils/axiosInstance.js"; // Adjust if needed

const baseURL = "api/";

class View {
  userTraining = `${baseURL}user-task-view/`;
  userTrainingView = `${baseURL}user-parent-task-view/`;
}

export async function createUserTraining(data) {
  try {
    const response = await axiosInstance.post(`${baseURL}user-task-view`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating user training:", error);
    throw error;
  }
}

export async function findUserTrainingById(id) {
  try {
    const response = await axiosInstance.get(`${baseURL}user-task-view/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error finding user training by ID:", error);
    throw error;
  }
}

export async function updateUserTraining(id, data) {
  try {
    const response = await axiosInstance.put(
      `${baseURL}user-task-view/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user training:", error);
    throw error;
  }
}

export async function deleteUserTraining(id) {
  try {
    const response = await axiosInstance.delete(
      `${baseURL}user-task-view/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting user training:", error);
    throw error;
  }
}

export async function findAllUserTrainings() {
  try {
    const response = await axiosInstance.get(`${baseURL}user-task-view`);
    return response.data;
  } catch (error) {
    console.error("Error finding all user trainings:", error);
    throw error;
  }
}

//view
export async function getTrainingModuleViewByCondition(condition) {
  try {
    const response = await axiosInstance.get(
      `${baseURL}user-training-view/condition`,
      {
        params: condition,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting training module view by condition:", error);
    throw error;
  }
}
