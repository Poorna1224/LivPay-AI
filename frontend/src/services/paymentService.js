import api from "./api";

export const getPaymentsByUser = async (userId) => {
  const response = await api.get(`/payments/${userId}`);
  return response.data;
};

export const getPaymentSummary = async (userId) => {
  const response = await api.get(`/payments/summary/${userId}`);
  return response.data;
};

export const getPayment = async (paymentId) => {
  const response = await api.get(`/payments/status/${paymentId}`);
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await api.post(`/payments/`, paymentData);
  return response.data;
};

export const payWeeklyPremium = async (userId) => {
  const response = await api.post(`/payments/premium/${userId}/pay`);
  return response.data;
};
