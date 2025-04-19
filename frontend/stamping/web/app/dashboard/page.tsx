"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UploadForm from '@/components/UploadForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user, userType, logout } = useAuth();
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
  
  // Function to safely get the user name
  const getUserDisplayName = () => {
    if (!user) return '';
    if (userType === 'company' && 'name' in user) {
      return user.name;
    } else if (userType === 'user' && 'fullName' in user) {
      return user.fullName;
    }
    return '';
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* User info header */}
        <div className="bg-white shadow rounded-lg p-4 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Welcome{user ? `, ${getUserDisplayName()}` : ''}!</h2>
            <p className="text-gray-600 text-sm">{user?.email}</p>
          </div>
          <button 
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Existing dashboard content follows */}
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {/* Upload section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <p className="text-gray-600 mb-4">
            Upload a document to stamp it with blockchain technology.
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Select File
            </label>
            <p className="text-gray-500 mt-2 text-sm">Or drag and drop files here</p>
          </div>
        </div>
        
        {/* Recent documents section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stamped Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Contract-123.pdf</div>
                        <div className="text-sm text-gray-500">1.2 MB</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Jan 10, 2024</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Verified
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-indigo-600 hover:text-indigo-900">Download</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Invoice-456.pdf</div>
                        <div className="text-sm text-gray-500">0.8 MB</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Jan 8, 2024</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Verified
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-indigo-600 hover:text-indigo-900">Download</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Agreement-789.pdf</div>
                        <div className="text-sm text-gray-500">1.5 MB</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Jan 5, 2024</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-indigo-600 hover:text-indigo-900">Download</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 