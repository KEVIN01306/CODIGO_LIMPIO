import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { CheckCircleOutlineOutlined } from '@mui/icons-material';
import { ErrorOutlineOutlined } from '@mui/icons-material';
import type { PersistenceStatus } from '../hooks/useCodePersistence';

interface Props {
  status: PersistenceStatus;
}

/**
 * PersistenceStatusIndicator
 *
 * A subtle, non-intrusive badge displayed in the editor header that informs
 * the student of the current backend synchronization state.
 *
 * States:
 *  - idle    → nothing shown
 *  - saving  → pulsing spinner + "Saving…"
 *  - saved   → green check + "Saved"
 *  - error   → amber warning + "Not synced"
 */
const PersistenceStatusIndicator: React.FC<Props> = ({ status }) => {
  if (status === 'idle') return null;

  const config: Record<
    Exclude<PersistenceStatus, 'idle'>,
    { icon: React.ReactNode; label: string; color: string }
  > = {
    saving: {
      icon: <CircularProgress size={12} sx={{ color: '#60a5fa' }} />,
      label: 'Saving…',
      color: '#60a5fa',
    },
    saved: {
      icon: <CheckCircleOutlineOutlined sx={{ fontSize: 14, color: '#4ade80' }} />,
      label: 'Saved',
      color: '#4ade80',
    },
    error: {
      icon: <ErrorOutlineOutlined sx={{ fontSize: 14, color: '#fbbf24' }} />,
      label: 'Not synced',
      color: '#fbbf24',
    },
  };

  const { icon, label, color } = config[status as Exclude<PersistenceStatus, 'idle'>];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.6,
        px: 1.2,
        py: 0.4,
        borderRadius: '10px',
        bgcolor: 'rgba(255, 255, 255, 0.04)',
        border: '0.5px solid rgba(255, 255, 255, 0.08)',
        userSelect: 'none',
      }}
    >
      {icon}
      <Typography
        variant="caption"
        sx={{ color, fontWeight: 500, letterSpacing: 0.3, lineHeight: 1 }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default PersistenceStatusIndicator;
