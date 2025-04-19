"use client";

import React from 'react';
import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the plan that works best for your business. All plans include our secure blockchain stamping technology.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Basic Plan */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-transform hover:transform hover:scale-105">
          <div className="bg-gray-50 p-6">
            <h3 className="text-2xl font-bold text-gray-800">Basic</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-extrabold text-gray-900">$29</span>
              <span className="ml-1 text-xl text-gray-500">/month</span>
            </div>
            <p className="mt-5 text-gray-600">Perfect for startups and small businesses</p>
          </div>
          <div className="p-6 space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>100 document stamps per month</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>5 GB storage</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Email support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Basic verification portal</span>
              </li>
            </ul>
            <Link 
              href="/signup?plan=basic" 
              className="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start with Basic
            </Link>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-blue-500 transform scale-105">
          <div className="bg-blue-50 p-6 relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white py-1 px-4 text-sm font-bold rounded-bl-lg">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Professional</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-extrabold text-gray-900">$79</span>
              <span className="ml-1 text-xl text-gray-500">/month</span>
            </div>
            <p className="mt-5 text-gray-600">Ideal for growing businesses</p>
          </div>
          <div className="p-6 space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>500 document stamps per month</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>25 GB storage</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority email & chat support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced verification portal</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>API access</span>
              </li>
            </ul>
            <Link 
              href="/signup?plan=professional" 
              className="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start with Professional
            </Link>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-transform hover:transform hover:scale-105">
          <div className="bg-gray-50 p-6">
            <h3 className="text-2xl font-bold text-gray-800">Enterprise</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-extrabold text-gray-900">$199</span>
              <span className="ml-1 text-xl text-gray-500">/month</span>
            </div>
            <p className="mt-5 text-gray-600">For large-scale operations</p>
          </div>
          <div className="p-6 space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited document stamps</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>100 GB storage</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>24/7 priority support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Custom verification portal</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced API with higher rate limits</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Dedicated account manager</span>
              </li>
            </ul>
            <Link 
              href="/signup?plan=enterprise" 
              className="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start with Enterprise
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl mb-3">What is included in each stamp?</h3>
            <p className="text-gray-600">Each stamp includes secure blockchain registration, a unique QR code for verification, and permanent immutable record of your document.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl mb-3">Can I upgrade or downgrade my plan?</h3>
            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl mb-3">Do unused stamps roll over?</h3>
            <p className="text-gray-600">No, unused stamps do not roll over to the next month. They reset at the beginning of each billing cycle.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl mb-3">Is there a free trial available?</h3>
            <p className="text-gray-600">Yes, all new accounts can try the Professional plan features for 14 days before choosing a subscription.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mt-16 bg-blue-50 p-8 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Contact our team to discuss your specific requirements and we'll create a tailored plan for your organization.
        </p>
        <Link 
          href="/contact" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
        >
          Contact Sales
        </Link>
      </section>
    </div>
  );
} 