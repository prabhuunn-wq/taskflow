// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { forgotPassword } from "../api/authApi";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [demoLink, setDemoLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(email);
      setSubmitted(true);
      if (data.resetLink) setDemoLink(data.resetLink); // demo-only, real apps email this
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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
          Forgot Password?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Enter your email and we'll help you reset it
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {submitted ? (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              If that email exists, a reset link has been generated.
            </Alert>

            {demoLink && (
              <Box sx={{ mb: 2, p: 2, bgcolor: "#f4f6f8", borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  Demo mode — in production this link would be emailed:
                </Typography>
                <Link to={demoLink.replace("http://localhost:5173", "")} style={{ fontSize: 13, wordBreak: "break-all" }}>
                  {demoLink}
                </Link>
              </Box>
            )}

            <Typography variant="body2" sx={{ textAlign: "center" }}>
              <Link to="/login" style={{ color: "#1976d2", fontWeight: 600 }}>
                Back to Login
              </Link>
            </Typography>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Email Address
            </Typography>
            <TextField
              placeholder="Enter your email"
              type="email"
              fullWidth
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <EmailOutlinedIcon sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
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
              {loading ? <CircularProgress size={22} color="inherit" /> : "Send Reset Link"}
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Remember your password?{" "}
              <Link to="/login" style={{ color: "#1976d2", fontWeight: 600 }}>
                Login
              </Link>
            </Typography>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPassword;