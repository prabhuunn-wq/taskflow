// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/auth/authSlice";
import { loginUser } from "../api/authApi";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!isValidEmail(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Login to continue managing your projects
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

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
              sx={{ mb: 1 }}
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <FormControlLabel
                control={<Checkbox size="small" defaultChecked />}
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Link to="/forgot-password" style={{ fontSize: 13 }}>
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mb: 2, textTransform: "none", fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Login"}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">
              or
            </Typography>
          </Divider>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#1976d2", fontWeight: 600 }}>
              Register
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
          src="/register.jpg"
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

export default Login;