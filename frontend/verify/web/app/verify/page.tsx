import VerifyForm from '@/components/VerifyForm';

export default function VerifyPage() {
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bill Verification
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your bill hash or code to quickly verify its authenticity and ensure you're 
            paying a legitimate bill.
          </p>
        </div>
        
        <VerifyForm />
        
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How to Find Your Bill Hash
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <p className="text-gray-700">
                  <span className="font-medium">Look for the QR code</span> - Most bills will have a QR code that you can scan directly.
                </p>
              </li>
              <li>
                <p className="text-gray-700">
                  <span className="font-medium">Find the verification code</span> - Bills typically include a verification code in the format "XXXX-YYYY".
                </p>
              </li>
              <li>
                <p className="text-gray-700">
                  <span className="font-medium">Check for a full hash</span> - Some bills might display the complete blockchain hash.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 