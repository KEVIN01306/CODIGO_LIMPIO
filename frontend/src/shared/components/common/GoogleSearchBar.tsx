import React from 'react';
import { Box, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface GoogleSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  loading?: boolean;
  maxWidth?: number | string;
}

export const GoogleSearchBar: React.FC<GoogleSearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search...',
  loading = false,
  maxWidth = 480,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mb: 3,
        width: '100%',
        maxWidth,
      }}
    >
      <TextField
        size="small"
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary', fontSize: 18 }} />
              </InputAdornment>
            ),
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onChange('')}
                  edge="end"
                  aria-label="clear search"
                  sx={{ p: 0.5, color: 'text.secondary' }}
                >
                  <Clear sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: {
              borderRadius: '10px',
              backgroundColor: 'background.paper',
              color: 'text.primary',
              fontSize: '13px',
              height: 38,
              '& fieldset': {
                borderColor: 'divider',
                borderWidth: '0.5px',
              },
              '&:hover fieldset': {
                borderColor: 'text.secondary',
                borderWidth: '0.5px',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: '1px',
                boxShadow: 'rgba(59, 130, 246, 0.25) 0px 0px 0px 1.5px',
              },
            },
          },
        }}
      />
      <Button
        type="submit"
        variant="outlined"
        disabled={loading}
        sx={{
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 450,
          fontSize: '13px',
          px: 2.5,
          height: 38,
          border: '0.5px solid',
          borderColor: 'divider',
          backgroundColor: 'action.hover',
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.selected',
            borderColor: 'text.secondary',
          },
        }}
      >
        Search
      </Button>
    </Box>
  );
};

export default GoogleSearchBar;
