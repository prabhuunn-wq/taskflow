// src/pages/Board.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  type SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import KanbanColumn from "../components/KanbanColumn";
import TaskDetailModal from "../components/task-detail/TaskDetailModal";
import BoardFilters from "../components/board/BoardFilters";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchTasks,
  createTaskThunk,
  updateTaskThunk,
  setTaskStatusOptimistic,
} from "../features/tasks/tasksSlice";
import { getProjectById } from "../api/projectApi";
import type { Task } from "../api/taskApi";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

const Board = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const tasks = useAppSelector((state) => state.tasks.items);
  const loading = useAppSelector((state) => state.tasks.loading);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [projectName, setProjectName] = useState("");

  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  useEffect(() => {
    if (projectId) dispatch(fetchTasks(projectId));
  }, [projectId, dispatch]);

  useEffect(() => {
    const taskId = searchParams.get("taskId");
    if (!taskId || tasks.length === 0) return;

    const found = tasks.find((t) => t._id === taskId);
    if (found) {
      setSelectedTask(found);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, tasks, setSearchParams]);

  useEffect(() => {
    if (projectId) {
      getProjectById(projectId).then((project) => setProjectName(project.name));
    }
  }, [projectId]);

  const assigneeOptions = useMemo(() => {
    const map = new Map<string, string>();
    tasks.forEach((t) => {
      if (t.assignee) map.set(t.assignee._id, t.assignee.name);
    });
    return Array.from(map, ([_id, name]) => ({ _id, name }));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (assigneeFilter && t.assignee?._id !== assigneeFilter) return false;
      return true;
    });
  }, [tasks, priorityFilter, assigneeFilter]);

  const handlePriorityFilterChange = (e: SelectChangeEvent) =>
    setPriorityFilter(e.target.value);
  const handleAssigneeFilterChange = (e: SelectChangeEvent) =>
    setAssigneeFilter(e.target.value);
  const clearFilters = () => {
    setPriorityFilter("");
    setAssigneeFilter("");
  };
  const hasActiveFilters = !!(priorityFilter || assigneeFilter);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t._id === active.id);
    if (!activeTask) return;

    const overColumn = columns.find((c) => c.id === over.id);
    const targetStatus = overColumn
      ? overColumn.id
      : tasks.find((t) => t._id === over.id)?.status;

    if (!targetStatus || targetStatus === activeTask.status) return;

    dispatch(
      setTaskStatusOptimistic({
        id: activeTask._id,
        status: targetStatus as Task["status"],
      }),
    );

    try {
      await dispatch(
        updateTaskThunk({
          id: activeTask._id,
          data: { status: targetStatus as Task["status"] },
        }),
      ).unwrap();
    } catch (err) {
      if (projectId) dispatch(fetchTasks(projectId));
    }
  };

  const handleAddTask = async () => {
    if (!projectId) return;
    const title = window.prompt("Task title");
    if (!title) return;
    await dispatch(createTaskThunk({ project: projectId, title }));
  };

  const refreshTasks = () => {
    if (projectId) dispatch(fetchTasks(projectId));
  };

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

  return (
    <Box sx={{ display: "flex", bgcolor: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <Sidebar />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <TopBar />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1.5, sm: 0 },
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {projectName ? `${projectName}` : "Kanban Board"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                sx={{ textTransform: "none", flex: { xs: 1, sm: "initial" } }}
                onClick={() => navigate(`/project/${projectId}/backlog`)}
              >
                Backlog
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ textTransform: "none", flex: { xs: 1, sm: "initial" } }}
                onClick={handleAddTask}
              >
                Add Task
              </Button>
              <Button
                variant="outlined"
                sx={{ textTransform: "none", flex: { xs: 1, sm: "initial" } }}
                onClick={() => navigate(`/project/${projectId}/settings`)}
              >
                Settings
              </Button>
            </Box>
          </Box>

          <BoardFilters
            priorityFilter={priorityFilter}
            assigneeFilter={assigneeFilter}
            assigneeOptions={assigneeOptions}
            hasActiveFilters={hasActiveFilters}
            onPriorityChange={handlePriorityFilterChange}
            onAssigneeChange={handleAssigneeFilterChange}
            onClearFilters={clearFilters}
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
              {columns.map((col) => (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  tasks={filteredTasks.filter((t) => t.status === col.id)}
                  onTaskClick={(task) => setSelectedTask(task)}
                />
              ))}
            </Box>
          </DndContext>
        </Box>
      </Box>

      <TaskDetailModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdated={refreshTasks}
      />
    </Box>
  );
};

export default Board;