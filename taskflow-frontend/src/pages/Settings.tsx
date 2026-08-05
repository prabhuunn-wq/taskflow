// src/pages/Settings.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Switch,
  FormControlLabel,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCredentials, logout } from "../features/auth/authSlice";
import { updateProfile, deleteAccount } from "../api/authApi";

const Settings = () => {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    (user as any)?.notificationsEnabled ?? true
  );
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggleNotifications = async (checked: boolean) => {
    setNotificationsEnabled(checked);
    if (!token || !user) return;
    const updated = await updateProfile({ notificationsEnabled: checked });
    dispatch(setCredentials({ user: { ...user, ...updated }, token }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      dispatch(logout());
      navigate("/login");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#fff", minHeight: "100vh" }}>
      <Sidebar />

      <Box sx={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
        <TopBar />

        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            maxWidth: { xs: "100%", sm: 560 },
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: { xs: 2, sm: 3 }, fontSize: { xs: 20, sm: 24 } }}
          >
            Settings
          </Typography>

          {saved && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Preferences saved
            </Alert>
          )}

          <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: 15, sm: 16 } }}>
              Notifications
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, fontSize: { xs: 13, sm: 14 } }}
            >
              Control whether you receive in-app notifications for task assignments and comments.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={(e) => handleToggleNotifications(e.target.checked)}
                />
              }
              label="Enable notifications"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: { xs: 13.5, sm: 14 } } }}
            />
          </Card>

          <Card sx={{ p: { xs: 2, sm: 3 }, border: "1px solid #ffcdd2" }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 1, color: "#d32f2f", fontSize: { xs: 15, sm: 16 } }}
            >
              Danger Zone
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, fontSize: { xs: 13, sm: 14 } }}
            >
              Deleting your account is permanent and cannot be undone. All your projects, tasks, and data will be lost.
            </Typography>

            {!deleteConfirm ? (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={() => setDeleteConfirm(true)}
                sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
              >
                Delete My Account
              </Button>
            ) : (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you absolutely sure? This cannot be undone.
                </Alert>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    fullWidth
                    sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
                  >
                    {deleting ? "Deleting..." : "Yes, Delete Permanently"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setDeleteConfirm(false)}
                    fullWidth
                    sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;