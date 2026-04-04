import api from "./api";

export const getIncomeLossPrediction = async (userId) => {
  const response = await api.get(`/ai/income-loss/${userId}`);
  return response.data;
};
