// src/components/TopBar.tsx
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleMobileSidebar } from "../features/ui/uiSlice";
import SearchBar from "./topbar/SearchBar";
import UserMenu from "./topbar/UserMenu";
import NotificationBell from "./topbar/NotificationBell";

const TopBar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleToggleSidebar = (event: React.MouseEvent<HTMLButtonElement>) => {
    // The Drawer applies aria-hidden to the rest of the app while it's open.
    // If this button still has DOM focus when that happens, the browser
    // flags "Blocked aria-hidden on an element because its descendant
    // retained focus". Blurring it first moves focus out of the
    // soon-to-be-hidden tree before the Drawer mounts.
    event.currentTarget.blur();
    dispatch(toggleMobileSidebar());
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 3 },
        py: 2,
        bgcolor: "white",
        borderBottom: "1px solid #eee",
        position: "relative",
        gap: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
        {isMobile && (
          <IconButton onClick={handleToggleSidebar} size="small">
            <MenuIcon />
          </IconButton>
        )}
        <SearchBar />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
        <NotificationBell />
        <UserMenu name={user?.name} role={user?.role} />
      </Box>
    </Box>
  );
};

export default TopBar;