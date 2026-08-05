// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/auth/authSlice";
import { registerUser } from "../api/authApi";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!name.trim()) errors.name = "Full name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!isValidEmail(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const data = await registerUser({ name, email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left side — form (50%) */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 4,
          bgcolor: "background.paper",
          overflowY: "auto",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="TaskFlow logo"
            sx={{ height: 60, mb: 6 }}
          />

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Start managing your projects with TaskFlow
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Full Name
            </Typography>
            <TextField
              placeholder="Enter your full name"
              fullWidth
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <PersonOutlinedIcon
                      sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                    />
                  ),
                },
              }}
            />

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
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <EmailOutlinedIcon
                      sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                    />
                  ),
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Password
            </Typography>
            <TextField
              placeholder="Enter your password"
              type="password"
              fullWidth
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <LockOutlinedIcon
                      sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                    />
                  ),
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Confirm Password
            </Typography>
            <TextField
              placeholder="Re-enter your password"
              type="password"
              fullWidth
              size="small"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <LockOutlinedIcon
                      sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                    />
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
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1976d2", fontWeight: 600 }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Right side — illustration panel (50%) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "50%",
          height: "100%",
          bgcolor: "#ffffff",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box
          component="img"
          src="/login.png"
          alt="TaskFlow dashboard preview"
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
    </Box>
  );
};

export default Register;
