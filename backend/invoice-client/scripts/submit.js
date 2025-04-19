import fs from 'fs';
import crypto from 'crypto';
import 'dotenv/config.js';
import { ethers } from 'ethers';

const abiJson = JSON.parse(
  fs.readFileSync(
    new URL('../artifacts/contracts/EurekaInvoiceRegistry.sol/EurekaInvoiceRegistry.json', import.meta.url),
    'utf8'
  )
);

/**
 * Submits an invoice to the EurekaInvoiceRegistry contract.
 * 
 * @param {string} pdf_path - Path to the invoice PDF file.
 * @param {string} invite_code - Invoice code (e.g., INV-XXXX-YYYY).
 * @param {string} reg_addr - Address of the deployed EurekaInvoiceRegistry contract.
 */
export async function submitInvoice(pdf_path, invite_code = 'INV-0000-0000', reg_addr = '0x7471244dc30c0bf17e7861dc4a4468c53a071090') {
  if (!pdf_path) throw new Error('Missing required parameter: pdf_path');

  // Read and hash the PDF
  const pdf = fs.readFileSync(pdf_path);
  const sha256 = '0x' + crypto.createHash('sha256').update(pdf).digest('hex');

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Sign raw SHA-256 bytes
  const sig = await signer.signMessage(ethers.getBytes(sha256));

  const registry = new ethers.Contract(reg_addr, abiJson.abi, signer);
  const tx = await registry.submitInvoice(sha256, invite_code, sig);
  console.log('⏳ waiting for confirmation…');
  await tx.wait();
  console.log('✅ invoice stored:', tx.hash);
}