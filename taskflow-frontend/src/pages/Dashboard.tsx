// src/pages/Dashboard.tsx

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import StatsCards from "../components/dashboard/StatsCards";
import ProjectsList from "../components/dashboard/ProjectsList";
import RecentActivity from "../components/dashboard/RecentActivity";
import CreateProjectDialog from "../components/dashboard/CreateProjectDialog";
import TaskListModal, {
  type TaskListItem,
} from "../components/dashboard/TaskListModal";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchProjects,
  addProject,
} from "../features/projects/projectsSlice";

import { getTasksByProject } from "../api/taskApi";
import {
  getActivityByProject,
  type ProjectActivity,
} from "../api/activityApi";

type ModalMode = "all" | "completed" | "pending" | null;

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const projects = useAppSelector((state) => state.projects.items);

  const [allTaskItems, setAllTaskItems] = useState<TaskListItem[]>([]);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const projectsListRef = useRef<HTMLDivElement>(null);

  //----------------------------------------
  // Fetch Projects
  //----------------------------------------

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  //----------------------------------------
  // Fetch Tasks
  //----------------------------------------

  useEffect(() => {
    const loadTasks = async () => {
      if (projects.length === 0) {
        setAllTaskItems([]);
        return;
      }

      setLoading(true);

      try {
        const results = await Promise.all(
          projects.map(async (project) => {
            const tasks = await getTasksByProject(project._id);

            return tasks.map((task) => ({
              task,
              projectId: project._id,
              projectName: project.name,
            }));
          })
        );

        setAllTaskItems(results.flat());
      } catch (err) {
        console.error("Task Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [projects]);

  //----------------------------------------
  // Fetch Activities
  //----------------------------------------

  useEffect(() => {
    const loadActivities = async () => {
      if (projects.length === 0) {
        setActivities([]);
        return;
      }

      try {
        const results = await Promise.all(
          projects.map((project) =>
            getActivityByProject(project._id)
          )
        );

        const merged = results.flat();

        merged.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setActivities(merged.slice(0, 10));
      } catch (err) {
        console.error("Activity Fetch Error:", err);
      }
    };

    loadActivities();
  }, [projects]);

  //----------------------------------------
  // Create Project
  //----------------------------------------

  const handleCreate = useCallback(async () => {
    if (!name.trim()) return;

    await dispatch(
      addProject({
        name,
        description,
      })
    );

    setName("");
    setDescription("");
    setOpen(false);
  }, [dispatch, name, description]);

  //----------------------------------------
  // Memoized Task Stats
  //----------------------------------------

  const completedItems = useMemo(
    () =>
      allTaskItems.filter(
        (item) => item.task.status === "done"
      ),
    [allTaskItems]
  );

  const pendingItems = useMemo(
    () =>
      allTaskItems.filter(
        (item) => item.task.status !== "done"
      ),
    [allTaskItems]
  );

  const totalTasks = allTaskItems.length;

  //----------------------------------------
  // Progress By Project (Single Loop)
  //----------------------------------------

  const progressByProject = useMemo(() => {
    const progress: Record<
      string,
      {
        completed: number;
        total: number;
      }
    > = {};

    allTaskItems.forEach((item) => {
      if (!progress[item.projectId]) {
        progress[item.projectId] = {
          completed: 0,
          total: 0,
        };
      }

      progress[item.projectId].total++;

      if (item.task.status === "done") {
        progress[item.projectId].completed++;
      }
    });

    return progress;
  }, [allTaskItems]);

  //----------------------------------------
  // Task Click
  //----------------------------------------

  const handleTaskClick = useCallback(
    (item: TaskListItem) => {
      setModalMode(null);

      navigate(
        `/project/${item.projectId}?taskId=${item.task._id}`
      );
    },
    [navigate]
  );

  //----------------------------------------
  // Modal Config
  //----------------------------------------

  const modalConfig = useMemo(
    () => ({
      all: {
        title: "All Tasks",
        items: allTaskItems,
      },
      completed: {
        title: "Completed Tasks",
        items: completedItems,
      },
      pending: {
        title: "Pending Tasks",
        items: pendingItems,
      },
    }),
    [allTaskItems, completedItems, pendingItems]
  );

  //----------------------------------------
  // Loading
  //----------------------------------------

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  //----------------------------------------
  // UI
  //----------------------------------------

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f4f6f8",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <TopBar />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "flex-start" },
              gap: { xs: 1.5, sm: 0 },
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Dashboard
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Overview of your projects and tasks
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
              onClick={() => setOpen(true)}
            >
              New Project
            </Button>
          </Box>

          <StatsCards
            totalProjects={projects.length}
            totalTasks={totalTasks}
            completedTasks={completedItems.length}
            pendingTasks={pendingItems.length}
            onProjectsClick={() =>
              projectsListRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            onTotalTasksClick={() => setModalMode("all")}
            onCompletedClick={() => setModalMode("completed")}
            onPendingClick={() => setModalMode("pending")}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <div ref={projectsListRef}>
                <ProjectsList
                  projects={projects}
                  progressByProject={progressByProject}
                />
              </div>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <RecentActivity activities={activities} />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <CreateProjectDialog
        open={open}
        name={name}
        description={description}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
      />

      {modalMode && (
        <TaskListModal
          open={true}
          title={modalConfig[modalMode].title}
          items={modalConfig[modalMode].items}
          onClose={() => setModalMode(null)}
          onTaskClick={handleTaskClick}
        />
      )}
    </Box>
  );
};

export default Dashboard;