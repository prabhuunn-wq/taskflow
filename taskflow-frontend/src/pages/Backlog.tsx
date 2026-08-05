// src/pages/Backlog.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, type SelectChangeEvent } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import TaskDetailModal from "../components/task-detail/TaskDetailModal";
import BacklogFilters from "../components/backlog/BacklogFilters";
import BacklogTable from "../components/backlog/BacklogTable";
import { getTasksByProject, type Task } from "../api/taskApi";
import { getProjectById } from "../api/projectApi";

const Backlog = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [projectName, setProjectName] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  const fetchTasks = async () => {
    if (!projectId) return;
    const data = await getTasksByProject(projectId);
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

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
      if (statusFilter && t.status !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (assigneeFilter && t.assignee?._id !== assigneeFilter) return false;
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, assigneeFilter]);

  const handleStatusFilterChange = (e: SelectChangeEvent) =>
    setStatusFilter(e.target.value);
  const handlePriorityFilterChange = (e: SelectChangeEvent) =>
    setPriorityFilter(e.target.value);
  const handleAssigneeFilterChange = (e: SelectChangeEvent) =>
    setAssigneeFilter(e.target.value);

  const clearFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setAssigneeFilter("");
  };

  const hasActiveFilters = !!(statusFilter || priorityFilter || assigneeFilter);

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#fff",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Sidebar />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <TopBar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            {projectName ? `${projectName}` : "Backlog"}
          </Typography>

          <BacklogFilters
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            assigneeFilter={assigneeFilter}
            assigneeOptions={assigneeOptions}
            filteredCount={filteredTasks.length}
            totalCount={tasks.length}
            hasActiveFilters={hasActiveFilters}
            onStatusChange={handleStatusFilterChange}
            onPriorityChange={handlePriorityFilterChange}
            onAssigneeChange={handleAssigneeFilterChange}
            onClearFilters={clearFilters}
          />

          <BacklogTable
            tasks={filteredTasks}
            onRowClick={(task) => setSelectedTask(task)}
          />
        </Box>
      </Box>

      <TaskDetailModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdated={fetchTasks}
      />
    </Box>
  );
};

export default Backlog;
