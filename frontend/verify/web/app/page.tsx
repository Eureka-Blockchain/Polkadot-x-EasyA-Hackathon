"use client";

import Hero from '@/components/Hero';
import VerifyForm from '@/components/VerifyForm';
import Features from '@/components/Features';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Hero />
      
      <section className="py-16 bg-gray-50" id="verify-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Verify Your Bill Now
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your bill hash or code to quickly verify its authenticity
            </p>
          </div>
          <VerifyForm />
        </div>
      </section>
      
      <Features />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Receive Your Bill</h3>
              <p className="text-gray-600">Receive a bill with a unique hash or code from a company</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Enter the Hash</h3>
              <p className="text-gray-600">Enter the hash or scan the QR code on our website</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Verify and Pay</h3>
              <p className="text-gray-600">Confirm it's legitimate and pay with confidence</p>
            </div>
          </div>
          <div className="mt-10">
            <Link 
              href="/how-it-works" 
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Learn more about how Eureka works
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
