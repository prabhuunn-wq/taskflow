// src/components/dashboard/ProjectsList.tsx

import { useCallback, useState } from "react";
import { Card, Typography, Box } from "@mui/material";

import type { Project } from "../../api/projectApi";
import {
  deleteProject as deleteProjectApi,
  updateProject,
} from "../../api/projectApi";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProjects } from "../../features/projects/projectsSlice";

import EditProjectDialog from "./EditProjectDialog";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: Project[];
  progressByProject: Record<
    string,
    {
      completed: number;
      total: number;
    }
  >;
}

const ProjectsList = ({ projects, progressByProject }: Props) => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.user);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);

  const [editProjectId, setEditProjectId] = useState("");

  const [editName, setEditName] = useState("");

  const [editDescription, setEditDescription] = useState("");

  const [editStatus, setEditStatus] = useState<Project["status"]>("active");

  const [saving, setSaving] = useState(false);

  const isOwnerOf = useCallback(
    (project: Project) => {
      return !!currentUser && project.owner._id === currentUser.id;
    },
    [currentUser],
  );

  const handleDelete = useCallback(
    async (e: React.MouseEvent, project: Project) => {
      e.stopPropagation();

      const confirmed = window.confirm(
        `Delete "${project.name}"?\n\nThis action cannot be undone.`,
      );

      if (!confirmed) return;

      setDeletingId(project._id);

      try {
        await deleteProjectApi(project._id);

        dispatch(fetchProjects());
      } catch (error) {
        console.error(error);
      } finally {
        setDeletingId(null);
      }
    },
    [dispatch],
  );

  const handleMarkDone = useCallback(
    async (e: React.MouseEvent, project: Project) => {
      e.stopPropagation();

      try {
        await updateProject(project._id, { status: "completed" });
        dispatch(fetchProjects());
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch],
  );

  const openEdit = useCallback((e: React.MouseEvent, project: Project) => {
    e.stopPropagation();

    setEditProjectId(project._id);
    setEditName(project.name);
    setEditDescription(project.description || "");
    setEditStatus(project.status);

    setEditOpen(true);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editName.trim()) return;

    setSaving(true);

    try {
      await updateProject(editProjectId, {
        name: editName.trim(),
        description: editDescription,
        status: editStatus,
      });

      dispatch(fetchProjects());

      setEditOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [dispatch, editProjectId, editName, editDescription, editStatus]);

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Your Projects
        </Typography>

        {projects.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              No Projects Found
            </Typography>

            <Typography color="text.secondary">
              Create your first project to get started.
            </Typography>
          </Box>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              stats={
                progressByProject[project._id] ?? {
                  completed: 0,
                  total: 0,
                }
              }
              isOwner={isOwnerOf(project)}
              deleting={deletingId === project._id}
              onDelete={handleDelete}
              onEdit={openEdit}
              onMarkDone={handleMarkDone}
            />
          ))
        )}
      </Card>

      <EditProjectDialog
        open={editOpen}
        name={editName}
        description={editDescription}
        status={editStatus}
        saving={saving}
        onNameChange={setEditName}
        onDescriptionChange={setEditDescription}
        onStatusChange={(value: string) =>
          setEditStatus(value as Project["status"])
        }
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default ProjectsList;