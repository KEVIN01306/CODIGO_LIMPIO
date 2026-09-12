import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Divider,
  Chip,
  Collapse,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import type { CodeExecutionResult } from '../hooks/useCodeExecution';

interface Props {
  /** Whether the output panel is visible. */
  open: boolean;
  /** Called when the user closes the panel. */
  onClose: () => void;
  /** True while an execution request is in-flight. */
  isRunning: boolean;
  /** Last execution result, or null if not yet run. */
  result: CodeExecutionResult | null;
}

/**
 * SandboxOutput
 *
 * A sliding panel at the bottom of the sandbox that displays the result of
 * the last "Run Code" execution.
 *
 * Possible states:
 *   - Running  → spinner
 *   - Success  → green header, stdout
 *   - Error    → red header, stderr / stdout
 *   - Empty    → "No output produced."
 *
 * This component ONLY displays output — it does not trigger execution.
 */
const SandboxOutput: React.FC<Props> = ({ open, onClose, isRunning, result }) => {
  return (
    <Collapse in={open} unmountOnExit>
      <Box
        sx={{
          borderTop: '0.5px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          height: 260,
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 0.75,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b0c0e' : '#f1f5f9'),
            borderBottom: '0.5px solid',
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                fontSize: '0.68rem',
              }}
            >
              Output
            </Typography>

            {result && !isRunning && (
              <>
                <Chip
                  icon={
                    result.success
                      ? <CheckCircleOutlineRoundedIcon sx={{ fontSize: '0.9rem !important' }} />
                      : <ErrorOutlineRoundedIcon sx={{ fontSize: '0.9rem !important' }} />
                  }
                  label={result.success ? 'Success' : `Exit ${result.exitCode ?? 'killed'}`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.68rem',
                    borderRadius: '10px',
                    bgcolor: result.success ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                    color: result.success ? '#4ade80' : '#f87171',
                    border: `0.5px solid ${result.success ? 'rgba(74, 222, 128, 0.25)' : 'rgba(248, 113, 113, 0.25)'}`,
                  }}
                />
                <Chip
                  icon={<AccessTimeRoundedIcon sx={{ fontSize: '0.9rem !important' }} />}
                  label={`${result.executionTimeMs}ms`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.68rem',
                    borderRadius: '10px',
                    color: 'text.secondary',
                    bgcolor: 'action.hover',
                    border: '0.5px solid',
                    borderColor: 'divider',
                  }}
                />
              </>
            )}
          </Box>

          <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary', p: 0.3, '&:hover': { color: 'text.primary' } }}>
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            fontFamily: '"Cascadia Code", "Fira Code", monospace',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            p: 1.5,
            color: 'text.primary',
          }}
        >
          {/* Loading */}
          {isRunning && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
              <CircularProgress size={16} sx={{ color: 'primary.main' }} />
              <Typography variant="caption" sx={{ color: 'primary.main' }}>
                Executing…
              </Typography>
            </Box>
          )}

          {/* Result */}
          {!isRunning && result && (
            <>
              {/* stdout */}
              {result.stdout && (
                <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'text.primary' }}>
                  {result.stdout}
                </Box>
              )}

              {/* stderr */}
              {result.stderr && (
                <>
                  {result.stdout && <Divider sx={{ my: 1, borderColor: 'divider' }} />}
                  <Box
                    component="pre"
                    sx={{ m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'error.main' }}
                  >
                    {result.stderr}
                  </Box>
                </>
              )}

              {/* Empty output */}
              {!result.stdout && !result.stderr && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  No output produced.
                </Typography>
              )}
            </>
          )}

          {/* Not yet run */}
          {!isRunning && !result && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              Click Run Code to execute your program.
            </Typography>
          )}
        </Box>
      </Box>
    </Collapse>
  );
};

export default SandboxOutput;
