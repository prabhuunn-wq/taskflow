import { Card, CardContent, Grid, Typography, Box } from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import GroupsIcon from "@mui/icons-material/Groups";

interface SummaryCardsProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalMembers: number;
}

const SummaryCards = ({
  totalTasks,
  completedTasks,
  pendingTasks,
  totalMembers,
}: SummaryCardsProps) => {
  const cards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: <AssignmentIcon />,
      color: "#1976d2",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: <CheckCircleIcon />,
      color: "#2e7d32",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: <PendingActionsIcon />,
      color: "#ed6c02",
    },
    {
      title: "Members",
      value: totalMembers,
      icon: <GroupsIcon />,
      color: "#7b1fa2",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mt: 1,
                    }}
                  >
                    {card.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    bgcolor: `${card.color}20`,
                    color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
