import axiosInstance from "/js/utils/axiosInstance.js"; // Absolute path for browser
const baseURL = "api/";
// Function to create a new task

class View {
  accessProvisioningView = `${baseURL}access-provisioning-view/`;
  userAccessView = `${baseURL}user-access-view/`;
}

const view = new View();

//---------------------------accessProvisioningView
// Function to get all access provisioning records
export const getAllAccessProvisioning = async () => {
    try {
      const response = await axiosInstance.get(`${view.accessProvisioningView}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all access provisioning records:", error);
      throw error;
    }
  };
  
  // Function to get access provisioning by ID
  export const getAccessProvisioningById = async (id) => {
    try {
      const response = await axiosInstance.get(`${view.accessProvisioningView}${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching access provisioning with ID ${id}:`, error);
      throw error;
    }
  };
  
  // Function to get access provisioning by Role ID
  export const getAccessProvisioningByRoleId = async (roleId) => {
    try {
      const response = await axiosInstance.get(`${view.accessProvisioningView}role/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching access provisioning with Role ID ${roleId}:`, error);
      throw error;
    }
  };


//---------------------------userAccessView
// Function to get all user access records
export const getAllUserAccess = async () => {
    try {
      const response = await axiosInstance.get(`${view.userAccessView}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all user access records:", error);
      throw error;
    }
  };
  
  // Function to get user access by user ID
  export const getUserAccessByUserId = async (userId) => {
    try {
      const response = await axiosInstance.get(`${view.userAccessView}user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user access with User ID ${userId}:`, error);
      throw error;
    }
  };
  
  // Function to get user access by access ID
  export const getUserAccessByAccessId = async (accessId) => {
    try {
      const response = await axiosInstance.get(`${View.userAccessView}access/${accessId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user access with Access ID ${accessId}:`, error);
      throw error;
    }
  };
  
  // Function to get user access by role ID
  export const getUserAccessByRoleId = async (roleId) => {
    try {
      const response = await axiosInstance.get(`${baseURL}role/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user access with Role ID ${roleId}:`, error);
      throw error;
    }
  };
  
  // Function to get user access by username
  export const getUserAccessByUserName = async (userName) => {
    try {
      const response = await axiosInstance.get(`${View.userAccessView}username/${userName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user access with Username ${userName}:`, error);
      throw error;
    }
  };