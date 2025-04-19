"use client";

import React from 'react';

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-4xl font-bold mb-2">How Eureka Works — <span className="font-bold text-blue-600">Issuer Portal</span></h1>
      <p className="text-xl text-gray-600 mb-6">
        <em>For utilities, SaaS vendors, and any business that sends invoices.</em>
      </p>
      
      <hr className="my-8 border-gray-200" />
      
      {/* Section 1: On-boarding */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. On‑boarding Your Company</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left border border-gray-200 font-semibold">Step</th>
                <th className="py-3 px-4 text-left border border-gray-200 font-semibold">Action</th>
                <th className="py-3 px-4 text-left border border-gray-200 font-semibold">Outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 border border-gray-200 font-semibold">1.1 Create account</td>
                <td className="py-3 px-4 border border-gray-200">Fill out the sign‑up form with company‑legal name, contact e‑mail, and preferred <strong>wallet address</strong> (Polkadot).</td>
                <td className="py-3 px-4 border border-gray-200">Account appears in <strong>"Pending Review"</strong> state.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-200 font-semibold">1.2 KYC / business proof</td>
                <td className="py-3 px-4 border border-gray-200">Upload cert of incorporation or VAT number.</td>
                <td className="py-3 px-4 border border-gray-200">Eureka compliance team reviews within 24 h.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-200 font-semibold">1.3 Manual approval</td>
                <td className="py-3 px-4 border border-gray-200">Eureka admin presses <strong>Approve → Add Signer</strong>.</td>
                <td className="py-3 px-4 border border-gray-200">Your wallet is added to the <code>authorized_signers</code> set in the on‑chain <strong>Eureka</strong> contract; dashboard flips to <strong>Verified</strong>.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-200 font-semibold">1.4 Multi‑sig (optional)</td>
                <td className="py-3 px-4 border border-gray-200">Add extra wallet addresses; portal auto‑creates a 2‑of‑3 multisig on Asset Hub.</td>
                <td className="py-3 px-4 border border-gray-200">Safer key management; any authorised signer can publish invoices.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 p-4 my-6 border-l-4 border-blue-500">
          <p className="font-semibold">Security model:</p>
          <p className="italic">Only wallets in the on‑chain signer set can store hashes.</p>
          <p>If you lose a key, the Eureka admin can revoke it and add a new one without redeploying the contract.</p>
        </div>
      </section>
      
      <hr className="my-8 border-gray-200" />
      
      {/* Section 2: Publishing an Invoice */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. Publishing an Invoice</h2>
        
        <ol className="space-y-6">
          <li>
            <p className="font-semibold">Log in → "New Invoice"</p>
            <p>Upload the PDF (or drag‑drop multiple files).</p>
          </li>
          
          <li>
            <p className="font-semibold">Browser canonicalises & hashes</p>
            <ul className="list-disc ml-6">
              <li>Strips the previous stamp area if re‑issued.</li>
              <li>Computes SHA‑256 <em>locally</em>—file never leaves the browser.</li>
            </ul>
          </li>
          
          <li>
            <p className="font-semibold">Smart‑contract write</p>
            <ul className="list-disc ml-6">
              <li>Portal signs a <code>addInvoice(hash, amount, payee, dueDate)</code> call with your wallet.</li>
              <li>Hash + metadata immutably stored on <strong>Polkadot Asset Hub</strong>.</li>
            </ul>
          </li>
          
          <li>
            <p className="font-semibold">Automatic stamping</p>
            <ul className="list-disc ml-6">
              <li>Backend overlays:
                <ul className="list-disc ml-6">
                  <li>QR code (links to verifier)</li>
                  <li>Short‑code <code>HB‑AB12‑34CD</code></li>
                  <li>Tiny "Verified by Eureka" badge</li>
                </ul>
              </li>
              <li>Stamped PDF returned to browser for download / e‑mail.</li>
            </ul>
          </li>
          
          <li>
            <p className="font-semibold">Dashboard update</p>
            <ul className="list-disc ml-6">
              <li>Tile turns green with on‑chain tx hash.</li>
              <li>"Copy link" and "Download stamped PDF" buttons appear.</li>
            </ul>
          </li>
        </ol>
      </section>
      
      <hr className="my-8 border-gray-200" />
      
      {/* Section 3: Tracking & Reconciling */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3. Tracking & Reconciling</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left border border-gray-200 font-semibold">Feature</th>
                <th className="py-3 px-4 text-left border border-gray-200 font-semibold">What it gives you</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 border border-gray-200 font-semibold">Invoice timeline</td>
                <td className="py-3 px-4 border border-gray-200">See <code>Added</code>, <code>Paid</code>, or <code>Overdue</code> status in real time—pulled from the Eureka contract events.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-200 font-semibold">Bulk CSV export</td>
                <td className="py-3 px-4 border border-gray-200">Download list of invoice IDs, amounts, paid timestamps for accounting upload.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-200 font-semibold">Webhook / Slack alert</td>
                <td className="py-3 px-4 border border-gray-200">Get a ping the moment a customer pays on chain.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-200 font-semibold">Key‑rotation panel</td>
                <td className="py-3 px-4 border border-gray-200">Revoke or add signer wallets without filing a support ticket.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <hr className="my-8 border-gray-200" />
      
      {/* Section 4: Behind the Scenes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4. Behind the Scenes</h2>
        
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-inner">
          <div className="flex justify-center items-center">
            <img 
              src="/how-it-works.png" 
              alt="Eureka Workflow Diagram" 
              className="max-w-full h-auto"
            />
          </div>
        </div>
        
        <p className="italic">
          All sensitive docs stay client‑side; only the <strong>32‑byte hash</strong> and metadata hit the blockchain.
        </p>
      </section>
      
      <hr className="my-8 border-gray-200" />
      
      {/* Section 5: FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">5. FAQ (Issuer Version)</h2>
        
        <div className="space-y-6">
          <div>
            <p className="font-semibold">Q: <em>Can someone else publish a hash pretending to be us?</em></p>
            <p><strong>A:</strong> No—<code>addInvoice()</code> rejects calls from wallets not in the signer set.</p>
            <p>Revoke lost keys instantly from the portal.</p>
          </div>
          
          <div>
            <p className="font-semibold">Q: <em>What if I need to cancel an invoice?</em></p>
            <p>Call <strong>Revoke</strong> in the dashboard; contract marks it <code>Cancelled</code> (cannot be reused).</p>
            <p>Customers scanning the QR will see a red "Cancelled" badge.</p>
          </div>
          
          <div>
            <p className="font-semibold">Q: <em>Do I pay gas fees?</em></p>
            <p>Yes, but they're tiny (≈ $0.01 per invoice).</p>
            <p>You can pre‑fund your multisig from the portal.</p>
          </div>
        </div>
      </section>
      
      <hr className="my-8 border-gray-200" />
      
      {/* Section 6: Next Steps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">6. Next Steps</h2>
        
        <ol className="list-decimal ml-6 space-y-2">
          <li><strong>Create your issuer account</strong> – takes 2 minutes.</li>
          <li>Upload your first invoice and send the stamped PDF to yourself as a test.</li>
          <li>Roll out to customers—enjoy fraud‑proof billing!</li>
        </ol>
        
        <div className="mt-6">
          <p><em>Questions?</em> Ping <code>onboarding@eureka.xyz</code>—we'll get you verified fast.</p>
        </div>
      </section>
    </div>
  );
} 