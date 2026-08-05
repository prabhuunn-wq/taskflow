// src/components/team/TeamMemberRow.tsx
import { Box, Typography, Avatar, Chip } from "@mui/material";
import type { Task } from "../../api/taskApi";
import { colorForString, statusLabels, priorityColors, priorityTextColors } from "./teamColors";

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  tasks: Task[];
}

interface Props {
  member: TeamMember;
  isOwner: boolean;
}

const TeamMemberRow = ({ member, isOwner }: Props) => {
  return (
    <Box
      sx={{
        bgcolor: "#FAFBFC",
        border: "1px solid #F0F1F3",
        borderRadius: 2,
        p: 1.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: member.tasks.length ? 1 : 0 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: 13,
            fontWeight: 600,
            bgcolor: colorForString(member.name),
          }}
        >
          {member.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#1F2937" }}>
              {member.name}
            </Typography>
            {isOwner && (
              <Chip
                label="Owner"
                size="small"
                sx={{ height: 18, fontSize: 10, bgcolor: "#EEF2FF", color: "#4338CA" }}
              />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
            {member.email}
          </Typography>
        </Box>
        <Chip
          label={`${member.tasks.length} task${member.tasks.length !== 1 ? "s" : ""}`}
          size="small"
          sx={{
            fontSize: 11,
            height: 22,
            fontWeight: 600,
            bgcolor: member.tasks.length ? "#F3F7FF" : "#F3F4F6",
            color: member.tasks.length ? "#1976d2" : "#9CA3AF",
          }}
        />
      </Box>

      {member.tasks.length > 0 && (
        <Box sx={{ pl: 5.75, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {member.tasks.map((t) => (
            <Box
              key={t._id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
                py: 0.25,
              }}
            >
              <Typography sx={{ fontSize: 13, flex: 1, minWidth: 100, color: "#374151" }}>
                {t.title}
              </Typography>
              <Chip
                label={statusLabels[t.status] || t.status}
                size="small"
                sx={{ height: 18, fontSize: 10, bgcolor: "#EEF1F5", color: "#4B5563" }}
              />
              <Chip
                label={t.priority}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  textTransform: "capitalize",
                  bgcolor: priorityColors[t.priority],
                  color: priorityTextColors[t.priority],
                }}
              />
              {t.dueDate && (
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 44, textAlign: "right" }}>
                  {new Date(t.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TeamMemberRow;