// src/api/authApi.ts
import api from "./axios";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (data: LoginPayload) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};


export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateProfile = async (data: { name?: string; notificationsEnabled?: boolean }) => {
  const response = await api.put("/auth/me", data);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put("/auth/change-password", data);
  return response.data;
};


export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.put(`/auth/reset-password/${token}`, { newPassword });
  return response.data;
};


export const deleteAccount = async () => {
  const response = await api.delete("/auth/me");
  return response.data;
};