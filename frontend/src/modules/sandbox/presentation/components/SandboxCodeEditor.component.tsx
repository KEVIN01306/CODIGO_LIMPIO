import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import * as monaco from 'monaco-editor';
import { getLanguage } from '../../sandbox.utils';

interface Props {
  /** Content of the currently selected file. */
  value: string;
  /** File name — used to derive the Monaco language. */
  fileName: string;
  /** Called on every keystroke with the new content. */
  onChange: (value: string) => void;
  /** Called when user presses Ctrl+S / Cmd+S inside editor. */
  onSave?: () => void;
}

/**
 * SandboxCodeEditor
 *
 * Renders the Monaco Editor for a single file.
 *
 * Responsibilities:
 *   - Create/destroy the Monaco instance.
 *   - Update the editor's content when `value` or `fileName` changes.
 *   - Report changes upward via `onChange`.
 *
 * Does NOT:
 *   - Call the backend.
 *   - Know about authentication or submission state.
 *   - Manage file selection or persistence.
 */
const SandboxCodeEditor: React.FC<Props> = ({ value, fileName, onChange, onSave }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onSaveRef = useRef(onSave);
  const onChangeRef = useRef(onChange);
  const isSettingValueRef = useRef(false);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // ── Create editor on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    editorRef.current = monaco.editor.create(containerRef.current, {
      value,
      language: getLanguage(fileName),
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      tabSize: 2,
    });

    editorRef.current.onDidChangeModelContent(() => {
      if (isSettingValueRef.current) return;
      onChangeRef.current?.(editorRef.current?.getValue() ?? '');
    });

    // Intercept Cmd+S / Ctrl+S inside Monaco to trigger save and prevent browser dialog
    editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSaveRef.current?.();
    });

    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync content when value or fileName changes ────────────────────────
  useEffect(() => {
    if (!editorRef.current) return;

    const current = editorRef.current.getValue();
    if (current !== value) {
      // Preserve cursor position when the update comes from file-switching.
      const pos = editorRef.current.getPosition();
      isSettingValueRef.current = true;
      editorRef.current.setValue(value);
      isSettingValueRef.current = false;
      if (pos) editorRef.current.setPosition(pos);
    }

    const model = editorRef.current.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, getLanguage(fileName));
    }
  }, [value, fileName]);

  return (
    <Box
      ref={containerRef}
      sx={{ flex: 1, minWidth: 0, height: '100%' }}
    />
  );
};

export default SandboxCodeEditor;
