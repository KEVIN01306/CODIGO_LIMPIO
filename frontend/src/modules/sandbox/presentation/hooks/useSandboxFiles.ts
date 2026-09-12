import { useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseSandboxFilesReturn {
  /** Full file map: { "src/main.ts": "content", ... } */
  files: Record<string, string>;
  /** Currently active file path. */
  selectedFile: string;
  /** Replace the entire file map (e.g. on initial load or F5 restore). */
  setFiles: (files: Record<string, string>) => void;
  /** Set the currently selected file without touching the map. */
  setSelectedFile: (filename: string) => void;
  /**
   * Called from Monaco's onChange — updates only the content of the
   * currently selected file without changing any other file.
   */
  updateFileContent: (value: string) => void;
  /**
   * Selects a different file.
   */
  selectFile: (filename: string) => void;
  /**
   * Creates a new file at the specified path and activates it.
   * Returns true if created, false if already exists or invalid.
   */
  createFile: (path: string, initialContent?: string) => boolean;
  /**
   * Creates a new folder at the specified path (represented by a placeholder).
   * Returns true if created, false if already exists or invalid.
   */
  createFolder: (folderPath: string) => boolean;
  /**
   * Deletes a file from the workspace.
   */
  deleteFile: (filename: string) => void;
  /**
   * Deletes a folder and all files inside it.
   */
  deleteFolder: (folderPath: string) => void;
  /**
   * Moves a file into a target folder (or root if targetFolder is empty / "/").
   */
  moveFile: (sourcePath: string, targetFolderPath: string) => boolean;
  /**
   * Renames or relocates a file.
   */
  renameFile: (oldPath: string, newPath: string) => boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useSandboxFiles = (): UseSandboxFilesReturn => {
  const [files, setFilesState] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFileState] = useState<string>('');

  const setFiles = useCallback((incoming: Record<string, string>) => {
    setFilesState(incoming);
  }, []);

  const setSelectedFile = useCallback((filename: string) => {
    setSelectedFileState(filename);
  }, []);

  const updateFileContent = useCallback((value: string) => {
    setFilesState((prev) => {
      if (!selectedFile) return prev;
      if (prev[selectedFile] === value) return prev;
      return { ...prev, [selectedFile]: value };
    });
  }, [selectedFile]);

  const selectFile = useCallback((filename: string) => {
    setSelectedFileState(filename);
  }, []);

  const createFile = useCallback((filePath: string, initialContent = ''): boolean => {
    const cleanPath = filePath.trim().replace(/^\/+/, '').replace(/\/+/g, '/');
    if (!cleanPath || cleanPath.endsWith('/')) return false;

    setFilesState((prev) => {
      if (prev[cleanPath] !== undefined) {
        return prev;
      }
      return { ...prev, [cleanPath]: initialContent };
    });

    setSelectedFileState(cleanPath);
    return true;
  }, []);

  const createFolder = useCallback((folderPath: string): boolean => {
    const cleanPath = folderPath.trim().replace(/^\/+/, '').replace(/\/+$/, '');
    if (!cleanPath) return false;

    // Create a placeholder file to preserve the folder structure in snapshot
    const placeholder = `${cleanPath}/.gitkeep`;
    setFilesState((prev) => {
      if (prev[placeholder] !== undefined) return prev;
      return { ...prev, [placeholder]: '' };
    });

    return true;
  }, []);

  const deleteFile = useCallback((filename: string) => {
    setFilesState((prev) => {
      const next = { ...prev };
      delete next[filename];

      // If deleted file was selected, pick another file
      setSelectedFileState((curr) => {
        if (curr === filename) {
          const remaining = Object.keys(next).filter((f) => !f.endsWith('/.gitkeep'));
          return remaining[0] ?? Object.keys(next)[0] ?? '';
        }
        return curr;
      });

      return next;
    });
  }, []);

  const deleteFolder = useCallback((folderPath: string) => {
    const cleanFolder = folderPath.trim().replace(/^\/+/, '').replace(/\/+$/, '');
    if (!cleanFolder) return;

    const prefix = `${cleanFolder}/`;
    setFilesState((prev) => {
      const next: Record<string, string> = {};
      let wasSelectedInside = false;

      for (const [path, content] of Object.entries(prev)) {
        if (path === cleanFolder || path.startsWith(prefix)) {
          if (path === selectedFile) wasSelectedInside = true;
          continue; // exclude
        }
        next[path] = content;
      }

      if (wasSelectedInside) {
        const remaining = Object.keys(next).filter((f) => !f.endsWith('/.gitkeep'));
        setSelectedFileState(remaining[0] ?? Object.keys(next)[0] ?? '');
      }

      return next;
    });
  }, [selectedFile]);

  const moveFile = useCallback((sourcePath: string, targetFolderPath: string): boolean => {
    const cleanSource = sourcePath.trim().replace(/^\/+/, '');
    if (!cleanSource) return false;

    // Extract base filename (e.g. "Button.tsx" from "components/Button.tsx")
    const parts = cleanSource.split('/');
    const baseName = parts[parts.length - 1];
    if (!baseName || baseName === '.gitkeep') return false;

    const cleanFolder = targetFolderPath.trim().replace(/^\/+/, '').replace(/\/+$/, '');
    const newPath = cleanFolder ? `${cleanFolder}/${baseName}` : baseName;

    if (cleanSource === newPath) return false;

    setFilesState((prev) => {
      if (prev[cleanSource] === undefined) return prev;
      const next = { ...prev };
      const content = next[cleanSource];
      delete next[cleanSource];
      next[newPath] = content;

      // If target folder had a .gitkeep placeholder, we can clean it up since it now has a real file
      if (cleanFolder && next[`${cleanFolder}/.gitkeep`] !== undefined) {
        delete next[`${cleanFolder}/.gitkeep`];
      }

      return next;
    });

    setSelectedFileState((curr) => (curr === cleanSource ? newPath : curr));
    return true;
  }, []);

  const renameFile = useCallback((oldPath: string, newPath: string): boolean => {
    const cleanOld = oldPath.trim().replace(/^\/+/, '');
    const cleanNew = newPath.trim().replace(/^\/+/, '');
    if (!cleanOld || !cleanNew || cleanOld === cleanNew) return false;

    setFilesState((prev) => {
      if (prev[cleanOld] === undefined) return prev;
      const next = { ...prev };
      const content = next[cleanOld];
      delete next[cleanOld];
      next[cleanNew] = content;
      return next;
    });

    setSelectedFileState((curr) => (curr === cleanOld ? cleanNew : curr));
    return true;
  }, []);

  return {
    files,
    selectedFile,
    setFiles,
    setSelectedFile,
    updateFileContent,
    selectFile,
    createFile,
    createFolder,
    deleteFile,
    deleteFolder,
    moveFile,
    renameFile,
  };
};
