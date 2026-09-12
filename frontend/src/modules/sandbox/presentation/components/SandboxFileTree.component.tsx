import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Collapse,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FolderSpecialOutlinedIcon from '@mui/icons-material/FolderSpecialOutlined';

interface Props {
  /** Sorted list of file paths in the snapshot. */
  files: string[];
  /** Currently active file path. */
  selectedFile: string;
  /** Whether the file explorer is expanded */
  isOpen: boolean;
  /** Toggle the file explorer */
  onToggle: () => void;
  /** Called when the user clicks a file entry. */
  onFileSelect: (filename: string) => void;
  /** Called to create a new file */
  onCreateFile: (path: string) => void;
  /** Called to create a new folder */
  onCreateFolder: (folderPath: string) => void;
  /** Called to delete a file */
  onDeleteFile?: (filename: string) => void;
  /** Called to delete a folder */
  onDeleteFolder?: (folderPath: string) => void;
  /** Called to move a file to another folder */
  onMoveFile?: (sourcePath: string, targetFolderPath: string) => void;
}

interface FileTreeNode {
  name: string;
  fullPath: string;
  isFolder: boolean;
  children: FileTreeNode[];
}

/**
 * Builds a hierarchical tree from a flat list of file paths.
 */
function buildTree(paths: string[]): FileTreeNode[] {
  const root: FileTreeNode = { name: '', fullPath: '', isFolder: true, children: [] };

  for (const path of paths) {
    const isGitkeep = path.endsWith('/.gitkeep');
    const displayPath = isGitkeep ? path.replace(/\/\.gitkeep$/, '') : path;
    const parts = displayPath.split('/');

    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const isFolder = !isLast || isGitkeep;
      const currentPath = parts.slice(0, i + 1).join('/');

      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          fullPath: isFolder ? currentPath : path,
          isFolder,
          children: [],
        };
        current.children.push(child);
      }
      current = child;
    }
  }

  const sortNodes = (nodes: FileTreeNode[]): FileTreeNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.isFolder === b.isFolder) {
          return a.name.localeCompare(b.name);
        }
        return a.isFolder ? -1 : 1;
      })
      .map((node) => ({
        ...node,
        children: sortNodes(node.children),
      }));
  };

  return sortNodes(root.children);
}

export const SandboxFileTree: React.FC<Props> = ({
  files,
  selectedFile,
  isOpen,
  onToggle,
  onFileSelect,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onDeleteFolder,
  onMoveFile,
}) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  // Creation state
  const [creatingType, setCreatingType] = useState<'file' | 'folder' | null>(null);
  const [targetFolder, setTargetFolder] = useState<string>(''); // '' means root
  const [inputVal, setInputVal] = useState('');

  // Drag & drop state
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  // Move Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [fileToMove, setFileToMove] = useState<string | null>(null);

  const tree = useMemo(() => buildTree(files), [files]);

  // Extract list of all unique folders in the workspace
  const availableFolders = useMemo(() => {
    const set = new Set<string>();
    for (const path of files) {
      const parts = path.split('/');
      if (parts.length > 1) {
        for (let i = 1; i < parts.length; i++) {
          set.add(parts.slice(0, i).join('/'));
        }
      }
    }
    return Array.from(set).sort();
  }, [files]);

  const toggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: prev[folderPath] === undefined ? false : !prev[folderPath],
    }));
  };

  const handleStartCreate = (type: 'file' | 'folder', folder = '') => {
    setCreatingType(type);
    setTargetFolder(folder);
    setInputVal('');
    if (folder) {
      setOpenFolders((prev) => ({ ...prev, [folder]: true }));
    }
  };

  const handleConfirmCreate = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setCreatingType(null);
      return;
    }

    const fullPath = targetFolder ? `${targetFolder}/${trimmed}` : trimmed;

    if (creatingType === 'file') {
      onCreateFile(fullPath);
    } else if (creatingType === 'folder') {
      onCreateFolder(fullPath);
    }

    setCreatingType(null);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirmCreate();
    } else if (e.key === 'Escape') {
      setCreatingType(null);
      setInputVal('');
    }
  };

  // ── Drag & Drop Handlers ──────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, fullPath: string) => {
    e.dataTransfer.setData('text/plain', fullPath);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedFile(fullPath);
  };

  const handleDragEnd = () => {
    setDraggedFile(null);
    setDragOverTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTarget !== folderPath) {
      setDragOverTarget(folderPath);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTarget(null);
    const sourceFile = e.dataTransfer.getData('text/plain') || draggedFile;
    if (sourceFile && onMoveFile) {
      onMoveFile(sourceFile, folderPath);
      // Auto expand target folder
      if (folderPath) {
        setOpenFolders((prev) => ({ ...prev, [folderPath]: true }));
      }
    }
    setDraggedFile(null);
  };

  // ── Move to Menu Handlers ────────────────────────────────────────────────
  const handleOpenMoveMenu = (e: React.MouseEvent<HTMLElement>, filePath: string) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
    setFileToMove(filePath);
  };

  const handleCloseMoveMenu = () => {
    setMenuAnchorEl(null);
    setFileToMove(null);
  };

  const handleSelectMoveDestination = (targetFolder: string) => {
    if (fileToMove && onMoveFile) {
      onMoveFile(fileToMove, targetFolder);
      if (targetFolder) {
        setOpenFolders((prev) => ({ ...prev, [targetFolder]: true }));
      }
    }
    handleCloseMoveMenu();
  };

  if (!isOpen) {
    return (
      <Box
        sx={{
          width: 44,
          height: '100%',
          bgcolor: '#131416',
          borderLeft: '0.5px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
          gap: 2,
          flexShrink: 0,
        }}
      >
        <Tooltip title="Expand File Explorer (Cmd+B / Ctrl+B)" placement="left">
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              color: '#cececf',
              bgcolor: 'rgba(255, 255, 255, 0.04)',
              border: '0.5px solid rgba(255, 255, 255, 0.08)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' },
            }}
          >
            <FolderSpecialOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography
          variant="caption"
          sx={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: '#858687',
            letterSpacing: 1.5,
            fontSize: '0.72rem',
            fontWeight: 500,
            textTransform: 'uppercase',
          }}
        >
          Files
        </Typography>
      </Box>
    );
  }

  // ── Render Node Helper ────────────────────────────────────────────────────
  const renderNode = (node: FileTreeNode, level = 0) => {
    if (node.isFolder) {
      const isFolderOpen = openFolders[node.fullPath] ?? true;
      const isDragTarget = dragOverTarget === node.fullPath;

      return (
        <Box key={node.fullPath}>
          <Box
            onClick={() => toggleFolder(node.fullPath)}
            onDragOver={(e) => handleDragOver(e, node.fullPath)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, node.fullPath)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 0.5,
              px: 1,
              pl: 1 + level * 1.5,
              cursor: 'pointer',
              color: isDragTarget ? '#60a5fa' : '#cececf',
              borderRadius: '6px',
              mx: 0.5,
              bgcolor: isDragTarget ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
              outline: isDragTarget ? '1px dashed #3b82f6' : 'none',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                color: '#ffffff',
                '& .folder-actions': { opacity: 1 },
              },
            }}
          >
            <Box sx={{ width: 16, display: 'flex', alignItems: 'center', mr: 0.5 }}>
              {isFolderOpen ? (
                <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#858687' }} />
              ) : (
                <KeyboardArrowRightIcon sx={{ fontSize: 16, color: '#858687' }} />
              )}
            </Box>
            {isFolderOpen ? (
              <FolderOpenOutlinedIcon sx={{ fontSize: 16, mr: 1, color: '#60a5fa' }} />
            ) : (
              <FolderOutlinedIcon sx={{ fontSize: 16, mr: 1, color: '#60a5fa' }} />
            )}
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                fontWeight: 500,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {node.name}
            </Typography>

            {/* Folder Actions */}
            <Box
              className="folder-actions"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.2,
                opacity: 0,
                transition: 'opacity 0.15s ease',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip title={`New file inside ${node.name}`}>
                <IconButton
                  size="small"
                  onClick={() => handleStartCreate('file', node.fullPath)}
                  sx={{ p: 0.2, color: '#9ca3af', '&:hover': { color: '#60a5fa' } }}
                >
                  <NoteAddOutlinedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title={`New subfolder inside ${node.name}`}>
                <IconButton
                  size="small"
                  onClick={() => handleStartCreate('folder', node.fullPath)}
                  sx={{ p: 0.2, color: '#9ca3af', '&:hover': { color: '#60a5fa' } }}
                >
                  <CreateNewFolderOutlinedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>

              {onDeleteFolder && (
                <Tooltip title={`Delete folder ${node.name}`}>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteFolder(node.fullPath)}
                    sx={{ p: 0.2, color: '#71717a', '&:hover': { color: '#f87171' } }}
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Collapse in={isFolderOpen} timeout="auto" unmountOnExit>
            {/* Inline creation inside this folder */}
            {creatingType && targetFolder === node.fullPath && (
              <Box
                sx={{
                  py: 0.5,
                  px: 1,
                  pl: 1 + (level + 1) * 1.5,
                  mx: 0.5,
                  mb: 0.5,
                  bgcolor: '#1c1d22',
                  borderRadius: '6px',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                }}
              >
                <Typography variant="caption" sx={{ color: '#60a5fa', fontSize: '0.68rem', display: 'block' }}>
                  {creatingType === 'file' ? `+ File in ${node.name}/:` : `+ Subfolder in ${node.name}/:`}
                </Typography>
                <TextField
                  autoFocus
                  fullWidth
                  size="small"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleConfirmCreate}
                  placeholder={creatingType === 'file' ? 'filename.js' : 'subfolder'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      height: 26,
                      bgcolor: '#0e0f11',
                      '& fieldset': { border: 'none' },
                    },
                  }}
                />
              </Box>
            )}

            {node.children.map((child) => renderNode(child, level + 1))}
          </Collapse>
        </Box>
      );
    }

    // It's a file
    const isSelected = selectedFile === node.fullPath;
    const isBeingDragged = draggedFile === node.fullPath;
    const canDelete = files.filter((f) => !f.endsWith('/.gitkeep')).length > 1;

    return (
      <Box
        key={node.fullPath}
        draggable
        onDragStart={(e) => handleDragStart(e, node.fullPath)}
        onDragEnd={handleDragEnd}
        onClick={() => onFileSelect(node.fullPath)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 0.4,
          px: 1,
          pl: 1 + level * 1.5 + 2,
          cursor: 'pointer',
          borderRadius: '6px',
          mx: 0.5,
          my: 0.2,
          opacity: isBeingDragged ? 0.4 : 1,
          bgcolor: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
          //borderLeft: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
          color: isSelected ? '#ffffff' : '#cececf',
          transition: 'all 0.12s ease',
          '&:hover': {
            bgcolor: isSelected ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255, 255, 255, 0.04)',
            color: '#ffffff',
            '& .file-actions': { opacity: 1 },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', mr: 0.5 }}>
          <InsertDriveFileOutlinedIcon
            sx={{
              fontSize: 15,
              mr: 1,
              color: isSelected ? '#60a5fa' : '#858687',
              flexShrink: 0,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              fontWeight: isSelected ? 500 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {node.name}
          </Typography>
        </Box>

        {/* File Actions */}
        <Box
          className="file-actions"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.2,
            opacity: 0,
            transition: 'opacity 0.15s ease',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {onMoveFile && (
            <Tooltip title="Move file to folder...">
              <IconButton
                size="small"
                onClick={(e) => handleOpenMoveMenu(e, node.fullPath)}
                sx={{
                  p: 0.2,
                  color: '#9ca3af',
                  '&:hover': { color: '#60a5fa' },
                }}
              >
                <DriveFileMoveOutlinedIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}

          {canDelete && onDeleteFile && (
            <Tooltip title="Delete file">
              <IconButton
                size="small"
                onClick={() => onDeleteFile(node.fullPath)}
                sx={{
                  p: 0.2,
                  color: '#71717a',
                  '&:hover': { color: '#f87171' },
                }}
              >
                <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: 250,
        height: '100%',
        bgcolor: '#131416',
        borderLeft: '0.5px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Explorer Header */}
      <Box
        sx={{
          height: 38,
          px: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)',
          flexShrink: 0,
          bgcolor: '#18191c',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: 1.2,
            color: '#a1a1aa',
            textTransform: 'uppercase',
          }}
        >
          Explorer
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
          <Tooltip title="New File in Root">
            <IconButton
              size="small"
              onClick={() => handleStartCreate('file', '')}
              sx={{
                p: 0.4,
                color: '#858687',
                '&:hover': { color: '#60a5fa', bgcolor: 'rgba(255, 255, 255, 0.06)' },
              }}
            >
              <NoteAddOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="New Folder in Root">
            <IconButton
              size="small"
              onClick={() => handleStartCreate('folder', '')}
              sx={{
                p: 0.4,
                color: '#858687',
                '&:hover': { color: '#60a5fa', bgcolor: 'rgba(255, 255, 255, 0.06)' },
              }}
            >
              <CreateNewFolderOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Close Explorer (Cmd+B / Ctrl+B)">
            <IconButton
              size="small"
              onClick={onToggle}
              sx={{
                p: 0.4,
                color: '#858687',
                '&:hover': { color: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.06)' },
              }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Root Creation Input */}
      {creatingType && targetFolder === '' && (
        <Box sx={{ p: 1, borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)', bgcolor: '#18191c' }}>
          <Typography variant="caption" sx={{ color: '#60a5fa', fontSize: '0.68rem', display: 'block', mb: 0.5 }}>
            {creatingType === 'file' ? 'New File Name (Root):' : 'New Folder Name (Root):'}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            size="small"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleConfirmCreate}
            placeholder={creatingType === 'file' ? 'index.js' : 'components'}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#0e0f11',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.78rem',
                height: 28,
                '& fieldset': { borderColor: 'rgba(59, 130, 246, 0.5)' },
              },
            }}
          />
          <Typography variant="caption" sx={{ color: '#71717a', fontSize: '0.65rem', mt: 0.5, display: 'block' }}>
            Enter to save • Esc to cancel
          </Typography>
        </Box>
      )}

      {/* Root Drop Zone: allows moving a file back to root */}
      {draggedFile && draggedFile.includes('/') && (
        <Box
          onDragOver={(e) => handleDragOver(e, '')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, '')}
          sx={{
            m: 0.8,
            p: 1,
            borderRadius: '6px',
            border: dragOverTarget === '' ? '1px dashed #3b82f6' : '1px dashed rgba(255, 255, 255, 0.2)',
            bgcolor: dragOverTarget === '' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Typography variant="caption" sx={{ color: dragOverTarget === '' ? '#60a5fa' : '#9ca3af', fontSize: '0.72rem' }}>
            📥 Drop here to move to Root (/)
          </Typography>
        </Box>
      )}

      {/* File Tree List */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 0.8 }}>
        {tree.map((node) => renderNode(node, 0))}
      </Box>

      {/* Bottom Tip Helper */}
      <Box
        sx={{
          p: 1.2,
          bgcolor: 'rgba(0, 0, 0, 0.2)',
          borderTop: '0.5px solid rgba(255, 255, 255, 0.06)',
          flexShrink: 0,
        }}
      >
        <Typography variant="caption" sx={{ color: '#71717a', fontSize: '0.68rem', lineHeight: 1.4, display: 'block' }}>
          💡 <strong style={{ color: '#9ca3af' }}>Drag & drop</strong> files into folders, or click the <strong style={{ color: '#60a5fa' }}>move icon</strong> to organize.
        </Typography>
      </Box>

      {/* Move To Folder Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMoveMenu}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#1e1f24',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              minWidth: 180,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            },
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 0.8, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>
            Move to folder:
          </Typography>
        </Box>

        {/* Root Option */}
        <MenuItem
          onClick={() => handleSelectMoveDestination('')}
          sx={{
            py: 0.8,
            fontSize: '0.8rem',
            '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 28, color: '#60a5fa' }}>
            <FolderOutlinedIcon sx={{ fontSize: 16 }} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#ffffff' }}>
                / (Root)
              </Typography>
            }
          />
        </MenuItem>

        {/* Existing Folders */}
        {availableFolders.map((folder) => (
          <MenuItem
            key={folder}
            onClick={() => handleSelectMoveDestination(folder)}
            sx={{
              py: 0.8,
              fontSize: '0.8rem',
              '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: '#60a5fa' }}>
              <FolderOutlinedIcon sx={{ fontSize: 16 }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#ffffff' }}>
                  {folder}
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SandboxFileTree;
