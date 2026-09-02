'use client';

import { AuthNavbar, HeroImage, LoginForm } from '@/src/components/features/auth';
import { useLogin } from '@/src/hooks';

export default function LoginPage() {
  const { login, loading, error } = useLogin();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AuthNavbar />
      <div className="flex-1 flex overflow-hidden bg-gray-100 p-4 md:p-6 gap-4 md:gap-6">
        <HeroImage />
        <LoginForm title="Admin Log in" onSubmit={login} loading={loading} error={error} />
      </div>
    </div>
  );
}
