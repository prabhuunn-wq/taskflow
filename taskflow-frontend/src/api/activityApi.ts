// src/api/activityApi.ts
import api from "./axios";


export interface Activity {
  _id: string;
  task: string;
  user: { _id: string; name: string; email: string };
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface ProjectActivity extends Omit<Activity, "task"> {
  task: {
    _id: string;
    title: string;
    dueDate?: string;
    status?: string;
    priority?: string;
  };
}

export const getActivityByTask = async (taskId: string): Promise<Activity[]> => {
  const response = await api.get(`/activity/task/${taskId}`);
  return response.data;
};

export const getActivityByProject = async (
  projectId: string
): Promise<ProjectActivity[]> => {
  const response = await api.get(`/activity/project/${projectId}`);
  return response.data;
};

export const getActivityForProjects = async (
  projectIds: string[]
): Promise<ProjectActivity[]> => {
  const results = await Promise.all(
    projectIds.map((id) => getActivityByProject(id))
  );
  return results.flat();
};