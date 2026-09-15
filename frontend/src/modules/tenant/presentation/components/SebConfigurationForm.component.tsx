import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  SecurityOutlined,
  SaveOutlined,
  Visibility,
  VisibilityOff,
  LockOutlined,
  InfoOutlined,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { sebConfigurationSchema } from '../../domain/tenant.schemas';
import type { SebConfigFormValues } from '../../domain/tenant.interfaces';
import {
  getSebConfiguration,
  updateSebConfiguration,
} from '../../infrastructure/tenant.service';
import { useAuthStore } from '../../../../core/store/auth.store';

export const SebConfigurationForm: React.FC = () => {
  const { user } = useAuthStore();
  const canEdit = user?.permissions?.includes('tenant:update') ?? false;

  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<SebConfigFormValues>({
    resolver: zodResolver(sebConfigurationSchema),
    defaultValues: {
      defaultSebConfigKey: '',
    },
  });

  const loadData = async () => {
    setLoading(true);
    setGlobalError(null);
    try {
      const data = await getSebConfiguration();
      reset({
        defaultSebConfigKey: data.defaultSebConfigKey || '',
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to load SEB configuration. Please try again.';
      setGlobalError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (values: SebConfigFormValues) => {
    if (!canEdit) return;
    setGlobalError(null);
    try {
      const formattedKey = values.defaultSebConfigKey.trim() || null;
      const updated = await updateSebConfiguration({
        defaultSebConfigKey: formattedKey,
      });
      reset({
        defaultSebConfigKey: updated.defaultSebConfigKey || '',
      });
      toast.success('SEB configuration updated successfully');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'An error occurred while saving the SEB configuration.';
      setGlobalError(message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {!canEdit && (
        <Alert severity="info" icon={<LockOutlined fontSize="inherit" />} sx={{ mb: 3 }}>
          You have read-only access. You need the <strong>tenant:update</strong> permission to modify SEB configuration.
        </Alert>
      )}

      {globalError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setGlobalError(null)}>
          {globalError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <SecurityOutlined sx={{ color: 'primary.main', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Safe Exam Browser (SEB) Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure the institution-level cryptographic key for Safe Exam Browser enforcement.
          </Typography>
        </Box>
      </Box>

      {/* Security Guidance Note */}
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          bgcolor: 'background.default',
          border: '0.5px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <InfoOutlined sx={{ color: 'info.main', fontSize: 20, mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary">
              The <strong>defaultSebConfigKey</strong> is the institutional fallback key validated by Safe Exam Browser when students take restricted exams. Leave this field empty if your institution does not enforce a global default key.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ maxWidth: 640 }}>
        <Controller
          name="defaultSebConfigKey"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              id="defaultSebConfigKey"
              label="Default SEB Config Key"
              placeholder="Enter SEB configuration key..."
              type={showKey ? 'text' : 'password'}
              disabled={!canEdit || isSubmitting}
              error={!!error}
              helperText={
                error?.message ||
                'Sensitive configuration key. Used by assessments configured with SEB requirements.'
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle SEB key visibility"
                        onClick={() => setShowKey(!showKey)}
                        edge="end"
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showKey ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />
      </Box>

      {canEdit && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
            disabled={isSubmitting || !isDirty}
            sx={{ px: 4, py: 1 }}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      )}
    </Box>
  );
};
