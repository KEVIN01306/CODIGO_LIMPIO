import { useEffect, useState } from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, CircularProgress } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import ListTable from '../../../../shared/components/tables/ListTable';
import { getAssessments } from '../../../evaluation/assessment/infrastructure/assessment.service';
import type { Assessment } from '../../../evaluation/assessment/domain/assessment.interfaces';
import { toast } from 'react-toastify';
import { PlayArrow } from '@mui/icons-material';
import { startSubmission } from '../../../sandbox/infrastructure/submission.service';
import { useNavigate } from 'react-router-dom';

const MyCourseAssessments = () => {
  const { offeringId } = useParams<{ offeringId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<Assessment[]>([]);
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

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} color="inherit" to="/my-courses">My Courses</MuiLink>
        <Typography color="text.primary">Assessments</Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
        Course Assessments
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Here are the evaluation activities for this course.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
      ) : (
        <ListTable
          data={data}
          columns={columns}
          actions={[
            {
              name: 'Open Editor',
              icon: <PlayArrow fontSize="small" />,
              color: 'primary.main',
              onClick: async (row) => {
                try {
                  const submission = await startSubmission(row.id);
                  navigate(`/sandbox/${submission.id}`);
                } catch (error) {
                  toast.error('Failed to start submission. It may be already completed.');
                }
              }
            }
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
