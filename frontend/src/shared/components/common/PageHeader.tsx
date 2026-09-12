import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  children?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  children,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 400,
            fontSize: { xs: '24px', sm: '28px' },
            letterSpacing: '-0.64px',
            color: '#ffffff',
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: '#858687',
              mt: 0.75,
              fontSize: '13px',
              letterSpacing: '-0.2px',
              maxWidth: 680,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, alignSelf: { xs: 'stretch', sm: 'auto' } }}>
        {children}
        {actionLabel && onAction && (
          <Button
            variant="contained"
            color="primary"
            startIcon={actionIcon}
            onClick={onAction}
            sx={{
              borderRadius: '10px',
              bgcolor: '#f2f2f2',
              color: '#333333',
              fontWeight: 450,
              fontSize: '14px',
              letterSpacing: '-0.2px',
              px: 2.5,
              py: 0.9,
              boxShadow: '0 1px 4px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: '#e5e5e5',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              },
            }}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
