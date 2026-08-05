// src/pages/Team.tsx
import { useState } from "react";
import { Box, Typography, Card, CircularProgress } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { addMember } from "../api/projectApi";
import { useAppSelector } from "../app/hooks";
import { useTeamData } from "../components/team/useTeamData";
import TeamProjectCard from "../components/team/TeamProjectCard";
import InviteMemberDialog from "../components/team/InviteMemberDialog";
import { ACCENT_PALETTE } from "../components/team/teamColors";

const Team = () => {
  const { teams, loading, reload } = useTeamData();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteProjectId, setInviteProjectId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const openInvite = (projectId: string) => {
    setInviteProjectId(projectId);
    setInviteEmail("");
    setInviteError("");
    setInviteOpen(true);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError("");
    try {
      await addMember(inviteProjectId, inviteEmail.trim());
      setInviteOpen(false);
      reload();
    } catch (err: any) {
      setInviteError(
        err?.response?.data?.message || "Could not add member. Check the email and try again."
      );
    } finally {
      setInviting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <TopBar />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ bgcolor: "#F7F8FA", minHeight: "calc(100vh - 64px)", p: { xs: 2, md: 4 } }}>
            <Box sx={{ maxWidth: 980, mx: "auto" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: "#111827" }}>
                Team
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Every project's owner, members, and what's on their plate right now
              </Typography>

              {teams.length === 0 && (
                <Card
                  sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: 3,
                    border: "1px solid #ECECEC",
                    boxShadow: "none",
                  }}
                >
                  <Typography color="text.secondary">
                    No projects yet. Create a project to start building your team.
                  </Typography>
                </Card>
              )}

              {teams.map(({ project, owner, members }, index) => (
                <TeamProjectCard
                  key={project._id}
                  project={project}
                  owner={owner}
                  members={members}
                  accentColor={ACCENT_PALETTE[index % ACCENT_PALETTE.length]}
                  canInvite={!!currentUser && project.owner._id === currentUser.id}
                  onInvite={() => openInvite(project._id)}
                />
              ))}
            </Box>

            <InviteMemberDialog
              open={inviteOpen}
              email={inviteEmail}
              error={inviteError}
              submitting={inviting}
              onEmailChange={setInviteEmail}
              onClose={() => setInviteOpen(false)}
              onSubmit={handleInvite}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Team;