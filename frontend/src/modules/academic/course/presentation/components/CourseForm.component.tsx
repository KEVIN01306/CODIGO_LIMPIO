import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, CircularProgress, Autocomplete, FormControlLabel, Switch } from '@mui/material';
import { courseSchema } from '../../../course/domain/course.schema';
import type { CourseFormValues, Course } from '../../../course/domain/course.interfaces';
import { createCourse, updateCourse } from '../../../course/infrastructure/course.service';
import { getAcademicPrograms } from '../../../program/infrastructure/academicProgram.service';
import type { AcademicProgram } from '../../../program/domain/academicProgram.interfaces';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CourseFormProps {
  initialData?: Course;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const programsRes = await getAcademicPrograms({ page: 1, perPage: 100 });
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
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      programId: initialData?.programId || '',
      code: initialData?.code || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      credits: initialData?.credits || 0,
      isActive: initialData ? initialData.isActive : true,
    },
  });

  const onSubmit = async (values: CourseFormValues) => {
    setGlobalError(null);
    try {
      if (initialData) {
        await updateCourse(initialData.id, values);
        toast.success('Course updated successfully');
      } else {
        await createCourse(values);
        toast.success('Course created successfully');
      }
      navigate('/academic/courses');
    } catch (error: any) {
      setGlobalError(error.response?.data?.message || 'An error occurred while saving the course.');
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
        name="code"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="code"
            label="Course Code"
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
            label="Course Name"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            multiline
            rows={3}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="credits"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            type="number"
            id="credits"
            label="Credits"
            error={!!error}
            helperText={error?.message}
            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
          />
        )}
      />

      {initialData && (
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
              sx={{ mt: 2 }}
            />
          )}
        />
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          disabled={isSubmitting}
          onClick={() => navigate('/academic/courses')}
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

export default CourseForm;
