import React, { useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import type { ChatMessage } from '../../../ai/domain/ai.types';
import { useAIChat } from '../hooks/useAIChat';

interface SandboxAIChatProps {
  submissionId: string;
  initialHistory?: ChatMessage[] | null;
  currentCode: string;
  language: string;
  lastExecutionOutput?: string | null;
  exerciseGoal: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const SandboxAIChat: React.FC<SandboxAIChatProps> = ({
  submissionId,
  initialHistory,
  currentCode,
  language,
  lastExecutionOutput,
  exerciseGoal,
  isOpen,
  onToggle,
}) => {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    retryLast,
  } = useAIChat({
    submissionId,
    initialHistory,
    currentCode,
    language,
    lastExecutionOutput,
    exerciseGoal,
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && inputValue.trim()) {
        sendMessage();
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      sendMessage(suggestion);
    }
  };

  if (!isOpen) {
    return (
      <Box
        sx={{
          width: 44,
          height: '100%',
          bgcolor: '#131416',
          borderRight: '0.5px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
          gap: 2,
          flexShrink: 0,
        }}
      >
        <Tooltip title="Open Mayéutica AI Tutor" placement="right">
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              color: '#3b82f6',
              bgcolor: 'rgba(59, 130, 246, 0.1)',
              border: '0.5px solid rgba(59, 130, 246, 0.25)',
              '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' },
            }}
          >
            <AutoAwesomeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography
          variant="caption"
          sx={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: '#858687',
            letterSpacing: 1.5,
            fontSize: '0.72rem',
            fontWeight: 500,
            textTransform: 'uppercase',
          }}
        >
          Mayéutica AI
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 360, lg: 390 },
        height: '100%',
        bgcolor: '#131416',
        borderRight: '0.5px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#0e0f11',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              bgcolor: 'rgba(59, 130, 246, 0.15)',
              border: '0.5px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 16 }} />
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#ffffff',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              Mayéutica
              <Chip
                label="Socratic Tutor"
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.62rem',
                  fontWeight: 500,
                  bgcolor: 'rgba(59, 130, 246, 0.12)',
                  color: '#60a5fa',
                  border: '0.5px solid rgba(59, 130, 246, 0.3)',
                  px: 0.5,
                }}
              />
            </Typography>
            <Typography variant="caption" sx={{ color: '#71717a', fontSize: '0.7rem' }}>
              Guiding questions for problem solving
            </Typography>
          </Box>
        </Box>

        <Tooltip title="Collapse Mayéutica panel">
          <IconButton
            size="small"
            onClick={onToggle}
            sx={{
              color: '#858687',
              '&:hover': { color: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.06)' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Messages Scroll Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
          },
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              p: 2,
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                border: '0.5px solid rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
              }}
            >
              <LightbulbOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>

            <Box>
              <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 500, mb: 0.5 }}>
                Meet Mayéutica
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#858687', fontSize: '0.82rem', lineHeight: 1.5, maxWidth: 280 }}
              >
                I won't give you code answers directly. Instead, I ask guiding questions so you discover
                and solve errors on your own.
              </Typography>
            </Box>

            <Box sx={{ width: '100%', mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#71717a',
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                Try asking:
              </Typography>
              {[
                'Why does my code return undefined?',
                'Can you help me check if my loop condition is right?',
                'How do I test my function with edge cases?',
              ].map((prompt, idx) => (
                <Button
                  key={idx}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSuggestionClick(prompt)}
                  disabled={isLoading}
                  sx={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontSize: '0.78rem',
                    color: '#cececf',
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(255, 255, 255, 0.07)',
                    borderRadius: '8px',
                    p: 1,
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.08)',
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                      color: '#ffffff',
                    },
                  }}
                >
                  {prompt}
                </Button>
              ))}
            </Box>
          </Box>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isLatestAssistant = !isUser && index === messages.length - 1;

            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  width: '100%',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#71717a',
                    fontSize: '0.68rem',
                    mb: 0.4,
                    px: 0.5,
                    fontWeight: 500,
                  }}
                >
                  {isUser ? 'You' : 'Mayéutica'}
                </Typography>

                <Box
                  sx={{
                    maxWidth: '88%',
                    px: 1.8,
                    py: 1.2,
                    borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    bgcolor: isUser ? '#1f1f21' : '#18191c',
                    color: isUser ? '#f2f2f2' : '#cececf',
                    border: isUser
                      ? '0.5px solid rgba(255, 255, 255, 0.08)'
                      : '0.5px solid rgba(59, 130, 246, 0.25)',
                    boxShadow: isUser
                      ? '0 1px 4px rgba(0,0,0,0.2)'
                      : '0 2px 8px rgba(0,0,0,0.3)',
                    fontSize: '0.84rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content ? (
                    msg.content
                  ) : isLatestAssistant && isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 0.6,
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#60a5fa',
                            animation: 'pulse 1.4s infinite ease-in-out',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
                              '50%': { opacity: 1, transform: 'scale(1.2)' },
                            },
                          }}
                        />
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#60a5fa',
                            animation: 'pulse 1.4s infinite ease-in-out',
                            animationDelay: '0.2s',
                          }}
                        />
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#60a5fa',
                            animation: 'pulse 1.4s infinite ease-in-out',
                            animationDelay: '0.4s',
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#858687', fontSize: '0.74rem' }}>
                        Thinking...
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
              </Box>
            );
          })
        )}

        {/* Error Feedback */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={retryLast}
                startIcon={<RefreshIcon fontSize="small" />}
                sx={{ textTransform: 'none', fontSize: '0.74rem' }}
              >
                Retry
              </Button>
            }
            sx={{
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              border: '0.5px solid rgba(239, 68, 68, 0.25)',
              fontSize: '0.78rem',
              py: 0.5,
            }}
          >
            {error}
          </Alert>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 1.5,
          borderTop: '0.5px solid rgba(255, 255, 255, 0.08)',
          bgcolor: '#0e0f11',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder="Ask Mayéutica about your code..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#18191c',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.84rem',
                border: '0.5px solid rgba(255, 255, 255, 0.08)',
                '& fieldset': { border: 'none' },
                '&:hover': {
                  bgcolor: '#1c1d21',
                },
                '&.Mui-focused': {
                  bgcolor: '#1c1d21',
                  boxShadow: '0 0 0 1.5px rgba(59, 130, 246, 0.5)',
                },
              },
            }}
          />

          <IconButton
            onClick={() => sendMessage()}
            disabled={isLoading || !inputValue.trim()}
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: inputValue.trim() && !isLoading ? '#f2f2f2' : 'rgba(255, 255, 255, 0.05)',
              color: inputValue.trim() && !isLoading ? '#131416' : '#71717a',
              border: 'none',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: inputValue.trim() && !isLoading ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
              },
              '&.Mui-disabled': {
                color: '#4b5563',
                bgcolor: 'rgba(255, 255, 255, 0.03)',
              },
            }}
          >
            {isLoading ? <CircularProgress size={18} sx={{ color: '#858687' }} /> : <SendIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: '#71717a',
            fontSize: '0.66rem',
            textAlign: 'center',
          }}
        >
          Enter to send • Shift + Enter for new line
        </Typography>
      </Box>
    </Box>
  );
};

export default SandboxAIChat;
