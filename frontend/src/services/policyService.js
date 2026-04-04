import api from "./api";

export const createPolicy = async (policyData) => {
  const response = await api.post("/policies/", policyData);
  return response.data;
};

export const getPoliciesByUser = async (userId) => {
  const response = await api.get(`/policies/user/${userId}`);
  return response.data;
};

export const getPolicy = async (policyId) => {
  const response = await api.get(`/policies/${policyId}`);
  return response.data;
};
