import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

interface Props {
  open: boolean;
  title: string;
  description: string | React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?: string;
  confirmColor?: 'error' | 'primary' | 'secondary' | 'warning';
}

const ConfirmDialog: React.FC<Props> = ({
  open,
  title,
  description,
  onClose,
  onConfirm,
  isLoading = false,
  confirmText = 'Confirm',
  confirmColor = 'error',
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 1,
            minWidth: { xs: '90%', sm: 400 },
            border: '0.5px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 20px 44px rgba(0, 0, 0, 0.5)'
                : '0 20px 44px rgba(0, 0, 0, 0.1)',
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 450, fontSize: '18px', letterSpacing: '-0.4px', color: 'text.primary', pt: 2, px: 2.5 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ px: 2.5 }}>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: '13px', lineHeight: 1.5 }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 450,
            fontSize: '13px',
            color: 'text.secondary',
            borderColor: 'divider !important',
            px: 2.5,
            '&:hover': {
              backgroundColor: 'action.hover',
              color: 'text.primary',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : confirmColor === 'error' ? (
              <Delete sx={{ fontSize: 16 }} />
            ) : undefined
          }
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 450,
            fontSize: '13px',
            px: 2.5,
            boxShadow: 'none',
            ...(confirmColor === 'error' && {
              bgcolor: '#f87171',
              color: '#ffffff',
              '&:hover': { bgcolor: '#ef4444' },
            }),
          }}
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;