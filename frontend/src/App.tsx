import { RouterProvider } from 'react-router-dom';
import { appRouter } from './presentation/routes/appRouter';
import { useAuthInitialization } from './core/hooks/useAuthInitialization';
import { Box, CircularProgress } from '@mui/material';

function App() {
  const { isInitialized } = useAuthInitialization();

  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <RouterProvider router={appRouter} />;
}

export default App;
