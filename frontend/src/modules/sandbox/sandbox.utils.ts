/**
 * sandbox.utils.ts
 *
 * Shared utilities for the sandbox module.
 * Kept separate from components/hooks so they can be imported without
 * pulling in any React or API dependencies.
 */

// ─── getLanguage ──────────────────────────────────────────────────────────────

/**
 * Maps a file name to the Monaco Editor language identifier.
 *
 * This ONLY affects syntax highlighting and editor behaviour inside Monaco.
 * It does NOT imply that the backend execution engine supports the language.
 *
 * Supported runtimes on this backend:
 *   - JavaScript (node)
 *   - TypeScript (tsx)
 *   - Python     (python3)
 *
 * Other extensions are mapped for display purposes only.
 */
export const getLanguage = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript';

    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
      return 'javascript';

    case 'py':
      return 'python';

    case 'java':
      return 'java';

    case 'html':
    case 'htm':
      return 'html';

    case 'css':
    case 'scss':
    case 'sass':
      return 'css';

    case 'json':
      return 'json';

    case 'md':
    case 'mdx':
      return 'markdown';

    case 'sh':
    case 'bash':
      return 'shell';

    default:
      return 'plaintext';
  }
};

/** Formats a text block as a comment for the specified programming language. */
export const formatCommentForLanguage = (text: string, language = 'javascript'): string => {
  if (!text || !text.trim()) return '';
  const lang = language.toLowerCase();
  const trimmed = text.trim();

  if (lang === 'python' || lang === 'py') {
    const lines = trimmed.split('\n');
    return lines.map((line) => (line ? `# ${line}` : '#')).join('\n') + '\n\n';
  }

  if (lang === 'html') {
    return `<!--\n${trimmed}\n-->\n\n`;
  }

  if (lang === 'css') {
    return `/*\n${trimmed}\n*/\n\n`;
  }

  // Default C-style comments (JS, TS, Java, etc.)
  const lines = trimmed.split('\n');
  if (lines.length === 1) {
    return `// ${trimmed}\n\n`;
  }
  return `/**\n${lines.map((l) => ` * ${l}`).join('\n')}\n */\n\n`;
};

// ─── parseCodeSnapshot ────────────────────────────────────────────────────────

/**
 * Normalises a raw `codeSnapshot` from the backend into a `Record<string, string>`.
 *
 * The backend stores `codeSnapshot` as `Json?` in Prisma, so the value returned
 * by the API may be:
 *   - `null` / `undefined`  → first-time open, no code yet
 *   - `{ code: "..." }`     → legacy single-file format from the old interval-autosave
 *   - `{ "path": "..." }`   → current multi-file format
 *
 * The normaliser unifies all three into `Record<string, string>` so the rest of
 * the sandbox always works with a consistent type.
 *
 * @param snapshot    Raw value from the API.
 * @param language    Assessment's `allowedLanguage` used to derive the default
 *                    file extension when no files are present.
 * @param description Optional assessment description to include as a leading comment.
 */
export const parseCodeSnapshot = (
  snapshot: unknown,
  language = 'javascript',
  description?: string | null
): Record<string, string> => {
  const defaultExt = languageToExtension(language);
  const comment = description ? formatCommentForLanguage(description, language) : '';
  const defaultPlaceholder = language === 'python' ? '# Write your code here\n' : '// Write your code here\n';
  const defaultFiles = () => ({
    [`main.${defaultExt}`]: `${comment}${defaultPlaceholder}`,
  });

  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    return defaultFiles();
  }

  const record = snapshot as Record<string, unknown>;

  // Legacy single-file format: { code: "..." }
  if ('code' in record && typeof record.code === 'string') {
    let code = record.code;
    if ((!code.trim() || code.trim() === '// Write your code here' || code.trim() === '# Write your code here') && comment) {
      code = `${comment}${defaultPlaceholder}`;
    }
    return { [`main.${defaultExt}`]: code };
  }

  // Multi-file format: filter out any non-string values
  const entries = Object.entries(record).filter(([, v]) => typeof v === 'string');
  if (entries.length === 0) return defaultFiles();

  const fileMap = Object.fromEntries(entries) as Record<string, string>;
  const firstKey = Object.keys(fileMap)[0];
  if (firstKey && comment) {
    const content = fileMap[firstKey];
    if (
      content.trim() === '' ||
      content.trim() === '// Write your code here' ||
      content.trim() === '# Write your code here'
    ) {
      fileMap[firstKey] = `${comment}${defaultPlaceholder}`;
    }
  }

  return fileMap;
};

/** Maps an assessment language name to a file extension for default file naming. */
const languageToExtension = (language: string): string => {
  const map: Record<string, string> = {
    typescript: 'ts',
    javascript: 'js',
    python: 'py',
    java: 'java',
    html: 'html',
    css: 'css',
  };
  return map[language?.toLowerCase()] ?? 'js';
};
