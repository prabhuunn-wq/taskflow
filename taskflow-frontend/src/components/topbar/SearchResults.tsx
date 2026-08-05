// src/components/topbar/SearchResults.tsx
import { Box, Typography, Paper, Chip } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import type { Task } from "../../api/taskApi";
import type { Project } from "../../api/projectApi";


export interface TaskResult {
  task: Task;
  projectName: string;
}

const statusColors: Record<string, string> = {
  todo: "default",
  inprogress: "info",
  review: "warning",
  done: "success",
};

interface Props {
  query: string;
  filteredProjects: Project[];
  filteredTasks: TaskResult[];
  onSelectProject: (projectId: string) => void;
  onSelectTask: (result: TaskResult) => void;
}

const SearchResults = ({
  query,
  filteredProjects,
  filteredTasks,
  onSelectProject,
  onSelectTask,
}: Props) => {
  const hasResults = filteredProjects.length > 0 || filteredTasks.length > 0;

  return (
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        right: 0,
        maxHeight: 400,
        overflowY: "auto",
        zIndex: 20,
        borderRadius: 2,
      }}
    >
      {!hasResults && (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
          No results for "{query}"
        </Typography>
      )}

      {filteredProjects.length > 0 && (
        <Box sx={{ py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, fontWeight: 600 }}>
            PROJECTS
          </Typography>
          {filteredProjects.map((project) => (
            <Box
              key={project._id}
              onClick={() => onSelectProject(project._id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1,
                cursor: "pointer",
                "&:hover": { bgcolor: "#f4f6f8" },
              }}
            >
              <FolderOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <Typography variant="body2">{project.name}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {filteredTasks.length > 0 && (
        <Box sx={{ py: 1, borderTop: filteredProjects.length > 0 ? "1px solid #f0f0f0" : "none" }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, fontWeight: 600 }}>
            TASKS
          </Typography>
          {filteredTasks.map((result) => (
            <Box
              key={result.task._id}
              onClick={() => onSelectTask(result)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                px: 2,
                py: 1,
                cursor: "pointer",
                "&:hover": { bgcolor: "#f4f6f8" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                <AssignmentOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {result.task.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {result.projectName}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={result.task.status}
                size="small"
                color={statusColors[result.task.status] as any}
                sx={{ textTransform: "capitalize", flexShrink: 0 }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default SearchResults;