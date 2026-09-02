'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import type { DashboardLoginCredentials } from '@/src/types';

interface DashboardLoginFormProps {
  onSubmit: (credentials: DashboardLoginCredentials) => Promise<void> | void;
  onGoogleLogin: (credential: string) => Promise<void> | void;
  loading?: boolean;
  googleLoading?: boolean;
  error?: string | null;
}

export default function DashboardLoginForm({
  onSubmit,
  onGoogleLogin,
  loading = false,
  googleLoading = false,
  error = null,
}: DashboardLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      onGoogleLogin(credentialResponse.credential);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  return (
    <div className="flex-1 bg-white rounded-xl flex items-center justify-center px-8 py-10 overflow-y-auto">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-start mb-1">
          <Image src="/Image/icon.svg" alt="Flutterflirt" width={42} height={40} style={{ width: "auto", height: "auto" }} />
          <span className="text-xs text-gray-500 font-medium mt-1">Flutterflirt</span>
        </div>

        <h2 className="text-[28px] font-light text-gray-400 mt-4 mb-7">
          Dashboard Log in
        </h2>

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-5 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
            width={320}
            logo_alignment="left"
          />
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-gray-400">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="dashboard-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E mail
            </label>
            <input
              id="dashboard-email"
              type="email"
              placeholder="E mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] focus:border-transparent transition-shadow"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="dashboard-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="dashboard-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] focus:border-transparent transition-shadow pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-[#1A7DE8] hover:bg-[#1669C9] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white font-semibold py-3 rounded-md"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
