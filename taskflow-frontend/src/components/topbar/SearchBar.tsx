// src/components/topbar/SearchBar.tsx
import { useEffect, useRef, useState } from "react";
import { Box, InputBase, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProjects } from "../../features/projects/projectsSlice";
import { getTasksByProject} from "../../api/taskApi";
import SearchResults, { type TaskResult } from "./SearchResults";

const SearchBar = () => {
  const projects = useAppSelector((state) => state.projects.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [allTasks, setAllTasks] = useState<TaskResult[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const tasksLoadedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  useEffect(() => {
    if (projects.length === 0 || tasksLoadedRef.current) return;

    tasksLoadedRef.current = true;
    setTasksLoading(true);

    Promise.all(
      projects.map(async (project) => {
        const tasks = await getTasksByProject(project._id);
        return tasks.map((task) => ({ task, projectName: project.name }));
      })
    )
      .then((results) => setAllTasks(results.flat()))
      .finally(() => setTasksLoading(false));
  }, [projects]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmedQuery = query.trim().toLowerCase();

  const filteredProjects =
    trimmedQuery.length === 0
      ? []
      : projects.filter((p) => p.name.toLowerCase().includes(trimmedQuery)).slice(0, 5);

  const filteredTasks =
    trimmedQuery.length === 0
      ? []
      : allTasks.filter((t) => t.task.title.toLowerCase().includes(trimmedQuery)).slice(0, 6);

  const handleSelectProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
    setQuery("");
    setShowDropdown(false);
  };

  const handleSelectTask = (result: TaskResult) => {
    navigate(`/project/${result.task.project}?taskId=${result.task._id}`);
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <Box ref={containerRef} sx={{ position: "relative", width: 320 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#f4f6f8",
          borderRadius: 2,
          px: 2,
          py: 0.5,
        }}
      >
        <SearchIcon sx={{ color: "text.secondary", fontSize: 20, mr: 1 }} />
        <InputBase
          id="global-search"
          name="search"
          placeholder="Search projects, tasks..."
          fullWidth
          sx={{ fontSize: 14 }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setShowDropdown(true);
          }}
        />
        {tasksLoading && <CircularProgress size={14} sx={{ ml: 1 }} />}
      </Box>

      {showDropdown && trimmedQuery.length > 0 && (
        <SearchResults
          query={query}
          filteredProjects={filteredProjects}
          filteredTasks={filteredTasks}
          onSelectProject={handleSelectProject}
          onSelectTask={handleSelectTask}
        />
      )}
    </Box>
  );
};

export default SearchBar;