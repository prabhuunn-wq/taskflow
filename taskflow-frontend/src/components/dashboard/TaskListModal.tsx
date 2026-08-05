// src/components/dashboard/TaskListModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Task } from "../../api/taskApi";

export interface TaskListItem {
  task: Task;
  projectId: string;
  projectName: string;
}

const statusColors: Record<string, string> = {
  todo: "default",
  inprogress: "info",
  review: "warning",
  done: "success",
};

const priorityColors: Record<string, string> = {
  low: "#e0e0e0",
  medium: "#fff3cd",
  high: "#ffe0b2",
  critical: "#ffcdd2",
};

interface Props {
  open: boolean;
  title: string;
  items: TaskListItem[];
  onClose: () => void;
  onTaskClick: (item: TaskListItem) => void;
}

const TaskListModal = ({ open, title, items, onClose, onTaskClick }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }} component="span">
          {title} ({items.length})
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: 420 }}>
        {items.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            No tasks here.
          </Typography>
        )}

        {items.map((item) => (
          <Box
            key={item.task._id}
            onClick={() => onTaskClick(item)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
              px: 1,
              borderRadius: 1,
              cursor: "pointer",
              "&:hover": { bgcolor: "#f4f6f8" },
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                {item.task.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.projectName}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <Chip
                label={item.task.priority}
                size="small"
                sx={{
                  bgcolor: priorityColors[item.task.priority],
                  textTransform: "capitalize",
                }}
              />
              <Chip
                label={item.task.status}
                size="small"
                color={statusColors[item.task.status] as any}
                sx={{ textTransform: "capitalize" }}
              />
            </Box>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default TaskListModal;