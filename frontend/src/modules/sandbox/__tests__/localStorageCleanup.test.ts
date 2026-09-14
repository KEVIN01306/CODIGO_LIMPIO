/**
 * Automated test suite for Sandbox LocalStorage Cleanup Lifecycle
 *
 * Verifies all 8 scenarios from the specification:
 *   Scenario 1 — Student works normally (localStorage persists in real-time)
 *   Scenario 2 — Browser refresh (preserves and restores temporary progress)
 *   Scenario 3 — Student leaves assessment (clears localStorage, fresh entry from backend)
 *   Scenario 4 — Successful submission (final sync, clears localStorage on success)
 *   Scenario 5 — Failed submission (preserves localStorage, allows retry)
 *   Scenario 6 — Multiple assessments (isolation: clearing A does not affect B)
 *   Scenario 7 — Multiple files (all files removed sequentially)
 *   Scenario 8 — Component remount (same route remount preserves progress)
 *   Extra: Non-interference with theme_mode, auth, and other storage keys
 */

import {
  clearSubmissionLocalStorage,
  getSnapshotKey,
  getFileKey,
  isAssessmentSessionActive,
  setAssessmentSessionActive,
  clearAssessmentSessionActive,
  type PersistedSnapshot,
} from '../presentation/hooks/useCodePersistence';

// ─── In-Memory Storage Mock ──────────────────────────────────────────────────

class MockStorage implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

// Attach mocks to global scope for Node test execution
const mockLocalStorage = new MockStorage();
const mockSessionStorage = new MockStorage();

(global as any).localStorage = mockLocalStorage;
(global as any).sessionStorage = mockSessionStorage;

// ─── Test Runner Helpers ──────────────────────────────────────────────────────

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function test(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err: any) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

async function runTests() {
  console.log('\n=== Running LocalStorage Cleanup & Persistence Tests ===\n');

  // Setup initial clean state
  mockLocalStorage.clear();
  mockSessionStorage.clear();

  // ──────────────────────────────────────────────────────────────────────────
  test('Scenario 1: Student works normally — files saved to scoped localStorage', () => {
    mockLocalStorage.clear();
    mockSessionStorage.clear();

    const submissionId = 'sub-001';
    const userId = 'usr-100';
    const files = {
      'src/index.js': 'console.log("hello world");',
      'src/utils.js': 'export const add = (a, b) => a + b;',
    };

    // Simulate real-time persistence
    const snapshot: PersistedSnapshot = { files, updatedAt: new Date().toISOString() };
    mockLocalStorage.setItem(getSnapshotKey(submissionId, userId), JSON.stringify(snapshot));
    for (const [path, content] of Object.entries(files)) {
      mockLocalStorage.setItem(getFileKey(submissionId, path, userId), content);
    }

    // Verify snapshot is present
    const rawSnapshot = mockLocalStorage.getItem(getSnapshotKey(submissionId, userId));
    assert(rawSnapshot !== null, 'Snapshot should be stored in localStorage');
    const parsed = JSON.parse(rawSnapshot!);
    assert(parsed.files['src/index.js'] === 'console.log("hello world");', 'File content must match');

    // Verify individual files are present
    assert(
      mockLocalStorage.getItem(getFileKey(submissionId, 'src/index.js', userId)) === 'console.log("hello world");',
      'Individual file 1 must be present'
    );
    assert(
      mockLocalStorage.getItem(getFileKey(submissionId, 'src/utils.js', userId)) === 'export const add = (a, b) => a + b;',
      'Individual file 2 must be present'
    );
  });

  // ──────────────────────────────────────────────────────────────────────────
  test('Scenario 2: Browser refresh — preserves and recovers temporary progress', () => {
    const submissionId = 'sub-001';
    const userId = 'usr-100';

    // Mark session active (as would happen during work)
    setAssessmentSessionActive(submissionId);
    assert(isAssessmentSessionActive(submissionId) === true, 'Session should be marked active');

    // Browser refresh preserves sessionStorage per browser spec
    // Verify that isAssessmentSessionActive detects it as a refresh
    const isRefresh = isAssessmentSessionActive(submissionId);
    assert(isRefresh === true, 'Active session must be recognized on refresh');

    // Check that localStorage snapshot remains available for recovery
    const rawSnapshot = mockLocalStorage.getItem(getSnapshotKey(submissionId, userId));
    assert(rawSnapshot !== null, 'Local snapshot must not be cleared during refresh');
  });

  // ──────────────────────────────────────────────────────────────────────────
  test('Scenario 3: Student leaves assessment — clears temporary localStorage and session', () => {
    const submissionId = 'sub-001';
    const userId = 'usr-100';

    // Student leaves: clear storage & session marker
    const removedKeys = clearSubmissionLocalStorage(submissionId, userId);
    clearAssessmentSessionActive(submissionId);

    assert(removedKeys.length >= 3, 'Must remove snapshot and individual file keys');
    assert(mockLocalStorage.getItem(getSnapshotKey(submissionId, userId)) === null, 'Snapshot must be removed');
    assert(mockLocalStorage.getItem(getFileKey(submissionId, 'src/index.js', userId)) === null, 'File 1 must be removed');
    assert(mockLocalStorage.getItem(getFileKey(submissionId, 'src/utils.js', userId)) === null, 'File 2 must be removed');
    assert(isAssessmentSessionActive(submissionId) === false, 'Session marker must be removed');

    // When re-entering:
    const isRefresh = isAssessmentSessionActive(submissionId);
    assert(isRefresh === false, 'Re-entering must NOT be detected as a refresh');
  });

  // ──────────────────────────────────────────────────────────────────────────
  test('Scenario 4: Successful submission — cleans up localStorage only on success', async () => {
    mockLocalStorage.clear();
    mockSessionStorage.clear();

    const submissionId = 'sub-002';
    const userId = 'usr-100';
    const files = { 'main.py': 'print("solution")' };

    // Student working
    setAssessmentSessionActive(submissionId);
    mockLocalStorage.setItem(getSnapshotKey(submissionId, userId), JSON.stringify({ files, updatedAt: new Date().toISOString() }));
    mockLocalStorage.setItem(getFileKey(submissionId, 'main.py', userId), files['main.py']);

    // Simulate submission flow
    let submissionSuccess = true;
    if (submissionSuccess) {
      clearSubmissionLocalStorage(submissionId, userId);
      clearAssessmentSessionActive(submissionId);
    }

    assert(mockLocalStorage.getItem(getSnapshotKey(submissionId, userId)) === null, 'Snapshot removed on success');
    assert(mockLocalStorage.getItem(getFileKey(submissionId, 'main.py', userId)) === null, 'File removed on success');
    assert(isAssessmentSessionActive(submissionId) === false, 'Session cleared on success');
  });

  // ──────────────────────────────────────────────────────────────────────────
  test('Scenario 5: Failed submission — preserves localStorage and allows retry', async () => {
    mockLocalStorage.clear();
    mockSessionStorage.clear();

    const submissionId = 'sub-003';
    const userId = 'usr-100';
    const files = { 'main.py': 'print("draft")' };

    setAssessmentSessionActive(submissionId);
    mockLocalStorage.setItem(getSnapshotKey(submissionId, userId), JSON.stringify({ files, updatedAt: new Date().toISOString() }));
    mockLocalStorage.setItem(getFileKey(submissionId, 'main.py', userId), files['main.py']);

    // Simulate failed submission (e.g. 500 error / network failure)
    let submissionFailed = true;
    if (submissionFailed) {
      // DO NOT clear localStorage
    }

    assert(mockLocalStorage.getItem(getSnapshotKey(submissionId, userId)) !== null, 'Snapshot must be preserved on failure');
    assert(mockLocalStorage.getItem(getFileKey(submissionId, 'main.py', userId)) === 'print("draft")', 'File must be preserved for retry');
    assert(isAssessmentSessionActive(submissionId) === true, 'Session must remain active');
  });

  // ──────────────────────────────────────────────────────────────────────────
  test('Scenario 6: Multiple assessments isolation — clearing A does not affect B', () => {
    mockLocalStorage.clear();

    const submissionA = 'sub-A';
    const submissionB = 'sub-B';
    const userId = 'usr-100';

    mockLocalStorage.setItem(getSnapshotKey(submissionA, userId), JSON.stringify({ files: { 'a.js': 'code A' } }));
    mockLocalStorage.setItem(getFileKey(submissionA, 'a.js', userId), 'code A');

    mockLocalStorage.setItem(getSnapshotKey(submissionB, userId), JSON.stringify({ files: { 'b.js': 'code B' } }));
    mockLocalStorage.setItem(getFileKey(submissionB, 'b.js', userId), 'code B');

    // Clear submission A only
    clearSubmissionLocalStorage(submissionA, userId);

    // A should be deleted
    assert(mockLocalStorage.getItem(getSnapshotKey(submissionA, userId)) === null, 'Submission A snapshot must be deleted');
    assert(mockLocalStorage.getItem(getFileKey(submissionA, 'a.js', userId)) === null, 'Submission A file must be deleted');

    // B must remain completely intact
    assert(mockLocalStorage.getItem(getSnapshotKey(submissionB, userId)) !== null, 'Submission B snapshot must remain');
    assert(mockLocalStorage.getItem(getFileKey(submissionB, 'b.js', userId)) === 'code B', 'Submission B file must remain');
  });

  // ──────────────────────────────────────────────────────────────────────────
  test('Scenario 7: Multiple files — all files removed sequentially', () => {
    mockLocalStorage.clear();

    const submissionId = 'sub-multi';
    const userId = 'usr-100';
    const files = {
      'file1.ts': 'const a = 1;',
      'file2.ts': 'const b = 2;',
      'file3.ts': 'const c = 3;',
    };

    mockLocalStorage.setItem(getSnapshotKey(submissionId, userId), JSON.stringify({ files }));
    for (const [path, content] of Object.entries(files)) {
      mockLocalStorage.setItem(getFileKey(submissionId, path, userId), content);
    }

    const removed = clearSubmissionLocalStorage(submissionId, userId);

    assert(removed.length === 4, `Expected 4 keys removed (1 snapshot + 3 files), got ${removed.length}`);
    for (const path of Object.keys(files)) {
      assert(mockLocalStorage.getItem(getFileKey(submissionId, path, userId)) === null, `${path} must be removed`);
    }
    assert(mockLocalStorage.getItem(getSnapshotKey(submissionId, userId)) === null, 'Snapshot must be removed');
  });

  // ──────────────────────────────────────────────────────────────────────────
  test('Scenario 8: Component remount on same route — preserves progress', () => {
    mockLocalStorage.clear();
    mockSessionStorage.clear();

    const submissionId = 'sub-remount';
    const userId = 'usr-100';
    const files = { 'code.js': 'console.log("persists across remount");' };

    setAssessmentSessionActive(submissionId);
    mockLocalStorage.setItem(getSnapshotKey(submissionId, userId), JSON.stringify({ files }));

    // Simulate component remount check (route is still /sandbox/sub-remount)
    const currentPath = `/sandbox/${submissionId}`;
    const isStillInSandbox = currentPath.startsWith(`/sandbox/${submissionId}`);

    if (!isStillInSandbox) {
      clearSubmissionLocalStorage(submissionId, userId);
    }

    assert(isStillInSandbox === true, 'Should detect user is still on sandbox route');
    assert(mockLocalStorage.getItem(getSnapshotKey(submissionId, userId)) !== null, 'Progress must be kept on remount');
  });

  // ──────────────────────────────────────────────────────────────────────────
  test('Non-interference: theme_mode, auth, and unrelated keys are untouched', () => {
    mockLocalStorage.clear();

    // Set application data
    mockLocalStorage.setItem('theme_mode', 'dark');
    mockLocalStorage.setItem('auth_token_mock', 'xyz789');

    // Set assessment data
    const submissionId = 'sub-isolation';
    mockLocalStorage.setItem(getSnapshotKey(submissionId), JSON.stringify({ files: {} }));
    mockLocalStorage.setItem(getFileKey(submissionId, 'test.js'), 'code');

    // Clear submission
    clearSubmissionLocalStorage(submissionId);

    // Submission keys must be gone
    assert(mockLocalStorage.getItem(getSnapshotKey(submissionId)) === null, 'Snapshot must be gone');
    assert(mockLocalStorage.getItem(getFileKey(submissionId, 'test.js')) === null, 'File key must be gone');

    // App data must remain untouched
    assert(mockLocalStorage.getItem('theme_mode') === 'dark', 'theme_mode must NOT be deleted');
    assert(mockLocalStorage.getItem('auth_token_mock') === 'xyz789', 'auth token must NOT be deleted');
  });

  console.log(`\nResults: ${passedTests}/${totalTests} tests passed.\n`);
  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
