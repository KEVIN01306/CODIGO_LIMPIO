import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { Add, Search, Edit, Visibility, GroupOutlined, AssignmentOutlined } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ListTable from '../../../../../shared/components/tables/ListTable';
import { getCourseOfferings } from '../../infrastructure/courseOffering.service';
import type { CourseOffering } from '../../domain/courseOffering.interfaces';
import { toast } from 'react-toastify';

const CourseOfferingList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  const q = searchParams.get('q') || '';

  const [data, setData] = useState<CourseOffering[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    fetchData();
  }, [page, perPage, q]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getCourseOfferings({ page, perPage, q });
      setData(response.data);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error('Failed to fetch course offerings');
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

  const columns = [
    {
      id: 'course',
      name: 'Course',
      format: (_: any, row: CourseOffering) => row.course?.name || 'N/A'
    },
    {
      id: 'campus',
      name: 'Campus',
      format: (_: any, row: CourseOffering) => row.campus?.name || 'N/A'
    },
    {
      id: 'cycle',
      name: 'Cycle',
      format: (_: any, row: CourseOffering) => row.cycle ? `${row.cycle.name} (${row.cycle.year})` : 'N/A'
    },
    {
      id: 'section',
      name: 'Section'
    },
    {
      id: 'teacher',
      name: 'Teacher',
      format: (_: any, row: CourseOffering) => row.teacher?.user ? `${row.teacher.user.firstName} ${row.teacher.user.lastName}` : 'Unassigned'
    }
  ];
  const actions = [
    {
      name: 'Detail',
      icon: <Visibility fontSize="small" />,
      onClick: (row: CourseOffering) => navigate(`/assignment/offerings/${row.id}`),
    },
    {
      name: 'Manage Enrollments',
      icon: <GroupOutlined fontSize="small" />,
      onClick: (row: CourseOffering) => navigate(`/assignment/offerings/${row.id}/enrollments`),
    },
    {
      name: 'Manage Assessments',
      icon: <AssignmentOutlined fontSize="small" />,
      onClick: (row: CourseOffering) => navigate(`/assignment/offerings/${row.id}/assessments`),
    },
    {
      name: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row: CourseOffering) => navigate(`/assignment/offerings/${row.id}/edit`),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Course Offerings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage course offerings for cycles and campuses.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/assignment/offerings/create')}
        >
          Create Offering
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

export default CourseOfferingList;
