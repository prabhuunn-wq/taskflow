import { Card, Typography } from "@mui/material";

const EmptyState = () => {
  return (
    <Card
      sx={{
        p: 6,
        textAlign: "center",
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
      >
        No Reports Available
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Create projects and tasks to generate reports.
      </Typography>
    </Card>
  );
};

export default EmptyState;