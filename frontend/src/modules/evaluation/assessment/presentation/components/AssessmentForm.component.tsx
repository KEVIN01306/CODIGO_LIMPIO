import React from 'react';
import { Box, Button, TextField, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assessmentSchema } from '../../domain/assessment.schema';
import type { AssessmentFormValues, Assessment } from '../../domain/assessment.interfaces';
import { createAssessment, updateAssessment } from '../../infrastructure/assessment.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AssessmentFormProps {
  initialData?: Assessment;
  offeringId?: string;
}

const ASSESSMENT_TYPES = ['QUIZ', 'EXAM', 'PROJECT', 'HOMEWORK', 'AI_INTERVIEW'];
const ALLOWED_LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp'];

const AssessmentForm: React.FC<AssessmentFormProps> = ({ initialData, offeringId }) => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema) as any,
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
      strictMode: initialData?.strictMode ?? true,
    },
  });

  const onSubmit = async (values: AssessmentFormValues) => {
    try {
      const payload = {
        ...values,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
      };

      if (initialData) {
        await updateAssessment(initialData.id, payload);
        toast.success('Assessment updated successfully');
      } else {
        await createAssessment(payload);
        toast.success('Assessment created successfully');
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

      <Controller
        name="strictMode"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
            label="Strict Mode (Proctoring features)"
            sx={{ mt: 2, mb: 1 }}
          />
        )}
      />

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
