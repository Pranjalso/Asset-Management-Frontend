'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/src/providers/AuthProvider';

import { Toaster } from 'react-hot-toast';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  'your_google_oauth_client_id_here.apps.googleusercontent.com';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Toaster position="bottom-right" />
        {children}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
