// src/components/team/TeamProjectCard.tsx
import { Box, Typography, Card, Avatar, Chip, Button } from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import type { Project } from "../../api/projectApi";
import CompletionRing from "./CompletionRing";
import TeamMemberRow, { type TeamMember } from "./TeamMemberRow";
import { colorForString } from "./teamColors";

interface Props {
  project: Project;
  owner: { _id: string; name: string; email: string };
  members: TeamMember[];
  accentColor: string;
  canInvite: boolean;
  onInvite: () => void;
}

const TeamProjectCard = ({ project, owner, members, accentColor, canInvite, onInvite }: Props) => {
  const totalTasks = members.reduce((sum, m) => sum + m.tasks.length, 0);
  const doneTasks = members.reduce(
    (sum, m) => sum + m.tasks.filter((t) => t.status === "done").length,
    0
  );
  const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        border: "1px solid #ECECEC",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        overflow: "hidden",
        display: "flex",
      }}
    >
      {/* Signature accent bar — echoes the priority-color border on task cards */}
      <Box sx={{ width: 5, bgcolor: accentColor, flexShrink: 0 }} />

      <Box sx={{ p: 3, flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2.5,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CompletionRing percent={percent} color={accentColor} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                {project.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75, flexWrap: "wrap" }}>
                <Chip
                  size="small"
                  avatar={
                    <Avatar sx={{ bgcolor: `${colorForString(owner.name)} !important`, fontSize: 10 }}>
                      {owner.name.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  label={`Owner · ${owner.name}`}
                  sx={{
                    bgcolor: "#F3F7FF",
                    color: "#1e40af",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {members.length} member{members.length !== 1 ? "s" : ""} · {totalTasks} task
                  {totalTasks !== 1 ? "s" : ""}
                </Typography>
              </Box>
            </Box>
          </Box>

          {canInvite && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<PersonAddAltOutlinedIcon fontSize="small" />}
              onClick={onInvite}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Invite member
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {members.map((m) => (
            <TeamMemberRow key={m._id} member={m} isOwner={m._id === owner._id} />
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default TeamProjectCard;