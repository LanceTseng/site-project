import axiosInstance from "/js/utils/axiosInstance.js"; // Adjust if needed
const baseURL = "api/form-design-view/";

export const getAllFormDesignView = async () => {
  try {
    const response = await axiosInstance.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

export const getFormDesignViewByFormId = async (id) => {
  try {
    const response = await axiosInstance.get(`${baseURL}formid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

export const getFormDesignViewFormTypeByFormTypeId = async () => {
  try {
    const response = await axiosInstance.get(`${baseURL}formtypeid`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};