# Polkadot Blockchain API

A Node.js API server that provides endpoints to interact with the EurekaInvoiceRegistry smart contract deployed on the Polkadot Westend testnet.

## Setup

1. Make sure you have Node.js installed (v14+ recommended)
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in the `.env` file:
   - `PRIVATE_KEY`: The private key of the account that has permissions to interact with the contract
   - `PORT`: The port for the API server (default: 3001)

## Running the API

Start the server in development mode:
```
npm run dev
```

Or in production mode:
```
npm start
```

## Testing the Contract

This API directly interacts with the Polkadot Westend testnet. The test script has been designed to accommodate potential contract interaction issues and will provide detailed logs to help diagnose problems.

### Prerequisites

1. Ensure you have a valid private key in your `.env` file.
2. The private key should belong to an account that:
   - Has sufficient WND (Westend tokens) to pay for transaction fees
   - Has the appropriate permissions on the contract (e.g., is whitelisted as a signer)

### Running the Test

1. Start the API server:
   ```
   npm run dev
   ```

2. In a separate terminal, run the test script:
   ```
   npm run test:contract
   ```

### Debugging Connection Issues

If you're having trouble connecting to the blockchain:

1. Check your connection status using the `/api/contract/status` endpoint:
   ```
   curl http://localhost:3001/api/contract/status
   ```

2. This will provide details about:
   - The blockchain network you're connected to
   - Your account address and balance
   - The contract address being used

If the account shows a zero balance, you'll need to obtain Westend testnet tokens using the [Westend Faucet](https://matrix.to/#/#westend_faucet:matrix.org).

### What the Test Does

The test script will:
1. Submit a new invoice with a random SHA-256 hash and hashcode
2. Verify the invoice retrieval works
3. Check if the SHA-256 hash exists in the contract
4. Complete the invoice 
5. Verify the invoice state was updated correctly

### Troubleshooting

- **Contract Interactions**: The Polkadot API and contract interactions can sometimes be complex. The service includes detailed logging to help debug issues.
- **Fallback Behavior**: For certain read operations, if the contract interaction fails, the service will provide fallback data to allow your frontend to continue working.
- **API Errors**: Check the API server logs for detailed error messages and stack traces if you encounter issues.

> **Note:** Real blockchain transactions may take time to be confirmed. The test script includes wait periods between actions to allow for these confirmations.

## API Endpoints

### Connection & Status

- **GET /api/contract/status** - Check the connection status to the blockchain and contract

### Read Operations

- **GET /api/contract/invoice/:hashcode** - Get invoice details by hashcode
- **GET /api/contract/sha-exists/:sha256Hash** - Check if a SHA-256 hash exists

### Write Operations

- **POST /api/contract/submit-invoice** - Submit a new invoice
  ```json
  {
    "sha256Hash": "0x123...abc",
    "hashcode": "INV-1234-5678"
  }
  ```

- **POST /api/contract/revoke-invoice** - Revoke an invoice
  ```json
  {
    "hashcode": "INV-1234-5678"
  }
  ```

- **POST /api/contract/complete-invoice** - Mark an invoice as completed
  ```json
  {
    "hashcode": "INV-1234-5678"
  }
  ```

- **POST /api/contract/add-signer** - Add a new signer (requires owner privileges)
  ```json
  {
    "signerAddress": "0xabc...123"
  }
  ```

- **POST /api/contract/remove-signer** - Remove a signer (requires owner privileges)
  ```json
  {
    "signerAddress": "0xabc...123"
  }
  ```

- **POST /api/contract/pause** - Pause contract operations (requires owner privileges)

- **POST /api/contract/unpause** - Unpause contract operations (requires owner privileges)

## Health Check

- **GET /health** - Returns status 200 if the server is running 