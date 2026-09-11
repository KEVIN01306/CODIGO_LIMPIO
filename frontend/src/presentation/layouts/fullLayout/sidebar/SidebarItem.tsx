import { useState, type ElementType } from 'react';
import { ListItemButton, ListItemIcon, ListItemText, Collapse, List, ListSubheader, Typography } from '@mui/material';
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
    if (!isSidebarOpen) return <ListSubheader component="div" sx={{ bgcolor: 'transparent', mt: 2, height: 24 }} />;
    return (
      <ListSubheader component="div" sx={{ bgcolor: 'transparent', mt: 2 }}>
        <Typography sx={{ fontWeight: "bold" }} variant="overline" color="text.secondary" >
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
          borderRadius: 1, 
          mx: isSidebarOpen ? 1 : 0,
          mb: 0.5,
          justifyContent: isSidebarOpen ? 'initial' : 'center',
          px: isSidebarOpen ? 2 : 2.5
        }}
      >
        {item.icon && (() => {
          const IconComponent = item.icon as ElementType;
          return (
            <ListItemIcon 
              sx={{ 
                minWidth: 0, 
                mr: isSidebarOpen ? 2 : 'auto', 
                justifyContent: 'center',
                color: isSelected ? 'primary.main' : 'inherit' 
              }}
            >
              <IconComponent fontSize="small" />
            </ListItemIcon>
          );
        })()}
        
        {isSidebarOpen && (
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  color: isSelected ? 'primary.main' : 'inherit'
                }}
              >
                {item.name}
              </Typography>
            }
          />
        )}
        
        {isSidebarOpen && hasChildren ? (open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />) : null}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open && isSidebarOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: isSidebarOpen ? 3 : 0 }}>
            {item.children!.map((child, idx) => (
              <SidebarItem key={idx} item={child} isSidebarOpen={isSidebarOpen} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};
