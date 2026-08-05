import { Box, Grid, Typography } from "@mui/material";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

import useReports from "../hooks/useReports";

import SummaryCards from "../components/reports/SummaryCards";
import StatusChart from "../components/reports/StatusChart";
import PriorityChart from "../components/reports/PriorityChart";
import WorkloadChart from "../components/reports/WorkloadChart";

import LoadingState from "../components/reports/LoadingState";
import ErrorState from "../components/reports/ErrorState";
import EmptyState from "../components/reports/EmptyState";

const Reports = () => {
  const {
    tasks,
    loading,
    error,

    statusData,
    priorityData,
    workloadData,

    summary,
  } = useReports();

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <TopBar />

        <Box sx={{ p: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Reports
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Analytics and task insights across all projects.
          </Typography>

          {loading && <LoadingState />}

          {!loading && error && <ErrorState message={error} />}

          {!loading && !error && tasks.length === 0 && <EmptyState />}

          {!loading && !error && tasks.length > 0 && (
            <>
              <SummaryCards
                totalTasks={summary.totalTasks}
                completedTasks={summary.completedTasks}
                pendingTasks={summary.pendingTasks}
                totalMembers={summary.totalMembers}
              />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <StatusChart data={statusData} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <PriorityChart data={priorityData} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <WorkloadChart data={workloadData} />
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
