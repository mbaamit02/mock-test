'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Providers from '../providers';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null; // Redirect handled by useEffect
  }

  return (
    <Providers>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%223%22 fill=%22rgba(255,255,255,0.2)%22/%3E%3C/svg%3E')] animate-pulse opacity-20 pointer-events-none" />
        <div className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-500 hover:shadow-2xl z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl pointer-events-none" />
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 relative z-20">Welcome to Your Dashboard</h1>
          <div className="space-y-4 relative z-20">
            <p className="text-center text-gray-700">Hello, <span className="font-semibold">{session.user.name || 'User'}</span>!</p>
            <p className="text-center text-gray-600">Email: {session.user.email}</p>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 rounded-lg hover:from-red-600 hover:to-pink-700 focus:ring-4 focus:ring-red-300 transition-all duration-300 font-semibold relative z-20"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Providers>
  );
}