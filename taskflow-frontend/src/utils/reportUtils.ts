import type {  Task } from "../api/taskApi";

export const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  review: "Review",
  done: "Done",
};

export const STATUS_COLORS: Record<string, string> = {
  todo: "#9e9e9e",
  inprogress: "#42a5f5",
  review: "#ffb74d",
  done: "#66bb6a",
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: "#9e9e9e",
  medium: "#ffa726",
  high: "#ff7043",
  critical: "#e53935",
};

export const BAR_COLORS = [
  "#1976d2",
  "#43a047",
  "#fb8c00",
  "#8e24aa",
  "#e53935",
  "#00897b",
];

export const getStatusData = (tasks: Task[]) => {
  return Object.entries(
    tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, value]) => ({
    name: STATUS_LABELS[status] || status,
    value,
    color: STATUS_COLORS[status] || "#9e9e9e",
  }));
};

export const getPriorityData = (tasks: Task[]) => {
  return Object.entries(
    tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {})
  ).map(([priority, value]) => ({
    name:
      priority.charAt(0).toUpperCase() +
      priority.slice(1),
    value,
    color:
      PRIORITY_COLORS[priority] || "#9e9e9e",
  }));
};

export const getWorkloadData = (tasks: Task[]) => {
  const workload = tasks.reduce(
    (acc: Record<string, number>, task) => {
      const member =
        task.assignee?.name || "Unassigned";

      acc[member] = (acc[member] || 0) + 1;

      return acc;
    },
    {}
  );

  return Object.entries(workload)
    .map(([name, tasks]) => ({
      name,
      tasks,
    }))
    .sort((a, b) => b.tasks - a.tasks);
};

export const getSummary = (tasks: Task[]) => {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (t) => t.status === "done"
  ).length;

  const pendingTasks =
    totalTasks - completedTasks;

  const members = new Set(
    tasks.map((t) => t.assignee?.name || "Unassigned")
  );

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    totalMembers: members.size,
    completionRate,
  };
};