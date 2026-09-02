'use client';

import { DashboardAuthNavbar, DashboardHeroImage, DashboardLoginForm } from '@/src/components/features/dashboard-auth';
import { useDashboardLogin } from '@/src/hooks';

export default function DashboardLoginPage() {
  const { login, loginWithGoogle, loading, googleLoading, error } = useDashboardLogin();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DashboardAuthNavbar />

      <div className="flex-1 flex overflow-hidden bg-gray-100 p-4 md:p-6 gap-4 md:gap-6">
        <DashboardHeroImage />

        <DashboardLoginForm
          onSubmit={login}
          onGoogleLogin={loginWithGoogle}
          loading={loading}
          googleLoading={googleLoading}
          error={error}
        />
      </div>
    </div>
  );
}
