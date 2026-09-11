import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, CircularProgress, Autocomplete } from '@mui/material';
import { teacherCreateSchema, teacherUpdateSchema } from '../../domain/teacher.schema';
import type { TeacherFormValues, TeacherProfile } from '../../domain/teacher.interfaces';
import { createTeacher, updateTeacher } from '../../infrastructure/teacher.service';
import { getCampuses } from '../../../../academic/campus/infrastructure/campus.service';
import type { Campus } from '../../../../academic/campus/domain/campus.interfaces';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface TeacherFormProps {
  initialData?: TeacherProfile;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ initialData }) => {
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
        toast.error('Failed to load campuses');
      } finally {
        setLoadingData(false);
      }
    };
    fetchRelations();
  }, []);

  const schema = initialData ? teacherUpdateSchema : teacherCreateSchema;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      email: initialData?.user?.email || '',
      passwordRaw: '', // Only for creation
      firstName: initialData?.user?.firstName || '',
      lastName: initialData?.user?.lastName || '',
      campusId: initialData?.campusId || '',
      employeeCode: initialData?.employeeCode || '',
    },
  });

  const onSubmit = async (values: TeacherFormValues) => {
    setGlobalError(null);
    try {
      if (initialData) {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          campusId: values.campusId,
          employeeCode: values.employeeCode
        };
        await updateTeacher(initialData.id, payload);
        toast.success('Teacher updated successfully');
      } else {
        await createTeacher(values);
        toast.success('Teacher created successfully');
      }
      navigate('/users/teachers');
    } catch (error: any) {
      setGlobalError(error.response?.data?.message || 'An error occurred while saving the teacher.');
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
    <Box component="form" onSubmit={handleSubmit(onSubmit as any)} noValidate sx={{ mt: 1 }}>
      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}

      <Controller
        name="firstName"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            label="First Name"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="lastName"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            label="Last Name"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      {!initialData && (
        <>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Email Address"
                type="email"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="passwordRaw"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </>
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
              <TextField {...params} label="Campus" margin="normal" required fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        )}
      />

      <Controller
        name="employeeCode"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            label="Employee Code (Optional)"
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
          onClick={() => navigate('/users/teachers')}
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

export default TeacherForm;
