// src/components/TaskCommentsAndActivity.tsx
import {
  Box,
  Typography,
  TextField,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import type { Comment } from "../../api/commentApi";
import type { Activity } from "../../api/activityApi";

const actionLabels: Record<string, string> = {
  created: "created this task",
  status_changed: "changed status",
  assigned: "changed assignee",
  priority_changed: "changed priority",
  due_date_changed: "changed due date",
  comment_added: "added a comment",
  comment_deleted: "deleted a comment",
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

interface Props {
  comments: Comment[];
  activities: Activity[];
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
}

const TaskCommentsAndActivity = ({
  comments,
  activities,
  newComment,
  onNewCommentChange,
  onAddComment,
}: Props) => {
  return (
    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {/* Comments */}
      <Box sx={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Comments
        </Typography>

        <Box sx={{ maxHeight: 320, overflowY: "auto", pr: 0.5 }}>
          {comments.map((c) => (
            <Box key={c._id} sx={{ display: "flex", gap: 1.5, mb: 2 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                {c.author.name.slice(0, 2).toUpperCase()}
              </Avatar>
              <Box sx={{ bgcolor: "#f4f6f8", borderRadius: 2, p: 1.5, flex: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {c.author.name}
                </Typography>
                <Typography variant="body2">{c.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeAgo(c.createdAt)}
                </Typography>
              </Box>
            </Box>
          ))}

          {comments.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No comments yet.
            </Typography>
          )}
        </Box>

        {/* Input bar sticks to the bottom of this column, always visible
            below the comment list — new comments append above it. */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            bgcolor: "#fff",
            zIndex: 10,
            pt: 2,
            mt: "auto",
            borderTop: "1px solid #eee",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              id="task-new-comment"
              name="newComment"
              size="small"
              fullWidth
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => onNewCommentChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAddComment()}
            />

            <Button
              variant="contained"
              onClick={onAddComment}
              sx={{ textTransform: "none" }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Activity Log */}
      <Box sx={{ flex: 1, minWidth: 280 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Activity
        </Typography>

        {activities.map((a) => (
          <Box key={a._id} sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>
              {a.user.name.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" component="div">
                <strong>{a.user.name}</strong>{" "}
                {actionLabels[a.action] || a.action}
                {a.oldValue && a.newValue && (
                  <>
                    {" "}
                    <Chip
                      label={a.oldValue}
                      size="small"
                      sx={{ height: 18, fontSize: 10, mx: 0.5 }}
                    />
                    →
                    <Chip
                      label={a.newValue}
                      size="small"
                      sx={{ height: 18, fontSize: 10, mx: 0.5 }}
                    />
                  </>
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {timeAgo(a.createdAt)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TaskCommentsAndActivity;