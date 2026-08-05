// src/components/task-detail/TaskInfoFields.tsx
import { useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  type SelectChangeEvent,
} from "@mui/material";

interface Member {
  _id: string;
  name: string;
}

interface Props {
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  description: string;
  labels: string[];
  members: Member[];
  canManage: boolean;
  onStatusChange: (e: SelectChangeEvent) => void;
  onPriorityChange: (e: SelectChangeEvent) => void;
  onAssigneeChange: (e: SelectChangeEvent) => void;
  onDueDateChange: (value: string) => void;
  onDueDateBlur: () => void;
  onDescriptionChange: (value: string) => void;
  onDescriptionBlur: () => void;
  onLabelsChange: (labels: string[]) => void;
}

const OWNER_ONLY_MESSAGE =
  "Only the project owner (team leader) can change this";

const TaskInfoFields = ({
  status,
  priority,
  assignee,
  dueDate,
  description,
  labels,
  members,
  canManage,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onDueDateChange,
  onDueDateBlur,
  onDescriptionChange,
  onDescriptionBlur,
  onLabelsChange,
}: Props) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [labelInput, setLabelInput] = useState("");

  const handleAddLabel = () => {
    if (!canManage) return;
    const trimmed = labelInput.trim();
    if (trimmed && !labels.includes(trimmed)) {
      onLabelsChange([...labels, trimmed]);
    }
    setLabelInput("");
  };

  const handleRemoveLabel = (label: string) => {
    if (!canManage) return;
    onLabelsChange(labels.filter((l) => l !== label));
  };

  const assigneeSelect = (
    <Select
      id="task-assignee"
      name="assignee"
      value={members.some((m) => m._id === assignee) ? assignee : ""}
      onChange={onAssigneeChange}
      size="small"
      displayEmpty
      disabled={!canManage}
      sx={{ display: "block", minWidth: 160, mt: 0.5 }}
    >
      <MenuItem value="">Unassigned</MenuItem>
      {members.map((m) => (
        <MenuItem key={m._id} value={m._id}>
          {m.name}
        </MenuItem>
      ))}
    </Select>
  );

  const dueDateField = (
    <TextField
      id="task-due-date"
      name="dueDate"
      type="date"
      size="small"
      value={dueDate}
      onChange={(e) => onDueDateChange(e.target.value)}
      onBlur={onDueDateBlur}
      inputRef={dateInputRef}
      disabled={!canManage}
      onClick={() => {
        if (canManage) dateInputRef.current?.showPicker?.();
      }}
      sx={{ display: "block", mt: 0.5, minWidth: 160 }}
    />
  );

  return (
    <>
      <Box sx={{ display: "flex", gap: 4, mb: 3, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Status
          </Typography>
          <Select
            id="task-status"
            name="status"
            value={status}
            onChange={onStatusChange}
            size="small"
            sx={{ display: "block", minWidth: 140, mt: 0.5 }}
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="inprogress">In Progress</MenuItem>
            <MenuItem value="review">Review</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Priority
          </Typography>
          <Select
            id="task-priority"
            name="priority"
            value={priority}
            onChange={onPriorityChange}
            size="small"
            sx={{ display: "block", minWidth: 140, mt: 0.5 }}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Assignee
          </Typography>
          {canManage ? (
            assigneeSelect
          ) : (
            <Tooltip title={OWNER_ONLY_MESSAGE}>
              <span>{assigneeSelect}</span>
            </Tooltip>
          )}
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Due Date
          </Typography>
          {canManage ? (
            dueDateField
          ) : (
            <Tooltip title={OWNER_ONLY_MESSAGE}>
              <span>{dueDateField}</span>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        Description
      </Typography>
      {/*
        Not using MUI's `multiline` prop here: it renders through
        react-textarea-autosize internally, which mounts a second hidden
        "shadow" textarea (used only to measure height) that has neither
        `id` nor `name` by design - that duplicate, un-identified node is
        exactly what DevTools was flagging. It's harmless (aria-hidden,
        not focusable), but using InputProps.inputComponent="textarea"
        with a fixed `rows` bypasses that autosize wrapper entirely, so
        there is only ever one real <textarea> in the DOM and the warning
        goes away for good. Trade-off: no auto-grow-with-content; height
        is fixed at 3 rows but still manually resizable (resize: vertical).
      */}
      <TextField
        id="task-description"
        name="description"
        fullWidth
        placeholder="Add a description..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        onBlur={onDescriptionBlur}
        slotProps={{
          input: {
            inputComponent: "textarea",
          },
          htmlInput: {
            rows: 3,
            style: { resize: "vertical" },
          },
        }}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        Labels
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
        {labels.map((label) => (
          <Chip
            key={label}
            label={label}
            size="small"
            onDelete={canManage ? () => handleRemoveLabel(label) : undefined}
          />
        ))}
      </Box>
      {canManage ? (
        <TextField
          id="task-label-input"
          name="labelInput"
          size="small"
          placeholder="Add a label and press Enter"
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddLabel()}
          sx={{ mb: 3, width: 250 }}
        />
      ) : (
        <Tooltip title={OWNER_ONLY_MESSAGE}>
          <span>
            <TextField
              id="task-label-input-disabled"
              name="labelInputDisabled"
              size="small"
              placeholder="Add a label and press Enter"
              disabled
              sx={{ mb: 3, width: 250 }}
            />
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default TaskInfoFields;
