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
 * @param snapshot  Raw value from the API.
 * @param language  Assessment's `allowedLanguage` used to derive the default
 *                  file extension when no files are present.
 */
export const parseCodeSnapshot = (
  snapshot: unknown,
  language = 'javascript'
): Record<string, string> => {
  const defaultExt = languageToExtension(language);
  const defaultFiles = () => ({ [`main.${defaultExt}`]: `// Write your code here\n` });

  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    return defaultFiles();
  }

  const record = snapshot as Record<string, unknown>;

  // Legacy single-file format: { code: "..." }
  if ('code' in record && typeof record.code === 'string') {
    return { [`main.${defaultExt}`]: record.code };
  }

  // Multi-file format: filter out any non-string values
  const entries = Object.entries(record).filter(([, v]) => typeof v === 'string');
  if (entries.length === 0) return defaultFiles();

  return Object.fromEntries(entries) as Record<string, string>;
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
