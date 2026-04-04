import api from "./api";

export const getSchedulerStatus = async () => {
  const response = await api.get("/scheduler/status");
  return response.data;
};

export const runSchedulerManual = async () => {
  const response = await api.post("/scheduler/trigger");
  return response.data;
};

export const getSchedulerLogs = async () => {
  const response = await api.get("/scheduler/triggers/current");
  return response.data;
};
