'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Lock, Mail } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setError(null);
    setSocialLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}`);
      setSocialLoading(null);
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
        <h2 className="font-heading text-lg font-bold text-slate-800">Welcome Back</h2>
        <p className="text-xs text-slate-400 mt-1">Log in to track orders and manage your profile</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-bold mb-5 text-center">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Password</label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-extrabold text-[#1a3a6b] hover:text-[#c9a84c] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
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

        <button
          type="submit"
          disabled={loading || socialLoading !== null}
          className="w-full bg-gradient-to-r from-[#0f2444] to-[#1e4d9e] hover:opacity-95 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl text-xs font-black tracking-wider transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging In...
            </>
          ) : (
            'Log In'
          )}
        </button>
      </form>

      {/* Social Login Separator */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-slate-100" />
        <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider">Or continue with</span>
        <div className="flex-1 border-t border-slate-100" />
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSocialSignIn('google')}
          disabled={loading || socialLoading !== null}
          className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 transition-all cursor-pointer disabled:opacity-50"
        >
          {socialLoading === 'google' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          )}
          Google
        </button>
        <button
          onClick={() => handleSocialSignIn('github')}
          disabled={loading || socialLoading !== null}
          className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 transition-all cursor-pointer disabled:opacity-50"
        >
          {socialLoading === 'github' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4 text-slate-800" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          )}
          GitHub
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-slate-400">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-extrabold text-[#1a3a6b] hover:text-[#c9a84c] transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0a1828] via-[#0f2444] to-[#1e4d9e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute w-72 h-72 bg-[#c9a84c]/10 rounded-full blur-3xl -top-12 -left-12 pointer-events-none" />
      <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -bottom-12 -right-12 pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col gap-4">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white mb-2 self-start select-none transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
        <Suspense fallback={
          <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-md flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a3a6b]" />
          </div>
        }>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
