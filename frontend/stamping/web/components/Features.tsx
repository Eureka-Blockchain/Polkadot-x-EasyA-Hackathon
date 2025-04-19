import React from 'react';

const features = [
  {
    title: 'Blockchain Verification',
    description: 'Documents are cryptographically stamped and stored on the blockchain, ensuring tamper-proof verification.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'Instant Processing',
    description: 'Our system processes your documents instantly, adding a secure timestamp and verification signature.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Universal Compatibility',
    description: 'Works with all PDF documents, regardless of size or origin, maintaining the original formatting.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Enterprise API',
    description: 'Integrate our stamping service directly into your workflow with our robust and secure API.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {features.map((feature, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex">
          <div className="mr-4 flex-shrink-0">
            {feature.icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 