import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
    MenuItem,
    Menu,
    Typography,
    TablePagination,
    Card,
    CardContent,
    Divider,
    Stack,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';

export interface Column {
    id: string;
    name: string;
    format?: (value: any, row: any) => React.ReactNode;
}

export interface Action {
    name: string;
    icon: React.ReactNode;
    color?: string;
    onClick: (row: any) => void;
    visible?: (row: any) => boolean;
}

export interface PaginationProps {
    total: number;
    limit: number;
    offset: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newLimit: number) => void;
}

export interface ListTableProps {
    data: any[];
    columns: Column[];
    actions?: Action[];
    pagination?: PaginationProps;
    emptyMessage?: string;
}

const ListTable: React.FC<ListTableProps> = ({
    data,
    columns,
    actions,
    pagination,
    emptyMessage = 'No hay registros disponibles',
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuRow, setMenuRow] = useState<any>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: any) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setMenuRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuRow(null);
    };

    const primaryColumn = columns[0];
    const secondaryColumns = columns.slice(1);

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            {/* Desktop / Tablet Table View (Medium screens and up) */}
            <Paper
                elevation={0}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: '100%',
                    overflowX: 'auto',
                    border: '0.5px solid',
                    borderColor: 'divider',
                    borderRadius: '12px',
                    bgcolor: 'background.paper',
                }}
            >
                <TableContainer
                    sx={{
                        backgroundColor: 'background.paper',
                        overflowX: 'auto',
                        width: '100%',
                    }}
                >
                    <Table sx={{ width: '100%', minWidth: 650, tableLayout: 'auto' }} aria-label="list table">
                        <TableHead sx={{ backgroundColor: 'background.paper' }}>
                            <TableRow sx={{ borderBottom: '0.5px solid', borderColor: 'divider' }}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.04rem',
                                            py: 1.5,
                                            borderBottom: '0.5px solid',
                                            borderColor: 'divider',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {column.name}
                                    </TableCell>
                                ))}
                                {actions && actions.length > 0 && (
                                    <TableCell align="right" sx={{ borderBottom: '0.5px solid', borderColor: 'divider' }}>
                                        <Typography sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04rem' }}>
                                            ACCIÓN
                                        </Typography>
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {emptyMessage}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, index) => (
                                    <TableRow
                                        key={row.id || index}
                                        sx={{
                                            borderBottom: '0.5px solid',
                                            borderColor: 'divider',
                                            '&:hover': { backgroundColor: 'action.hover' },
                                            transition: 'background-color 0.15s',
                                        }}
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                sx={{
                                                    py: 1.5,
                                                    maxWidth: 220,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    borderBottom: '0.5px solid',
                                                    borderColor: 'divider',
                                                    color: 'text.primary',
                                                }}
                                            >
                                                <Box sx={{ color: 'text.primary', fontWeight: 450, fontSize: '13px' }}>
                                                    {column.format ? column.format(row[column.id], row) : row[column.id]}
                                                </Box>
                                            </TableCell>
                                        ))}
                                        {actions && actions.length > 0 && (
                                            <TableCell align="right" sx={{ borderBottom: '0.5px solid', borderColor: 'divider' }}>
                                                <IconButton onClick={(event) => handleMenuOpen(event, row)} size="small" sx={{ color: 'text.secondary' }}>
                                                    <MoreVert sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {pagination && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={pagination.total}
                        rowsPerPage={pagination.limit}
                        page={Math.floor(pagination.offset / pagination.limit)}
                        onPageChange={(_, newPage) => pagination.onPageChange(newPage)}
                        onRowsPerPageChange={(event) => pagination.onRowsPerPageChange(parseInt(event.target.value, 10))}
                        labelRowsPerPage="Filas:"
                        sx={{
                            borderTop: '0.5px solid',
                            borderColor: 'divider',
                            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                fontSize: '11px',
                                color: 'text.secondary',
                            },
                            overflow: 'hidden',
                        }}
                    />
                )}
            </Paper>

            {/* Mobile Cards View (Small screens: xs to sm) */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {data.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            border: '0.5px dashed',
                            borderColor: 'divider',
                            borderRadius: '12px',
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {emptyMessage}
                        </Typography>
                    </Paper>
                ) : (
                    <Stack spacing={1.75}>
                        {data.map((row, index) => (
                            <Card
                                key={row.id || index}
                                elevation={0}
                                sx={{
                                    border: '0.5px solid',
                                    borderColor: 'divider',
                                    borderRadius: '12px',
                                    backgroundColor: 'background.paper',
                                    transition: 'all 0.15s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    {/* Card Header: Primary Column Value + Action Menu */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Box sx={{ flex: 1, pr: 1, minWidth: 0 }}>
                                            {primaryColumn && (
                                                <>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            fontWeight: 500,
                                                            fontSize: '11px',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.04rem',
                                                            display: 'block',
                                                            mb: 0.25,
                                                        }}
                                                    >
                                                        {primaryColumn.name}
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            color: 'text.primary',
                                                            fontWeight: 500,
                                                            fontSize: '14px',
                                                            wordBreak: 'break-word',
                                                        }}
                                                    >
                                                        {primaryColumn.format
                                                            ? primaryColumn.format(row[primaryColumn.id], row)
                                                            : (row[primaryColumn.id] ?? '-')}
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                        {actions && actions.length > 0 && (
                                            <IconButton
                                                onClick={(event) => handleMenuOpen(event, row)}
                                                size="small"
                                                sx={{
                                                    mt: -0.5,
                                                    mr: -0.5,
                                                    color: 'text.secondary',
                                                    '&:hover': { backgroundColor: 'action.hover', color: 'text.primary' },
                                                }}
                                                aria-label="acciones"
                                            >
                                                <MoreVert sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        )}
                                    </Box>

                                    {/* Secondary Columns Grid / List */}
                                    {secondaryColumns.length > 0 && (
                                        <>
                                            <Divider sx={{ my: 1.25, borderColor: 'divider' }} />
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                                {secondaryColumns.map((column) => (
                                                    <Box
                                                        key={column.id}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            py: 0.4,
                                                            gap: 1.5,
                                                            borderBottom: '0.5px dashed',
                                                            borderColor: 'divider',
                                                            '&:last-child': { borderBottom: 'none' },
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: 'text.secondary',
                                                                fontWeight: 500,
                                                                fontSize: '11px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.03rem',
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {column.name}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                color: 'text.primary',
                                                                fontWeight: 450,
                                                                fontSize: '13px',
                                                                textAlign: 'right',
                                                                wordBreak: 'break-word',
                                                            }}
                                                        >
                                                            {column.format
                                                                ? column.format(row[column.id], row)
                                                                : (row[column.id] ?? '-')}
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}

                {/* Mobile Pagination */}
                {pagination && (
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 2,
                            border: '0.5px solid',
                            borderColor: 'divider',
                            borderRadius: '12px',
                            backgroundColor: 'background.paper',
                            overflow: 'hidden',
                        }}
                    >
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={pagination.total}
                            rowsPerPage={pagination.limit}
                            page={Math.floor(pagination.offset / pagination.limit)}
                            onPageChange={(_, newPage) => pagination.onPageChange(newPage)}
                            onRowsPerPageChange={(event) => pagination.onRowsPerPageChange(parseInt(event.target.value, 10))}
                            labelRowsPerPage="Filas:"
                            sx={{
                                '.MuiTablePagination-toolbar': {
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    px: 1,
                                    py: 0.5,
                                },
                                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                    fontSize: '11px',
                                    color: 'text.secondary',
                                },
                            }}
                        />
                    </Paper>
                )}
            </Box>

            {/* Actions Menu (Shared between Desktop Table and Mobile Cards) */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: 160,
                            borderRadius: '12px',
                            bgcolor: 'background.paper',
                            border: '0.5px solid',
                            borderColor: 'divider',
                            boxShadow: (theme) => theme.shadows[8],
                        }
                    }
                }}
            >
                {actions?.map((action, index) => {
                    const isVisible = !action.visible || (menuRow ? action.visible(menuRow) : true);
                    if (!isVisible) return null;
                    return (
                        <MenuItem
                            key={index}
                            onClick={() => {
                                action.onClick(menuRow);
                                handleMenuClose();
                            }}
                            sx={{ fontSize: '13px', gap: 1.5, color: action.color || 'text.primary' }}
                        >
                            {action.icon}
                            {action.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </Box>
    );
};

export default ListTable;