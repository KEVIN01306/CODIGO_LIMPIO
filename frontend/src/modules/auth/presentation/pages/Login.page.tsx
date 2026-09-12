import { Container, Box, Typography, Paper } from '@mui/material';
import { Terminal } from '@mui/icons-material';
import LoginForm from '../components/LoginForm.component';

const LoginPage = () => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 4.5 },
            width: '100%',
            borderRadius: '16px',
            border: '0.5px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 20px 44px rgba(0,0,0,0.5)'
                : '0 10px 30px rgba(0,0,0,0.06)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Mission control technical chip logo */}
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '10px',
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1f1f21' : '#f1f5f9'),
                border: '0.5px solid',
                borderColor: 'divider',
                boxShadow: '0 0 0 1.5px rgba(59, 130, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
                mb: 2.5,
              }}
            >
              <Terminal sx={{ fontSize: 26 }} />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 400,
                color: 'text.primary',
                fontSize: '24px',
                letterSpacing: '-0.64px',
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              Sign in
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 3,
                fontSize: '13px',
                letterSpacing: '-0.2px',
              }}
            >
              to continue to <span style={{ color: 'inherit', fontWeight: 500 }}>CleanCode Platform</span>
            </Typography>

            <LoginForm />
          </Box>
        </Paper>

        {/* Minimal Footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 1.5,
            mt: 3,
            fontSize: '11px',
            color: 'text.secondary',
            letterSpacing: '-0.1px',
          }}
        >
          <span>CleanCode Platform</span>
          <Box sx={{ display: 'flex', gap: 2.5 }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }}>Help</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }}>Privacy</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }}>Terms</span>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
