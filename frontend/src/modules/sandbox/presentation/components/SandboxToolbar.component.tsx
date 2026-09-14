import React from 'react';
import { Box, Button, Typography, CircularProgress, Chip, IconButton, Tooltip } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FolderSpecialOutlinedIcon from '@mui/icons-material/FolderSpecialOutlined';
import PersistenceStatusIndicator from './PersistenceStatusIndicator';
import type { PersistenceStatus } from '../hooks/useCodePersistence';

interface Props {
  /** Assessment or submission title shown on the left. */
  title: string;
  /** Current backend sync status from useCodePersistence. */
  persistenceStatus: PersistenceStatus;
  /** Whether the assessment has strict anti-cheat mode enabled. */
  isStrictMode: boolean;
  /** Total number of recorded infractions (tab switches + clipboard). */
  infractionCount: number;
  /** Whether a Run Code request is currently in-flight. */
  isRunning: boolean;
  /** Whether a Submit request is currently in-flight. */
  isSubmitting: boolean;
  /** Whether the Mayéutica AI chat panel is open. */
  isAIChatOpen?: boolean;
  /** Called when the user clicks Mayéutica AI toggle. */
  onToggleAIChat?: () => void;
  /** Whether the File Explorer panel is open. */
  isFileTreeOpen?: boolean;
  /** Called when the user clicks File Explorer toggle. */
  onToggleFileTree?: () => void;
  /** Called when the user clicks Run Code. */
  onRunCode: () => void;
  /** Called when the user clicks Submit Assessment. */
  onSubmit: () => void;
  /** Called when the user clicks Exit / Back to leave the assessment. */
  onExit?: () => void;
}

/**
 * SandboxToolbar
 *
 * The top bar of the sandbox editor. Contains:
 *   - Assessment title (left)
 *   - Persistence status badge
 *   - Strict-mode infraction counter
 *   - Run Code button
 *   - Submit Assessment button
 *
 * All actions are received as callbacks — the toolbar contains no logic.
 */
const SandboxToolbar: React.FC<Props> = ({
  title,
  persistenceStatus,
  isStrictMode,
  infractionCount,
  isRunning,
  isSubmitting,
  isAIChatOpen,
  onToggleAIChat,
  isFileTreeOpen,
  onToggleFileTree,
  onRunCode,
  onSubmit,
  onExit,
}) => {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '0.5px solid',
        borderColor: 'divider',
        flexShrink: 0,
        minHeight: 48,
      }}
    >
      {/* Left: exit button + title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0 }}>
        {onExit && (
          <Tooltip title="Exit Assessment" arrow>
            <IconButton
              size="small"
              onClick={onExit}
              aria-label="Exit assessment"
              sx={{
                color: 'text.secondary',
                p: 0.5,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: 'action.hover',
                  borderColor: 'text.secondary',
                },
              }}
            >
              <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'text.primary' }}
          noWrap
        >
          {title}
        </Typography>
      </Box>

      {/* Right: status + actions */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexShrink: 0 }}>
        <PersistenceStatusIndicator status={persistenceStatus} />

        {isStrictMode && (
          <Chip
            label={`Strict Mode · ${infractionCount} infraction${infractionCount !== 1 ? 's' : ''}`}
            size="small"
            sx={{
              fontSize: '0.72rem',
              height: 24,
              borderRadius: '10px',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              color: '#f87171',
              border: '0.5px solid rgba(248, 113, 113, 0.3)',
            }}
          />
        )}

        {/* Mayéutica AI Tutor Toggle */}
        {onToggleAIChat && (
          <Button
            variant="outlined"
            size="small"
            onClick={onToggleAIChat}
            startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderColor: isAIChatOpen ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.12)',
              color: isAIChatOpen ? '#60a5fa' : '#cececf',
              bgcolor: isAIChatOpen ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              borderRadius: '10px',
              fontSize: '0.8rem',
              py: 0.5,
              px: 1.5,
              '&:hover': {
                borderColor: '#3b82f6',
                color: '#60a5fa',
                bgcolor: 'rgba(59, 130, 246, 0.16)',
              },
            }}
          >
            Mayéutica
          </Button>
        )}

        {/* Files Explorer Toggle */}
        {onToggleFileTree && (
          <Button
            variant="outlined"
            size="small"
            onClick={onToggleFileTree}
            startIcon={<FolderSpecialOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderColor: isFileTreeOpen ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.12)',
              color: isFileTreeOpen ? '#60a5fa' : '#cececf',
              bgcolor: isFileTreeOpen ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              borderRadius: '10px',
              fontSize: '0.8rem',
              py: 0.5,
              px: 1.5,
              '&:hover': {
                borderColor: '#3b82f6',
                color: '#60a5fa',
                bgcolor: 'rgba(59, 130, 246, 0.16)',
              },
            }}
          >
            Files
          </Button>
        )}

        {/* Run Code */}
        <Button
          variant="outlined"
          size="small"
          disabled={isRunning || isSubmitting}
          onClick={onRunCode}
          startIcon={
            isRunning
              ? <CircularProgress size={13} color="inherit" />
              : <PlayArrowRoundedIcon />
          }
          sx={{
            borderColor: 'rgba(74, 222, 128, 0.3)',
            color: '#4ade80',
            borderRadius: '10px',
            fontSize: '0.8rem',
            py: 0.5,
            px: 1.5,
            '&:hover': {
              borderColor: '#4ade80',
              bgcolor: 'rgba(74, 222, 128, 0.08)',
            },
            '&.Mui-disabled': { opacity: 0.4 },
          }}
        >
          {isRunning ? 'Running…' : 'Run Code'}
        </Button>

        {/* Submit */}
        <Button
          variant="contained"
          size="small"
          disabled={isSubmitting || isRunning}
          onClick={onSubmit}
          startIcon={
            isSubmitting
              ? <CircularProgress size={13} color="inherit" />
              : <CheckCircleOutlineRoundedIcon />
          }
          sx={{
            bgcolor: 'primary.main',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '0.8rem',
            fontWeight: 500,
            py: 0.5,
            px: 2,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            },
          }}
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
      </Box>
    </Box>
  );
};

export default SandboxToolbar;
