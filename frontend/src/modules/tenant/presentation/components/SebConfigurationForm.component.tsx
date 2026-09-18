import React, { useEffect, useState, useRef } from 'react';
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
  Chip,
  Stack,
} from '@mui/material';
import {
  SecurityOutlined,
  SaveOutlined,
  Visibility,
  VisibilityOff,
  LockOutlined,
  InfoOutlined,
  UploadFileOutlined,
  InsertDriveFileOutlined,
  CheckCircleOutlineOutlined,
  CloseOutlined,
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
  const [configuredFileName, setConfiguredFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const extractFileName = (url?: string | null): string | null => {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split('/');
      return decodeURIComponent(parts[parts.length - 1]);
    } catch {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setGlobalError(null);
    try {
      const data = await getSebConfiguration();
      reset({
        defaultSebConfigKey: data.defaultSebConfigKey || '',
      });
      const existingUrl = data.defaultSebConfigUrl || data.defaultSebConfigFilePath;
      setConfiguredFileName(extractFileName(existingUrl));
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.seb')) {
      setFileError('Only .seb files are allowed.');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (values: SebConfigFormValues) => {
    if (!canEdit) return;
    setGlobalError(null);
    try {
      const formattedKey = values.defaultSebConfigKey.trim() || null;

      let updated;
      if (selectedFile) {
        const formData = new FormData();
        if (formattedKey !== null) {
          formData.append('defaultSebConfigKey', formattedKey);
        }
        // Force MIME type to application/seb
        const fileWithMime = new File([selectedFile], selectedFile.name, {
          type: 'application/seb',
        });
        formData.append('file', fileWithMime);
        updated = await updateSebConfiguration(formData);
      } else {
        updated = await updateSebConfiguration({
          defaultSebConfigKey: formattedKey,
        });
      }

      reset({
        defaultSebConfigKey: updated.defaultSebConfigKey || '',
      });
      const newUrl = updated.defaultSebConfigUrl || updated.defaultSebConfigFilePath;
      setConfiguredFileName(extractFileName(newUrl));
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

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

  const hasChanges = isDirty || selectedFile !== null;

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
            Configure the institution-level cryptographic key and default SEB configuration file for Safe Exam Browser enforcement.
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
              The <strong>defaultSebConfigKey</strong> and default configuration file (<strong>.seb</strong>) are validated by Safe Exam Browser when students take restricted exams.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Stack spacing={3} sx={{ maxWidth: 640 }}>
        {/* SEB Key Input */}
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

        {/* SEB Configuration File Upload */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            SEB Configuration File
          </Typography>

          {/* Configured file status */}
          {configuredFileName && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                mb: 1.5,
                borderRadius: 1,
                bgcolor: 'action.hover',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <CheckCircleOutlineOutlined sx={{ color: 'success.main', fontSize: 20 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ display: "block" }} variant="caption" color="text.secondary">
                  Configured file:
                </Typography>
                <Typography sx={{ fontWeight: 500, display: "block" }} variant="body2" noWrap>
                  {configuredFileName}
                </Typography>
              </Box>
              <Chip size="small" label="Active" color="success" variant="outlined" />
            </Box>
          )}

          {/* Selected new file preview */}
          {selectedFile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                mb: 1.5,
                borderRadius: 1,
                bgcolor: 'primary.dark',
                opacity: 0.9,
              }}
            >
              <InsertDriveFileOutlined sx={{ color: 'primary.light', fontSize: 22 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024).toFixed(1)} KB (Ready to upload)
                </Typography>
              </Box>
              <IconButton size="small" onClick={handleClearSelectedFile} aria-label="remove selected file">
                <CloseOutlined fontSize="small" />
              </IconButton>
            </Box>
          )}

          {fileError && (
            <Alert severity="error" sx={{ mb: 1.5 }}>
              {fileError}
            </Alert>
          )}

          {/* File picker button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".seb"
            id="sebConfigFile"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={!canEdit || isSubmitting}
          />

          <Button
            variant="outlined"
            color="primary"
            startIcon={<UploadFileOutlined />}
            onClick={() => fileInputRef.current?.click()}
            disabled={!canEdit || isSubmitting}
            size="medium"
          >
            {configuredFileName ? 'Replace file' : 'Choose .seb file'}
          </Button>
          <Typography sx={{ display: "block", mt: 0.5 }} variant="caption" color="text.secondary">
            Accepts only <strong>.seb</strong> files.
          </Typography>
        </Box>
      </Stack>

      {canEdit && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
            disabled={isSubmitting || !hasChanges}
            sx={{ px: 4, py: 1 }}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      )}
    </Box>
  );
};
