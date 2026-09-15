import React from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Checkbox,
  Chip,
  Tooltip,
} from '@mui/material';
import { FolderOutlined } from '@mui/icons-material';
import type { RoleItem, PermissionModuleGroup as IPermissionModuleGroup } from '../../domain/roles.interfaces';

interface PermissionModuleGroupProps {
  group: IPermissionModuleGroup;
  roles: RoleItem[];
}

export const PermissionModuleGroup: React.FC<PermissionModuleGroupProps> = ({
  group,
  roles,
}) => {
  return (
    <>
      {/* Module Header Row */}
      <TableRow
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          borderBottom: '0.5px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <TableCell
          colSpan={roles.length + 1}
          sx={{
            py: 1.25,
            px: 2.5,
            bgcolor: 'background.paper',
            position: 'sticky',
            left: 0,
            zIndex: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <FolderOutlined sx={{ fontSize: 16, color: 'info.main' }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.06em',
                color: 'text.primary',
                textTransform: 'uppercase',
              }}
            >
              {group.module}
            </Typography>
            <Chip
              label={`${group.permissions.length} ${group.permissions.length === 1 ? 'perm' : 'perms'}`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                color: 'text.secondary',
                border: '0.5px solid rgba(255, 255, 255, 0.07)',
              }}
            />
          </Box>
        </TableCell>
      </TableRow>

      {/* Permission Rows */}
      {group.permissions.map((permission) => {
        return (
          <TableRow
            key={permission.id}
            hover
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.03) !important',
              },
              transition: 'background-color 0.15s ease',
            }}
          >
            {/* Sticky First Column: Permission Details */}
            <TableCell
              sx={{
                py: 1.25,
                pl: 4,
                pr: 2,
                position: 'sticky',
                left: 0,
                zIndex: 1,
                bgcolor: 'background.paper',
                borderRight: '0.5px solid rgba(255, 255, 255, 0.07)',
                minWidth: 260,
                maxWidth: 340,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    letterSpacing: '-0.2px',
                    lineHeight: 1.3,
                  }}
                >
                  {permission.actionName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    color: 'text.secondary',
                    display: 'block',
                    mt: 0.25,
                  }}
                >
                  {permission.action}
                </Typography>
                {permission.description && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      color: 'text.disabled',
                      display: 'block',
                      fontStyle: 'italic',
                      lineHeight: 1.2,
                    }}
                  >
                    {permission.description}
                  </Typography>
                )}
              </Box>
            </TableCell>

            {/* Checkbox columns for each role */}
            {roles.map((role) => {
              const hasPermission = role.permissions.includes(permission.action);

              return (
                <TableCell
                  key={role.id}
                  align="center"
                  sx={{
                    py: 1,
                    px: 1.5,
                    minWidth: 120,
                  }}
                >
                  <Tooltip
                    title={
                      hasPermission
                        ? `${role.name} has permission "${permission.action}"`
                        : `${role.name} does not have "${permission.action}"`
                    }
                    arrow
                    placement="top"
                  >
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Checkbox
                        checked={hasPermission}
                        disabled
                        disableRipple
                        inputProps={{
                          'aria-label': `${role.name} has ${permission.action}`,
                        }}
                        sx={{
                          p: 0.5,
                          cursor: 'default',
                          color: 'rgba(255, 255, 255, 0.18)',
                          '&.Mui-disabled': {
                            color: hasPermission
                              ? '#3b82f6'
                              : 'rgba(255, 255, 255, 0.12)',
                          },
                        }}
                      />
                    </Box>
                  </Tooltip>
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </>
  );
};
