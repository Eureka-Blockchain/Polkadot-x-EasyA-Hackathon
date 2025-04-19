"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'company' | 'user'>('company');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate form
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Check for dummy account credentials
    if (formData.email === 'dummy@eureka.com' && formData.password === 'Monday100') {
      // Go directly to dashboard for dummy account
      setTimeout(() => {
        setIsLoading(false);
        router.push('/dashboard');
      }, 1000);
      return;
    }

    try {
      await login(formData, userType);
      // Login successful - navigation handled by auth context
    } catch (err: any) {
      setIsLoading(false);
      
      // Handle network errors specially
      if (err.isNetworkError) {
        console.log("Network error during login - using fallback mode");
        try {
          // Try to login again - the fetch wrapper should handle fallbacks
          await login(formData, userType);
          return; // If successful, exit
        } catch (fallbackErr: any) {
          // If even the fallback fails, show error
          setError(`Could not connect to server. Please try again later. (${fallbackErr.message || 'Unknown error'})`);
        }
      } else {
        // Show specific error message if available
        setError(err.message || 'Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-screen py-16 flex flex-col items-center">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Log In to Eureka</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login as
            </label>
            <div className="flex space-x-4">
              <div>
                <input 
                  type="radio" 
                  id="company" 
                  name="userType" 
                  value="company"
                  checked={userType === 'company'}
                  onChange={() => setUserType('company')}
                  className="mr-2"
                />
                <label htmlFor="company">Company</label>
              </div>
              <div>
                <input 
                  type="radio" 
                  id="user" 
                  name="userType" 
                  value="user"
                  checked={userType === 'user'}
                  onChange={() => setUserType('user')}
                  className="mr-2"
                />
                <label htmlFor="user">User</label>
              </div>
            </div>
          </div>
          
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 