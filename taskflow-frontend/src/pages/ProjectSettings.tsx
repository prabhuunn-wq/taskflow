// src/pages/ProjectSettings.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { getProjectById, addMember, removeMember } from "../api/projectApi";
import { useAppSelector } from "../app/hooks";

interface Member {
  _id: string;
  name: string;
  email: string;
}

const ProjectSettings = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [projectName, setProjectName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProject = async () => {
    if (!projectId) return;
    const project = await getProjectById(projectId);
    setProjectName(project.name);
    setOwnerId((project.owner as any)._id || project.owner);
    setMembers(project.members as any);
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const handleAddMember = async () => {
    if (!projectId || !newEmail.trim()) return;
    setError("");
    setSuccess("");
    try {
      await addMember(projectId, newEmail.trim());
      setNewEmail("");
      setSuccess("Member added successfully");
      loadProject();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!projectId) return;
    setError("");
    try {
      await removeMember(projectId, memberId);
      loadProject();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  const isOwner = currentUser?.id === ownerId;

  return (
    <Box sx={{ display: "flex", bgcolor: "#fff", minHeight: "100vh" }}>
      <Sidebar />

      <Box sx={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
        <TopBar />

        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: { xs: "100%", sm: 600 } }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: { xs: 2, sm: 3 }, fontSize: { xs: 20, sm: 24 } }}
          >
            Project Settings
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
            Project Name
          </Typography>
          <TextField fullWidth value={projectName} size="small" disabled sx={{ mb: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Members
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {members.map((m) => (
            <Box
              key={m._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                borderBottom: "1px solid #f0f0f0",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: 13, flexShrink: 0 }}>
                  {m.name.slice(0, 2).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  {/*
                    Typography's default `body2` variant renders a <p>.
                    <Chip> renders a <div>, and a <div> can't legally sit
                    inside a <p> - that's the "cannot be a descendant of"
                    hydration error. Rendering this row as a <span> (via
                    `component="span"`) instead of a paragraph fixes the
                    nesting while keeping the same look.
                  */}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: { xs: 140, sm: "none" },
                      }}
                    >
                      {m.name}
                    </Box>
                    {m._id === ownerId && (
                      <Chip
                        label="Owner"
                        size="small"
                        sx={{ height: 18, fontSize: 10, flexShrink: 0 }}
                      />
                    )}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: { xs: 180, sm: "none" },
                    }}
                  >
                    {m.email}
                  </Typography>
                </Box>
              </Box>

              {isOwner && m._id !== ownerId && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveMember(m._id)}
                  sx={{ flexShrink: 0 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}

          {isOwner && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                mt: 3,
              }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Enter member's email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
              />
              <Button
                variant="contained"
                startIcon={<PersonAddOutlinedIcon />}
                onClick={handleAddMember}
                fullWidth
                sx={{
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Add
              </Button>
            </Box>
          )}

          {!isOwner && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
              Only the project owner can add or remove members.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectSettings;