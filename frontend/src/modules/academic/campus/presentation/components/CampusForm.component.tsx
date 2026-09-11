import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import { campusSchema } from '../../../campus/domain/campus.schema';
import type { CampusFormValues, Campus } from '../../../campus/domain/campus.interfaces';
import { createCampus, updateCampus } from '../../../campus/infrastructure/campus.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CampusFormProps {
  initialData?: Campus;
}

const CampusForm: React.FC<CampusFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CampusFormValues>({
    resolver: zodResolver(campusSchema),
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      address: initialData?.address || '',
      isActive: initialData !== undefined ? initialData.isActive : true,
    },
  });

  const onSubmit = async (values: CampusFormValues) => {
    setGlobalError(null);
    try {
      if (initialData) {
        await updateCampus(initialData.id, values);
        toast.success('Campus updated successfully');
      } else {
        await createCampus(values);
        toast.success('Campus created successfully');
      }
      navigate('/academic/campuses');
    } catch (error: any) {
      setGlobalError(error.response?.data?.message || 'An error occurred while saving the campus.');
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
            label="Campus Code"
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
            label="Campus Name"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="address"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            id="address"
            label="Address"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                color="primary"
              />
            }
            label="Is Active"
            sx={{ mt: 2, mb: 1, display: 'block' }}
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          disabled={isSubmitting}
          onClick={() => navigate('/academic/campuses')}
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

export default CampusForm;
