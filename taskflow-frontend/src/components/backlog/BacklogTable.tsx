// src/components/backlog/BacklogTable.tsx
import { Box, Typography, Chip, Avatar } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { Task } from "../../api/taskApi";
import { statusColors, priorityColors, isTaskOverdue } from "../../utils/taskDisplay";

interface Props {
  tasks: Task[];
  onRowClick: (task: Task) => void;
}

const BacklogTable = ({ tasks, onRowClick }: Props) => {
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Task",
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Chip
            label={params.value}
            size="small"
            color={statusColors[params.value] as any}
            sx={{ textTransform: "capitalize" }}
          />
        </Box>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Chip
            label={params.value}
            size="small"
            sx={{
              bgcolor: priorityColors[params.value],
              textTransform: "capitalize",
            }}
          />
        </Box>
      ),
    },
    {
      field: "assignee",
      headerName: "Assignee",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%", gap: 1 }}>
          {params.value ? (
            <>
              <Avatar sx={{ width: 24, height: 24, fontSize: 11 }}>
                {params.value.name.slice(0, 2).toUpperCase()}
              </Avatar>
              <Typography variant="body2">{params.value.name}</Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Unassigned
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      renderCell: (params) => {
        const overdue = isTaskOverdue(params.row as Task);
        const formatted = params.value
          ? new Date(params.value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—";

        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Typography
              variant="body2"
              sx={{
                color: overdue ? "#d32f2f" : "inherit",
                fontWeight: overdue ? 600 : 400,
              }}
            >
              {formatted}
              {overdue && " (Overdue)"}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 500, bgcolor: "white", overflowX: "auto" }}>
      <DataGrid
        rows={tasks}
        columns={columns}
        getRowId={(row) => row._id}
        onRowClick={(params) => onRowClick(params.row)}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        slotProps={{
          pagination: {
            // The default "Rows per page" label/select pair breaks down on
            // narrow (mobile) widths: the label's `for` ends up pointing at a
            // select that gets responsively hidden/re-rendered, causing the
            // "label for doesn't match any element id" DevTools issue.
            // Hiding just the rows-per-page control (not the whole footer)
            // avoids the mismatch and also fits better on small screens.
            labelRowsPerPage: "",
            SelectProps: {
              sx: { display: "none" },
            },
            sx: {
              "& .MuiTablePagination-input": { display: "none" },
              "& .MuiTablePagination-actions": { ml: { xs: 0, sm: 2 } },
            },
          },
        }}
        sx={{
          border: "1px solid #eee",
          minWidth: 600,
          "& .MuiDataGrid-row": { cursor: "pointer" },
          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" },
        }}
      />
    </Box>
  );
};

export default BacklogTable;