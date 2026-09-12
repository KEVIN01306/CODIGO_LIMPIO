import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ListTable from '../../../../../shared/components/tables/ListTable';
import { getTeachers } from '../../infrastructure/teacher.service';
import type { TeacherProfile } from '../../domain/teacher.interfaces';
import { toast } from 'react-toastify';
import PageHeader from '../../../../../shared/components/common/PageHeader';
import GoogleSearchBar from '../../../../../shared/components/common/GoogleSearchBar';

const TeacherList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  const q = searchParams.get('q') || '';

  const [data, setData] = useState<TeacherProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    fetchData();
  }, [page, perPage, q]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getTeachers({ page, perPage, q });
      setData(response.data);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error('Failed to fetch teachers');
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
      id: 'name',
      name: 'Name',
      format: (_: any, row: TeacherProfile) =>
        row.user ? `${row.user.firstName} ${row.user.lastName}` : 'N/A',
    },
    {
      id: 'email',
      name: 'Email',
      format: (_: any, row: TeacherProfile) => row.user?.email || 'N/A',
    },
    {
      id: 'campus',
      name: 'Campus',
      format: (_: any, row: TeacherProfile) => row.campus?.name || 'N/A',
    },
    {
      id: 'employeeCode',
      name: 'Employee Code',
      format: (_: any, row: TeacherProfile) => row.employeeCode || '-',
    },
  ];

  const actions = [
    {
      name: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row: TeacherProfile) => navigate(`/users/teachers/${row.id}/edit`),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <PageHeader
        title="Teachers"
        subtitle="Manage instructor profiles, course assignment rights, and employee details."
        actionLabel="Add Teacher"
        actionIcon={<Add />}
        onAction={() => navigate('/users/teachers/create')}
      />

      <GoogleSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSubmit={handleSearch}
        loading={loading}
        placeholder="Search teachers by name or email..."
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

export default TeacherList;
