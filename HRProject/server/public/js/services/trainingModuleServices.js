import axiosInstance from "/js/utils/axiosInstance.js"; // Absolute path for browser
const baseURL = "api";
// Function to create a new task

class View {
  trainingModule = `${baseURL}/training-modules`;
  trainingModuleView = `${baseURL}/training-modules-view`;
}
var view = new View();

export const getAllTrainingModules = async () => {
  try {
    const response = await axiosInstance.get(`${view.trainingModule}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching training modules:", error);
    throw error;
  }
};

export const getTrainingModuleById = async (id) => {
  try {
    const response = await axiosInstance.get(`${view.trainingModule}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching training module with id ${id}:`, error);
    throw error;
  }
};

export const createTrainingModule = async (data) => {
  try {
    const response = await axiosInstance.post(`${view.trainingModule}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating training module:", error);
    throw error;
  }
};

export const updateTrainingModule = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `${view.trainingModule}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating training module with id ${id}:`, error);
    throw error;
  }
};

export const deleteTrainingModule = async (id) => {
  try {
    const response = await axiosInstance.delete(`${view.trainingModule}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting training module with id ${id}:`, error);
    throw error;
  }
};
//-----------View

export const getTrainingModuleViewByCondition = async (condition) => {
  try {
    const response = await axiosInstance.get(
      `${view.trainingModuleView}/condition`,
      { params: condition }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching training modules:", error);
    throw error;
  }
};
