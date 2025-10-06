"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from '@/src/lib/axios';

interface Branch { id: number; name: string; }

function InnerCompleteRegistration() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState('client');
  const [branchId, setBranchId] = useState<string>('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const statusRes = await axios.get('/api/auth/status');
        if (!statusRes.data.authenticated) {
          router.replace('/login');
          return;
        }
        const user = statusRes.data.user;
        const urlRole = params.get('role');
        const urlBranch = params.get('branch');
        const viaGoogle = params.get('from') === 'google';
        if (viaGoogle && urlRole && (!user?.role || (urlRole !== 'client' && !user?.branchId))) {
          try {
            await axios.post('/api/auth/complete', { role: urlRole, branchId: urlRole === 'client' ? null : urlBranch });
            router.replace('/');
            return;
          } catch (e) {
            // fall back to manual completion UI
          }
        }
        if (user?.role && (user.role === 'client' || user.branchId)) {
          router.replace('/');
          return;
        }
        setIsNew(!user?.role);
        const branchesRes = await axios.get('/api/branches');
        setBranches(branchesRes.data.branches || []);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router, params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await axios.post('/api/auth/complete', { role, branchId: branchId || null });
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      router.replace('/');
    } catch (err) {
      if (typeof err === 'object' && err && 'response' in err) {
        // @ts-expect-error dynamic axios-like error shape
        setError(err.response?.data?.message || 'Failed to complete registration');
      } else {
        setError('Failed to complete registration');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-2">Complete Your Registration</h1>
        {!isNew && <p className="text-sm text-gray-500 mb-4">We need a few more details to finish setting up your account.</p>}
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
              <option value="client">Client (Renter)</option>
              <option value="manager">Manager</option>
              <option value="supervisor">Supervisor</option>
              <option value="assistant">Assistant</option>
            </select>
          </div>
          {(role !== 'client') && (
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Branch</label>
              <select value={branchId} onChange={e => setBranchId(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">Select a branch</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          )}
          <button disabled={submitting} type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60">
            {submitting ? 'Saving...' : 'Finish'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CompleteRegistrationClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <InnerCompleteRegistration />
    </Suspense>
  );
}
