import { expect } from 'chai';
import { ethers } from 'ethers';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('EurekaInvoiceRegistry contract interactions', function () {
  let provider, wallet, registry, hashcode, fakeSha256;

  before(function () {
    // Setup
    provider = new ethers.JsonRpcProvider('https://westend-asset-hub-eth-rpc.polkadot.io');
    wallet = new ethers.Wallet('0x6ce45e8de32eccf14a849b6a76c1173cb9f3f12aa8af09a33b275ef740829c33', provider);

    // Example: Read file in a `contracts` folder one level up
    const filePath = path.join(__dirname, '../contracts/contract_abi.json');

    const abi = JSON.parse(
        fs.readFileSync(filePath, 'utf8')
    );

    const contractAddress = '0x7471244dc30c0bf17e7861dc4a4468c53a071090';
    registry = new ethers.Contract(contractAddress, abi, wallet);

    // Static test data
    hashcode = 'INV-1234-5678';
    fakeSha256 = '3c3bfd7816919b1fd4c672cd71bf1e9247aa8f28a3ef7fda1dfe8bfcf650e1e2d2ec4f110751cd93b2512080e1f4b1fff1de9536fd75a66a64e00c367ffac0d7f4e876f7e4aa568973c243fd6fe8105638a56d9db108ece312133c86e58d52975813c639c71f57cab672b60a6bc5552d092b15d1a081f216c0d0fc5b56452f23e50a0eb4a16c950edf446a494586849b837b969daecfb2acc7c4e41677fc63a4159af535c9553365cc037fc9b802b22780dddb01e698c0471c48175cf5e11e2a7829fe1c8ed6e1c00b234b2e49afd38cee9b7747a46d729e4fdbbe3e298b2d4a821213f6e363aa49ddb0d25eb172b395d52d636392797bd8a931c14df9687052b5282c1de640eed12bb015e6666dea31f97573bb300ab9845beb71566149e26a19c0c95004acb50c516bcc08265484a19d798cad8a1b1dbbd865292244da212e';
  });

  it('should submit an invoice', async function () {
    const tx = await registry.submitInvoice(fakeSha256, hashcode);
    await tx.wait();
    const invoice = await registry.getInvoice(hashcode);
    expect(invoice.hashcode).to.equal(hashcode);
    expect(invoice.issuer).to.equal(wallet.address);
  });

  it('should revoke the invoice', async function () {
    const tx = await registry.revokeInvoice(hashcode);
    await tx.wait();
    const invoice = await registry.getInvoice(hashcode);
    expect(invoice.revoked).to.equal(true);
  });

  it('should fail to complete a revoked invoice', async function () {
    await expect(registry.completeInvoice(hashcode)).to.be.revertedWithCustomError(
      registry,
      'AlreadyRevoked'
    );
  });

  it('should read the invoice metadata', async function () {
    const invoice = await registry.getInvoice(hashcode);
    expect(invoice.hash).to.equal(fakeSha256);
    expect(invoice.revoked).to.equal(true);
  });
});