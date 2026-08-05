// src/components/topbar/UserMenu.tsx
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

interface Props {
  name?: string;
  role?: string;
}

const UserMenu = ({ name, role }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box
        onClick={() => navigate("/profile")}
        sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
      >
        <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>{initials}</Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {role}
          </Typography>
        </Box>
      </Box>
      <IconButton onClick={handleLogout} size="small">
        <LogoutIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default UserMenu;