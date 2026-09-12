import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { toast } from 'react-toastify';
import { gradeSubmission, type AssessmentStudentItem } from '../../../../sandbox/infrastructure/submission.service';

interface Props {
  open: boolean;
  onClose: () => void;
  student: AssessmentStudentItem | null;
  maxScore: number;
  onSuccess: () => void;
}

export const SubmissionGradeModal: React.FC<Props> = ({
  open,
  onClose,
  student,
  maxScore,
  onSuccess
}) => {
  const [score, setScore] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (student?.submission) {
      setScore(student.submission.totalScore !== null && student.submission.totalScore !== undefined
        ? String(student.submission.totalScore)
        : '');
      setFeedback(student.submission.feedback || '');
      setErrorMsg(null);
    }
  }, [student]);

  if (!student || !student.submission) return null;

  const handleSave = async () => {
    const numScore = parseFloat(score);
    if (isNaN(numScore)) {
      setErrorMsg('Please enter a valid score.');
      return;
    }
    if (numScore < 0) {
      setErrorMsg('Score cannot be less than 0.');
      return;
    }
    if (numScore > maxScore) {
      setErrorMsg(`Score cannot exceed the maximum score (${maxScore}).`);
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      await gradeSubmission(student.submission.id, {
        totalScore: numScore,
        feedback: feedback.trim() || undefined
      });
      toast.success(`Grade for ${student.fullName} updated successfully`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save grade';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Grade Submission: {student.fullName}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Student ID: <strong>{student.studentNumber}</strong> | Email: <strong>{student.email}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Max Assessment Score: <strong>{maxScore} pts</strong>
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            label={`Score (0 - ${maxScore})`}
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            fullWidth
            required
            inputProps={{ min: 0, max: maxScore, step: 0.1 }}
            helperText={`Enter a value between 0 and ${maxScore}`}
            autoFocus
          />

          <TextField
            label="Feedback & Comments for the Student"
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            fullWidth
            placeholder="Write observations, suggestions, or rubric feedback for the student..."
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={saving} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {saving ? 'Saving...' : 'Save Grade'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

