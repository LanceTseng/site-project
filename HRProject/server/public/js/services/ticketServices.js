import axiosInstance from "/js/utils/axiosInstance.js"; // Absolute path for browser
const baseURL = "api/";
// Function to create a new task

class View {
  ticketHead = `${baseURL}ticket-head/`;
  ticketDetail = `${baseURL}ticket-detail/`;
  ticketView = `${baseURL}ticket-view/`;
  ticketHeadView = `${baseURL}ticket-head-view/`;
}

const view = new View();

//ticket head
export const getAllTicketHeads = async () => {
  try {
    const response = await axiosInstance.get(view.ticketHead);
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket heads:", error);
    throw error;
  }
};

export const getTicketHeadById = async (id) => {
  try {
    const response = await axiosInstance.get(`${view.ticketHead}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket head with id ${id}:`, error);
    throw error;
  }
};

export const createTicketHead = async (data) => {
  try {
    const response = await axiosInstance.post(view.ticketHead, data);
    return response.data;
  } catch (error) {
    console.error("Error creating ticket head:", error);
    throw error;
  }
};

export const updateTicketHead = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${view.ticketHead}${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating ticket head with id ${id}:`, error);
    throw error;
  }
};

export const deleteTicketHead = async (id) => {
  try {
    const response = await axiosInstance.delete(`${view.ticketHead}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ticket head with id ${id}:`, error);
    throw error;
  }
};

//ticket detail
export const getAllTicketDetails = async () => {
  try {
    const response = await axiosInstance.get(view.ticketDetail);
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    throw error;
  }
};

export const getTicketDetailById = async (id) => {
  try {
    const response = await axiosInstance.get(`${view.ticketDetail}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket detail with id ${id}:`, error);
    throw error;
  }
};

export const createTicketDetail = async (data) => {
  try {
    const response = await axiosInstance.post(view.ticketDetail, data);
    return response.data;
  } catch (error) {
    console.error("Error creating ticket detail:", error);
    throw error;
  }
};

export const updateTicketDetail = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${view.ticketDetail}${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating ticket detail with id ${id}:`, error);
    throw error;
  }
};

export const deleteTicketDetail = async (id) => {
  try {
    const response = await axiosInstance.delete(`${view.ticketDetail}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ticket detail with id ${id}:`, error);
    throw error;
  }
};

//ticket view
export const getAllTickets = async () => {
  try {
    const response = await axiosInstance.get(view.ticketView);
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const getTicketsByCondition = async (condition) => {
  try {
    const response = await axiosInstance.get(`${view.ticketView}condition`, {
      params: condition,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets by condition:", error);
    throw error;
  }
};

export const getAllTicketHeadView = async () => {
  try {
    const response = await axiosInstance.get(`${view.ticketHeadView}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const getTicketHeadViewByCondition = async (condition) => {
  try {
    const response = await axiosInstance.get(
      `${view.ticketHeadView}condition?`,
      { params: condition }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};
