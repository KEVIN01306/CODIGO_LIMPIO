import React, { useEffect, useState } from 'react';
import { Box, Chip } from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import ListTable from '../../../../../shared/components/tables/ListTable';
import { getCourseEnrollments } from '../../infrastructure/courseEnrollment.service';
import type { CourseEnrollment } from '../../domain/courseEnrollment.interfaces';
import { toast } from 'react-toastify';
import PageHeader from '../../../../../shared/components/common/PageHeader';
import GoogleSearchBar from '../../../../../shared/components/common/GoogleSearchBar';

const CourseEnrollmentList = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // offeringId
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
      const response = await getCourseEnrollments({ offeringId: id, page, perPage, q });
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

  const getStatusChipStyle = (status: string) => {
    switch (status) {
      case 'ENROLLED':
        return { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '0.5px solid rgba(59, 130, 246, 0.3)' };
      case 'COMPLETED':
        return { backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', border: '0.5px solid rgba(74, 222, 128, 0.3)' };
      case 'DROPPED':
        return { backgroundColor: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', border: '0.5px solid rgba(234, 88, 12, 0.3)' };
      case 'FAILED':
        return { backgroundColor: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: '0.5px solid rgba(248, 113, 113, 0.3)' };
      default:
        return { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#858687', border: '0.5px solid rgba(255, 255, 255, 0.1)' };
    }
  };

  const columns = [
    {
      id: 'student',
      name: 'Student',
      format: (_: any, row: CourseEnrollment) =>
        row.student?.user ? `${row.student.user.firstName} ${row.student.user.lastName}` : 'N/A',
    },
    {
      id: 'course',
      name: 'Course Offering',
      format: (_: any, row: CourseEnrollment) =>
        row.offering?.course ? `${row.offering.course.name} - Sec: ${row.offering.section}` : 'N/A',
    },
    {
      id: 'status',
      name: 'Status',
      format: (_: any, row: CourseEnrollment) => {
        const style = getStatusChipStyle(row.status);
        return (
          <Chip
            label={row.status}
            size="small"
            sx={{
              borderRadius: '5.26px',
              fontWeight: 500,
              fontSize: '11px',
              ...style,
            }}
          />
        );
      },
    },
    {
      id: 'finalGrade',
      name: 'Final Grade',
      format: (_: any, row: CourseEnrollment) =>
        row.finalGrade != null ? <strong>{row.finalGrade}</strong> : '-',
    },
  ];

  const actions = [
    {
      name: 'Detail',
      icon: <Visibility fontSize="small" />,
      onClick: (row: CourseEnrollment) =>
        navigate(`/assignment/offerings/${id}/enrollments/${row.id}`),
    },
    {
      name: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row: CourseEnrollment) =>
        navigate(`/assignment/offerings/${id}/enrollments/${row.id}/edit`),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <PageHeader
        title="Course Enrollments"
        subtitle="Manage enrolled students, academic standing, and final grades."
        actionLabel="Enroll Student"
        actionIcon={<Add />}
        onAction={() => navigate(`/assignment/offerings/${id}/enrollments/create`)}
      />

      <GoogleSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSubmit={handleSearch}
        loading={loading}
        placeholder="Search enrolled students..."
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

export default CourseEnrollmentList;
