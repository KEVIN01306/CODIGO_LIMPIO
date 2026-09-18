import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

const ExamFinishedPage: React.FC = () => {
  const handleClose = () => {
    try {
      window.close();
    } catch {
      // Ignored
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        p: 3,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          borderRadius: '16px',
          bgcolor: 'background.paper',
          border: '0.5px solid',
          borderColor: 'divider',
          maxWidth: 480,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CheckCircleOutlineRoundedIcon
          sx={{
            fontSize: 56,
            color: 'success.main',
            mb: 2,
          }}
        />

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5, letterSpacing: '-0.02em' }}>
          Examen entregado exitosamente
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5, lineHeight: 1.6 }}>
          Tu solución ha sido guardada y enviada correctamente para su evaluación.
          El entorno de examen ha finalizado. Ya puedes cerrar esta ventana.
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleClose}
          sx={{
            borderRadius: '10px',
            px: 3,
          }}
        >
          Cerrar ventana
        </Button>
      </Paper>
    </Box>
  );
};

export default ExamFinishedPage;
