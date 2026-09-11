import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, CircularProgress, Autocomplete } from '@mui/material';
import { cohortSchema } from '../../../cohort/domain/cohort.schema';
import type { CohortFormValues, Cohort } from '../../../cohort/domain/cohort.interfaces';
import { createCohort, updateCohort } from '../../../cohort/infrastructure/cohort.service';
import { getCampuses } from '../../../campus/infrastructure/campus.service';
import { getAcademicPrograms } from '../../../program/infrastructure/academicProgram.service';
import type { Campus } from '../../../campus/domain/campus.interfaces';
import type { AcademicProgram } from '../../../program/domain/academicProgram.interfaces';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CohortFormProps {
  initialData?: Cohort;
}

const CohortForm: React.FC<CohortFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const [campusesRes, programsRes] = await Promise.all([
          getCampuses({ page: 1, perPage: 100, isActive: true }),
          getAcademicPrograms({ page: 1, perPage: 100 })
        ]);
        setCampuses(campusesRes.data);
        setPrograms(programsRes.data);
      } catch (error) {
        toast.error('Failed to load related data');
      } finally {
        setLoadingData(false);
      }
    };
    fetchRelations();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CohortFormValues>({
    resolver: zodResolver(cohortSchema),
    defaultValues: {
      campusId: initialData?.campusId || '',
      programId: initialData?.programId || '',
      name: initialData?.name || '',
      startYear: initialData?.startYear || new Date().getFullYear(),
    },
  });

  const onSubmit = async (values: CohortFormValues) => {
    setGlobalError(null);
    try {
      if (initialData) {
        await updateCohort(initialData.id, values);
        toast.success('Cohort updated successfully');
      } else {
        await createCohort(values);
        toast.success('Cohort created successfully');
      }
      navigate('/academic/cohorts');
    } catch (error: any) {
      setGlobalError(error.response?.data?.message || 'An error occurred while saving the cohort.');
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}

      <Controller
        name="campusId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            options={campuses}
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={campuses.find(c => c.id === field.value) || null}
            onChange={(_, newValue) => field.onChange(newValue ? newValue.id : '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Campus"
                margin="normal"
                required
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        )}
      />

      <Controller
        name="programId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            options={programs}
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={programs.find(p => p.id === field.value) || null}
            onChange={(_, newValue) => field.onChange(newValue ? newValue.id : '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Academic Program"
                margin="normal"
                required
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
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
            label="Cohort Name"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="startYear"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            type="number"
            id="startYear"
            label="Start Year"
            error={!!error}
            helperText={error?.message}
            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || '')}
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          disabled={isSubmitting}
          onClick={() => navigate('/academic/cohorts')}
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

export default CohortForm;
