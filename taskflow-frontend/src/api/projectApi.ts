// src/api/projectApi.ts
import api from "./axios";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: { _id: string; name: string; email: string };
  members: string[];
  status: "active" | "completed" | "archived";
  createdAt: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/projects");
  return response.data;
};

export const createProject = async (data: {
  name: string;
  description?: string;
}): Promise<Project> => {
  const response = await api.post("/projects", data);
  return response.data;
};

export const getProjectById = async (id: string): Promise<Project & { members: any[] }> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const updateProject = async (
  id: string,
  data: Partial<Pick<Project, "name" | "description" | "status">>
): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

export const addMember = async (projectId: string, email: string) => {
  const response = await api.post(`/projects/${projectId}/members`, { email });
  return response.data;
};

export const removeMember = async (projectId: string, memberId: string) => {
  const response = await api.delete(`/projects/${projectId}/members/${memberId}`);
  return response.data;
};