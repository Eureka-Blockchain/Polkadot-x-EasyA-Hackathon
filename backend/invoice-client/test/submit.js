import { expect } from 'chai';
import { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { submitInvoice } from '../scripts/submit.js'; // update path as needed
import dotenv from 'dotenv';

dotenv.config();

describe('EurekaInvoiceRegistry - submitInvoice()', function () {
  let registry;
  let deployer;
  let signer;
  let invoiceCode = 'INV-1234-5678';
  let tempPdfPath;

  before(async () => {
    // Get signers
    [deployer, signer] = await ethers.getSigners();

    // Deploy the contract
    const Registry = await ethers.getContractFactory('EurekaInvoiceRegistry');
    registry = await Registry.deploy(deployer.address);
    await registry.waitForDeployment();

    // Add signer to whitelist
    await registry.connect(deployer).addSigner(signer.address);

    // Create a temporary PDF file for testing
    const tempDir = path.resolve('./test/tmp');
    fs.mkdirSync(tempDir, { recursive: true });
    tempPdfPath = path.join(tempDir, 'test_invoice.pdf');
    fs.writeFileSync(tempPdfPath, 'Test Invoice PDF Content');
  });

  it('should submit a hashed invoice and emit InvoiceSubmitted', async () => {
    // Generate SHA-256 hash of the PDF
    const pdf = fs.readFileSync(tempPdfPath);
    const sha256 = '0x' + crypto.createHash('sha256').update(pdf).digest('hex');

    // Mock .env variables
    process.env.PRIVATE_KEY = '0x6ce45e8de32eccf14a849b6a76c1173cb9f3f12aa8af09a33b275ef740829c33' //signer.privateKey;
    process.env.RPC_URL = 'https://westend-asset-hub-eth-rpc.polkadot.io' //'http://127.0.0.1:8545'; // Hardhat node

    // Call the submission function
    await submitInvoice(tempPdfPath, invoiceCode, await registry.getAddress());

    // Verify on-chain data
    const invoice = await registry.getInvoice(invoiceCode);
    expect(invoice.hash).to.equal(sha256);
    expect(invoice.issuer).to.equal(signer.address);
    expect(invoice.revoked).to.equal(false);
    expect(invoice.completed).to.equal(false);
  });

  after(() => {
    if (tempPdfPath && fs.existsSync(tempPdfPath)) {
      fs.unlinkSync(tempPdfPath);
    }
  });
});