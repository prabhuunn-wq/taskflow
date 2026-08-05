// src/components/dashboard/StatsCards.tsx
import { Box, Typography, Card, Grid, Avatar } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";

interface Props {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  onProjectsClick: () => void;
  onTotalTasksClick: () => void;
  onCompletedClick: () => void;
  onPendingClick: () => void;
}

const StatsCards = ({
  totalProjects,
  totalTasks,
  completedTasks,
  pendingTasks,
  onProjectsClick,
  onTotalTasksClick,
  onCompletedClick,
  onPendingClick,
}: Props) => {
  const statCards = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: <FolderOutlinedIcon />,
      color: "#e3f2fd",
      iconColor: "#1976d2",
      onClick: onProjectsClick,
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: <AssignmentOutlinedIcon />,
      color: "#f3e8ff",
      iconColor: "#9333ea",
      onClick: onTotalTasksClick,
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: <CheckCircleOutlinedIcon />,
      color: "#dcfce7",
      iconColor: "#16a34a",
      onClick: onCompletedClick,
    },
    {
      label: "Pending",
      value: pendingTasks,
      icon: <PendingActionsOutlinedIcon />,
      color: "#fef3c7",
      iconColor: "#d97706",
      onClick: onPendingClick,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statCards.map((stat) => (
        <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            onClick={stat.onClick}
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: 3 },
            }}
          >
            <Avatar sx={{ bgcolor: stat.color, color: stat.iconColor }}>
              {stat.icon}
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;