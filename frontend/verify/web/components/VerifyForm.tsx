"use client";

import { FormEvent, useState, useRef, ChangeEvent } from 'react';

export default function VerifyForm() {
  const [hash, setHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isComputingHash, setIsComputingHash] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [verificationResult, setVerificationResult] = useState<null | {
    isValid: boolean;
    status: 'paid' | 'unpaid';
    amount?: string;
    dueDate?: string;
    payee?: string;
  }>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hash.trim()) return;

    setIsVerifying(true);
    setVerificationResult(null);
    
    // TODO: Replace with actual blockchain verification logic
    setTimeout(() => {
      // Simulated response for now
      setVerificationResult({
        isValid: true,
        status: 'unpaid',
        amount: '$124.50',
        dueDate: '2025-05-15',
        payee: '0x1234...5678'
      });
      setIsVerifying(false);
    }, 1500);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploadedFile(file);
    await computeHash(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploadedFile(file);
    await computeHash(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const computeHash = async (file: File) => {
    setIsComputingHash(true);
    
    try {
      // Read the file as an ArrayBuffer
      const buffer = await file.arrayBuffer();
      
      // Use the Web Crypto API to compute the SHA-256 hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      
      // Convert the hash to a hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHash(hashHex);
    } catch (error) {
      console.error('Error computing hash:', error);
      alert('Error computing hash. Please try again.');
    } finally {
      setIsComputingHash(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div id="verify-section" className="w-full max-w-md mx-auto relative">
      {/* Light blue glow effect in the background */}
      <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-3xl opacity-50 -z-10"></div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Verify Your Bill</h2>
        
        <div className="mb-6">
          <label htmlFor="hash" className="block text-gray-700 text-sm font-medium mb-2">
            Enter Bill Hash or Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="hash"
              placeholder="Enter you Hashcode here: XXXX-YYYY"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">Enter the unique hash or code found on your bill</p>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isVerifying || isComputingHash}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isVerifying ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : 'Verify Bill'}
          </button>
        </div>

        {verificationResult && (
          <div className="mt-8 p-5 rounded-lg border animate-fadeIn">
            <div className={`text-center mb-4 font-bold text-lg ${
              verificationResult.isValid 
                ? verificationResult.status === 'paid' 
                  ? 'text-green-600' 
                  : 'text-blue-600'
                : 'text-red-600'
            }`}>
              {!verificationResult.isValid && (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Invalid Bill
                </div>
              )}
              {verificationResult.isValid && verificationResult.status === 'paid' && (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Valid Bill - PAID
                </div>
              )}
              {verificationResult.isValid && verificationResult.status === 'unpaid' && (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Valid Bill - UNPAID
                </div>
              )}
            </div>
            
            {verificationResult.isValid && (
              <div className="space-y-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Amount:</span> 
                  <span className="font-bold text-xl">{verificationResult.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Due Date:</span> 
                  <span>{verificationResult.dueDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Payee:</span> 
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{verificationResult.payee}</span>
                </div>
                
                {verificationResult.status === 'unpaid' && (
                  <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Pay Now
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </form>
      
      <div 
        className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="font-medium">Upload PDF or drag and drop</span>
          </div>
          <p className="text-xs text-gray-500">Only PDF files are supported</p>
          
          {isComputingHash && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm text-blue-500">Computing hash...</span>
            </div>
          )}
          
          {uploadedFile && !isComputingHash && (
            <div className="mt-3">
              <div className="bg-blue-50 p-2 rounded text-sm flex items-center gap-2 max-w-full overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="truncate" title={uploadedFile.name}>{uploadedFile.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 