// src/components/dashboard/TaskStatusChartCard.tsx
import { Box, Typography, Card } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Task } from "../../api/taskApi";

interface Props {
  tasks: Task[];
  onClick: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  review: "Review",
  done: "Done",
};

const STATUS_COLORS: Record<string, string> = {
  todo: "#9e9e9e",
  inprogress: "#42a5f5",
  review: "#ffb74d",
  done: "#66bb6a",
};

const TaskStatusChartCard = ({ tasks, onClick }: Props) => {
  const counts: Record<string, number> = { todo: 0, inprogress: 0, review: 0, done: 0 };
  tasks.forEach((t) => {
    counts[t.status] = (counts[t.status] || 0) + 1;
  });

  const data = Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([status, value]) => ({
      name: STATUS_LABELS[status] || status,
      value,
      color: STATUS_COLORS[status],
    }));

  return (
    <Card
      onClick={onClick}
      sx={{
        p: 2,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <Box sx={{ width: 90, height: 90, flexShrink: 0 }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={26}
                outerRadius={42}
                paddingAngle={2}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "8px solid #EEF1F5",
            }}
          />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Task Status Breakdown
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} across your projects
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.75 }}>
          {data.map((d) => (
            <Box key={d.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: d.color }} />
              <Typography variant="caption" color="text.secondary">
                {d.name} ({d.value})
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <ArrowForwardIosIcon sx={{ fontSize: 14, color: "#9CA3AF", flexShrink: 0 }} />
    </Card>
  );
};

export default TaskStatusChartCard;