import React, { useEffect, useState } from 'react';
import { Box, Chip } from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ListTable from '../../../../../shared/components/tables/ListTable';
import { getCourses } from '../../../course/infrastructure/course.service';
import type { Course } from '../../../course/domain/course.interfaces';
import { toast } from 'react-toastify';
import PageHeader from '../../../../../shared/components/common/PageHeader';
import GoogleSearchBar from '../../../../../shared/components/common/GoogleSearchBar';

const CourseList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  const q = searchParams.get('q') || '';

  const [data, setData] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    fetchData();
  }, [page, perPage, q]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getCourses({ page, perPage, q });
      setData(response.data);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error('Failed to fetch courses');
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
      id: 'code',
      name: 'Code',
      format: (value: string) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 500, color: '#60a5fa' }}>
          {value}
        </span>
      ),
    },
    { id: 'name', name: 'Name' },
    {
      id: 'program',
      name: 'Program',
      format: (_, row: Course) => row.program?.name || 'N/A',
    },
    { id: 'credits', name: 'Credits' },
    {
      id: 'isActive',
      name: 'Status',
      format: (value: boolean) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          size="small"
          sx={{
            borderRadius: '5.26px',
            fontWeight: 500,
            fontSize: '11px',
            backgroundColor: value ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            color: value ? '#4ade80' : '#858687',
            border: `0.5px solid ${value ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
          }}
        />
      ),
    },
  ];

  const actions = [
    {
      name: 'Detail',
      icon: <Visibility fontSize="small" />,
      onClick: (row: Course) => navigate(`/academic/courses/${row.id}`),
    },
    {
      name: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row: Course) => navigate(`/academic/courses/${row.id}/edit`),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <PageHeader
        title="Courses"
        subtitle="Manage academic courses, syllabus definitions, and credit structures."
        actionLabel="Create Course"
        actionIcon={<Add />}
        onAction={() => navigate('/academic/courses/create')}
      />

      <GoogleSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSubmit={handleSearch}
        loading={loading}
        placeholder="Search courses by code or name..."
      />

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

export default CourseList;
