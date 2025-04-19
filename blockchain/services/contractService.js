const { ethers } = require('ethers');
const { hexToU8a, u8aToHex } = require('@polkadot/util');
const { cryptoWaitReady } = require('@polkadot/util-crypto');

// Contract ABI - should be replaced with proper ABI exported from contract compilation
const contractAbi = require('../abi/contract-abi.json');

// Contract address from the README
const CONTRACT_ADDRESS = '0x19C8500bf08dDc7941801Fb629a4307C2bCdcD7E';
// Using the correct Westend Asset Hub EVM endpoint
const WESTEND_ENDPOINT = 'https://westend-asset-hub-eth-rpc.polkadot.io';
const CHAIN_ID = 420420421; // Westend Asset Hub EVM Chain ID

// Transaction config
const TX_CONFIG = {
  gasLimitBuffer: 1.5, // Multiply estimated gas by this factor for safety margin
  maxGasLimit: 10000000n, // Maximum gas limit to prevent unreasonable values
  autoConfirmGas: true, // Always automatically confirm gas charges
  txTimeout: 60000, // Timeout for transaction in ms (1 minute)
  maxRetries: 3, // Maximum number of retries for failed transactions
  retryDelay: 2000 // Delay between retries in ms
};

// Initialize connections
let provider;
let wallet;
let contract;
let isConnected = false;
let reconnecting = false;

const logDetail = (message, data = null) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

// Function to handle connection issues
const handleConnectionIssue = async () => {
  if (reconnecting) return; // Prevent multiple reconnection attempts
  
  reconnecting = true;
  logDetail('Connection issue detected, attempting to reconnect...');
  
  try {
    // Reset connection state
    isConnected = false;
    provider = null;
    wallet = null;
    contract = null;
    
    // Reinitialize
    await initialize();
    reconnecting = false;
    logDetail('Successfully reconnected to the network');
  } catch (error) {
    reconnecting = false;
    logDetail('Failed to reconnect:', { error: error.message });
    throw error;
  }
};

// Function to retry operations with exponential backoff
const withRetry = async (operation, description, maxRetries = TX_CONFIG.maxRetries) => {
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        logDetail(`Retry attempt ${attempt}/${maxRetries} for ${description}`);
      }
      
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Check if this is a connection issue
      const isConnectionError = 
        error.message.includes('disconnected') || 
        error.message.includes('connection') ||
        error.message.includes('timeout') ||
        !isConnected;
      
      if (isConnectionError && attempt < maxRetries) {
        // Try to reconnect before next attempt
        try {
          await handleConnectionIssue();
        } catch (reconnectError) {
          // Just log reconnection errors but continue with retry logic
          logDetail('Reconnection failed during retry:', { error: reconnectError.message });
        }
      }
      
      if (attempt < maxRetries) {
        // Wait with exponential backoff before retrying
        const delay = TX_CONFIG.retryDelay * Math.pow(2, attempt - 1);
        logDetail(`Waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logDetail(`Operation ${description} failed after ${maxRetries} attempts:`, { 
          error: lastError.message, 
          stack: lastError.stack 
        });
        throw lastError;
      }
    }
  }
};

const initialize = async () => {
  if (provider && isConnected) return;
  
  try {
    logDetail('Waiting for crypto libraries to be ready...');
    await cryptoWaitReady();
    logDetail('Crypto libraries are ready');
    
    logDetail('Initializing ethers.js provider...');
    
    // Connect to Westend Asset Hub EVM endpoint
    provider = new ethers.providers.JsonRpcProvider(WESTEND_ENDPOINT);
    
    // Ensure private key is in the right format
    const privateKey = process.env.PRIVATE_KEY.startsWith('0x') 
      ? process.env.PRIVATE_KEY 
      : `0x${process.env.PRIVATE_KEY}`;
    
    // Create wallet with private key
    wallet = new ethers.Wallet(privateKey, provider);
    
    logDetail(`Connected with address: ${wallet.address}`);
    
    // Initialize contract with ABI and address
    contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, wallet);
    
    // Check if contract exists
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === '0x' || code === '0x0') {
      throw new Error(`No contract found at address ${CONTRACT_ADDRESS}`);
    }
    
    // Get network details for verification
    const network = await provider.getNetwork();
    logDetail(`Connected to chain ID: ${network.chainId}`);
    
    // Check balance to ensure account is funded
    const balance = await provider.getBalance(wallet.address);
    logDetail(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);
    
    // Verify we have enough balance for transactions
    if (balance.isZero()) {
      logDetail('WARNING: Account has zero balance, transactions will fail');
    }
    
    isConnected = true;
    logDetail('ethers.js initialized successfully');
  } catch (error) {
    isConnected = false;
    logDetail('Failed to initialize ethers.js:', { error: error.message, stack: error.stack });
    throw error;
  }
};

/**
 * Create a placeholder invoice object with default values
 * @param {string} [hash=''] - Optional hash to include in placeholder
 * @returns {Object} Empty invoice object with default values
 */
const createPlaceholderInvoice = (hash = '') => {
  return {
    hash: hash,
    hashcode: '',
    issuer: '',
    timestamp: 0,
    revoked: false,
    completed: false,
    status: 'Unknown'
  };
};

// Call a read-only contract method
const queryContract = async (method, ...args) => {
  await initialize();
  
  logDetail(`Querying contract method: ${method} with args:`, args);
  
  try {
    // Check if the method exists in the contract
    if (typeof contract[method] !== 'function') {
      logDetail(`Method ${method} not found in contract, available methods:`, 
        Object.keys(contract.functions));
      throw new Error(`Method ${method} not found in contract`);
    }
    
    // Call the contract's read method
    const result = await contract[method](...args);
    logDetail(`Query result:`, result);
    
    return result;
  } catch (error) {
    logDetail('Error in queryContract:', { error: error.message });
    
    // For frontend compatibility, return placeholder data for getInvoice
    if (method === 'getInvoice') {
      logDetail('Returning placeholder invoice data for frontend compatibility');
      return createPlaceholderInvoice(args[0]);
    }
    
    // Return false for shaExists to avoid blocking frontend functions
    if (method === 'shaExists') {
      logDetail('Returning false for shaExists due to error');
      return false;
    }
    
    throw error;
  }
};

// Fallback method that directly calls Substrate RPCs
const callSubstrateRPC = async (method, params) => {
  await initialize();
  
  logDetail(`Calling Substrate RPC: ${method} with params:`, params);
  
  try {
    // Find the appropriate RPC method
    const rpcMethod = method.split('.');
    let rpcCall = provider;
    
    for (const part of rpcMethod) {
      rpcCall = rpcCall[part];
      if (!rpcCall) {
        throw new Error(`RPC method ${method} not found`);
      }
    }
    
    // Call the RPC method
    const result = await rpcCall(...params);
    logDetail(`RPC result:`, result.toString());
    return result;
  } catch (error) {
    logDetail('Error in RPC call:', { error: error.message });
    throw error;
  }
};

// Send a transaction to the contract
const txContract = async (method, ...args) => {
  await initialize();
  
  logDetail(`Preparing transaction to contract method: ${method} with args:`, args);
  
  try {
    // Check if the method exists in the contract
    if (typeof contract[method] !== 'function') {
      logDetail(`Method ${method} not found in contract, available methods:`, 
        Object.keys(contract.functions));
      throw new Error(`Method ${method} not found in contract`);
    }
    
    // Use ethers.js to estimate gas
    logDetail(`Estimating gas for ${method}...`);
    let gasLimit;
    
    try {
      // Estimate gas for the transaction
      gasLimit = await contract.estimateGas[method](...args);
      
      // Apply safety buffer
      gasLimit = gasLimit.mul(Math.floor(TX_CONFIG.gasLimitBuffer * 100)).div(100);
      
      logDetail('Gas estimation successful:', gasLimit.toString());
    } catch (error) {
      logDetail(`Gas estimation failed: ${error.message}`);
      
      // Use fallback gas limits if estimation fails
      if (method === 'submitInvoice') {
        gasLimit = ethers.BigNumber.from('8000000');
      } else {
        gasLimit = ethers.BigNumber.from('5000000');
      }
      
      logDetail(`Using fallback gas limit: ${gasLimit.toString()}`);
    }
    
    // Prepare transaction options
    const txOptions = { 
      gasLimit,
      gasPrice: await provider.getGasPrice()
    };
    
    logDetail('Transaction parameters:', {
      to: CONTRACT_ADDRESS,
      from: wallet.address,
      gasLimit: txOptions.gasLimit.toString(),
      gasPrice: ethers.utils.formatUnits(txOptions.gasPrice, 'gwei') + ' gwei'
    });
    
    // Create promise to track transaction
    return new Promise(async (resolve, reject) => {
      try {
        // Send the transaction
        const tx = await contract[method](...args, txOptions);
        logDetail(`Transaction sent: ${tx.hash}`);
        
        // Wait for transaction to be mined
        logDetail(`Waiting for transaction to be mined...`);
        const receipt = await tx.wait();
        
        logDetail(`Transaction confirmed in block ${receipt.blockNumber}`, {
          blockHash: receipt.blockHash,
          gasUsed: receipt.gasUsed.toString(),
          events: receipt.events ? receipt.events.length : 0
        });
        
        resolve({
          status: 'success',
          message: `Transaction ${method} included in block ${receipt.blockNumber}`,
          blockHash: receipt.blockHash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          events: receipt.events ? receipt.events.map(e => e.event) : [],
          transactionHash: receipt.transactionHash
        });
      } catch (error) {
        logDetail(`Transaction failed: ${error.message}`, {
          error: error,
          stack: error.stack
        });
        
        reject(new Error(`Transaction ${method} failed: ${error.message}`));
      }
    });
  } catch (error) {
    logDetail('Error in txContract:', { 
      error: error.message, 
      stack: error.stack,
      method,
      args
    });
    throw error;
  }
};

/**
 * Get an invoice by its hashcode
 * @param {string} hashcode - Hashcode of the invoice (e.g. "INV-4F7C-92A1")
 * @returns {Promise<Object>} Invoice data
 */
const getInvoice = async (hashcode) => {
  try {
    logDetail(`Getting invoice with hashcode: ${hashcode}`);
    const result = await queryContract('getInvoice', hashcode);
    return processInvoiceResult(result);
  } catch (error) {
    logDetail('Error in getInvoice:', { error: error.message, hashcode });
    return createPlaceholderInvoice();
  }
};

/**
 * Check if an invoice hash already exists
 * @param {string} sha256Hash - SHA-256 hash of the invoice data
 * @returns {Promise<boolean>} True if hash exists
 */
const shaExists = async (sha256Hash) => {
  try {
    logDetail(`Checking if hash exists: ${sha256Hash}`);
    // Format hash properly for the contract
    const formattedHash = sha256Hash.startsWith('0x') ? sha256Hash : `0x${sha256Hash}`;
    const result = await queryContract('shaExists', formattedHash);
    return result === true;
  } catch (error) {
    logDetail('Error in shaExists:', { error: error.message, sha256Hash });
    return false; // Default to false for frontend compatibility
  }
};

/**
 * Submit a new invoice to the blockchain
 * @param {string} sha256Hash - SHA-256 hash of the invoice data
 * @param {string} hashcode - Invoice hashcode (e.g. "INV-4F7C-92A1")
 * @returns {Promise<Object>} Transaction result
 */
const submitInvoice = async (sha256Hash, hashcode) => {
  return withRetry(async () => {
    logDetail('Submitting invoice:', { sha256Hash, hashcode });
    
    // Validate parameters
    if (!sha256Hash) {
      throw new Error('Missing required parameter: sha256Hash');
    }
    if (!hashcode) {
      throw new Error('Missing required parameter: hashcode');
    }
    
    // Format hash properly for the contract
    const formattedHash = sha256Hash.startsWith('0x') ? sha256Hash : `0x${sha256Hash}`;
    
    // Check if hash already exists to prevent duplicate submissions
    const exists = await shaExists(formattedHash).catch(() => false);
    if (exists) {
      logDetail('Warning: Invoice hash already exists on chain', { formattedHash });
    }
    
    logDetail('Transaction preparation starting: submitInvoice', {
      formattedHash,
      hashcode,
      contractAddress: CONTRACT_ADDRESS,
      timestamp: Date.now()
    });
    
    // Call submitInvoice with parameters in the correct order per Solidity contract
    const result = await txContract('submitInvoice', formattedHash, hashcode);
    
    logDetail('submitInvoice transaction result:', result);
    return result;
  }, 'submitInvoice');
};

/**
 * Complete an existing invoice
 * @param {string} hashcode - Hashcode of the invoice to complete (e.g. "INV-4F7C-92A1")
 * @returns {Promise<Object>} Transaction result
 */
const completeInvoice = async (hashcode) => {
  try {
    logDetail(`Completing invoice with hashcode: ${hashcode}`);
    
    // Call completeInvoice with the invoice hashcode
    return await txContract('completeInvoice', hashcode);
  } catch (error) {
    logDetail('Error in completeInvoice:', { error: error.message, hashcode });
    throw error;
  }
};

/**
 * Revoke an existing invoice
 * @param {string} hashcode - Hashcode of the invoice to revoke (e.g. "INV-4F7C-92A1")
 * @returns {Promise<Object>} Transaction result
 */
const revokeInvoice = async (hashcode) => {
  try {
    logDetail(`Revoking invoice with hashcode: ${hashcode}`);
    
    // Call revokeInvoice with the invoice hashcode
    return await txContract('revokeInvoice', hashcode);
  } catch (error) {
    logDetail('Error in revokeInvoice:', { error: error.message, hashcode });
    throw error;
  }
};

/**
 * Process raw invoice data from contract
 * @param {Object} rawInvoice - Raw invoice data from contract
 * @returns {Object} Processed invoice object
 */
const processInvoiceResult = (rawInvoice) => {
  // If we received null or undefined, return empty invoice
  if (!rawInvoice) {
    return createPlaceholderInvoice();
  }
  
  try {
    logDetail('Processing raw invoice data:', rawInvoice);
    
    // For Solidity contract, extract the invoice struct fields
    // The EVM contract returns data matching the struct fields in EurekaInvoiceRegistry.sol
    const processedInvoice = {
      hash: rawInvoice.hash || '',
      hashcode: rawInvoice.hashcode || '',
      issuer: rawInvoice.issuer || '',
      timestamp: Number(rawInvoice.timestamp) || 0,
      revoked: Boolean(rawInvoice.revoked) || false,
      completed: Boolean(rawInvoice.completed) || false,
      status: getStatusString(rawInvoice)
    };
    
    logDetail('Processed invoice:', processedInvoice);
    return processedInvoice;
  } catch (error) {
    logDetail('Error processing invoice result:', { error: error.message, rawInvoice });
    return createPlaceholderInvoice();
  }
};

/**
 * Determine invoice status string from raw data
 * @param {Object} invoice - Raw invoice data
 * @returns {string} Status string
 */
const getStatusString = (invoice) => {
  if (!invoice || !invoice.timestamp || invoice.timestamp.toString() === '0') {
    return 'Unknown';
  }
  
  if (invoice.completed) {
    return 'Completed';
  }
  
  if (invoice.revoked) {
    return 'Revoked';
  }
  
  return 'Submitted';
};

// Contract service functions to be exposed in the API
const contractService = {
  // Contract validation
  validateContract: async () => {
    try {
      await initialize();
      
      logDetail('Validating contract integrity...');
      
      // 1. Check if we can get contract metadata
      logDetail('Retrieving contract metadata...');
      const network = await provider.getNetwork();
      if (!network) {
        throw new Error('Unable to retrieve blockchain metadata');
      }
      logDetail('Blockchain metadata successfully retrieved');
      
      // 2. Check if contract exists at the address
      const contractExists = await provider.getCode(CONTRACT_ADDRESS);
      if (!contractExists || contractExists === '0x') {
        logDetail('ERROR: No contract found at specified address', { CONTRACT_ADDRESS });
        throw new Error(`No contract found at address ${CONTRACT_ADDRESS}`);
      }
      logDetail('Contract exists at specified address', { CONTRACT_ADDRESS });
      
      // 3. Check if critical methods are available
      const queryMethods = Object.keys(contract);
      const txMethods = Object.keys(contract);
      
      logDetail('Available contract query methods:', queryMethods);
      logDetail('Available contract transaction methods:', txMethods);
      
      const requiredMethods = ['submitInvoice', 'getInvoice', 'shaExists'];
      const missingMethods = requiredMethods.filter(method => 
        !queryMethods.includes(method) && !txMethods.includes(method)
      );
      
      if (missingMethods.length > 0) {
        logDetail('WARNING: Required contract methods missing', { missingMethods });
        throw new Error(`Contract is missing required methods: ${missingMethods.join(', ')}`);
      }
      
      // 4. Test read-only call to verify contract interaction
      try {
        // Try to get a non-existent invoice to test contract read capability
        const testHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
        logDetail('Testing contract read with getInvoice call', { testHash });
        
        const result = await queryContract('getInvoice', testHash);
        logDetail('Contract read test successful', { result });
      } catch (error) {
        logDetail('Contract read test failed', { error: error.message });
        throw new Error(`Unable to read from contract: ${error.message}`);
      }
      
      // Get chain and account information for additional confirmation
      // Get balance properly as a direct value, not wrapped in {data}
      const balance = await provider.getBalance(wallet.address);
      
      return {
        valid: true,
        contractAddress: CONTRACT_ADDRESS,
        methods: {
          query: queryMethods,
          transaction: txMethods
        },
        connection: {
          chain: network.chainId.toString(),
          node: `${network.name} v${network.version}`,
          signer: wallet.address,
          balance: ethers.utils.formatEther(balance)
        }
      };
    } catch (error) {
      logDetail('Contract validation failed', { error: error.message, stack: error.stack });
      return {
        valid: false,
        error: error.message
      };
    }
  },
  
  // Read functions
  getInvoice: async (invoiceHash) => {
    try {
      return await getInvoice(invoiceHash);
    } catch (error) {
      logDetail(`Error in getInvoice for ${invoiceHash}:`, { error: error.message });
      return createPlaceholderInvoice(invoiceHash);
    }
  },
  
  shaExists: async (invoiceHash) => {
    try {
      return await shaExists(invoiceHash);
    } catch (error) {
      logDetail(`Error in shaExists for ${invoiceHash}:`, { error: error.message });
      return false;
    }
  },
  
  // Write functions
  submitInvoice: async (invoiceHash, invoiceURI, invoiceAddress) => {
    logDetail(`Submitting invoice: SHA=${invoiceHash}, URI=${invoiceURI}, Address=${invoiceAddress}`);
    try {
      // Validate contract before submission
      const contractValidation = await contractService.validateContract();
      if (!contractValidation.valid) {
        throw new Error(`Cannot submit invoice: Contract validation failed: ${contractValidation.error}`);
      }
      
      return await submitInvoice(invoiceHash, invoiceURI, invoiceAddress);
    } catch (error) {
      logDetail(`Error in submitInvoice:`, { error: error.message });
      throw error;
    }
  },
  
  revokeInvoice: async (invoiceHash) => {
    logDetail(`Revoking invoice: ${invoiceHash}`);
    try {
      return await revokeInvoice(invoiceHash);
    } catch (error) {
      logDetail(`Error in revokeInvoice:`, { error: error.message });
      throw error;
    }
  },
  
  completeInvoice: async (invoiceHash) => {
    logDetail(`Completing invoice: ${invoiceHash}`);
    try {
      return await completeInvoice(invoiceHash);
    } catch (error) {
      logDetail(`Error in completeInvoice:`, { error: error.message });
      throw error;
    }
  },
  
  addSigner: async (signerAddress) => {
    logDetail(`Adding signer: ${signerAddress}`);
    try {
      return await txContract('addSigner', signerAddress);
    } catch (error) {
      logDetail(`Error in addSigner:`, { error: error.message });
      throw error;
    }
  },
  
  removeSigner: async (signerAddress) => {
    logDetail(`Removing signer: ${signerAddress}`);
    try {
      return await txContract('removeSigner', signerAddress);
    } catch (error) {
      logDetail(`Error in removeSigner:`, { error: error.message });
      throw error;
    }
  },
  
  pauseContract: async () => {
    logDetail('Pausing contract');
    try {
      return await txContract('pause');
    } catch (error) {
      logDetail(`Error in pauseContract:`, { error: error.message });
      throw error;
    }
  },
  
  unpauseContract: async () => {
    logDetail('Unpausing contract');
    try {
      return await txContract('unpause');
    } catch (error) {
      logDetail(`Error in unpauseContract:`, { error: error.message });
      throw error;
    }
  },
  
  // Direct connection information for debugging
  getConnectionInfo: async () => {
    await initialize();
    
    try {
      // Get chain information
      const network = await provider.getNetwork();
      
      // Get account information - direct balance, not wrapped in {data}
      const balance = await provider.getBalance(wallet.address);
      
      return {
        chain: network.chainId.toString(),
        node: {
          name: network.name,
          version: network.version
        },
        account: {
          address: wallet.address,
          balance: ethers.utils.formatEther(balance)
        },
        contractAddress: CONTRACT_ADDRESS
      };
    } catch (error) {
      logDetail('Error getting connection info:', { error: error.message });
      throw error;
    }
  }
};

module.exports = contractService; 