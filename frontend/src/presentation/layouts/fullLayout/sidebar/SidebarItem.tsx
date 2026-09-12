import { useState, type ElementType } from 'react';
import { ListItemButton, ListItemIcon, ListItemText, Collapse, List, ListSubheader, Typography, Box } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuItem } from './menuItems';

interface SidebarItemProps {
  item: MenuItem;
  isSidebarOpen?: boolean;
}

export const SidebarItem = ({ item, isSidebarOpen = true }: SidebarItemProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (item.group) {
    if (!isSidebarOpen) return <ListSubheader component="div" sx={{ bgcolor: 'transparent', mt: 1.5, height: 16 }} />;
    return (
      <ListSubheader component="div" sx={{ bgcolor: 'transparent', mt: 2, mb: 0.5, px: 2.5 }}>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '10px',
            letterSpacing: '0.06em',
            color: 'text.secondary',
            textTransform: 'uppercase',
          }}
        >
          {item.group}
        </Typography>
      </ListSubheader>
    );
  }

  const hasChildren = item.children && item.children.length > 0;
  const isSelected = item.link ? location.pathname === item.link : false;

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        selected={isSelected}
        sx={{
          borderRadius: '10px',
          mx: isSidebarOpen ? 1.5 : 1,
          my: 0.25,
          minHeight: 38,
          justifyContent: isSidebarOpen ? 'initial' : 'center',
          px: isSidebarOpen ? 1.5 : 1,
          transition: 'all 0.15s ease',
          '&.Mui-selected': {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.08)',
            color: 'info.main',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.16)' : 'rgba(37, 99, 235, 0.12)',
            },
          },
          '&:hover': {
            bgcolor: isSelected
              ? (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(59, 130, 246, 0.16)'
                    : 'rgba(37, 99, 235, 0.12)'
              : 'action.hover',
          },
        }}
      >
        {item.icon && (() => {
          const IconComponent = item.icon as ElementType;
          return (
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isSidebarOpen ? 1.5 : 'auto',
                justifyContent: 'center',
                color: isSelected ? 'info.main' : 'text.secondary',
                fontSize: 18,
              }}
            >
              <IconComponent sx={{ fontSize: 18 }} />
            </ListItemIcon>
          );
        })()}

        {isSidebarOpen && (
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: isSelected ? 500 : 400,
                  letterSpacing: '-0.2px',
                  color: isSelected ? 'text.primary' : 'text.secondary',
                }}
              >
                {item.name}
              </Typography>
            }
          />
        )}

        {isSidebarOpen && hasChildren ? (
          <Box sx={{ color: isSelected ? '#3b82f6' : '#858687', display: 'flex' }}>
            {open ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
          </Box>
        ) : null}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open && isSidebarOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: isSidebarOpen ? 2 : 0 }}>
            {item.children!.map((child, idx) => (
              <SidebarItem key={idx} item={child} isSidebarOpen={isSidebarOpen} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};
