"use client";

import React from "react";

export default function HowItWorksClient() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl bg-white">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-blue-700">How Eureka Works</h1>
        
        <p className="text-xl text-center mb-8 text-gray-700">
          Invoice fraud costs businesses <strong className="text-red-600">$26 B every year</strong>.
          <br />
          Eureka stops it with a 2‑second QR‑scan powered by <span className="text-blue-600">Polkadot Asset Hub</span>.
        </p>
        
        <hr className="my-8 border-gray-300" />
        
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">1. Issuer Prints a Tamper‑Proof Code</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-4 text-left border border-gray-300 font-semibold text-gray-900">Step</th>
                  <th className="p-4 text-left border border-gray-300 font-semibold text-gray-900">What Happens</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900"><strong>1.1 Create invoice</strong></td>
                  <td className="p-4 border border-gray-300 text-gray-900">Finance team exports their normal PDF.</td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900"><strong>1.2 Hash with Eureka CLI</strong></td>
                  <td className="p-4 border border-gray-300 text-gray-900">
                    <code className="bg-gray-100 p-1 px-2 rounded">eureka mint invoice.pdf</code> → generates a SHA‑256 hash 
                    <br />and publishes it on chain.
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900"><strong>1.3 Stamp & send</strong></td>
                  <td className="p-4 border border-gray-300 text-gray-900">
                    CLI adds a QR + short‑code (e.g. <code className="bg-gray-100 p-1 px-2 rounded">HB‑4F7C‑02A1</code>) 
                    <br />to the footer, then emails / prints the bill.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="mt-6 italic bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 text-gray-800">
            Only wallets holding the "Verified Issuer" token can publish hashes → no outsider spam.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">2. Customer Verifies in Two Seconds</h2>
          
          <ol className="list-decimal pl-6 mb-6 space-y-3 text-gray-800">
            <li className="text-lg"><strong className="text-gray-900">Scan the QR</strong> (or type the short‑code at <em className="text-blue-600">verify.eureka.xyz</em>).</li>
            <li className="text-lg">Eureka fetches the on‑chain record and shows one of three badges:</li>
          </ol>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-4 text-left border border-gray-300 font-semibold text-gray-900">Badge</th>
                  <th className="p-4 text-left border border-gray-300 font-semibold text-gray-900">Meaning</th>
                  <th className="p-4 text-left border border-gray-300 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900">✅ <strong>Valid • Unpaid</strong></td>
                  <td className="p-4 border border-gray-300 text-gray-900">Fresh invoice from the official wallet.</td>
                  <td className="p-4 border border-gray-300 text-gray-900">Pay normally.</td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900">✅ <strong>Valid • Paid</strong></td>
                  <td className="p-4 border border-gray-300 text-gray-900">Already settled on chain.</td>
                  <td className="p-4 border border-gray-300 text-gray-900">Ignore duplicates.</td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900">❌ <strong>Unknown Invoice</strong></td>
                  <td className="p-4 border border-gray-300 text-gray-900">Hash not in Eureka registry.</td>
                  <td className="p-4 border border-gray-300 text-gray-900">Suspected fraud; bin it.</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="mt-6 bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400 text-gray-800">
            No wallet or plugin needed—just a phone camera.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">3. Why It's Bullet‑Proof</h2>
          
          <ul className="list-disc pl-6 space-y-4 text-gray-800">
            <li className="text-lg"><strong className="text-gray-900">Immutable hashes</strong> – change one pixel, the hash changes, verification fails.</li>
            <li className="text-lg"><strong className="text-gray-900">On‑chain identity</strong> – only the utility's multisig can write; contract address is hard‑coded in every QR.</li>
            <li className="text-lg"><strong className="text-gray-900">Open audit trail</strong> – anyone can view the <code className="bg-gray-100 p-1 px-2 rounded">InvoiceAdded</code> / <code className="bg-gray-100 p-1 px-2 rounded">InvoicePaid</code> events on Polkadot explorers.</li>
            <li className="text-lg"><strong className="text-gray-900">Low fees at scale</strong> – storing a 32‑byte hash on Asset Hub costs &lt; $0.01.</li>
          </ul>
        </section>
        
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">4. Under the Hood</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-4 text-left border border-gray-300 font-semibold text-gray-900">Component</th>
                  <th className="p-4 text-left border border-gray-300 font-semibold text-gray-900">Tech</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900">Smart contract</td>
                  <td className="p-4 border border-gray-300 text-gray-900">ink! 5 on Polkadot Asset Hub</td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900">Hashing</td>
                  <td className="p-4 border border-gray-300 text-gray-900">SHA‑256 in browser & CLI</td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900">Data store</td>
                  <td className="p-4 border border-gray-300 text-gray-900">Mapping &lt;hash ⇒ {`{amount, payee, due, paid}`}&gt;</td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900">Front‑end</td>
                  <td className="p-4 border border-gray-300 text-gray-900">Next.js 14, Tailwind, <code className="bg-gray-100 p-1 px-2 rounded">@polkadot/api-contract</code></td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="p-4 border border-gray-300 text-gray-900">Optional extras</td>
                  <td className="p-4 border border-gray-300 text-gray-900">IPFS pinning • Slack alerts • Zapier export</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">5. Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Does Eureka see my invoice data?</h3>
              <p className="text-gray-800">
                No. We store <strong>only the hash</strong> plus public metadata (amount, due‑date, payee address). 
                The PDF never leaves your browser unless you opt‑in to IPFS backup.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Can someone copy your name and fool users?</h3>
              <p className="text-gray-800">
                Names are cosmetic—the QR embeds our 32‑byte contract address and the verifier trusts only that address. 
                Impostor contracts are ignored.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-blue-600">What if my customer has no smartphone?</h3>
              <p className="text-gray-800">
                They can enter the short code on our web verifier or use the freephone IVR printed next to the QR.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 