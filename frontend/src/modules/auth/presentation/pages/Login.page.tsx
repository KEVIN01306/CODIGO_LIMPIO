import { Container, Box, Typography, Paper } from '@mui/material';
import LoginForm from '../components/LoginForm.component';

const LoginPage = () => {
  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="App Icon"
            sx={{
              width: 120,
              height: 120,
              borderRadius: 2,
              mb: 2,
              objectFit: 'cover',
            }}
          />
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Please sign in to access your dashboard.
          </Typography>

          <LoginForm />
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
