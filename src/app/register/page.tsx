"use client"

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the Branch interface
interface Branch {
  branch_id: number;
  branch_name: string;
  location: string;
}

// Role options for staff
const STAFF_ROLES = [
  { value: 'manager', label: 'Manager' },
  { value: 'assistant', label: 'Assistant' },
  { value: 'supervisor', label: 'Supervisor' },
  // Add more roles if needed
];

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('client');
  const [role, setRole] = useState('assistant');
  const [branchId, setBranchId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Email verification states
  const [step, setStep] = useState<'form' | 'verify' | 'complete'>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    // Fetch branches from API
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/branch');
        if (!response.ok) {
          throw new Error('Failed to fetch branches');
        }
        const data = await response.json();
        setBranches(data.result || []);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all required fields
    if (!name.trim() || !email.trim() || !password || !confirmPassword || !branchId) {
      setError('All fields are required');
      return;
    }

    if (userType === 'staff' && !role) {
      setError('Please select a staff role');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Step 1: Send verification code
    await sendVerificationCode();
  };

  const sendVerificationCode = async () => {
    setIsSendingCode(true);
    setError('');

    try {
      const response = await fetch('/api/auth/manual/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      setSuccess('Verification code sent to your email!');
      setStep('verify');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      const verifyResponse = await fetch('/api/auth/manual/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
          name : name,
          password : password
        }),
      });

      const verifyData = await verifyResponse.json();
  // Removed debug log: verifyData

      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'Invalid verification code'); 
      }

      // Step 2: Complete registration after email verification
      await completeRegistration();
    } catch (err: unknown) {
      setError((err as Error).message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const completeRegistration = async () => {
    try {
      // Validate all required fields before sending
      if (!name || !email || !password || !branchId) {
        setError('All fields are required. Please go back and fill in all information.');
        setStep('form');
        return;
      }

      if (userType === 'staff' && !role) {
        setError('Staff role is required. Please go back and select a role.');
        setStep('form');
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role: userType === 'client' ? 'client' : role,
          branch_id: branchId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(data.message);
      setStep('complete');
      
      if (userType === 'client') {
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Register - DreamHome</title>
        <meta name="description" content="Create a new DreamHome account" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <h2 className="text-center text-3xl font-extrabold text-blue-600">DreamHome</h2>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Registration Form */}
          {step === 'form' && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">
                  I want to register as a
                </label>
                <div className="mt-1">
                  <select
                    id="user-type"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="client">Client</option>
                    <option value="staff">Staff Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {userType === 'staff' && (
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Staff Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      {STAFF_ROLES.map((staffRole) => (
                        <option key={staffRole.value} value={staffRole.value}>
                          {staffRole.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                  {userType === 'client' ? 'Preferred Branch' : 'Assigned Branch'}
                </label>
                <div className="mt-1">
                  <select
                    id="branch"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    required
                    disabled={loading}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select a branch</option>
                    {branches.map((branch, index) => (
                      <option key={branch.branch_id || `branch-${index}`} value={branch.branch_id}>
                        {branch.branch_name} ({branch.location})
                      </option>
                    ))}
                  </select>
                  {loading && <p className="text-xs text-gray-500 mt-1">Loading branches...</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSendingCode || loading}
                >
                  {isSendingCode ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Email Verification */}
          {step === 'verify' && (
            <form className="space-y-6" onSubmit={handleVerifyCode}>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Verify Your Email</h3>
                <p className="mt-2 text-sm text-gray-600">
                  We&apos;ve sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
                  Enter verification code
                </label>
                <div className="mt-1">
                  <input
                    id="verification-code"
                    name="verification-code"
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center text-lg tracking-widest"
                    placeholder="000000"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Complete Registration'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  className="text-blue-600 hover:text-blue-500 text-sm mr-4"
                  disabled={isSendingCode}
                >
                  {isSendingCode ? 'Sending...' : 'Resend code'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-gray-600 hover:text-gray-500 text-sm"
                >
                  Back to form
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Registration Complete */}
          {step === 'complete' && (
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Registration Complete!</h3>
              <p className="text-sm text-gray-600">
                {userType === 'client' 
                  ? 'Your account has been created successfully. You will be redirected to login shortly.'
                  : 'Your staff application has been submitted successfully. You will be contacted once it is reviewed.'
                }
              </p>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/login" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
