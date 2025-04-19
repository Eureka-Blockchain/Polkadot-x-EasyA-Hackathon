import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export default function Hero({ title, subtitle, buttonText, buttonLink }: HeroProps) {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
            {title}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md">
            {subtitle}
          </p>
          <Link 
            href={buttonLink} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
          >
            {buttonText}
          </Link>
        </div>
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md h-80 md:h-96">
            <Image
              src="/stamping-illustration.svg"
              alt="Document Stamping Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
} 