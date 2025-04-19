"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-800">Eureka</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Blockchain-powered bill verification to prevent fraud and ensure payment authenticity.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-800">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#verify-section" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Verify
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-800">Contact</h3>
            <p className="text-gray-600 leading-relaxed">
              Questions? <br />
              <a href="mailto:info@eureka.com" className="text-blue-600 hover:underline">
                info@eureka.com
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Eureka. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 