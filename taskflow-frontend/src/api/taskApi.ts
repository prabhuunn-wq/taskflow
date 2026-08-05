// src/api/taskApi.ts
import api from "./axios";

export interface Task {
  _id: string;
  project: string;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: { _id: string; name: string; email: string; avatar?: string };
  reporter: { _id: string; name: string; email: string };
  dueDate?: string;
  order: number;
  labels: string[];
}

export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  const response = await api.get(`/tasks/project/${projectId}`);
  return response.data;
};

export const createTask = async (data: {
  project: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
}): Promise<Task> => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const updateTask = async (
  id: string,
  data: Partial<Task>
): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};