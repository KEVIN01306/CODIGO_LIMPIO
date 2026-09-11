import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Chip } from '@mui/material';
import { Add, Search, Edit, Visibility } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ListTable from '../../../../../shared/components/tables/ListTable';
import { getCourseEnrollments } from '../../infrastructure/courseEnrollment.service';
import type { CourseEnrollment } from '../../domain/courseEnrollment.interfaces';
import { toast } from 'react-toastify';

const CourseEnrollmentList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  const q = searchParams.get('q') || '';

  const [data, setData] = useState<CourseEnrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    fetchData();
  }, [page, perPage, q]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getCourseEnrollments({ page, perPage, q });
      setData(response.data);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error('Failed to fetch enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ page: '1', perPage: perPage.toString(), q: searchInput });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: (newPage + 1).toString(), perPage: perPage.toString(), q });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setSearchParams({ page: '1', perPage: newPerPage.toString(), q });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ENROLLED': return 'primary';
      case 'COMPLETED': return 'success';
      case 'DROPPED': return 'warning';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      id: 'student',
      name: 'Student',
      format: (_: any, row: CourseEnrollment) => row.student?.user ? `${row.student.user.firstName} ${row.student.user.lastName}` : 'N/A'
    },
    {
      id: 'course',
      name: 'Course Offering',
      format: (_: any, row: CourseEnrollment) => row.offering?.course ? `${row.offering.course.name} - Sec: ${row.offering.section}` : 'N/A'
    },
    {
      id: 'status',
      name: 'Status',
      format: (_: any, row: CourseEnrollment) => (
        <Chip label={row.status} color={getStatusColor(row.status) as any} size="small" />
      )
    },
    {
      id: 'finalGrade',
      name: 'Final Grade',
      format: (_: any, row: CourseEnrollment) => row.finalGrade ?? '-'
    }
  ];

  const actions = [
    {
      name: 'Detail',
      icon: <Visibility fontSize="small" />,
      onClick: (row: CourseEnrollment) => navigate(`/assignment/enrollments/${row.id}`),
    },
    {
      name: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row: CourseEnrollment) => navigate(`/assignment/enrollments/${row.id}/edit`),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Course Enrollments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage student enrollments and grades.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/assignment/enrollments/create')}
        >
          Enroll Student
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }
          }}
          sx={{ width: 300, backgroundColor: 'background.paper' }}
        />
        <Button type="submit" variant="outlined" disabled={loading}>
          Search
        </Button>
      </Box>

      <ListTable
        data={data}
        columns={columns}
        actions={actions}
        pagination={{
          total,
          limit: perPage,
          offset: (page - 1) * perPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handlePerPageChange,
        }}
      />
    </Box>
  );
};

export default CourseEnrollmentList;
