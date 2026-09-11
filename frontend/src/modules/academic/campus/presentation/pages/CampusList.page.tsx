import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Chip } from '@mui/material';
import { Add, Search, Edit, Visibility } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ListTable from '../../../../../shared/components/tables/ListTable';
import { getCampuses } from '../../../campus/infrastructure/campus.service';
import type { Campus } from '../../../campus/domain/campus.interfaces';
import { toast } from 'react-toastify';

const CampusList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  const q = searchParams.get('q') || '';

  const [data, setData] = useState<Campus[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    fetchData();
  }, [page, perPage, q]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getCampuses({ page, perPage, q });
      setData(response.data);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error('Failed to fetch campuses');
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
    { id: 'code', name: 'Code' },
    { id: 'name', name: 'Name' },
    { id: 'address', name: 'Address' },
    {
      id: 'isActive',
      name: 'Status',
      format: (value: boolean) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
  ];

  const actions = [
    {
      name: 'Detail',
      icon: <Visibility fontSize="small" />,
      onClick: (row: Campus) => navigate(`/academic/campuses/${row.id}`),
    },
    {
      name: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row: Campus) => navigate(`/academic/campuses/${row.id}/edit`),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Campuses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your institution's campuses and study centers.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/academic/campuses/create')}
        >
          Create Campus
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search by code or name..."
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

export default CampusList;
