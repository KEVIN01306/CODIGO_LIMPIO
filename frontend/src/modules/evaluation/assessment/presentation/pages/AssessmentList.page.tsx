import { useEffect, useState } from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, Chip } from '@mui/material';
import { Add, Edit, Delete, AssignmentTurnedIn, NavigateNext, Assignment } from '@mui/icons-material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ListTable from '../../../../../shared/components/tables/ListTable';
import { getAssessments, deleteAssessment } from '../../infrastructure/assessment.service';
import type { Assessment } from '../../domain/assessment.interfaces';
import { toast } from 'react-toastify';
import PageHeader from '../../../../../shared/components/common/PageHeader';
import ConfirmDialog from '../../../../../shared/components/dialog/ConfirmDialog';

const AssessmentList = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Course Offering ID

  const [data, setData] = useState<Assessment[]>([]);
  const [total, setTotal] = useState(0);
  const [_loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteAssessment(deleteTargetId);
      toast.success('Assessment deleted successfully');
      setDeleteTargetId(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete assessment');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      id: 'title',
      name: 'Title',
      format: (v: string) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Assignment sx={{ color: '#3b82f6', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
            {v}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'type',
      name: 'Type',
      format: (v: string) => (
        <Chip
          label={v}
          size="small"
          sx={{
            borderRadius: '10px',
            fontWeight: 500,
            fontSize: '0.75rem',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: '#60a5fa',
            border: '0.5px solid rgba(59, 130, 246, 0.25)',
          }}
        />
      ),
    },
    {
      id: 'maxScore',
      name: 'Max Score',
      format: (v: number) => <strong>{v} pts</strong>,
    },
    {
      id: 'weight',
      name: 'Weight (%)',
      format: (v: any) => (v != null ? `${v}%` : 'N/A'),
    },
    {
      id: 'dueDate',
      name: 'Due Date',
      format: (v: any) =>
        v
          ? new Date(v).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'No deadline',
    },
  ];

  const actions = [
    {
      name: 'Submissions',
      icon: <AssignmentTurnedIn fontSize="small" />,
      color: '#3b82f6',
      onClick: (row: Assessment) =>
        navigate(`/assignment/offerings/${id}/assessments/${row.id}/submissions`),
    },
    {
      name: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row: Assessment) =>
        navigate(`/assignment/offerings/${id}/assessments/${row.id}/edit`),
    },
    {
      name: 'Delete',
      icon: <Delete fontSize="small" />,
      color: '#f87171',
      onClick: (row: Assessment) => setDeleteTargetId(row.id),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" sx={{ color: 'text.secondary' }} />}
        sx={{ mb: 2.5, fontSize: '0.875rem' }}
      >
        <MuiLink
          component={Link}
          to="/assignment/offerings"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: '#60a5fa', textDecoration: 'underline' },
          }}
        >
          Course Offerings
        </MuiLink>
        <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.875rem' }}>
          Assessments
        </Typography>
      </Breadcrumbs>

      <PageHeader
        title="Assessments"
        subtitle="Manage tests, assignments, practical coding exercises, and grading rubrics."
        actionLabel="Add Assessment"
        actionIcon={<Add />}
        onAction={() => navigate(`/assignment/offerings/${id}/assessments/create`)}
      />

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

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        title="Delete Assessment"
        description="Are you sure you want to delete this assessment? This will also remove student submissions and grades associated with it."
        confirmText="Delete"
        confirmColor="error"
        isLoading={isDeleting}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default AssessmentList;
