import React, { useState, useRef, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Chip,
    Card,
    CardContent,
    Divider,
    Stack,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export interface Column {
    id: string;
    name: string;
    format?: (value: any, row?: any) => React.ReactNode;
}

export interface Props {
    columns: Column[];
    data: any[];
    headerBgColor?: string;
    headerTextColor?: string;
    disableVerticalScroll?: boolean;
    maxTableHeight?: number | string;
}

export const ListTableSimple = ({
    columns,
    data,
    headerBgColor = 'background.paper',
    headerTextColor = 'text.secondary',
    disableVerticalScroll = false,
    maxTableHeight = 520,
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);

    const checkScroll = () => {
        if (disableVerticalScroll || !containerRef.current) {
            setShowScrollIndicator(false);
            return;
        }

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const hasMoreToScroll = scrollHeight - scrollTop - clientHeight > 5;

        setShowScrollIndicator(hasMoreToScroll);
    };

    useEffect(() => {
        const handleInitialCheck = requestAnimationFrame(() => {
            checkScroll();
        });

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }

        return () => {
            cancelAnimationFrame(handleInitialCheck);
            if (container) {
                container.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [data, disableVerticalScroll]);

    const primaryColumn = columns[0];
    const secondaryColumns = columns.slice(1);

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            {/* Desktop Table View (Medium screens and up) */}
            <TableContainer
                ref={containerRef}
                component={Paper}
                elevation={0}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    overflowX: 'auto',
                    overflowY: disableVerticalScroll ? 'visible' : 'auto',
                    maxHeight: disableVerticalScroll ? 'none' : maxTableHeight,
                    border: '0.5px solid',
                    borderColor: 'divider',
                    borderRadius: '12px',
                    bgcolor: 'background.paper',
                }}
            >
                <Table stickyHeader={!disableVerticalScroll} sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.id}
                                    sx={{
                                        backgroundColor: headerBgColor,
                                        color: headerTextColor,
                                        fontWeight: 500,
                                        fontSize: '11px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04rem',
                                        borderBottom: '0.5px solid',
                                        borderColor: 'divider',
                                        py: 1.5,
                                    }}
                                >
                                    {col.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <TableRow
                                    key={row.id || rowIndex}
                                    hover
                                    sx={{
                                        borderBottom: '0.5px solid',
                                        borderColor: 'divider',
                                        transition: 'background-color 0.15s ease',
                                        '&:last-child td, &:last-child th': { border: 0 },
                                    }}
                                >
                                    {columns.map((col) => {
                                        const value = row[col.id];
                                        return (
                                            <TableCell key={col.id} sx={{ py: 1.5, fontSize: '13px', color: 'text.primary' }}>
                                                {col.format ? col.format(value, row) : (value ?? '-')}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No hay registros disponibles.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Mobile Cards View (Small screens) */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {data && data.length > 0 ? (
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
                                }}
                            >
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    {primaryColumn && (
                                        <Box sx={{ mb: 1 }}>
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
                                        </Box>
                                    )}

                                    {secondaryColumns.length > 0 && (
                                        <>
                                            <Divider sx={{ my: 1.25, borderColor: 'divider' }} />
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                                {secondaryColumns.map((col) => {
                                                    const value = row[col.id];
                                                    return (
                                                        <Box
                                                            key={col.id}
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
                                                                {col.name}
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
                                                                {col.format ? col.format(value, row) : (value ?? '-')}
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                ) : (
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
                            No hay registros disponibles.
                        </Typography>
                    </Paper>
                )}
            </Box>

            {showScrollIndicator && (
                <Box
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        pointerEvents: 'none',
                        animation: 'bounce 2s infinite',
                        '@keyframes bounce': {
                            '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0) translateX(-50%)' },
                            '40%': { transform: 'translateY(-6px) translateX(-50%)' },
                            '60%': { transform: 'translateY(-3px) translateX(-50%)' },
                        },
                    }}
                >
                    <Chip
                        icon={<ArrowDownwardIcon sx={{ fontSize: 14 }} />}
                        label="Desliza para ver más"
                        sx={{
                            fontWeight: 500,
                            backgroundColor: 'background.paper',
                            color: 'text.primary',
                            border: '0.5px solid',
                            borderColor: 'divider',
                            '& .MuiChip-icon': { marginLeft: '8px' },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};