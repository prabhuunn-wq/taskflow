// src/components/Sidebar.tsx
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { closeMobileSidebar } from "../features/ui/uiSlice";

const SIDEBAR_WIDTH = 260;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = useAppSelector((state) => state.auth.user);
  const mobileOpen = useAppSelector((state) => state.ui.mobileSidebarOpen);

  const navItems = [
    { label: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/dashboard" },
    {
      label: "Kanban Board",
      icon: <ViewKanbanOutlinedIcon />,
      path: projectId ? `/project/${projectId}` : "/dashboard",
      disabled: !projectId,
    },
    {
      label: "Backlog",
      icon: <ListAltOutlinedIcon />,
      path: projectId ? `/project/${projectId}/backlog` : "/dashboard",
      disabled: !projectId,
    },
    { label: "Calendar", icon: <CalendarTodayOutlinedIcon />, path: "/calendar" },
    { label: "Settings", icon: <SettingsOutlinedIcon />, path: "/settings" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) dispatch(closeMobileSidebar());
  };

  const sidebarContent = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100vh",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #ECECEC",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", px: 3, py: 3.5 }}>
        <Box component="img" src="/logo.png" alt="TaskFlow" sx={{ height: 32 }} />
      </Box>

      <Divider />

      <List sx={{ px: 2, py: 2.5, flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            mb: 1,
            display: "block",
            fontWeight: 600,
            color: "#9CA3AF",
            letterSpacing: 0.5,
            textTransform: "uppercase",
            fontSize: 11,
          }}
        >
          Menu
        </Typography>

        {navItems.map((item) => {
          const active = !item.disabled && location.pathname === item.path;

          return (
            <ListItemButton
              key={item.label}
              disabled={item.disabled}
              onClick={() => handleNavigate(item.path)}
              selected={active}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                py: 1.2,
                transition: "all .2s ease",
                "&.Mui-disabled": { opacity: 0.4 },
                "& .MuiListItemIcon-root": {
                  color: active ? "#fff" : "#6B7280",
                  transition: "color .2s ease",
                },
                "& .MuiListItemText-primary": {
                  fontWeight: active ? 600 : 500,
                  fontSize: 14.5,
                },
                "&.Mui-selected": {
                  background: "linear-gradient(135deg, #1976d2, #1565c0)",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(25,118,210,0.25)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1976d2, #1565c0)",
                  },
                },
                "&:hover": { bgcolor: "#F3F7FF", transform: "translateX(3px)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5, bgcolor: "#FAFBFC" }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38, fontWeight: 600, fontSize: 14 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: "hidden" }}>
          <Typography noWrap sx={{ fontWeight: 600, fontSize: 14 }}>
            {user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        open={mobileOpen}
        onClose={() => dispatch(closeMobileSidebar())}
        ModalProps={{ keepMounted: true }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Box sx={{ position: "sticky", top: 0 }}>
      {sidebarContent}
    </Box>
  );
};

export default Sidebar;