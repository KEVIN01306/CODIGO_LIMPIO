import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ListTable from '../../../../../shared/components/tables/ListTable';
import { getAcademicCycles } from '../../../cycle/infrastructure/academicCycle.service';
import type { AcademicCycle } from '../../../cycle/domain/academicCycle.interfaces';
import { toast } from 'react-toastify';
import PageHeader from '../../../../../shared/components/common/PageHeader';
import GoogleSearchBar from '../../../../../shared/components/common/GoogleSearchBar';

const AcademicCycleList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  const q = searchParams.get('q') || '';

  const [data, setData] = useState<AcademicCycle[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    fetchData();
  }, [page, perPage, q]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAcademicCycles({ page, perPage, q });
      setData(response.data);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error('Failed to fetch academic cycles');
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
    { id: 'name', name: 'Name' },
    {
      id: 'campus',
      name: 'Campus',
      format: (_: any, row: AcademicCycle) => row.campus?.name || 'N/A',
    },
    { id: 'year', name: 'Year' },
    { id: 'order', name: 'Order' },
    {
      id: 'startDate',
      name: 'Start Date',
      format: (value: string) =>
        new Date(value).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      id: 'endDate',
      name: 'End Date',
      format: (value: string) =>
        new Date(value).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
  ];

  const actions = [
    {
      name: 'Detail',
      icon: <Visibility fontSize="small" />,
      onClick: (row: AcademicCycle) => navigate(`/academic/cycles/${row.id}`),
    },
    {
      name: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row: AcademicCycle) => navigate(`/academic/cycles/${row.id}/edit`),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <PageHeader
        title="Academic Cycles"
        subtitle="Manage academic periods, semesters, and operational dates."
        actionLabel="Create Cycle"
        actionIcon={<Add />}
        onAction={() => navigate('/academic/cycles/create')}
      />

      <GoogleSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSubmit={handleSearch}
        loading={loading}
        placeholder="Search cycles by name..."
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

export default AcademicCycleList;
