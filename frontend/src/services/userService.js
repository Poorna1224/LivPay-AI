import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (phone, password) => {
  const response = await api.post("/auth/login", { phone, password });
  return response.data;
};

export const loginAdmin = async (phone, admin_pin) => {
  const response = await api.post("/auth/admin/login", { phone, admin_pin });
  return response.data;
};

export const accessAdmin = async (name, admin_pin) => {
  const response = await api.post("/auth/admin/access", { name, admin_pin });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateKYC = async (kycData) => {
  const response = await api.post("/api/workers/kyc", kycData);
  return response.data;
};
