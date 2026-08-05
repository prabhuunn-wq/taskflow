// src/components/team/teamColors.ts

export const statusLabels: Record<string, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  review: "Review",
  done: "Done",
};

export const priorityColors: Record<string, string> = {
  low: "#e0e0e0",
  medium: "#fff3cd",
  high: "#ffe0b2",
  critical: "#ffcdd2",
};

export const priorityTextColors: Record<string, string> = {
  low: "#616161",
  medium: "#856404",
  high: "#e65100",
  critical: "#c62828",
};


export const ACCENT_PALETTE = [
  "#1976d2",
  "#7c3aed",
  "#059669",
  "#d97706",
  "#db2777",
  "#0891b2",
];

export const colorForString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENT_PALETTE[Math.abs(hash) % ACCENT_PALETTE.length];
};