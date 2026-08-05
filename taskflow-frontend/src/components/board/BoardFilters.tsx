// src/components/board/BoardFilters.tsx
import { Box, Select, MenuItem, Typography, type SelectChangeEvent } from "@mui/material";

interface AssigneeOption {
  _id: string;
  name: string;
}

interface Props {
  priorityFilter: string;
  assigneeFilter: string;
  assigneeOptions: AssigneeOption[];
  hasActiveFilters: boolean;
  onPriorityChange: (e: SelectChangeEvent) => void;
  onAssigneeChange: (e: SelectChangeEvent) => void;
  onClearFilters: () => void;
}

const BoardFilters = ({
  priorityFilter,
  assigneeFilter,
  assigneeOptions,
  hasActiveFilters,
  onPriorityChange,
  onAssigneeChange,
  onClearFilters,
}: Props) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
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
    </Box>
  );
};

export default BoardFilters;