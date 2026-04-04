import api from "./api";

export const getClaimsByUser = async (userId) => {
  const response = await api.get(`/claims/user/${userId}`);
  return response.data;
};

export const createClaimFromTrigger = async (triggerId) => {
  const response = await api.post(`/claims/create-from-trigger/${triggerId}`);
  return response.data;
};

export const getClaim = async (claimId) => {
  const response = await api.get(`/claims/${claimId}`);
  return response.data;
};

export const getTriggersByUser = async (userId) => {
  const response = await api.get(`/triggers/user/${userId}`);
  return response.data;
};

export const getTrigger = async (triggerId) => {
  const response = await api.get(`/triggers/${triggerId}`);
  return response.data;
};
