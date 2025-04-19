require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: { enabled: true, runs: 800 },
      viaIR: true                          // LLVM IR path = big size win
    }
  },
  networks: {
    westend: {
      url: process.env.RPC_URL || 'https://evm-westend.publicnode.com',
      chainId: 420420421,      // Westend AH EVM
      accounts: [process.env.PRIVATE_KEY.startsWith('0x')
                 ? process.env.PRIVATE_KEY
                 : '0x' + process.env.PRIVATE_KEY],
      timeout: 300000          // 5‑min RPC timeout
    }
  }
};
