import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { AdminPanelSettingsOutlined } from '@mui/icons-material';
import type { RoleItem, PermissionModuleGroup as IPermissionModuleGroup } from '../../domain/roles.interfaces';
import { PermissionModuleGroup } from './PermissionModuleGroup.component';

interface PermissionsMatrixProps {
  roles: RoleItem[];
  groups: IPermissionModuleGroup[];
}

export const PermissionsMatrix: React.FC<PermissionsMatrixProps> = ({
  roles,
  groups,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '12px',
        border: '0.5px solid rgba(255, 255, 255, 0.07)',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 'calc(100vh - 280px)',
          overflowX: 'auto',
          // Custom clean scrollbar
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
          },
        }}
      >
        <Table stickyHeader sx={{ minWidth: Math.max(680, 260 + roles.length * 140) }}>
          <TableHead>
            <TableRow>
              {/* Top-left corner: Sticky Permission / Module column header */}
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                  bgcolor: 'background.paper',
                  borderRight: '0.5px solid rgba(255, 255, 255, 0.07)',
                  minWidth: 260,
                  maxWidth: 340,
                  py: 2,
                  px: 2.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    fontSize: '0.72rem',
                  }}
                >
                  Permission / Module
                </Typography>
              </TableCell>

              {/* Roles columns */}
              {roles.map((role) => (
                <TableCell
                  key={role.id}
                  align="center"
                  sx={{
                    minWidth: 140,
                    py: 2,
                    px: 1.5,
                    bgcolor: 'background.paper',
                    borderBottom: '0.5px solid rgba(255, 255, 255, 0.07)',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {role.isSystem && (
                        <AdminPanelSettingsOutlined sx={{ fontSize: 15, color: 'info.main' }} />
                      )}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          letterSpacing: '-0.2px',
                          color: 'text.primary',
                        }}
                      >
                        {role.name.replace(/_/g, ' ')}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${role.permissions.length} granted`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.68rem',
                        fontWeight: 500,
                        bgcolor: 'rgba(59, 130, 246, 0.08)',
                        color: 'info.light',
                        border: '0.5px solid rgba(59, 130, 246, 0.2)',
                      }}
                    />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={roles.length + 1}
                  align="center"
                  sx={{ py: 6, color: 'text.secondary' }}
                >
                  <Typography variant="body2">
                    No permissions match the current search.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group) => (
                <PermissionModuleGroup
                  key={group.module}
                  group={group}
                  roles={roles}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
