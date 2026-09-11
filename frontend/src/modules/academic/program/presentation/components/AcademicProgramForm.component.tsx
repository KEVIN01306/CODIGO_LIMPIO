import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { academicProgramSchema } from '../../../program/domain/academicProgram.schema';
import type { AcademicProgramFormValues, AcademicProgram } from '../../../program/domain/academicProgram.interfaces';
import { createAcademicProgram, updateAcademicProgram } from '../../../program/infrastructure/academicProgram.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AcademicProgramFormProps {
  initialData?: AcademicProgram;
}

const AcademicProgramForm: React.FC<AcademicProgramFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AcademicProgramFormValues>({
    resolver: zodResolver(academicProgramSchema),
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
    },
  });

  const onSubmit = async (values: AcademicProgramFormValues) => {
    setGlobalError(null);
    try {
      if (initialData) {
        await updateAcademicProgram(initialData.id, values);
        toast.success('Academic program updated successfully');
      } else {
        await createAcademicProgram(values);
        toast.success('Academic program created successfully');
      }
      navigate('/academic/programs');
    } catch (error: any) {
      setGlobalError(error.response?.data?.message || 'An error occurred while saving the academic program.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}

      <Controller
        name="code"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="code"
            label="Program Code"
            autoFocus
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="name"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="name"
            label="Program Name"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          disabled={isSubmitting}
          onClick={() => navigate('/academic/programs')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default AcademicProgramForm;
