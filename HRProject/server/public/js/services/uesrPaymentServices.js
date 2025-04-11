import axiosInstance from "/js/utils/axiosInstance.js"; // Absolute path for browser
const baseURL = "api/";

class View {
  userPayment = `${baseURL}rel-user-payment/`;
  userPaymentView = `${baseURL}user-payment-view/`;
}

var view = new View();

export function createRelUserPayment(data) {
  return axiosInstance
    .post(view.userPayment, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating user payment:", error);
      throw error;
    });
}

export function getAllRelUserPayments() {
  return axiosInstance
    .get(view.userPayment)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching all user payments:", error);
      throw error;
    });
}

export function getRelUserPaymentById(id) {
  return axiosInstance
    .get(`${view.userPayment}${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Error fetching user payment with id ${id}:`, error);
      throw error;
    });
}

export function updateRelUserPayment(id, data) {
  return axiosInstance
    .put(`${view.userPayment}${id}`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Error updating user payment with id ${id}:`, error);
      throw error;
    });
}

export function deleteRelUserPayment(id) {
  return axiosInstance
    .delete(`${view.userPayment}${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Error deleting user payment with id ${id}:`, error);
      throw error;
    });
}

//Vuew
export function getAllUserPaymentView() {
  return axiosInstance
    .get(view.userPaymentView)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching all user payments view:", error);
      throw error;
    });
}

export function getUserPaymentViewByCondition(condition) {
  return axiosInstance
    .get(`${view.userPaymentView}condition`, { params: condition })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching user payments by condition:", error);
      throw error;
    });
}
