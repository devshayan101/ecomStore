'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/storefront';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError('Invalid reset link or missing token.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Password reset failed');
      }

      setMessage('Password has been reset successfully.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl border border-[#c9a84c]/20 p-8 shadow-[0_8px_32px_rgba(15,36,68,0.08)] flex flex-col">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex flex-col select-none mb-4">
          <span className="font-heading text-2xl font-bold tracking-wider leading-none text-[#0f2444]">
            Olin<span className="text-[#c9a84c]">buy</span>
          </span>
          <span className="text-[9px] text-[#1a3a6b]/95 tracking-[2px] uppercase font-bold mt-1.5">
            India's Best Store
          </span>
        </Link>
        <h2 className="font-heading text-lg font-bold text-slate-800">Reset Password</h2>
        <p className="text-xs text-slate-400 mt-1">Enter your new password below</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-bold mb-5 text-center select-none">
          ❌ {error}
        </div>
      )}

      {message ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-xs font-semibold text-center select-none space-y-3">
          <p>🎉 {message}</p>
          <p className="text-[10px] text-slate-400">Redirecting to login page...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">New Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Confirm New Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0f2444] to-[#1e4d9e] hover:opacity-95 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl text-xs font-black tracking-wider transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0a1828] via-[#0f2444] to-[#1e4d9e] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-[#c9a84c]/10 rounded-full blur-3xl -top-12 -left-12 pointer-events-none" />
      <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -bottom-12 -right-12 pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col gap-4">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white mb-2 self-start select-none transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
        
        <Suspense fallback={
          <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-md flex items-center justify-center min-h-[250px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a3a6b]" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
