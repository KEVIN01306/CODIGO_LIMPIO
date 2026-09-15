import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayArrow, Assignment, Visibility, RateReview } from '@mui/icons-material';
import ListTable from '../../../../shared/components/tables/ListTable';
import { getAssessments } from '../../../evaluation/assessment/infrastructure/assessment.service';
import type { Assessment as AssessmentType } from '../../../evaluation/assessment/domain/assessment.interfaces';
import { toast } from 'react-toastify';
import {
  startSubmission,
  getMySubmissions,
  type MySubmissionItem,
} from '../../../sandbox/infrastructure/submission.service';
import { getCourseOfferingById } from '../../../assignment/courseOffering/infrastructure/courseOffering.service';
import { CourseHeaderTabs } from '../components/CourseHeaderTabs.component';

const MyCourseAssessments = () => {
  const { offeringId } = useParams<{ offeringId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<AssessmentType[]>([]);
  const [courseOffering, setCourseOffering] = useState<any>(null);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, MySubmissionItem>>({});
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
      const [assessmentsRes, mySubs, offeringRes] = await Promise.all([
        getAssessments({ offeringId, page, perPage }),
        getMySubmissions({ offeringId }).catch(() => [] as MySubmissionItem[]),
        offeringId ? getCourseOfferingById(offeringId).catch(() => null) : null,
      ]);

      setData(assessmentsRes.data);
      setTotal(assessmentsRes.meta?.total || 0);
      if (offeringRes) setCourseOffering(offeringRes);

      const subMap: Record<string, MySubmissionItem> = {};
      if (Array.isArray(mySubs)) {
        for (const sub of mySubs) {
          subMap[sub.assessmentId] = sub;
        }
      }
      setSubmissionsMap(subMap);
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
      id: 'submissionStatus',
      name: 'Status',
      format: (_: any, row: AssessmentType) => {
        const sub = submissionsMap[row.id];
        if (!sub) {
          return (
            <Chip
              label="Not Started"
              size="small"
              sx={{
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '0.75rem',
                backgroundColor: 'rgba(157, 158, 159, 0.1)',
                color: 'text.secondary',
                border: '0.5px solid rgba(157, 158, 159, 0.25)',
              }}
            />
          );
        }

        if (sub.status === 'IN_PROGRESS') {
          return (
            <Chip
              label="In Progress"
              size="small"
              sx={{
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '0.75rem',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                color: '#60a5fa',
                border: '0.5px solid rgba(59, 130, 246, 0.3)',
              }}
            />
          );
        }

        if (sub.status === 'SUBMITTED') {
          return (
            <Chip
              label="Submitted - Awaiting Review"
              size="small"
              sx={{
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '0.75rem',
                backgroundColor: 'rgba(234, 179, 8, 0.12)',
                color: '#facc15',
                border: '0.5px solid rgba(234, 179, 8, 0.3)',
              }}
            />
          );
        }

        if (sub.status === 'EVALUATED') {
          return (
            <Chip
              label="Evaluated"
              size="small"
              sx={{
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '0.75rem',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                color: '#4ade80',
                border: '0.5px solid rgba(34, 197, 94, 0.3)',
              }}
            />
          );
        }

        return (
          <Chip
            label={sub.status}
            size="small"
            sx={{
              borderRadius: '8px',
              fontSize: '0.75rem',
            }}
          />
        );
      },
    },
    {
      id: 'score',
      name: 'Score',
      format: (_: any, row: AssessmentType) => {
        const sub = submissionsMap[row.id];
        if (sub && sub.status === 'EVALUATED' && sub.totalScore !== null && sub.totalScore !== undefined) {
          return (
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4ade80' }}>
              {sub.totalScore} / {row.maxScore} pts
            </Typography>
          );
        }
        return <Typography variant="body2" color="text.secondary">-</Typography>;
      },
    },
    {
      id: 'maxScore',
      name: 'Max Score',
      format: (v: number) => <span>{v} pts</span>,
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
      <CourseHeaderTabs
        courseName={courseOffering?.course?.name || (data[0] as any)?.offering?.course?.name || 'Course'}
        courseCode={courseOffering?.course?.code || (data[0] as any)?.offering?.course?.code}
        activeTab="assessments"
        title="Course Assessments"
        subtitle="Review scheduled evaluation activities, complete coding exercises, and examine detailed teacher feedback."
      />

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
              visible: (row: AssessmentType) => {
                const sub = submissionsMap[row.id];
                return !sub || sub.status === 'IN_PROGRESS';
              },
              onClick: async (row: AssessmentType) => {
                try {
                  const submission = await startSubmission(row.id);
                  navigate(`/sandbox/${submission.id}`);
                } catch (error) {
                  toast.error('Failed to start submission. It may be already completed.');
                }
              },
            },
            {
              name: 'Review Feedback',
              icon: <RateReview fontSize="small" />,
              color: '#4ade80',
              visible: (row: AssessmentType) => {
                const sub = submissionsMap[row.id];
                return sub?.status === 'EVALUATED';
              },
              onClick: (row: AssessmentType) => {
                navigate(`/my-courses/${offeringId}/assessments/${row.id}/feedback`);
              },
            },
            {
              name: 'View Submission',
              icon: <Visibility fontSize="small" />,
              color: '#facc15',
              visible: (row: AssessmentType) => {
                const sub = submissionsMap[row.id];
                return sub?.status === 'SUBMITTED' || sub?.status === 'FLAGGED';
              },
              onClick: (row: AssessmentType) => {
                navigate(`/my-courses/${offeringId}/assessments/${row.id}/feedback`);
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
