import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, CircularProgress, Autocomplete, FormControlLabel, Checkbox } from '@mui/material';
import { academicCycleSchema } from '../../../cycle/domain/academicCycle.schema';
import type { AcademicCycleFormValues, AcademicCycle } from '../../../cycle/domain/academicCycle.interfaces';
import { createAcademicCycle, updateAcademicCycle } from '../../../cycle/infrastructure/academicCycle.service';
import { getCampuses } from '../../../campus/infrastructure/campus.service';
import type { Campus } from '../../../campus/domain/campus.interfaces';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AcademicCycleFormProps {
  initialData?: AcademicCycle;
}

const AcademicCycleForm: React.FC<AcademicCycleFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const campusesRes = await getCampuses({ page: 1, perPage: 100 });
        setCampuses(campusesRes.data);
      } catch (error) {
        toast.error('Failed to load related data');
      } finally {
        setLoadingData(false);
      }
    };
    fetchRelations();
  }, []);

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AcademicCycleFormValues>({
    resolver: zodResolver(academicCycleSchema),
    defaultValues: {
      campusId: initialData?.campusId || '',
      name: initialData?.name || '',
      year: initialData?.year || new Date().getFullYear(),
      order: initialData?.order || 1,
      startDate: formatDateForInput(initialData?.startDate) || '',
      endDate: formatDateForInput(initialData?.endDate) || '',
      isCurrent: initialData?.isCurrent || false,
    },
  });

  const onSubmit = async (values: AcademicCycleFormValues) => {
    setGlobalError(null);
    try {
      const formattedValues = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString()
      };

      if (initialData) {
        await updateAcademicCycle(initialData.id, formattedValues);
        toast.success('Academic cycle updated successfully');
      } else {
        await createAcademicCycle(formattedValues);
        toast.success('Academic cycle created successfully');
      }
      navigate('/academic/cycles');
    } catch (error: any) {
      setGlobalError(error.response?.data?.message || 'An error occurred while saving the academic cycle.');
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
            getOptionLabel={(option) => option.name}
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
        name="name"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="name"
            label="Cycle Name"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="year"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            type="number"
            id="year"
            label="Year"
            error={!!error}
            helperText={error?.message}
            onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
          />
        )}
      />

      <Controller
        name="order"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            type="number"
            id="order"
            label="Order (e.g. 1 for First Cycle)"
            error={!!error}
            helperText={error?.message}
            onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
          />
        )}
      />

      <Controller
        name="startDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            type="datetime-local"
            id="startDate"
            label="Start Date"
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="endDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            type="datetime-local"
            id="endDate"
            label="End Date"
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="isCurrent"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                color="primary"
              />
            }
            label="Is Current Cycle?"
            sx={{ mt: 2, mb: 1 }}
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          disabled={isSubmitting}
          onClick={() => navigate('/academic/cycles')}
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

export default AcademicCycleForm;
