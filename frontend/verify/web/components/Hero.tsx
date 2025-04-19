"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-800 py-20 sm:py-28 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Verify your bills with <span className="text-blue-300">blockchain</span> security
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Protect yourself from fraudulent bills and scams with our secure bill verification system powered by blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="#verify-section" 
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-lg text-center transition-colors text-lg shadow-lg"
              >
                Verify a Bill
              </Link>
              <Link 
                href="/how-it-works" 
                className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold py-3 px-8 rounded-lg text-center transition-colors text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md h-80 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Image
                src="/eureka.jpg"
                alt="Eureka Verification"
                fill
                style={{ objectFit: 'contain', borderWidth: '1px' }}
                className="drop-shadow-2xl filter brightness-110 border border-gray-300"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 