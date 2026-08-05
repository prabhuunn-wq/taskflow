// src/components/dashboard/EditProjectDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  name: string;
  description: string;
  status: string;
  saving: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const EditProjectDialog = ({
  open,
  name,
  description,
  status,
  saving,
  onNameChange,
  onDescriptionChange,
  onStatusChange,
  onClose,
  onSave,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 700 }}>Edit project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Project name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box>
          <Typography variant="caption" color="text.secondary">
            Status
          </Typography>
          <Select
            fullWidth
            size="small"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            sx={{ mt: 0.5 }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={saving || !name.trim()}
          onClick={onSave}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectDialog;