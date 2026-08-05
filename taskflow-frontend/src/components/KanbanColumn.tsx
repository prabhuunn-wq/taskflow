// src/components/KanbanColumn.tsx
import {Typography, Paper } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import type { Task } from "../api/taskApi";

interface Props {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const KanbanColumn = ({ id, title, tasks, onTaskClick }: Props) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        bgcolor: "#f4f6f8",
        p: 1.5,
        borderRadius: 2,
        minHeight: 400,
        flex: 1,
      }}
      elevation={0}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}
      >
        {title} · {tasks.length}
      </Typography>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </SortableContext>
    </Paper>
  );
};

export default KanbanColumn;