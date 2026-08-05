import { Box, Typography } from "@mui/material";

type LegendItem = {
  name: string;
  value: number;
  color: string;
};

interface ChartLegendProps {
  data: LegendItem[];
}

const ChartLegend = ({ data }: ChartLegendProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 2,
        mt: 2,
      }}
    >
      {data.map((item) => (
        <Box
          key={item.name}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: item.color,
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {item.name} ({item.value})
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ChartLegend;