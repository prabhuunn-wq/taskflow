// src/components/team/InviteMemberDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface Props {
  open: boolean;
  email: string;
  error: string;
  submitting: boolean;
  onEmailChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const InviteMemberDialog = ({
  open,
  email,
  error,
  submitting,
  onEmailChange,
  onClose,
  onSubmit,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 700 }}>Invite member</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          sx={{ mt: 1 }}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={submitting}
          onClick={onSubmit}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Add member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteMemberDialog;