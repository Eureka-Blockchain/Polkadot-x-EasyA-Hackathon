import { ethers } from 'ethers';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Load contract ABI
const abi = JSON.parse(
  fs.readFileSync('../contracts/EurekaInvoiceRegistry.json', 'utf8')
).abi;

// ENV: RPC_URL + PRIVATE_KEY
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract setup
const contractAddress = process.env.CONTRACT_ADDRESS; // Change to deployed address
const registry = new ethers.Contract(contractAddress, abi, wallet);

// Sample invoice data
const hashcode = 'INV-1234-5678';
const fakeSha256 = '3c3bfd7816919b1fd4c672cd71bf1e9247aa8f28a3ef7fda1dfe8bfcf650e1e2d2ec4f110751cd93b2512080e1f4b1fff1de9536fd75a66a64e00c367ffac0d7f4e876f7e4aa568973c243fd6fe8105638a56d9db108ece312133c86e58d52975813c639c71f57cab672b60a6bc5552d092b15d1a081f216c0d0fc5b56452f23e50a0eb4a16c950edf446a494586849b837b969daecfb2acc7c4e41677fc63a4159af535c9553365cc037fc9b802b22780dddb01e698c0471c48175cf5e11e2a7829fe1c8ed6e1c00b234b2e49afd38cee9b7747a46d729e4fdbbe3e298b2d4a821213f6e363aa49ddb0d25eb172b395d52d636392797bd8a931c14df9687052b5282c1de640eed12bb015e6666dea31f97573bb300ab9845beb71566149e26a19c0c95004acb50c516bcc08265484a19d798cad8a1b1dbbd865292244da212e';

// Submit invoice
async function submitInvoice() {
  const tx = await registry.submitInvoice(fakeSha256, hashcode);
  console.log(`📝 Submitted. Tx Hash: ${tx.hash}`);
  await tx.wait();
  console.log('✅ Invoice submitted.');
}

// Revoke invoice
async function revokeInvoice() {
  const tx = await registry.revokeInvoice(hashcode);
  console.log(`❌ Revoke sent. Tx Hash: ${tx.hash}`);
  await tx.wait();
  console.log('✅ Invoice revoked.');
}

// Complete invoice
async function completeInvoice() {
  const tx = await registry.completeInvoice(hashcode);
  console.log(`💰 Completion sent. Tx Hash: ${tx.hash}`);
  await tx.wait();
  console.log('✅ Invoice marked as completed.');
}

// Read invoice
async function readInvoice() {
  const invoice = await registry.getInvoice(hashcode);
  console.log('📦 Invoice:', invoice);
}