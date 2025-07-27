'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Providers from '../providers';

export default function Register() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/register', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();

    if (result.success) {
      router.push('/login');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <Providers>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%223%22 fill=%22rgba(255,255,255,0.2)%22/%3E%3C/svg%3E')] animate-pulse opacity-20 pointer-events-none" />
        <div className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-500 hover:shadow-2xl z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl pointer-events-none" />
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 relative z-20">Create Your Account</h1>
          {error && (
            <p className="text-red-500 bg-red-100/50 border border-red-300 rounded-md p-3 mb-6 text-center animate-pulse relative z-20">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center">
                <svg className="absolute left-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="flex items-center">
                <svg className="absolute left-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m0 0c0 1.1.9 2 2 2s2-.9 2-2-2-4-2-4zm0 0h4m-8 0H4m8 4v4m-4-8V5a2 2 0 012-2h4a2 2 0 012 2v4"></path>
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 font-semibold relative z-20"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600 relative z-20">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200 cursor-pointer pointer-events-auto relative z-30">
              Login
            </a>
          </p>
        </div>
      </div>
    </Providers>
  );
}