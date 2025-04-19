"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UploadForm from '@/components/UploadForm';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [userData, setUserData] = useState({
    name: 'Dummy User',
    email: 'dummy@eureka.com',
    company: 'Demo Company',
    joinDate: new Date().toLocaleDateString()
  });
  
  // Add company verification state
  const [isCompanyVerified, setIsCompanyVerified] = useState(true);
  
  const [documents, setDocuments] = useState<any[]>([]);
  
  // Simulate loading some dummy documents after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDocuments([
        {
          id: 'doc-12345',
          name: 'Contract-2023.pdf',
          stamped: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: 'verified'
        },
        {
          id: 'doc-67890',
          name: 'Invoice-April2023.pdf',
          stamped: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: 'verified'
        }
      ]);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Toggle company verification status
  const toggleCompanyVerification = () => {
    setIsCompanyVerified(!isCompanyVerified);
  };
  
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {userData.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Company verification toggle (only for dummy user) */}
            {userData.email === 'dummy@eureka.com' && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Company Status:</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isCompanyVerified}
                    onChange={toggleCompanyVerification}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {isCompanyVerified ? 'Verified' : 'Unverified'}
                  </span>
                </label>
              </div>
            )}
            <div className="mt-4 md:mt-0 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg text-sm">
              Joined: {userData.joinDate}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {userData.name.charAt(0)}
                </div>
                <div className="mt-3">
                  <p className="font-medium">{userData.name}</p>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'upload' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Upload Document
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'history' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Document History
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'settings' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Account Settings
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link 
                  href="/" 
                  className="block text-red-600 hover:text-red-800 font-medium"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'upload' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Upload Document for Stamping</h2>
                  <p className="text-gray-600 mb-8">
                    Upload your PDF document to be stamped with blockchain verification. 
                    Each document will receive a unique identifier that can be used for verification.
                  </p>
                  
                  {!isCompanyVerified ? (
                    <div className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Company Verification Required</h3>
                      <p className="text-yellow-700 mb-4">
                        Before you can upload invoices, your company needs to be verified by the Eureka team.
                        Please provide the following documents:
                      </p>
                      <ul className="list-disc list-inside text-yellow-700 mb-4 space-y-1">
                        <li>Company incorporation documents</li>
                        <li>Links to tax registration</li>
                        <li>Valid company email verification</li>
                      </ul>
                      <button 
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                        onClick={() => setActiveTab('settings')}
                      >
                        Go to Account Settings
                      </button>
                    </div>
                  ) : (
                    <UploadForm />
                  )}
                </div>
              )}
              
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Document History</h2>
                  <p className="text-gray-600 mb-4">
                    View and manage all your previously stamped documents.
                  </p>
                  
                  {documents.length === 0 ? (
                    // Empty state
                    <div className="text-center py-16 border-2 border-dashed rounded-lg border-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Loading documents...</h3>
                      <div className="flex justify-center">
                        <div className="animate-pulse mt-4 h-5 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ) : (
                    // Document list
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stamped Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 flex-shrink-0 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                    <div className="text-sm text-gray-500">ID: {doc.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {doc.stamped}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {doc.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">Download</button>
                                <button className="text-blue-600 hover:text-blue-900">Verify</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  <p className="text-gray-600 mb-8">
                    Manage your account details and preferences.
                  </p>
                  
                  {!isCompanyVerified && (
                    <div className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Company Verification Required</h3>
                      <p className="text-yellow-700 mb-4">
                        Please upload the following documents to verify your company:
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Incorporation Document
                          </label>
                          <input
                            type="file"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax Registration Document
                          </label>
                          <input
                            type="file"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Information
                          </label>
                          <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            rows={4}
                            placeholder="Please provide any additional information about your company..."
                          />
                        </div>
                        <button 
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                          onClick={(e) => {
                            e.preventDefault();
                            // In a real app, this would submit the documents for review
                            // For the demo, we just toggle the verification status
                            if (userData.email === 'dummy@eureka.com') {
                              setIsCompanyVerified(true);
                            }
                          }}
                        >
                          Submit for Verification
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={userData.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={userData.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        defaultValue={userData.company}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="text-lg font-medium mb-4">Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 