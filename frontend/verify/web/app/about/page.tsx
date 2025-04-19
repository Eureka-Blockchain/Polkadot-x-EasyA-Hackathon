import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About BillChain
          </h1>
          
          <div className="prose lg:prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              BillChain is a blockchain-powered bill verification system designed to protect businesses and 
              consumers from fraudulent bills and invoice scams.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">The Problem</h2>
            <p className="text-gray-600 mb-6">
              Invoice fraud is a growing problem globally, with billions lost each year to scammers. In the UK alone, 
              £1.2 billion was stolen from businesses through invoice fraud in 2022, while global losses from fraud 
              totaled nearly $500 billion in 2023.
            </p>
            <p className="text-gray-600 mb-6">
              Scammers use increasingly sophisticated methods to send fake bills that look legitimate, tricking 
              businesses and individuals into making payments to fraudulent accounts.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Solution</h2>
            <p className="text-gray-600 mb-6">
              BillChain leverages the power of blockchain technology to create an immutable verification system for bills and invoices:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-600">
              <li>Companies register bills on the blockchain with a unique hash</li>
              <li>Customers can verify the bill's authenticity by checking the hash</li>
              <li>The verification process confirms key details like amount, due date, and payee information</li>
              <li>QR codes make verification quick and easy</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Businesses</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Reduce risk of fraudulent payment redirection</li>
                  <li>Build customer trust through verified billing</li>
                  <li>Streamline payment processes</li>
                  <li>Reduce payment disputes</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Customers</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Easily verify bill authenticity</li>
                  <li>Avoid paying fraudulent bills</li>
                  <li>No need to remember multiple login portals</li>
                  <li>Peace of mind with each payment</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
              <p className="text-gray-600 mb-6">
                Verify your first bill now or learn more about how our system works.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/verify" 
                  className="bg-primary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md text-center transition-colors"
                >
                  Verify a Bill
                </Link>
                <a 
                  href="#" 
                  className="bg-white hover:bg-gray-50 text-primary border border-primary font-medium py-3 px-6 rounded-md text-center transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 