// src/pages/ResetPassword.tsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { resetPassword } from "../api/authApi";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 380, px: 4 }}>
        <Box component="img" src="/logo.png" alt="TaskFlow logo" sx={{ height: 60, mb: 4 }} />

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Enter your new password below
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password reset successfully! Redirecting to login...
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              New Password
            </Typography>
            <TextField
              placeholder="Enter new password"
              type="password"
              fullWidth
              size="small"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <LockOutlinedIcon sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                  ),
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Confirm New Password
            </Typography>
            <TextField
              placeholder="Re-enter new password"
              type="password"
              fullWidth
              size="small"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <LockOutlinedIcon sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mb: 3, textTransform: "none", fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Reset Password"}
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center" }}>
              <Link to="/login" style={{ color: "#1976d2", fontWeight: 600 }}>
                Back to Login
              </Link>
            </Typography>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default ResetPassword;