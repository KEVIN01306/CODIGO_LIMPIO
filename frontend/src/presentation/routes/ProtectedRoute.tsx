import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../core/store/auth.store';
import { Box, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';

// For simplicity, we just check Zustand store. 
// In a full implementation, you'd verify if the token is expired and refresh it.
const ProtectedRoute = () => {
  const { isAuthenticated, accessToken } = useAuthStore();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Simulate validation delay. 
    // Here you would call a /me endpoint or verify JWT expiration.
    const validateSession = () => {
      setIsValidating(false);
    };
    validateSession();
  }, [accessToken]);

  if (isValidating) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
