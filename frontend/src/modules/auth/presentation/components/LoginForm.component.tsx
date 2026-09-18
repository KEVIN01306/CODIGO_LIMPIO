import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginSchema, type LoginFormValues } from '../../domain/auth.schemas';
import { login } from '../../infrastructure/auth.service';
import { useAuthStore } from '../../../../core/store/auth.store';
import api from '../../../../core/api/axios.config';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setGlobalError(null);
    try {
      const response = await login(values);
      setAuth(response.user, response.accessToken);

      // 1. Check if there was a previous route in location.state (e.g. from ProtectedRoute)
      const stateFrom = (location.state as any)?.from;
      let targetPath = '/';

      if (stateFrom) {
        if (typeof stateFrom === 'string' && stateFrom.trim() && !stateFrom.startsWith('/auth')) {
          targetPath = stateFrom;
        } else if (typeof stateFrom === 'object' && stateFrom.pathname && !stateFrom.pathname.startsWith('/auth')) {
          targetPath = `${stateFrom.pathname}${stateFrom.search || ''}${stateFrom.hash || ''}`;
        }
      }

      // 2. Check for SEB active submission cookie or query active submission
      const cookieMatch = document.cookie.match(/(?:^|; )seb_active_submission_id=([^;]+)/);
      const sebCookieSubmissionId = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
      const isSeb = navigator.userAgent.includes('SEB') || navigator.userAgent.includes('SafeExamBrowser');

      if (sebCookieSubmissionId) {
        targetPath = `/sandbox/${sebCookieSubmissionId}`;
        document.cookie = 'seb_active_submission_id=; path=/; max-age=0;';
      } else if (isSeb && !targetPath.startsWith('/sandbox/')) {
        try {
          const activeRes = await api.get('/evaluations/submissions/active', {
            headers: { Authorization: `Bearer ${response.accessToken}` }
          });
          if (activeRes.data?.data?.id) {
            targetPath = `/sandbox/${activeRes.data.data.id}`;
          }
        } catch {
          // fallback to targetPath
        }
      }

      navigate(targetPath, { replace: true });
      toast.success('Signed in successfully');
    } catch (error: any) {
      setGlobalError(
        error.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
      {globalError && (
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
            borderRadius: '10px',
            fontSize: '13px',
            textAlign: 'left',
            bgcolor: 'rgba(248, 113, 113, 0.1)',
            color: '#f87171',
            border: '0.5px solid rgba(248, 113, 113, 0.3)',
          }}
        >
          {globalError}
        </Alert>
      )}

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email or Username"
            autoComplete="email"
            autoFocus
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            error={!!error}
            helperText={error?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: '#858687' }}
                    >
                      {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />

      <Box sx={{ mt: 3, mb: 1 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          fullWidth
          sx={{
            borderRadius: '10px',
            bgcolor: '#f2f2f2',
            color: '#333333',
            textTransform: 'none',
            fontWeight: 450,
            fontSize: '14px',
            letterSpacing: '-0.2px',
            height: 40,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: '#e5e5e5',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            },
          }}
        >
          {isSubmitting ? <CircularProgress size={18} color="inherit" /> : 'Sign In'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
