export async function register() {
  // This runs in Next.js build/runtime phases (with instrumentation hook)
  try {
    // Lightweight logging (will appear in build output)
    console.log('[instrumentation] cwd=', process.cwd());
    console.log('[instrumentation] NODE_ENV=', process.env.NODE_ENV);
  } catch (e) {
    console.log('[instrumentation] error', e);
  }
}
