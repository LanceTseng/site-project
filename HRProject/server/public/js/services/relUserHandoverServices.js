import axiosInstance from "/js/utils/axiosInstance.js"; // Absolute path for browser
const baseURL = "api/rel-user-handover/";

export const createRelUserHandover = async (data) => {
  try {
    const response = await axiosInstance.post(baseURL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

export const getAllRelUserHandovers = async () => {
  try {
    const response = await axiosInstance.get(baseURL);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

export const getRelUserHandoverById = async (id) => {
  try {
    const response = await axiosInstance.get(`${baseURL}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

export const getRelUserHandoverByChildTaskId = async (id) => {
  try {
    const response = await axiosInstance.get(`${baseURL}childtaskid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

export const getRelUserHandoverReviewById = async (id) => {
  try {
    const response = await axiosInstance.get(`${baseURL}review/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

export const updateRelUserHandover = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${baseURL}${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

export const deleteRelUserHandover = async (id) => {
  try {
    const response = await axiosInstance.delete(`${baseURL}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};
