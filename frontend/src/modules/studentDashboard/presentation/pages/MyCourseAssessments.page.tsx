import { useEffect, useState } from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, CircularProgress, Chip } from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PlayArrow, NavigateNext, Assignment } from '@mui/icons-material';
import ListTable from '../../../../shared/components/tables/ListTable';
import { getAssessments } from '../../../evaluation/assessment/infrastructure/assessment.service';
import type { Assessment as AssessmentType } from '../../../evaluation/assessment/domain/assessment.interfaces';
import { toast } from 'react-toastify';
import { startSubmission } from '../../../sandbox/infrastructure/submission.service';

const MyCourseAssessments = () => {
  const { offeringId } = useParams<{ offeringId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<AssessmentType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    if (offeringId) {
      fetchData();
    }
  }, [offeringId, page, perPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAssessments({ offeringId, page, perPage });
      setData(response.data);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
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

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" sx={{ color: 'text.secondary' }} />}
        sx={{ mb: 2.5, fontSize: '0.875rem' }}
      >
        <MuiLink
          component={Link}
          to="/my-courses"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: '#60a5fa', textDecoration: 'underline' },
          }}
        >
          My Courses
        </MuiLink>
        <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.875rem' }}>
          Assessments
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 400, letterSpacing: '-0.02em' }}>
          Course Assessments
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Review scheduled evaluation activities, open the coding sandbox, and submit your practical solutions.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress sx={{ color: '#3b82f6' }} />
        </Box>
      ) : (
        <ListTable
          data={data}
          columns={columns}
          actions={[
            {
              name: 'Open Editor',
              icon: <PlayArrow fontSize="small" />,
              color: '#3b82f6',
              onClick: async (row) => {
                try {
                  const submission = await startSubmission(row.id);
                  navigate(`/sandbox/${submission.id}`);
                } catch (error) {
                  toast.error('Failed to start submission. It may be already completed.');
                }
              },
            },
          ]}
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
      )}
    </Box>
  );
};

export default MyCourseAssessments;
