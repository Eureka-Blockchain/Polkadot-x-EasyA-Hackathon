// Test script for validating contract connectivity
require('dotenv').config();
const contractService = require('./services/contractService');

async function testContract() {
  console.log('Starting contract validation test...');
  
  try {
    // Step 1: Validate contract connection and read capabilities
    console.log('\n--- Contract Validation ---');
    const validation = await contractService.validateContract();
    
    if (!validation.valid) {
      console.error('❌ Contract validation failed:', validation.error);
      return;
    }
    
    console.log('✅ Contract validation successful!');
    console.log('Contract address:', validation.contractAddress);
    console.log('Available query methods:', validation.methods.query.join(', '));
    console.log('Available transaction methods:', validation.methods.transaction.join(', '));
    console.log('Connected to:', validation.connection.chain);
    console.log('Node:', validation.connection.node);
    console.log('Account:', validation.connection.signer);
    console.log('Balance:', validation.connection.balance);
    
    // Step 2: Test a shaExists query with a random hash
    const testHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    console.log('\n--- Testing shaExists ---');
    console.log('Test hash:', testHash);
    
    const exists = await contractService.shaExists(testHash);
    console.log('Hash exists:', exists ? '✅ Yes' : '❌ No (expected for random hash)');
    
    // Step 3: Get connection info
    console.log('\n--- Connection Info ---');
    const connectionInfo = await contractService.getConnectionInfo();
    console.log('Chain:', connectionInfo.chain);
    console.log('Node name:', connectionInfo.node.name);
    console.log('Node version:', connectionInfo.node.version);
    console.log('Account address:', connectionInfo.account.address);
    console.log('Account balance:', connectionInfo.account.balance);
    
    console.log('\nContract validation complete - connection is working properly.');
    console.log('You can now proceed with submitting an invoice.');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Execute the test
testContract()
  .catch(error => {
    console.error('Unhandled error:', error);
  })
  .finally(() => {
    console.log('\nTest completed.');
    // Keep process alive briefly to complete any pending operations
    setTimeout(() => process.exit(0), 1000);
  }); 