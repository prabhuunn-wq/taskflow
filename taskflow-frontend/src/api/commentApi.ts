// src/api/commentApi.ts
import api from "./axios";

export interface Comment {
  _id: string;
  task: string;
  author: { _id: string; name: string; email: string };
  message: string;
  createdAt: string;
}

export const getCommentsByTask = async (taskId: string): Promise<Comment[]> => {
  const response = await api.get(`/comments/task/${taskId}`);
  return response.data;
};

export const addComment = async (
  taskId: string,
  message: string
): Promise<Comment> => {
  const response = await api.post(`/comments/task/${taskId}`, { message });
  return response.data;
};