// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  Divider,
  Card,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCredentials } from "../features/auth/authSlice";
import { updateProfile, changePassword } from "../api/authApi";
import { fetchProjects } from "../features/projects/projectsSlice";
import { getTasksByProject } from "../api/taskApi";

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const projects = useAppSelector((state) => state.projects.items);
  const dispatch = useAppDispatch();

  const [name, setName] = useState(user?.name || "");
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  useEffect(() => {
    const loadStats = async () => {
      let total = 0;
      let completed = 0;
      for (const project of projects) {
        const tasks = await getTasksByProject(project._id);
        total += tasks.length;
        completed += tasks.filter((t) => t.status === "done").length;
      }
      setTotalTasks(total);
      setCompletedTasks(completed);
    };
    if (projects.length > 0) loadStats();
  }, [projects]);

  const handleSaveProfile = async () => {
    if (!name.trim() || !token) return;
    const updated = await updateProfile({ name });
    dispatch(setCredentials({ user: updated, token }));
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#fff", minHeight: "100vh" }}>
      <Sidebar />

      <Box sx={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
        <TopBar />

        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: { xs: "100%", sm: 560 } }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: { xs: 2, sm: 3 }, fontSize: { xs: 20, sm: 24 } }}
          >
            Profile
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              minWidth: 0,
            }}
          >
            <Avatar sx={{ width: { xs: 52, sm: 64 }, height: { xs: 52, sm: 64 }, fontSize: { xs: 20, sm: 24 }, flexShrink: 0 }}>
              {initials}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
          </Box>

          {/* Account Stats */}
          <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, mb: 4 }}>
            <Card sx={{ p: { xs: 1.2, sm: 2 }, flex: 1, textAlign: "center", minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 20 } }}>
                {projects.length}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: 10.5, sm: 12 }, display: "block" }}
              >
                Projects
              </Typography>
            </Card>
            <Card sx={{ p: { xs: 1.2, sm: 2 }, flex: 1, textAlign: "center", minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 20 } }}>
                {totalTasks}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: 10.5, sm: 12 }, display: "block" }}
              >
                Total Tasks
              </Typography>
            </Card>
            <Card sx={{ p: { xs: 1.2, sm: 2 }, flex: 1, textAlign: "center", minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 20 } }}>
                {completedTasks}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: 10.5, sm: 12 }, display: "block" }}
              >
                Completed
              </Typography>
            </Card>
          </Box>

          {/* Edit Profile */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Edit Profile
          </Typography>

          {profileSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Profile updated successfully
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Full Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Email
          </Typography>
          <TextField fullWidth size="small" value={user?.email || ""} disabled sx={{ mb: 2 }} />

          <Button
            variant="contained"
            onClick={handleSaveProfile}
            fullWidth
            sx={{ textTransform: "none", mb: 4, width: { xs: "100%", sm: "auto" } }}
          >
            Save Changes
          </Button>

          <Divider sx={{ mb: 3 }} />

          {/* Change Password */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Change Password
          </Typography>

          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password changed successfully
            </Alert>
          )}

          <TextField
            label="Current Password"
            type="password"
            fullWidth
            size="small"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            size="small"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            size="small"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleChangePassword}
            fullWidth
            sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
          >
            Update Password
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;