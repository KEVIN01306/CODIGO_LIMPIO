import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { BusinessOutlined, SaveOutlined, LockOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { tenantInformationSchema } from '../../domain/tenant.schemas';
import type { TenantInfoFormValues, TenantConfiguration } from '../../domain/tenant.interfaces';
import {
  getTenantConfiguration,
  updateTenantConfiguration,
} from '../../infrastructure/tenant.service';
import { useAuthStore } from '../../../../core/store/auth.store';

export const TenantInformationForm: React.FC = () => {
  const { user } = useAuthStore();
  const canEdit = user?.permissions?.includes('tenant:update') ?? false;

  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [tenantData, setTenantData] = useState<TenantConfiguration | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<TenantInfoFormValues>({
    resolver: zodResolver(tenantInformationSchema),
    defaultValues: {
      name: '',
      slug: '',
      isActive: true,
    },
  });

  const loadData = async () => {
    setLoading(true);
    setGlobalError(null);
    try {
      const data = await getTenantConfiguration();
      setTenantData(data);
      reset({
        name: data.name,
        slug: data.slug,
        isActive: data.isActive,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to load tenant information. Please try again.';
      setGlobalError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (values: TenantInfoFormValues) => {
    if (!canEdit) return;
    setGlobalError(null);
    try {
      const updated = await updateTenantConfiguration({
        name: values.name.trim(),
        slug: values.slug.trim(),
        isActive: values.isActive,
      });
      setTenantData(updated);
      reset({
        name: updated.name,
        slug: updated.slug,
        isActive: updated.isActive,
      });
      toast.success('Tenant information updated successfully');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'An error occurred while updating tenant information.';
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
          You have read-only access. You need the <strong>tenant:update</strong> permission to modify these settings.
        </Alert>
      )}

      {globalError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setGlobalError(null)}>
          {globalError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <BusinessOutlined sx={{ color: 'primary.main', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            General Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage organizational details for your institution.
          </Typography>
        </Box>
      </Box>

      {/* Read-Only Metadata Badges */}
      {tenantData && (
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 1.5,
            bgcolor: 'background.default',
            border: '0.5px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Tenant ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
              {tenantData.id}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.07)' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Status
            </Typography>
            <Chip
              label={tenantData.isActive ? 'Active' : 'Inactive'}
              size="small"
              color={tenantData.isActive ? 'success' : 'default'}
              variant="outlined"
              sx={{ height: 22, fontSize: '0.75rem' }}
            />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.07)' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Created At
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(tenantData.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3,
        }}
      >
        <Box>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                id="tenant-name"
                label="Institution Name"
                placeholder="e.g. Universidad Tecnológica"
                disabled={!canEdit || isSubmitting}
                error={!!error}
                helperText={error?.message}
                required
              />
            )}
          />
        </Box>

        <Box>
          <Controller
            name="slug"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                id="tenant-slug"
                label="Subdomain / Slug Identifier"
                placeholder="e.g. utec"
                disabled={!canEdit || isSubmitting}
                error={!!error}
                helperText={
                  error?.message || 'Unique URL slug for this tenant (alphanumeric and hyphens only)'
                }
                required
              />
            )}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={!canEdit || isSubmitting}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Tenant Active Status
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Controls whether the tenant institution is active and accessible.
                    </Typography>
                  </Box>
                }
              />
            )}
          />
        </Box>
      </Box>

      {canEdit && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
            disabled={isSubmitting || !isDirty}
            sx={{ px: 4, py: 1 }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      )}
    </Box>
  );
};
