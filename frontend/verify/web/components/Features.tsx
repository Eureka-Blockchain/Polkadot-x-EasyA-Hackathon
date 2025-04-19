"use client";

import { 
  ShieldCheckIcon,
  DocumentCheckIcon, 
  ClockIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Secure Verification',
    description:
      'Verify bills using blockchain technology for tamper-proof security and peace of mind.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Quick & Easy',
    description:
      'Simply enter a bill code or hash to instantly check if it is legitimate.',
    icon: ClockIcon,
  },
  {
    name: 'QR Code Support',
    description:
      'Scan QR codes on bills for automatic verification without manual entry.',
    icon: QrCodeIcon,
  },
  {
    name: 'Detailed Information',
    description:
      'View verified bill details including amount due, due date, and payment information.',
    icon: DocumentCheckIcon,
  },
];

export default function Features() {
  return (
    <div className="bg-white py-16" id="learn-more">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Why Use Eureka?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our blockchain-powered verification system ensures that you only pay legitimate bills
            and protects you from scams.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.name} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-800 text-center">{feature.name}</h3>
              <p className="mt-3 text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 