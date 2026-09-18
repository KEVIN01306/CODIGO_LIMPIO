import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Card,
  Typography,
  IconButton,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  SecurityOutlined,
  UploadFileOutlined,
  InsertDriveFileOutlined,
  CheckCircleOutlineOutlined,
  CloseOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAssessmentSchema } from '../../domain/assessment.schema';
import type { AssessmentFormValues, Assessment } from '../../domain/assessment.interfaces';
import { createAssessment, updateAssessment, getDefaultSebConfig } from '../../infrastructure/assessment.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


interface AssessmentFormProps {
  initialData?: Assessment;
  offeringId?: string;
}

const ASSESSMENT_TYPES = ['QUIZ', 'EXAM', 'PROJECT', 'HOMEWORK', 'AI_INTERVIEW'];
const ALLOWED_LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp'];

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

const AssessmentForm: React.FC<AssessmentFormProps> = ({ initialData, offeringId }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showSebKey, setShowSebKey] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tenantHasDefaultSeb, setTenantHasDefaultSeb] = useState<boolean>(false);
  const existingFileName = extractFileName(initialData?.sebConfigFilePath);
  const schema = useMemo(() => createAssessmentSchema(tenantHasDefaultSeb), [tenantHasDefaultSeb]);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {

      offeringId: initialData?.offeringId || offeringId || '',
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'QUIZ',
      maxScore: initialData?.maxScore || 100,
      weight: initialData?.weight || 0,
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : '',
      timeLimitMinutes: initialData?.timeLimitMinutes || 60,
      allowedLanguage: initialData?.allowedLanguage || '',
      strictMode: initialData?.strictMode ?? false,
      sebConfigKey: initialData?.sebConfigKey || '',
      sebConfigFile: null,
      sebConfigFilePath: initialData?.sebConfigFilePath || null,
    },
  });

  const selectedOfferingId = useWatch({ control, name: 'offeringId' }) || offeringId || initialData?.offeringId;
  const strictMode = useWatch({ control, name: 'strictMode' });

  useEffect(() => {
    getDefaultSebConfig(selectedOfferingId)
      .then((res) => {
        const hasSeb = Boolean(res?.hasDefaultSeb);
        setTenantHasDefaultSeb(hasSeb);
        if (hasSeb) {
          clearErrors('sebConfigKey');
          clearErrors('sebConfigFile');
        }
      })
      .catch(() => setTenantHasDefaultSeb(false));
  }, [selectedOfferingId, clearErrors]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.seb')) {
      setError('sebConfigFile', { message: 'Only .seb files are allowed.' });
      setSelectedFile(null);
      setValue('sebConfigFile', null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    clearErrors('sebConfigFile');
    setSelectedFile(file);
    setValue('sebConfigFile', file, { shouldValidate: true });
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setValue('sebConfigFile', null, { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (values: AssessmentFormValues) => {
    try {
      if (values.strictMode) {
        // Enforce multipart/form-data for SEB configuration
        const formData = new FormData();
        formData.append('offeringId', values.offeringId);
        formData.append('title', values.title);
        if (values.description) formData.append('description', values.description);
        formData.append('type', values.type);
        formData.append('maxScore', String(values.maxScore));
        if (values.weight !== undefined && values.weight !== null) formData.append('weight', String(values.weight));
        if (values.dueDate) formData.append('dueDate', new Date(values.dueDate).toISOString());
        if (values.timeLimitMinutes !== undefined && values.timeLimitMinutes !== null) {
          formData.append('timeLimitMinutes', String(values.timeLimitMinutes));
        }
        if (values.allowedLanguage) formData.append('allowedLanguage', values.allowedLanguage);
        formData.append('strictMode', 'true');
        formData.append('sebConfigKey', values.sebConfigKey?.trim() || '');

        const fileToUpload = selectedFile || (values.sebConfigFile instanceof File ? values.sebConfigFile : null);
        if (fileToUpload) {
          const fileWithMime = new File([fileToUpload], fileToUpload.name, {
            type: 'application/seb',
          });
          formData.append('sebConfigFile', fileWithMime);
          formData.append('file', fileWithMime);
        }

        if (initialData) {
          await updateAssessment(initialData.id, formData);
          toast.success('Assessment updated successfully');
        } else {
          await createAssessment(formData);
          toast.success('Assessment created successfully');
        }
      } else {
        // Normal JSON payload when strictMode = false (requireSeb = false)
        const payload = {
          offeringId: values.offeringId,
          title: values.title,
          description: values.description || undefined,
          type: values.type,
          maxScore: values.maxScore,
          weight: values.weight,
          dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
          timeLimitMinutes: values.timeLimitMinutes,
          allowedLanguage: values.allowedLanguage,
          strictMode: false,
        };

        if (initialData) {
          await updateAssessment(initialData.id, payload);
          toast.success('Assessment updated successfully');
        } else {
          await createAssessment(payload);
          toast.success('Assessment created successfully');
        }
      }

      navigate(`/assignment/offerings/${values.offeringId}/assessments`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred while saving the assessment.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit as any)} noValidate>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Title" margin="normal" required fullWidth error={!!errors.title} helperText={errors.title?.message} />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Description" margin="normal" fullWidth multiline rows={3} error={!!errors.description} helperText={errors.description?.message} />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Type" margin="normal" required fullWidth error={!!errors.type} helperText={errors.type?.message}>
            {ASSESSMENT_TYPES.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
        )}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller
          name="maxScore"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="number" label="Max Score" margin="normal" required fullWidth error={!!errors.maxScore} helperText={errors.maxScore?.message} />
          )}
        />
        <Controller
          name="weight"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="number" label="Weight (%)" margin="normal" fullWidth error={!!errors.weight} helperText={errors.weight?.message} />
          )}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="datetime-local" label="Due Date" margin="normal" fullWidth slotProps={{ inputLabel: { shrink: true } }} error={!!errors.dueDate} helperText={errors.dueDate?.message} />
          )}
        />
        <Controller
          name="timeLimitMinutes"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="number" label="Time Limit (Minutes)" margin="normal" fullWidth error={!!errors.timeLimitMinutes} helperText={errors.timeLimitMinutes?.message} />
          )}
        />
      </Box>

      <Controller
        name="allowedLanguage"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Allowed Language" margin="normal" fullWidth error={!!errors.allowedLanguage} helperText={errors.allowedLanguage?.message}>
            <MenuItem value="">(No specific language)</MenuItem>
            {ALLOWED_LANGUAGES.map((lang) => (
              <MenuItem key={lang} value={lang}>{lang}</MenuItem>
            ))}
          </TextField>
        )}
      />

      {/* Strict Mode Switch */}
      <Controller
        name="strictMode"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(field.value)}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label="Strict Mode (Proctoring features & Safe Exam Browser)"
            sx={{ mt: 2, mb: 1 }}
          />
        )}
      />

      {/* Conditional SEB Configuration Section: Only shown when strictMode is enabled */}
      {strictMode && (
        <Card
          variant="outlined"
          sx={{
            mt: 2,
            mb: 2,
            p: 2.5,
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <SecurityOutlined sx={{ color: 'primary.main', fontSize: 24 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                SEB Configuration
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {tenantHasDefaultSeb
                  ? 'Institutional default SEB configuration is active. Providing an Assessment-specific key and .seb file is optional and will override the default configuration.'
                  : 'Both the SEB Key and a .seb configuration file are mandatory when strict mode is active.'}
              </Typography>
            </Box>
          </Box>

          {/* SEB Key Input */}
          <Controller
            name="sebConfigKey"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={tenantHasDefaultSeb ? "SEB Key (Optional - overrides tenant default)" : "SEB Key"}
                placeholder="Enter SEB configuration key..."
                required={!tenantHasDefaultSeb}
                fullWidth
                margin="normal"
                type={showSebKey ? 'text' : 'password'}
                error={!!errors.sebConfigKey}
                helperText={errors.sebConfigKey?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle SEB key visibility"
                          onClick={() => setShowSebKey(!showSebKey)}
                          edge="end"
                          size="small"
                        >
                          {showSebKey ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          {/* SEB Configuration File */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              SEB Configuration File {tenantHasDefaultSeb ? '(Optional)' : '*'}
            </Typography>


            {/* Configured file from initialData */}
            {existingFileName && !selectedFile && (
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
                  <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                    {existingFileName}
                  </Typography>
                </Box>
                <Chip size="small" label="Active" color="success" variant="outlined" />
              </Box>
            )}

            {/* Newly selected file */}
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
                <IconButton size="small" onClick={handleClearFile} aria-label="remove selected file">
                  <CloseOutlined fontSize="small" />
                </IconButton>
              </Box>
            )}

            {errors.sebConfigFile && (
              <Typography sx={{ display: "block", mb: 1 }} variant="caption" color="error">
                {errors.sebConfigFile.message as string}
              </Typography>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".seb"
              id="assessmentSebConfigFile"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <Button
              variant="outlined"
              size="medium"
              startIcon={<UploadFileOutlined />}
              onClick={() => fileInputRef.current?.click()}
            >
              {existingFileName || selectedFile ? 'Replace .seb file' : 'Upload .seb file'}
            </Button>
            <Typography sx={{ display: "block", mt: 0.5 }} variant="caption" color="text.secondary">
              Accepts only <strong>.seb</strong> files.
            </Typography>
          </Box>
        </Card>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
          {initialData ? 'Update Assessment' : 'Create Assessment'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate(`/assignment/offerings/${offeringId}/assessments`)}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AssessmentForm;
