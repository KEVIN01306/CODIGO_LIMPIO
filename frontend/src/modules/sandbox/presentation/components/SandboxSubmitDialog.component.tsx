import React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

interface Props {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * SandboxSubmitDialog
 *
 * Confirmation dialog shown before finalizing the submission.
 * Informs the student that the action is irreversible and that
 * the latest snapshot will be saved before finalizing.
 */
const SandboxSubmitDialog: React.FC<Props> = ({
  open,
  isSubmitting,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !isSubmitting && onClose()}
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            minWidth: 360,
            border: '0.5px solid',
            borderColor: 'divider',
            borderRadius: '16px',
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ color: 'success.main', fontWeight: 500, pb: 1, letterSpacing: '-0.01em' }}>
        Submit Assessment
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: 'text.primary' }}>
          Are you sure you want to submit? This action is{' '}
          <strong>irreversible</strong>.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Your latest code will be saved to the server before finalizing.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          variant="outlined"
          size="small"
          sx={{
            color: 'text.secondary',
            borderColor: 'divider',
            borderRadius: '10px',
            '&:hover': {
              borderColor: 'text.secondary',
              bgcolor: 'action.hover',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isSubmitting}
          variant="contained"
          size="small"
          startIcon={
            isSubmitting ? (
              <CircularProgress size={14} color="inherit" />
            ) : null
          }
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: '10px',
            fontWeight: 500,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {isSubmitting ? 'Submitting…' : 'Confirm Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SandboxSubmitDialog;
