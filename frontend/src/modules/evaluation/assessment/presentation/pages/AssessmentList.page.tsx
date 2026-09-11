import { useEffect, useState } from 'react';
import { Box, Typography, Button, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ListTable from '../../../../../shared/components/tables/ListTable';
import { getAssessments, deleteAssessment } from '../../infrastructure/assessment.service';
import type { Assessment } from '../../domain/assessment.interfaces';
import { toast } from 'react-toastify';

const AssessmentList = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Course Offering ID

  const [data, setData] = useState<Assessment[]>([]);
  const [total, setTotal] = useState(0);
  const [_loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, page, perPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAssessments({ offeringId: id, page, perPage });
      setData(response.data);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error('Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assessmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await deleteAssessment(assessmentId);
        toast.success('Assessment deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete assessment');
      }
    }
  };

  const columns = [
    { id: 'title', name: 'Title' },
    { id: 'type', name: 'Type' },
    { id: 'maxScore', name: 'Max Score' },
    { id: 'weight', name: 'Weight (%)', format: (v: any) => v ?? 'N/A' },
    {
      id: 'dueDate',
      name: 'Due Date',
      format: (v: any) => v ? new Date(v).toLocaleString() : 'N/A'
    }
  ];

  const actions = [
    {
      name: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row: Assessment) => navigate(`/assignment/offerings/${id}/assessments/${row.id}/edit`),
    },
    {
      name: 'Delete',
      icon: <Delete fontSize="small" color="error" />,
      onClick: (row: Assessment) => handleDelete(row.id),
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} color="inherit" to="/assignment/offerings">Course Offerings</MuiLink>
        <Typography color="text.primary">Assessments</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Assessments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage evaluations for this course offering.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate(`/assignment/offerings/${id}/assessments/create`)}
        >
          Add Assessment
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
          onPageChange: (newPage) => setPage(newPage + 1),
          onRowsPerPageChange: (newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
          },
        }}
      />
    </Box>
  );
};

export default AssessmentList;
