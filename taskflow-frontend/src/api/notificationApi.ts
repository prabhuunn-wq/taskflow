// src/api/notificationApi.ts
import api from "./axios";

export interface Notification {
  _id: string;
  message: string;
  task: { _id: string; title: string };
  read: boolean;
  createdAt: string;
}

export const getMyNotifications = async (): Promise<Notification[]> => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markAsRead = async (id: string) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};