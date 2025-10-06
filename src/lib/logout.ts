// Unified logout helper: clears manual JWT cookie via API and signs out NextAuth
// Usage: import { hybridLogout } from '@/src/lib/logout'; await hybridLogout();

import { signOut } from 'next-auth/react';

export async function hybridLogout(options: { redirect?: boolean } = {}) {
  try {
    // Clear manual token cookie on server
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    // Remove legacy token in localStorage if present
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem('token'); } catch {}
    }
  } finally {
    const doRedirect = options.redirect === true;
    if (doRedirect) {
      await signOut({ redirect: true, callbackUrl: '/' });
    } else {
      await signOut({ redirect: false });
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }
}
