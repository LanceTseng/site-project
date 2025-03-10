import axiosInstance from "/js/utils/axiosInstance.js"; // Adjust if needed

const baseURL = "api/";

class View {
  userTraining = `${baseURL}user-training/`;
  userTrainingView = `${baseURL}user-training-view/`;
}

var view = new View();
export const createUserTraining = async (data) => {
  try {
    const response = await axiosInstance.post(view.userTraining, data);
    return response.data;
  } catch (error) {
    console.error("Error creating user training:", error);
    throw error;
  }
};

export const findUserTrainingById = async (id) => {
  try {
    const response = await axiosInstance.get(`${view.userTraining}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error finding user training with ID ${id}:`, error);
    throw error;
  }
};

export const updateUserTraining = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${view.userTraining}${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user training with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUserTraining = async (id) => {
  try {
    const response = await axiosInstance.delete(`${view.userTraining}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user training with ID ${id}:`, error);
    throw error;
  }
};

export const getTrainingModuleViewByCondition = async (condition) => {
  try {
    const response = await axiosInstance.get(
      `${view.userTrainingView}condition`,
      {
        params: condition,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting training module view by condition:", error);
    throw error;
  }
};
