import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default"
      }}
    >
      <Typography variant="h3" color="error" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        You do not have permission to access this page.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Return to Home
      </Button>
    </Box>
  );
};

export default AccessDeniedPage;
