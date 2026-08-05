// src/components/backlog/BacklogFilters.tsx
import {
  Box,
  Typography,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";

interface AssigneeOption {
  _id: string;
  name: string;
}

interface Props {
  statusFilter: string;
  priorityFilter: string;
  assigneeFilter: string;
  assigneeOptions: AssigneeOption[];
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onStatusChange: (e: SelectChangeEvent) => void;
  onPriorityChange: (e: SelectChangeEvent) => void;
  onAssigneeChange: (e: SelectChangeEvent) => void;
  onClearFilters: () => void;
}

const BacklogFilters = ({
  statusFilter,
  priorityFilter,
  assigneeFilter,
  assigneeOptions,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onClearFilters,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 2,
        alignItems: { xs: "stretch", sm: "center" },
      }}
    >
      <Select
        value={statusFilter}
        onChange={onStatusChange}
        size="small"
        displayEmpty
        sx={{ minWidth: { xs: "100%", sm: 150 } }}
      >
        <MenuItem value="">All Statuses</MenuItem>
        <MenuItem value="todo">To Do</MenuItem>
        <MenuItem value="inprogress">In Progress</MenuItem>
        <MenuItem value="review">Review</MenuItem>
        <MenuItem value="done">Done</MenuItem>
      </Select>

      <Select
        value={priorityFilter}
        onChange={onPriorityChange}
        size="small"
        displayEmpty
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="">All Priorities</MenuItem>
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
        <MenuItem value="critical">Critical</MenuItem>
      </Select>

      <Select
        value={assigneeFilter}
        onChange={onAssigneeChange}
        size="small"
        displayEmpty
        sx={{ minWidth: 170 }}
      >
        <MenuItem value="">All Assignees</MenuItem>
        {assigneeOptions.map((a) => (
          <MenuItem key={a._id} value={a._id}>
            {a.name}
          </MenuItem>
        ))}
      </Select>

      {hasActiveFilters && (
        <Typography
          variant="body2"
          color="primary"
          onClick={onClearFilters}
          sx={{ cursor: "pointer", fontWeight: 500 }}
        >
          Clear filters
        </Typography>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
        {filteredCount} of {totalCount} tasks
      </Typography>
    </Box>
  );
};

export default BacklogFilters;
