// src/components/dashboard/ProjectCard.tsx

import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../api/projectApi";

interface Props {
  project: Project;
  stats: {
    completed: number;
    total: number;
  };
  isOwner: boolean;
  deleting: boolean;
  onDelete: (e: React.MouseEvent, project: Project) => void;
  onEdit: (e: React.MouseEvent, project: Project) => void;
  onMarkDone: (e: React.MouseEvent, project: Project) => void;
}

const statusColor = {
  active: "success",
  completed: "primary",
  archived: "default",
} as const;

const ProjectCard = ({
  project,
  stats,
  isOwner,
  deleting,
  onDelete,
  onEdit,
  onMarkDone,
}: Props) => {
  const navigate = useNavigate();

  const percent =
    stats.total === 0
      ? 0
      : Math.round((stats.completed / stats.total) * 100);

  return (
    <Box
      onClick={() => navigate(`/project/${project._id}`)}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: { xs: 1.5, sm: 0 },
        py: 1.5,
        px: 1,
        borderRadius: 2,
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": {
          bgcolor: "#f5f5f5",
        },
        borderBottom: "1px solid #eee",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, width: { xs: "100%", sm: "auto" } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>{project.name}</Typography>

          <Chip
            label={project.status}
            size="small"
            color={statusColor[project.status]}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {project.description || "No description"}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          width: { xs: "100%", sm: "auto" },
          justifyContent: { xs: "space-between", sm: "flex-end" },
        }}
      >
        <Box
          sx={{
            width: { xs: "60%", sm: 160 },
            mr: { xs: 1, sm: 2 },
          }}
        >
          <Tooltip title={`${stats.completed} of ${stats.total} completed`}>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                height: 6,
                borderRadius: 10,
              }}
            />
          </Tooltip>

          <Typography variant="caption" color="text.secondary">
            {stats.total
              ? `${stats.completed}/${stats.total} (${percent}%)`
              : "No Tasks"}
          </Typography>
        </Box>

        {isOwner && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {project.status !== "completed" && (
              <Tooltip title="Mark as done">
                <IconButton
                  size="small"
                  onClick={(e) => onMarkDone(e, project)}
                  sx={{ color: "#16a34a" }}
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Edit">
              <IconButton size="small" onClick={(e) => onEdit(e, project)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={(e) => onDelete(e, project)}
                disabled={deleting}
                color="error"
              >
                {deleting ? (
                  <CircularProgress size={18} />
                ) : (
                  <DeleteOutlineIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProjectCard;