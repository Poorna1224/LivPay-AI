import api from "./api";

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

export const getRegisteredWorkers = async () => {
  const response = await api.get("/api/");
  return response.data.filter((user) => user.role === "worker");
};

export const getPendingWorkers = async () => {
  const response = await api.get("/admin/workers/pending");
  return response.data;
};

export const getVerifiedWorkers = async () => {
  const response = await api.get("/admin/workers/verified");
  return response.data;
};

export const getRejectedWorkers = async () => {
  const response = await api.get("/admin/workers/rejected");
  return response.data;
};

export const getAllWorkers = async () => {
  const response = await api.get("/admin/workers/all");
  return response.data;
};

export const verifyWorker = async (workerId) => {
  const response = await api.post(`/admin/workers/${workerId}/verify`);
  return response.data;
};

export const rejectWorker = async (workerId) => {
  const response = await api.post(`/admin/workers/${workerId}/reject`);
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const deleteWorker = async (workerId) => {
  const response = await api.delete(`/admin/workers/${workerId}`);
  return response.data;
};
