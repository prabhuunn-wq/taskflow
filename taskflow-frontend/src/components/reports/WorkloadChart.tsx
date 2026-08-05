import { Card, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { BAR_COLORS } from "../../utils/reportUtils";

interface WorkloadData {
  name: string;
  tasks: number;
}

interface WorkloadChartProps {
  data: WorkloadData[];
}

const WorkloadChart = ({ data }: WorkloadChartProps) => {
  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
        }}
      >
        Task Load by Member
      </Typography>

      <Box sx={{ width: "100%", height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="name" tick={{ fontSize: 12 }} />

            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

            <Tooltip formatter={(value) => [`${value ?? 0} Tasks`, "Count"]} />

            <Bar dataKey="tasks" radius={[8, 8, 0, 0]} animationDuration={900}>
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default WorkloadChart;
