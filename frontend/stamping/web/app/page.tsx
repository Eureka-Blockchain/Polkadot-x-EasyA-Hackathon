import React from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Hero 
        title="Secure Your Documents with Blockchain Technology"
        subtitle="Create an account to start stamping your PDFs with immutable blockchain verification"
        buttonText="Sign Up Now"
        buttonLink="/signup"
      />
      
      <section id="features" className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Stamping Service?</h2>
          <Features />
        </div>
      </section>
      
      <section id="how-it-works" className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Create an Account</h3>
              <p className="text-gray-600">Sign up for an Eureka account to get started with our document stamping service.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Upload Your PDF</h3>
              <p className="text-gray-600">Upload your PDF document to our secure platform for stamping.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Receive Verified Document</h3>
              <p className="text-gray-600">Get your document back with a cryptographic stamp that proves authenticity and timestamp.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to secure your documents?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of companies protecting their important documents with our enterprise-grade stamping service.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/signup" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
            >
              Sign Up Now
            </Link>
            <Link 
              href="/login" 
              className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 