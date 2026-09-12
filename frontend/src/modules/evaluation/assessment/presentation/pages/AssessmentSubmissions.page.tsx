import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  WarningAmber as WarningAmberIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Grade as GradeIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getAssessmentSubmissions,
  type AssessmentSubmissionsResponse,
  type AssessmentStudentItem
} from '../../../../sandbox/infrastructure/submission.service';
import { SubmissionDetailModal } from '../components/SubmissionDetailModal.component';
import { SubmissionGradeModal } from '../components/SubmissionGradeModal.component';
import { downloadSubmissionZip } from '../../infrastructure/submission-zip.util';

const AssessmentSubmissionsPage = () => {
  const { id: offeringId, assessmentId } = useParams<{ id: string; assessmentId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AssessmentSubmissionsResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<AssessmentStudentItem | null>(null);
  const [selectedStudentForGrade, setSelectedStudentForGrade] = useState<AssessmentStudentItem | null>(null);
  const [downloadingZipId, setDownloadingZipId] = useState<string | null>(null);

  useEffect(() => {
    if (assessmentId) {
      fetchSubmissions();
    }
  }, [assessmentId]);

  const fetchSubmissions = async () => {
    if (!assessmentId) return;
    setLoading(true);
    try {
      const response = await getAssessmentSubmissions(assessmentId);
      setData(response);
    } catch (err: any) {
      toast.error('Failed to load assessment submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = async (student: AssessmentStudentItem) => {
    if (!student.submission?.codeSnapshot) {
      toast.warn('This submission does not contain code files to download.');
      return;
    }
    setDownloadingZipId(student.studentId);
    try {
      await downloadSubmissionZip(
        student.fullName,
        student.studentNumber,
        data?.assessment.title || 'assessment',
        student.submission.codeSnapshot
      );
      toast.success(`ZIP downloaded for ${student.fullName}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to download ZIP');
    } finally {
      setDownloadingZipId(null);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!data) return [];
    return data.students.filter((item) => {
      const matchesSearch =
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'SUBMITTED') {
        return item.hasSubmitted;
      }
      if (statusFilter === 'IN_PROGRESS') {
        return item.submission?.status === 'IN_PROGRESS';
      }
      if (statusFilter === 'NOT_STARTED') {
        return !item.submission;
      }
      if (statusFilter === 'GRADED') {
        return item.submission && item.submission.totalScore !== null && item.submission.totalScore !== undefined;
      }
      if (statusFilter === 'VIOLATIONS') {
        return (item.submission?.tabSwitchesCount ?? 0) > 0 || (item.submission?.clipboardAttempts ?? 0) > 0;
      }

      return true;
    });
  }, [data, searchTerm, statusFilter]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading student submissions...
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Requested assessment information could not be found.</Alert>
        <Button startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    );
  }

  const { assessment, stats } = data;

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} color="inherit" to="/assignment/offerings">
          Course Offerings
        </MuiLink>
        <MuiLink component={Link} color="inherit" to={`/assignment/offerings/${offeringId}/assessments`}>
          Assessments
        </MuiLink>
        <Typography color="text.primary">Submissions & Grades</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/assignment/offerings/${offeringId}/assessments`)}
            size="small"
            sx={{ mb: 1 }}
          >
            Back to Assessments
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {assessment.title} — Student Submissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Course: <strong>{assessment.course.name} ({assessment.course.code})</strong> | Section: <strong>{assessment.offering.section}</strong> | Cycle: <strong>{assessment.offering.cycle || 'N/A'}</strong>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap' }}>
            <Chip label={`Max Score: ${assessment.maxScore} pts`} color="primary" size="small" />
            {assessment.dueDate && (
              <Chip
                icon={<ScheduleIcon />}
                label={`Due: ${new Date(assessment.dueDate).toLocaleString()}`}
                size="small"
                variant="outlined"
              />
            )}
            {assessment.allowedLanguage && (
              <Chip label={`Language: ${assessment.allowedLanguage}`} size="small" variant="outlined" />
            )}
            {assessment.strictMode && (
              <Chip label="Strict Mode Active" size="small" color="secondary" variant="outlined" />
            )}
          </Box>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 3 }}>
        <Card variant="outlined">
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
              <PersonIcon fontSize="small" color="action" /> Total Enrolled
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5 }}>
              {stats.totalEnrolled}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ bgcolor: stats.submittedCount > 0 ? '#f0fdf4' : 'inherit' }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Typography variant="caption" color="success.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
              <AssignmentTurnedInIcon fontSize="small" color="success" /> Submitted
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5, color: 'success.main' }}>
              {stats.submittedCount}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ bgcolor: stats.gradedCount > 0 ? '#eff6ff' : 'inherit' }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Typography variant="caption" color="primary.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
              <GradeIcon fontSize="small" color="primary" /> Graded
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5, color: 'primary.main' }}>
              {stats.gradedCount}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Typography variant="caption" color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
              <SchoolIcon fontSize="small" color="warning" /> In Progress
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5, color: 'warning.main' }}>
              {stats.inProgressCount}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ bgcolor: stats.integrityViolationsCount > 0 ? '#fef2f2' : 'inherit' }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Typography variant="caption" color="error.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
              <WarningAmberIcon fontSize="small" color="error" /> Integrity Alerts
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5, color: stats.integrityViolationsCount > 0 ? 'error.main' : 'text.primary' }}>
              {stats.integrityViolationsCount}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters and Search Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search student by name, student ID, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Submission Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Submission Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All students ({data.students.length})</MenuItem>
            <MenuItem value="SUBMITTED">Submitted ({stats.submittedCount})</MenuItem>
            <MenuItem value="GRADED">Graded ({stats.gradedCount})</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress ({stats.inProgressCount})</MenuItem>
            <MenuItem value="NOT_STARTED">Not Started ({stats.notStartedCount})</MenuItem>
            <MenuItem value="VIOLATIONS">With Integrity Infractions ({stats.integrityViolationsCount})</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Submissions Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Submission Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Integrity Infractions</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Score / Grade</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Files</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No students found matching the selected filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => {
                const sub = student.submission;
                const tabSwitches = sub?.tabSwitchesCount ?? 0;
                const clipboards = sub?.clipboardAttempts ?? 0;
                const totalInfractions = tabSwitches + clipboards;
                const hasScore = sub && sub.totalScore !== null && sub.totalScore !== undefined;

                return (
                  <TableRow key={student.studentId} hover>
                    {/* Student Info */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {student.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Student ID: <strong>{student.studentNumber}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {student.email}
                      </Typography>
                    </TableCell>

                    {/* Submission Status */}
                    <TableCell>
                      {!sub ? (
                        <Chip label="Not Started" size="small" variant="outlined" />
                      ) : sub.status === 'SUBMITTED' || sub.status === 'EVALUATED' ? (
                        <Box>
                          <Chip
                            label={sub.status === 'EVALUATED' ? 'Graded' : 'Submitted'}
                            color={sub.status === 'EVALUATED' ? 'info' : 'success'}
                            size="small"
                            sx={{ fontWeight: 'bold', mb: 0.5 }}
                          />
                          {sub.submittedAt && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {new Date(sub.submittedAt).toLocaleString()}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Chip label="In Progress" color="warning" size="small" variant="outlined" />
                      )}
                    </TableCell>

                    {/* Integrity Infractions */}
                    <TableCell>
                      {!sub ? (
                        <Typography variant="caption" color="text.secondary">
                          -
                        </Typography>
                      ) : totalInfractions > 0 ? (
                        <Tooltip
                          title={
                            <div>
                              <div>Tab switches: {tabSwitches}</div>
                              <div>Clipboard attempts: {clipboards}</div>
                            </div>
                          }
                          arrow
                        >
                          <Chip
                            icon={<WarningAmberIcon />}
                            label={`${totalInfractions} infraction(s)`}
                            color="error"
                            size="small"
                            sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                          />
                        </Tooltip>
                      ) : (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="0 infractions"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>

                    {/* Score / Grade */}
                    <TableCell>
                      {!sub ? (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: hasScore ? 'bold' : 'normal',
                              color: hasScore ? 'primary.main' : 'text.secondary'
                            }}
                          >
                            {hasScore ? `${sub.totalScore} / ${assessment.maxScore}` : 'Ungraded'}
                          </Typography>
                          {student.hasSubmitted && (
                            <Tooltip title="Edit Grade">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => setSelectedStudentForGrade(student)}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      )}
                    </TableCell>

                    {/* Files */}
                    <TableCell>
                      {sub && sub.filesCount > 0 ? (
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {sub.filesCount} file(s)
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          0 files
                        </Typography>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {/* View Detail & Code without opening Sandbox */}
                        <Tooltip title="View Details & Code (without opening sandbox)">
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              disabled={!sub}
                              onClick={() => setSelectedStudentForDetail(student)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        {/* Download ZIP */}
                        <Tooltip title="Download code as ZIP">
                          <span>
                            <IconButton
                              size="small"
                              color="secondary"
                              disabled={!sub || sub.filesCount === 0 || downloadingZipId === student.studentId}
                              onClick={() => handleDownloadZip(student)}
                            >
                              {downloadingZipId === student.studentId ? (
                                <CircularProgress size={16} />
                              ) : (
                                <DownloadIcon fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>

                        {/* Grade / Edit Score */}
                        <Tooltip title="Grade / Edit Score">
                          <span>
                            <IconButton
                              size="small"
                              color="default"
                              disabled={!sub}
                              onClick={() => setSelectedStudentForGrade(student)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail & Code Explorer Modal */}
      <SubmissionDetailModal
        open={!!selectedStudentForDetail}
        onClose={() => setSelectedStudentForDetail(null)}
        student={selectedStudentForDetail}
        assessmentTitle={assessment.title}
        maxScore={assessment.maxScore}
        onOpenGradeModal={(st) => {
          setSelectedStudentForDetail(null);
          setSelectedStudentForGrade(st);
        }}
      />

      {/* Grade Edit Modal */}
      <SubmissionGradeModal
        open={!!selectedStudentForGrade}
        onClose={() => setSelectedStudentForGrade(null)}
        student={selectedStudentForGrade}
        maxScore={assessment.maxScore}
        onSuccess={fetchSubmissions}
      />
    </Box>
  );
};

export default AssessmentSubmissionsPage;
