// src/components/TaskCard.tsx
import { Card, Typography, Box, Chip, Avatar } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../api/taskApi";
import { isTaskOverdue } from "../utils/taskDisplay";

const priorityColors: Record<string, string> = {
  low: "#e0e0e0",
  medium: "#fff3cd",
  high: "#ffe0b2",
  critical: "#ffcdd2",
};

const priorityTextColors: Record<string, string> = {
  low: "#616161",
  medium: "#856404",
  high: "#e65100",
  critical: "#c62828",
};

const priorityBorderColors: Record<string, string> = {
  low: "#9e9e9e",
  medium: "#f5a623",
  high: "#ff7043",
  critical: "#e53935",
};

interface Props {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
    cursor: "grab",
  };

  const overdue = isTaskOverdue(task);

  const initials = task.assignee?.name
    ? task.assignee.name.split(" ").map((w) => w[0]).join("").slice(0, 2)
    : "";

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      sx={{
        p: 1.5,
        mb: 1.5,
        cursor: "grab",
        borderLeft: `4px solid ${priorityBorderColors[task.priority]}`,
        outline: overdue ? "1px solid #ffcdd2" : "none",
        bgcolor: overdue ? "#fff8f8" : "background.paper",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
        {task.title}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Chip
          label={task.priority}
          size="small"
          sx={{
            bgcolor: priorityColors[task.priority],
            color: priorityTextColors[task.priority],
            fontSize: 11,
            height: 20,
            textTransform: "capitalize",
          }}
        />
        {task.assignee && (
          <Avatar sx={{ width: 22, height: 22, fontSize: 10 }}>{initials}</Avatar>
        )}
      </Box>

      {task.labels && task.labels.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
          {task.labels.map((label) => (
            <Chip key={label} label={label} size="small" variant="outlined" sx={{ fontSize: 10, height: 18 }} />
          ))}
        </Box>
      )}

      {task.dueDate && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: "block",
            color: overdue ? "#d32f2f" : "text.secondary",
            fontWeight: overdue ? 600 : 400,
          }}
        >
          Due {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          {overdue && " (Overdue)"}
        </Typography>
      )}
    </Card>
  );
};

export default TaskCard;