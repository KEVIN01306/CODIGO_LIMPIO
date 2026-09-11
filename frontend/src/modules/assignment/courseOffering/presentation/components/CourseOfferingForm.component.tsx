import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, CircularProgress, Autocomplete } from '@mui/material';
import { courseOfferingSchema } from '../../domain/courseOffering.schema';
import type { CourseOfferingFormValues, CourseOffering, TeacherProfile } from '../../domain/courseOffering.interfaces';
import { createCourseOffering, updateCourseOffering } from '../../infrastructure/courseOffering.service';
import { getCampuses } from '../../../../academic/campus/infrastructure/campus.service';
import { getCourses } from '../../../../academic/course/infrastructure/course.service';
import { getAcademicCycles } from '../../../../academic/cycle/infrastructure/academicCycle.service';
import api from '../../../../../core/api/axios.config';
import type { Campus } from '../../../../academic/campus/domain/campus.interfaces';
import type { Course } from '../../../../academic/course/domain/course.interfaces';
import type { AcademicCycle } from '../../../../academic/cycle/domain/academicCycle.interfaces';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CourseOfferingFormProps {
  initialData?: CourseOffering;
}

const CourseOfferingForm: React.FC<CourseOfferingFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [cycles, setCycles] = useState<AcademicCycle[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const [campusesRes, coursesRes, cyclesRes, teachersRes] = await Promise.all([
          getCampuses({ page: 1, perPage: 100 }),
          getCourses({ page: 1, perPage: 500 }),
          getAcademicCycles({ page: 1, perPage: 100 }),
          api.get('/profiles/teachers')
        ]);
        setCampuses(campusesRes.data);
        setCourses(coursesRes.data);
        setCycles(cyclesRes.data);
        setTeachers(teachersRes.data.data);
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
  } = useForm<CourseOfferingFormValues>({
    resolver: zodResolver(courseOfferingSchema),
    defaultValues: {
      campusId: initialData?.campusId || '',
      courseId: initialData?.courseId || '',
      cycleId: initialData?.cycleId || '',
      teacherId: initialData?.teacherId || '',
      section: initialData?.section || '',
    },
  });

  const onSubmit = async (values: CourseOfferingFormValues) => {
    setGlobalError(null);
    try {
      const payload = {
          ...values,
          teacherId: values.teacherId ? values.teacherId : undefined
      };
      
      if (initialData) {
        await updateCourseOffering(initialData.id, payload);
        toast.success('Course Offering updated successfully');
      } else {
        await createCourseOffering(payload);
        toast.success('Course Offering created successfully');
      }
      navigate('/assignment/offerings');
    } catch (error: any) {
      setGlobalError(error.response?.data?.message || 'An error occurred while saving the course offering.');
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
              <TextField {...params} label="Campus" margin="normal" required fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        )}
      />

      <Controller
        name="courseId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            options={courses}
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={courses.find(c => c.id === field.value) || null}
            onChange={(_, newValue) => field.onChange(newValue ? newValue.id : '')}
            renderInput={(params) => (
              <TextField {...params} label="Course" margin="normal" required fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        )}
      />

      <Controller
        name="cycleId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            options={cycles}
            getOptionLabel={(option) => `${option.name} (${option.year})`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={cycles.find(c => c.id === field.value) || null}
            onChange={(_, newValue) => field.onChange(newValue ? newValue.id : '')}
            renderInput={(params) => (
              <TextField {...params} label="Cycle" margin="normal" required fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        )}
      />

      <Controller
        name="teacherId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            options={teachers}
            getOptionLabel={(option) => `${option.user?.firstName} ${option.user?.lastName} (${option.user?.email})`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={teachers.find(c => c.id === field.value) || null}
            onChange={(_, newValue) => field.onChange(newValue ? newValue.id : '')}
            renderInput={(params) => (
              <TextField {...params} label="Teacher (Optional)" margin="normal" fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        )}
      />

      <Controller
        name="section"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="section"
            label="Section (e.g. A, B, C)"
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
          onClick={() => navigate('/assignment/offerings')}
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

export default CourseOfferingForm;
