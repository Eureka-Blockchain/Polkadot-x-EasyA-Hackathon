"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    registeredAddress: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'company' | 'user'>('company');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    // Form validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    // Check for dummy account
    if (formData.email === 'dummy@eureka.com' && formData.password === 'Monday100') {
      setTimeout(() => {
        setIsLoading(false);
        router.push('/dashboard');
      }, 1000);
      return;
    }

    try {
      // Call the signup function from AuthContext
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        registeredAddress: formData.registeredAddress
      }, userType);
      
      // Registration successful - navigation handled by auth context
    } catch (err: any) {
      setIsLoading(false);
      
      // Handle network errors specially
      if (err.isNetworkError) {
        console.log("Network error during signup - using fallback mode");
        try {
          // Try to sign up again - the fetch wrapper should handle fallbacks
          await signup({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            companyName: formData.companyName,
            registeredAddress: formData.registeredAddress
          }, userType);
          return; // If successful, exit
        } catch (fallbackErr: any) {
          // If even the fallback fails, show error
          setError(`Could not connect to server. Please try again later. (${fallbackErr.message || 'Unknown error'})`);
        }
      } else {
        // Show specific error message if available
        setError(err.message || 'An error occurred during registration');
      }
    }
  };

  // Function to fill in dummy account details for quick access (only visible in development)
  const useDummyAccount = () => {
    setFormData({
      name: 'Dummy User',
      email: 'dummy@eureka.com',
      password: 'Monday100',
      confirmPassword: 'Monday100',
      companyName: 'Demo Company',
      registeredAddress: '123 Demo Street, Demoville'
    });
  };

  return (
    <div className="min-h-screen py-16 flex flex-col items-center">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Create an Account</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register as
            </label>
            <div className="flex space-x-4 mb-4">
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
        
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
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
          
          {userType === 'company' && (
            <>
              <div className="mb-4">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name {userType === 'company' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Company"
                  required={userType === 'company'}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="registeredAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Registered Address
                </label>
                <textarea
                  id="registeredAddress"
                  name="registeredAddress"
                  value={formData.registeredAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company Address (Optional)"
                  rows={2}
                />
              </div>
            </>
          )}
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
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
            <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                  Privacy Policy
                </Link>
              </label>
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
                Creating account...
              </>
            ) : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Log in
            </Link>
          </p>
          
          {/* Hidden button only visible during development */}
          {process.env.NODE_ENV === 'development' && (
            <button 
              onClick={useDummyAccount} 
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline opacity-30 hover:opacity-100"
            >
              Dev only: Use test account
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 