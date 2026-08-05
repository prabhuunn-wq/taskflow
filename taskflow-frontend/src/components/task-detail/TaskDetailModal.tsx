// src/components/task-detail/TaskDetailModal.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  type SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import type { Task } from "../../api/taskApi";
import { updateTask, deleteTask } from "../../api/taskApi";
import {
  getCommentsByTask,
  addComment,
  type Comment,
} from "../../api/commentApi";
import { getActivityByTask, type Activity } from "../../api/activityApi";
import { getProjectById } from "../../api/projectApi";
import TaskInfoFields from "./TaskInfoFields";
import TaskCommentsAndActivity from "./TaskCommentsAndActivity";
import { useAppSelector } from "../../app/hooks";

interface Props {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const TaskDetailModal = ({ task, open, onClose, onUpdated }: Props) => {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [members, setMembers] = useState<{ _id: string; name: string }[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newComment, setNewComment] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
      setStatus(task.status);
      setPriority(task.priority);
      setAssignee(task.assignee?._id || "");
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
      setLabels(task.labels || []);
      setIsDirty(false);
      loadComments();
      loadActivity();
      loadMembers();
    }
  }, [task]);

  const loadComments = async () => {
    if (!task) return;
    const data = await getCommentsByTask(task._id);
    data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setComments(data);
  };

  const loadActivity = async () => {
    if (!task) return;
    setActivities(await getActivityByTask(task._id));
  };

  const loadMembers = async () => {
    if (!task) return;
    const project = await getProjectById(task.project);
    setMembers(project.members as any);
    const ownerId =
      typeof project.owner === "string"
        ? project.owner
        : (project.owner as any)?._id;
    setIsOwner(!!currentUser && ownerId === currentUser.id);
  };

  // --- Only update local state now; no API call here anymore ---
  const handleStatusChange = (e: SelectChangeEvent) => {
    setStatus(e.target.value);
    setIsDirty(true);
  };

  const handlePriorityChange = (e: SelectChangeEvent) => {
    setPriority(e.target.value);
    setIsDirty(true);
  };

  const handleAssigneeChange = (e: SelectChangeEvent) => {
    if (!isOwner) return;
    setAssignee(e.target.value);
    setIsDirty(true);
  };

  const handleDueDateChange = (value: string) => {
    if (!isOwner) return;
    setDueDate(value);
    setIsDirty(true);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setIsDirty(true);
  };

  const handleLabelsChange = (newLabels: string[]) => {
    if (!isOwner) return;
    setLabels(newLabels);
    setIsDirty(true);
  };

  // --- Single save point: the Done button ---
  const handleDone = async () => {
    if (!task) return;
    setSaving(true);
    try {
      await updateTask(task._id, {
        status: status as Task["status"],
        priority: priority as Task["priority"],
        description,
        ...(isOwner
          ? {
              assignee: assignee || undefined,
              dueDate,
              labels,
            }
          : {}),
      } as any);
      await loadActivity();
      onUpdated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;
    await addComment(task._id, newComment.trim());
    setNewComment("");
    loadComments();
    loadActivity();
  };

  const handleDeleteTask = async () => {
    if (!task || !isOwner) return;
    const confirmed = window.confirm(
      `Delete "${task.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteTask(task._id);
      onUpdated();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }} component="span">
          {task.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {isOwner ? (
            <IconButton
              onClick={handleDeleteTask}
              size="small"
              disabled={deleting}
              title="Delete task"
              sx={{ color: "#d32f2f" }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          ) : (
            <Tooltip title="Only the project owner (team leader) can delete tasks">
              <span>
                <IconButton size="small" disabled sx={{ color: "#d32f2f" }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TaskInfoFields
          status={status}
          priority={priority}
          assignee={assignee}
          dueDate={dueDate}
          description={description}
          labels={labels}
          members={members}
          canManage={isOwner}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onAssigneeChange={handleAssigneeChange}
          onDueDateChange={handleDueDateChange}
          onDueDateBlur={() => {}}
          onDescriptionChange={handleDescriptionChange}
          onDescriptionBlur={() => {}}
          onLabelsChange={handleLabelsChange}
        />

        <Box sx={{ borderTop: "1px solid #eee", pt: 3 }}>
          <TaskCommentsAndActivity
            comments={comments}
            activities={activities}
            newComment={newComment}
            onNewCommentChange={setNewComment}
            onAddComment={handleAddComment}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDone}
          disabled={saving || !isDirty}
        >
          {saving ? "Saving..." : "Done"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailModal;