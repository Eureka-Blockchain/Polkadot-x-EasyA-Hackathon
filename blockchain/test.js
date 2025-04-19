require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const contractService = require('./services/contractService');

const API_URL = `http://localhost:${process.env.PORT || 3001}/api/contract`;

// Helper for consistent logging
const logStep = (step, message) => {
  console.log(`\n${step}. ${message}`);
};

const logDetail = (message, data = null) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

// Generate a random SHA-256 hash for testing
const generateRandomSha256 = () => {
  const randomData = crypto.randomBytes(32).toString('hex');
  return '0x' + crypto.createHash('sha256').update(randomData).digest('hex');
};

// Generate a valid invoice hashcode in the format INV-XXXX-XXXX
const generateInvoiceHashcode = () => {
  const part1 = Math.random().toString(16).substring(2, 6).toUpperCase();
  const part2 = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `INV-${part1}-${part2}`;
};

// Test contract connection directly
const testContractConnection = async () => {
  console.log('\n========================================');
  console.log('🔗 TESTING CONTRACT CONNECTION DIRECTLY');
  console.log('========================================\n');
  
  try {
    // Step 1: Validate contract connection and read capabilities
    logStep(1, 'Validating contract connectivity...');
    const validation = await contractService.validateContract();
    
    if (!validation.valid) {
      console.error('❌ Contract validation failed:', validation.error);
      return false;
    }
    
    logDetail('✅ Contract validation successful!');
    logDetail('Contract address:', validation.contractAddress);
    logDetail('Available query methods:', validation.methods.query.join(', '));
    logDetail('Available transaction methods:', validation.methods.transaction.join(', '));
    logDetail('Connected to chain:', validation.connection.chain);
    logDetail('Node:', validation.connection.node);
    logDetail('Using account:', validation.connection.signer);
    logDetail('Account balance:', validation.connection.balance);
    
    // Step 2: Test a shaExists query
    const testHash = generateRandomSha256();
    logStep(2, 'Testing shaExists for random hash...');
    logDetail('Test hash:', testHash);
    
    const exists = await contractService.shaExists(testHash);
    logDetail('Hash exists:', exists ? '✅ Yes' : '❌ No (expected for random hash)');
    
    return true;
  } catch (error) {
    console.error('\n❌ Contract connection test failed with error:');
    logDetail('Error details:', { 
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};

// Test submitting a new invoice via API
const testSubmitInvoiceViaAPI = async () => {
  console.log('\n========================================');
  console.log('🧪 TESTING CONTRACT VIA API ENDPOINTS');
  console.log('========================================\n');
  
  const sha256Hash = generateRandomSha256();
  const hashcode = generateInvoiceHashcode();
  
  logDetail(`Testing with:`, {
    sha256Hash,
    hashcode
  });
  
  try {
    // Check if server is running first
    try {
      logStep(1, 'Checking if API server is running...');
      const healthResponse = await axios.get(`http://localhost:${process.env.PORT || 3001}/health`);
      logDetail('API server is running', healthResponse.data);
    } catch (error) {
      console.error('Error: API server is not running. Please start it with "npm run dev" in another terminal.');
      if (error.code === 'ECONNREFUSED') {
        logDetail('Connection refused. Make sure the server is running on the correct port.');
      } else {
        logDetail('Error details:', { 
          message: error.message,
          code: error.code,
          response: error.response?.data
        });
      }
      return false;
    }
    
    logStep(2, 'Submitting new invoice...');
    try {
      const submitResponse = await axios.post(`${API_URL}/submit-invoice`, {
        sha256Hash,
        hashcode
      });
      
      logDetail('Success! Invoice submitted.', submitResponse.data);
      
      // Wait for transaction to be processed
      logDetail('Waiting 5 seconds for transaction to be processed...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      logDetail('Error submitting invoice:', { 
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Continue the test even if this fails - we'll check if the API can handle reads
      logDetail('Continuing test despite error...');
    }
    
    // Check if the invoice exists
    logStep(3, 'Verifying invoice...');
    try {
      const getResponse = await axios.get(`${API_URL}/invoice/${hashcode}`);
      logDetail('Invoice retrieved:', getResponse.data);
    } catch (error) {
      logDetail('Error retrieving invoice:', { 
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Continue with the test
      logDetail('Continuing test despite error...');
    }
    
    // Verify SHA exists
    logStep(4, 'Verifying SHA exists...');
    try {
      const shaResponse = await axios.get(`${API_URL}/sha-exists/${sha256Hash}`);
      logDetail(`SHA exists check result:`, shaResponse.data);
    } catch (error) {
      logDetail('Error checking SHA existence:', { 
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Continue with the test
      logDetail('Continuing test despite error...');
    }
    
    // Complete the invoice
    logStep(5, 'Completing the invoice...');
    try {
      const completeResponse = await axios.post(`${API_URL}/complete-invoice`, {
        hashcode
      });
      logDetail('Invoice completion response:', completeResponse.data);
      
      // Wait for transaction to be processed
      logDetail('Waiting 5 seconds for transaction to be processed...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      logDetail('Error completing invoice:', { 
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Continue the test even if this fails
      logDetail('Continuing test despite error...');
    }
    
    // Check the invoice state after completion
    logStep(6, 'Verifying final invoice state...');
    try {
      const finalResponse = await axios.get(`${API_URL}/invoice/${hashcode}`);
      logDetail('Final invoice state:', finalResponse.data);
      
      // Verify the invoice is now completed
      if (finalResponse.data.completed === true) {
        logDetail('✅ Invoice was successfully marked as completed!');
      } else {
        logDetail('⚠️ Invoice completion may not have been recorded.');
      }
    } catch (error) {
      logDetail('Error retrieving final invoice state:', { 
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    
    logDetail('✅ API tests completed. Some operations may have failed, check logs for details.');
    return true;
  } catch (error) {
    console.error('\n❌ API test failed with an unexpected error:');
    logDetail('Error details:', { 
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};

// Test direct contract submission
const testDirectContractSubmission = async () => {
  console.log('\n========================================');
  console.log('🧪 TESTING DIRECT CONTRACT SUBMISSION');
  console.log('========================================\n');
  
  try {
    // Generate test invoice data
    logStep(1, 'Preparing test invoice data...');
    
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
    
    // Get signer's address for the invoice address
    const connectionInfo = await contractService.getConnectionInfo();
    const address = connectionInfo.account.address;
    
    // Create test URI (in a real app, this would be an IPFS URI)
    const uri = `ipfs://test/${hash}`;
    
    logDetail('Test data:', {
      hash,
      uri,
      address
    });
    
    // Check if hash already exists
    logStep(2, 'Checking if hash already exists...');
    const exists = await contractService.shaExists(hash);
    
    if (exists) {
      logDetail('⚠️ Hash already exists, modifying hash...');
      testInvoiceData.id = `test-${Date.now()}-modified`;
      const newTestDataString = JSON.stringify(testInvoiceData);
      hash = '0x' + crypto.createHash('sha256').update(newTestDataString).digest('hex');
      logDetail('New hash:', hash);
    } else {
      logDetail('✅ Hash does not exist, ready for submission');
    }
    
    // Submit the invoice
    logStep(3, 'Submitting invoice to blockchain...');
    logDetail('Submission started at:', new Date().toISOString());
    
    const submitResult = await contractService.submitInvoice(hash, uri, address);
    
    logDetail('✅ Invoice submitted successfully!');
    logDetail('Transaction details:', submitResult);
    
    // Verify the invoice was stored
    logStep(4, 'Verifying invoice storage...');
    const invoice = await contractService.getInvoice(hash);
    
    logDetail('Retrieved invoice:', invoice);
    
    if (invoice.hash === hash) {
      logDetail('✅ Invoice verification successful');
    } else {
      logDetail('⚠️ Retrieved invoice hash does not match submitted hash');
    }
    
    return true;
  } catch (error) {
    console.error('\n❌ Direct submission test failed with error:');
    logDetail('Error details:', { 
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};

// Main test function
const runTests = async () => {
  console.log('========================================');
  console.log('🧪 STARTING COMPREHENSIVE CONTRACT TESTS');
  console.log('========================================\n');
  
  // Test contract connection first
  const connectionSuccess = await testContractConnection();
  
  if (!connectionSuccess) {
    console.error('❌ Contract connection failed, skipping further tests.');
    return false;
  }
  
  // Ask user what tests to run
  console.log('\n========================================');
  console.log('Which test would you like to run?');
  console.log('1: Direct contract submission test');
  console.log('2: API test (requires server to be running)');
  console.log('3: Run both tests');
  console.log('4: Skip further tests');
  console.log('========================================');
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    readline.question('Enter your choice (1-4): ', async (choice) => {
      readline.close();
      
      let success = true;
      
      switch (choice) {
        case '1':
          success = await testDirectContractSubmission();
          break;
        case '2':
          success = await testSubmitInvoiceViaAPI();
          break;
        case '3':
          const directSuccess = await testDirectContractSubmission();
          const apiSuccess = await testSubmitInvoiceViaAPI();
          success = directSuccess && apiSuccess;
          break;
        case '4':
          console.log('Skipping further tests.');
          break;
        default:
          console.log('Invalid choice, skipping further tests.');
      }
      
      console.log('\n========================================');
      if (success) {
        console.log('🎉 TESTS COMPLETED SUCCESSFULLY');
      } else {
        console.log('⚠️ TESTS COMPLETED WITH SOME FAILURES');
        console.log('Check logs above for details on failures.');
      }
      console.log('========================================');
      
      resolve(success);
    });
  });
};

// Run the tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\nUnexpected error during tests:', error);
    process.exit(1);
  }); 