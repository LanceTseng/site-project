import axiosInstance from "/js/utils/axiosInstance.js"; // Absolute path for browser
const baseURL = "api/";

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(`${baseURL}upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getFile = async (filename) => {
    try {
      const response = await axiosInstance.get(`${baseURL}files/${filename}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  };
  
  export const getOfficalFile = async (filename) => {
    try {
      const response = await axiosInstance.get(`${baseURL}files/offical/${filename}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  };

export const getFileUrl = async (filename) => {
  try {
    const response = await axiosInstance.get(`${baseURL}fileurl/${filename}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getOfficalFileUrl = async (filename) => {
  try {
    const response = await axiosInstance.get(`${baseURL}fileurl/offical/${filename}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};