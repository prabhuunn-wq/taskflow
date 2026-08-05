// src/components/team/CompletionRing.tsx
import { Box, Typography } from "@mui/material";

interface Props {
  percent: number;
  color: string;
  size?: number;
}

// The page's signature element: at a glance, how much of this project's
// visible work is actually done.
const CompletionRing = ({ percent, color, size = 44 }: Props) => {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EEF1F5"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>
          {percent}%
        </Typography>
      </Box>
    </Box>
  );
};

export default CompletionRing;