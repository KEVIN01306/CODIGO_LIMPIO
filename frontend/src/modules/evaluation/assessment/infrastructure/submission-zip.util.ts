import JSZip from 'jszip';

/**
 * Downloads a student's code snapshot as a .zip file.
 */
export const downloadSubmissionZip = async (
  studentName: string,
  studentNumber: string,
  assessmentTitle: string,
  codeSnapshot: Record<string, string> | null
): Promise<void> => {
  if (!codeSnapshot || Object.keys(codeSnapshot).length === 0) {
    throw new Error('No code files available in this submission.');
  }

  const zip = new JSZip();
  for (const [filePath, content] of Object.entries(codeSnapshot)) {
    const cleanPath = filePath.replace(/^\/+/, '');
    zip.file(cleanPath, content ?? '');
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeAssessmentTitle = assessmentTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeStudent = (studentNumber || studentName).replace(/[^a-zA-Z0-9_-]/g, '_');
  a.href = url;
  a.download = `${safeStudent}_${safeAssessmentTitle}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
