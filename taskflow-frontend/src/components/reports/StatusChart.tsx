import { Card, Typography, Box } from "@mui/material";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import ChartLegend from "./ChartLegend";

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface StatusChartProps {
  data: StatusData[];
}

const StatusChart = ({ data }: StatusChartProps) => {
  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
        }}
      >
        Tasks by Status
      </Typography>

      <Box sx={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              isAnimationActive
              animationDuration={800}
            >
              {data.map((item, index) => (
                <Cell key={index} fill={item.color} stroke="none" />
              ))}
            </Pie>

            <Tooltip formatter={(value) => [`${value ?? 0} Tasks`, "Count"]} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <ChartLegend data={data} />
    </Card>
  );
};

export default StatusChart;
