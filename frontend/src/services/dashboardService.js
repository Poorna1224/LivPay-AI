import api from "./api";

export const getUserDashboard = async (userId) => {
  const response = await api.get(`/dashboard/user/${userId}`);
  return response.data;
};

export const getUserPremium = async (userId) => {
  const response = await api.get(`/premium/user/${userId}`);
  return response.data;
};

export const getIncomeLossPrediction = async (userId) => {
  const response = await api.get(`/ai/income-loss/${userId}`);
  return response.data;
};

export const getUserClaims = async (userId) => {
  const response = await api.get(`/claims/user/${userId}`);
  return response.data;
};

export const getClaimsByUser = getUserClaims;

export const getUserTriggers = async (userId) => {
  const response = await api.get(`/triggers/user/${userId}`);
  return response.data;
};

export const getTriggersByUser = getUserTriggers;

export const getUserPolicies = async (userId) => {
  const response = await api.get(`/policies/user/${userId}`);
  return response.data;
};

export const getUserPayouts = async (userId) => {
  const response = await api.get(`/payouts/user/${userId}`);
  return response.data;
};

export const getUserNotifications = async (userId) => {
  const response = await api.get(`/notifications/user/${userId}`);
  return response.data;
};
