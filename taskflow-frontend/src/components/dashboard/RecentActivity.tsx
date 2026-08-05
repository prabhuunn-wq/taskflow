// src/components/dashboard/RecentActivity.tsx
import { useState } from "react";
import { Box, Typography, Card, Avatar, Button } from "@mui/material";
import type { ProjectActivity } from "../../api/activityApi";

const actionLabels: Record<string, string> = {
  created: "created a task",
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

const COLLAPSED_COUNT = 5;

interface Props {
  activities: ProjectActivity[];
}

const RecentActivity = ({ activities }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? activities : activities.slice(0, COLLAPSED_COUNT);
  const hasMore = activities.length > COLLAPSED_COUNT;

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Recent Activity
      </Typography>

      {visible.map((a) => (
        <Box key={a._id} sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
            {a.user.name.slice(0, 2).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" component="div">
              <strong>{a.user.name}</strong> {actionLabels[a.action] || a.action}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timeAgo(a.createdAt)}
            </Typography>
          </Box>
        </Box>
      ))}

      {activities.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No recent activity yet.
        </Typography>
      )}

      {hasMore && (
        <Button
          size="small"
          onClick={() => setExpanded((prev) => !prev)}
          sx={{ textTransform: "none", mt: 0.5 }}
        >
          {expanded ? "Show less" : `Show more (${activities.length - COLLAPSED_COUNT} more)`}
        </Button>
      )}
    </Card>
  );
};

export default RecentActivity;