"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image 
              src="/eureka.jpg" 
              alt="Eureka Logo" 
              fill 
              className="object-contain border border-gray-300" 
              style={{ borderWidth: '1px' }}
            />
          </div>
          <span className="font-bold text-2xl text-blue-600">Eureka</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700 hover:text-blue-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8">
            <li>
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 font-medium">
                Pricing
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-4 border-t border-gray-100">
          <ul className="flex flex-col px-4">
            <li>
              <Link 
                href="/" 
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/how-it-works" 
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link 
                href="/pricing" 
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link 
                href="/login" 
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </li>
            <li className="mt-2">
              <Link 
                href="/signup" 
                className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
} 