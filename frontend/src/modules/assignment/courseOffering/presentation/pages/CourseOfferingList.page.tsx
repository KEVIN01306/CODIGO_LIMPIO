import React, { useEffect, useState } from 'react';
import { Box, Chip } from '@mui/material';
import { Add, Edit, Visibility, GroupOutlined, AssignmentOutlined } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ListTable from '../../../../../shared/components/tables/ListTable';
import { getCourseOfferings } from '../../infrastructure/courseOffering.service';
import type { CourseOffering } from '../../domain/courseOffering.interfaces';
import { toast } from 'react-toastify';
import PageHeader from '../../../../../shared/components/common/PageHeader';
import GoogleSearchBar from '../../../../../shared/components/common/GoogleSearchBar';

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
      format: (_: any, row: CourseOffering) => row.course?.name || 'N/A',
    },
    {
      id: 'campus',
      name: 'Campus',
      format: (_: any, row: CourseOffering) => row.campus?.name || 'N/A',
    },
    {
      id: 'cycle',
      name: 'Cycle',
      format: (_: any, row: CourseOffering) =>
        row.cycle ? `${row.cycle.name} (${row.cycle.year})` : 'N/A',
    },
    {
      id: 'section',
      name: 'Section',
      format: (v: string) => (
        <Chip
          label={v}
          size="small"
          sx={{
            borderRadius: '5.26px',
            fontWeight: 500,
            fontSize: '11px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#cececf',
            border: '0.5px solid rgba(255, 255, 255, 0.1)',
          }}
        />
      ),
    },
    {
      id: 'teacher',
      name: 'Teacher',
      format: (_: any, row: CourseOffering) =>
        row.teacher?.user ? `${row.teacher.user.firstName} ${row.teacher.user.lastName}` : 'Unassigned',
    },
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
      color: '#3b82f6',
      onClick: (row: CourseOffering) => navigate(`/assignment/offerings/${row.id}/assessments`),
    },
    {
      name: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row: CourseOffering) => navigate(`/assignment/offerings/${row.id}/edit`),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <PageHeader
        title="Course Offerings"
        subtitle="Manage active course sections, assigned instructors, and schedules."
        actionLabel="Create Offering"
        actionIcon={<Add />}
        onAction={() => navigate('/assignment/offerings/create')}
      />

      <GoogleSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSubmit={handleSearch}
        loading={loading}
        placeholder="Search course offerings..."
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

export default CourseOfferingList;
