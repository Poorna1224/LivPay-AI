import api from "./api";

export const getPayoutsByUser = async (userId) => {
  const response = await api.get(`/payouts/user/${userId}`);
  return response.data;
};

export const getPayout = async (payoutId) => {
  const response = await api.get(`/payouts/${payoutId}`);
  return response.data;
};

export const processPayout = async (claimId) => {
  const response = await api.post(`/payouts/process/${claimId}`);
  return response.data;
};
