'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Lock, Mail, ChevronRight, CheckCircle2 } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams ? searchParams.get('callbackUrl') || '/' : '/';

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

  const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'instagram') => {
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
    <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1 select-none mb-3 lg:hidden">
          <span className="font-sans text-xl font-black tracking-tight text-slate-900">
            Olin<span className="text-orange-500">buy</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-xs text-slate-500 mt-1.5">Enter your credentials to access your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-bold mb-6 text-center">
          {error}
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
              placeholder="name@example.com"
              className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-slate-800 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Password</label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-extrabold text-slate-500 hover:text-slate-800 transition-colors"
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
              className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-slate-800 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || socialLoading !== null}
          className="w-full bg-slate-900 hover:bg-orange-500 hover:text-white text-white py-3.5 rounded-xl text-xs font-black tracking-wider transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Logging In...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Social Login Separator */}
      <div className="flex items-center my-7">
        <div className="flex-1 border-t border-slate-100" />
        <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider">Or continue with</span>
        <div className="flex-1 border-t border-slate-100" />
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleSocialSignIn('google')}
          disabled={loading || socialLoading !== null}
          className="flex items-center justify-center gap-1.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 py-2.5 rounded-xl text-[10px] font-black text-slate-600 transition-all cursor-pointer disabled:opacity-50"
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
          onClick={() => handleSocialSignIn('facebook')}
          disabled={loading || socialLoading !== null}
          className="flex items-center justify-center gap-1.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 py-2.5 rounded-xl text-[10px] font-black text-slate-600 transition-all cursor-pointer disabled:opacity-50"
        >
          {socialLoading === 'facebook' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          )}
          Facebook
        </button>
        <button
          onClick={() => handleSocialSignIn('instagram')}
          disabled={loading || socialLoading !== null}
          className="flex items-center justify-center gap-1.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 py-2.5 rounded-xl text-[10px] font-black text-slate-600 transition-all cursor-pointer disabled:opacity-50"
        >
          {socialLoading === 'instagram' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          )}
          Instagram
        </button>
      </div>

      <div className="text-center mt-8">
        <p className="text-xs text-slate-500">
          New to Olinbuy?{' '}
          <Link
            href="/register"
            className="font-black text-slate-900 hover:text-orange-500 transition-colors"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white relative overflow-hidden font-sans">
      
      {/* Left: Decorative Brand Panel (lg screens) */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden select-none">
        {/* Glow Spheres background */}
        <div className="absolute w-[80%] aspect-square rounded-full bg-blue-600/10 blur-[100px] top-[-10%] left-[-10%] pointer-events-none"></div>
        <div className="absolute w-[80%] aspect-square rounded-full bg-purple-600/10 blur-[100px] bottom-[-10%] right-[-10%] pointer-events-none"></div>

        {/* Brand Link */}
        <Link href="/" className="inline-flex flex-col select-none relative z-10">
          <span className="text-2xl font-black tracking-tight text-white">
            Olin<span className="text-orange-500">buy</span>
          </span>
          <span className="text-[9px] text-slate-400 tracking-[2px] uppercase font-bold mt-1">
            Premium Marketplace
          </span>
        </Link>

        {/* Feature Highlights */}
        <div className="space-y-6 relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
            Log in to discover unbeatable deals.
          </h1>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">⚡ Instant checkout with one-click payment</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">📦 Secure real-time delivery tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">🏷️ Exclusive subscriber-only flash sales</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-slate-500 relative z-10">
          © {new Date().getFullYear()} Olinbuy. All rights reserved.
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 bg-slate-50/50 relative">
        {/* Back Floating Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 shadow-sm px-4 py-2 rounded-full absolute top-6 left-6 select-none transition-all duration-200 cursor-pointer active:scale-95 z-20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shop</span>
        </Link>

        <Suspense fallback={
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
          </div>
        }>
          <LoginContent />
        </Suspense>
      </div>

    </div>
  );
}
