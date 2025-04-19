// Test script for submitting an invoice to the blockchain
require('dotenv').config();
const contractService = require('./services/contractService');
const crypto = require('crypto');

async function testSubmitInvoice() {
  console.log('Starting invoice submission test...');
  
  try {
    // Step 1: First validate the contract to ensure we can connect
    console.log('\n--- Validating Contract Connection ---');
    const validation = await contractService.validateContract();
    
    if (!validation.valid) {
      console.error('❌ Contract validation failed:', validation.error);
      console.error('Cannot proceed with submission test.');
      return;
    }
    
    console.log('✅ Contract validation successful');
    console.log('Account:', validation.connection.signer);
    console.log('Balance:', validation.connection.balance);
    
    // Step 2: Generate test invoice data
    console.log('\n--- Preparing Test Invoice ---');
    
    // Create a hash for testing (in a real app this would be a hash of the actual invoice data)
    const testInvoiceData = { 
      id: `test-${Date.now()}`,
      amount: 100.00,
      currency: 'USD',
      description: 'Test Invoice',
      date: new Date().toISOString()
    };
    
    // Create a hash of the test data
    const testDataString = JSON.stringify(testInvoiceData);
    let hash = '0x' + crypto.createHash('sha256').update(testDataString).digest('hex');
    
    // Create test URI (in a real app, this would be an IPFS URI)
    const uri = `ipfs://test/${hash}`;
    
    // Use the signer's address as the invoice address for this test
    const address = validation.connection.signer;
    
    console.log('Test Invoice Hash:', hash);
    console.log('Test Invoice URI:', uri);
    console.log('Test Invoice Address:', address);
    
    // Step 3: Check if hash already exists (to avoid duplicate submissions)
    console.log('\n--- Checking if Hash Already Exists ---');
    const exists = await contractService.shaExists(hash);
    
    if (exists) {
      console.log('⚠️ Hash already exists on chain! Using a different hash for testing...');
      // Modify the hash slightly to get a new one
      testInvoiceData.id = `test-${Date.now()}-modified`;
      const newTestDataString = JSON.stringify(testInvoiceData);
      hash = '0x' + crypto.createHash('sha256').update(newTestDataString).digest('hex');
      console.log('New Test Invoice Hash:', hash);
    } else {
      console.log('✅ Hash does not exist, ready to proceed');
    }
    
    // Step 4: Submit the invoice
    console.log('\n--- Submitting Invoice ---');
    console.log('Starting submission at:', new Date().toISOString());
    
    console.log('Please wait, this may take some time...');
    
    const result = await contractService.submitInvoice(hash, uri, address);
    
    console.log('✅ Invoice submitted successfully!');
    console.log('Transaction hash:', result.extrinsicHash);
    console.log('Block hash:', result.blockHash);
    console.log('Events:', result.events);
    
    // Step 5: Verify the invoice was stored properly
    console.log('\n--- Verifying Invoice Storage ---');
    console.log('Fetching invoice with hash:', hash);
    
    const invoice = await contractService.getInvoice(hash);
    
    console.log('Retrieved Invoice:');
    console.log('Hash:', invoice.hash);
    console.log('URI:', invoice.uri);
    console.log('Address:', invoice.address);
    console.log('Status:', invoice.status);
    console.log('Submission Time:', new Date(invoice.submissionTime).toISOString());
    
    console.log('\nTest completed successfully! Invoice has been submitted and stored on the blockchain.');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Execute the test
testSubmitInvoice()
  .catch(error => {
    console.error('Unhandled error:', error);
  })
  .finally(() => {
    console.log('\nTest completed.');
    // Keep process alive briefly to complete any pending operations
    setTimeout(() => process.exit(0), 3000);
  }); 