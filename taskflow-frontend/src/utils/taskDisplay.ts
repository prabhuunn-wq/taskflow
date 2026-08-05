// src/utils/taskDisplay.ts
import type { Task } from "../api/taskApi";


export const statusColors: Record<string, string> = {
  todo: "default",
  inprogress: "info",
  review: "warning",
  done: "success",
};

export const priorityColors: Record<string, string> = {
  low: "#e0e0e0",
  medium: "#fff3cd",
  high: "#ffe0b2",
  critical: "#ffcdd2",
};

export const isTaskOverdue = (task: Task) =>
  !!task.dueDate &&
  task.status !== "done" &&
  new Date(task.dueDate) < new Date(new Date().toDateString());