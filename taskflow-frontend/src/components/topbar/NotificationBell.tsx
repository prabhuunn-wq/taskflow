// src/components/topbar/NotificationBell.tsx
import { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Badge,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate } from "react-router-dom";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "../../api/notificationApi";

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadNotifications = async () => {
    const data = await getMyNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
    // Poll every 30s for new notifications
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (n: Notification) => {
    if (!n.read) await markAsRead(n._id);
    setOpen(false);
    loadNotifications();
    navigate(`/project/${(n.task as any).project || ""}`);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    loadNotifications();
  };

  return (
    <Box ref={containerRef} sx={{ position: "relative" }}>
      <IconButton onClick={() => setOpen((prev) => !prev)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      {open && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 340,
            maxHeight: 420,
            overflowY: "auto",
            zIndex: 20,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography
                variant="caption"
                color="primary"
                onClick={handleMarkAllRead}
                sx={{ cursor: "pointer" }}
              >
                Mark all as read
              </Typography>
            )}
          </Box>

          {notifications.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
              No notifications yet
            </Typography>
          )}

          {notifications.map((n) => (
            <Box
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              sx={{
                display: "flex",
                gap: 1.5,
                p: 2,
                cursor: "pointer",
                bgcolor: n.read ? "transparent" : "#f0f7ff",
                "&:hover": { bgcolor: "#f4f6f8" },
                borderBottom: "1px solid #f5f5f5",
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                <NotificationsNoneIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="body2">{n.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeAgo(n.createdAt)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default NotificationBell;