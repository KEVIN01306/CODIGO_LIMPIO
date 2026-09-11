import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, CircularProgress, Autocomplete, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { courseEnrollmentSchema } from '../../domain/courseEnrollment.schema';
import type { CourseEnrollmentFormValues, CourseEnrollment, StudentProfile } from '../../domain/courseEnrollment.interfaces';
import { createCourseEnrollment, updateCourseEnrollment } from '../../infrastructure/courseEnrollment.service';

import api from '../../../../../core/api/axios.config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CourseEnrollmentFormProps {
  initialData?: CourseEnrollment;
  offeringId?: string;
}

const CourseEnrollmentForm: React.FC<CourseEnrollmentFormProps> = ({ initialData, offeringId }) => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const studentsRes = await api.get('/users/students');
        setStudents(studentsRes.data.data);
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
  } = useForm<CourseEnrollmentFormValues>({
    resolver: zodResolver(courseEnrollmentSchema),
    defaultValues: {
      offeringId: initialData?.offeringId || offeringId || '',
      studentId: initialData?.studentId || '',
      status: initialData?.status || 'ENROLLED',
      finalGrade: initialData?.finalGrade || null,
    },
  });

  const onSubmit = async (values: CourseEnrollmentFormValues) => {
    setGlobalError(null);
    try {
      const payload = {
        ...values,
        finalGrade: values.finalGrade === null ? undefined : Number(values.finalGrade)
      };

      if (initialData) {
        // update DTO only allows status and finalGrade typically, but here we can send it all
        await updateCourseEnrollment(initialData.id, payload);
        toast.success('Course Enrollment updated successfully');
      } else {
        await createCourseEnrollment(payload);
        toast.success('Course Enrollment created successfully');
      }
      navigate(`/assignment/offerings/${offeringId}/enrollments`);
    } catch (error: any) {
      setGlobalError(error.response?.data?.message || 'An error occurred while saving the enrollment.');
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
        name="studentId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            options={students}
            getOptionLabel={(option) => `${option.user?.firstName} ${option.user?.lastName} (${option.user?.email})`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={students.find(s => s.id === field.value) || null}
            onChange={(_, newValue) => field.onChange(newValue ? newValue.id : '')}
            disabled={!!initialData}
            renderInput={(params) => (
              <TextField {...params} label="Student" margin="normal" required fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        )}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="status-label">Status</InputLabel>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              labelId="status-label"
              id="status"
              label="Status"
            >
              <MenuItem value="ENROLLED">Enrolled</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="DROPPED">Dropped</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
            </Select>
          )}
        />
      </FormControl>

      {initialData && (
        <Controller
          name="finalGrade"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              margin="normal"
              fullWidth
              type="number"
              id="finalGrade"
              label="Final Grade (0-100)"
              error={!!error}
              helperText={error?.message}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
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
          onClick={() => navigate(`/assignment/offerings/${offeringId}/enrollments`)}
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

export default CourseEnrollmentForm;
