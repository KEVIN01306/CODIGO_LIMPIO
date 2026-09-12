import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}

/**
 * SandboxWarningDialog
 *
 * Modal displayed when an anti-cheat infraction is detected in strict mode
 * (tab switch, copy, paste). Shows the infraction message and requires
 * explicit acknowledgement.
 */
const SandboxWarningDialog: React.FC<Props> = ({ open, message, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            minWidth: 340,
            border: '0.5px solid',
            borderColor: 'divider',
            borderRadius: '16px',
            p: 1,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'error.main',
          fontWeight: 500,
          pb: 1,
          letterSpacing: '-0.01em',
        }}
      >
        <WarningAmberRoundedIcon sx={{ color: 'error.main' }} />
        Security Warning
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: 'text.secondary' }}>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          sx={{
            bgcolor: 'error.main',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 500,
            '&:hover': { bgcolor: 'error.dark' },
          }}
        >
          I Understand
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SandboxWarningDialog;
