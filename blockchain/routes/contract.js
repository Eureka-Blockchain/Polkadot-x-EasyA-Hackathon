const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');

// Health/Debug endpoint to check connection status
router.get('/status', async (req, res) => {
  try {
    const status = await contractService.getConnectionInfo();
    res.json(status);
  } catch (error) {
    console.error('Error getting connection status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get invoice by hashcode
router.get('/invoice/:hashcode', async (req, res) => {
  try {
    const { hashcode } = req.params;
    const invoice = await contractService.getInvoice(hashcode);
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if SHA exists
router.get('/sha-exists/:sha256Hash', async (req, res) => {
  try {
    const { sha256Hash } = req.params;
    const exists = await contractService.shaExists(sha256Hash);
    res.json({ exists });
  } catch (error) {
    console.error('Error checking SHA existence:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit a new invoice
router.post('/submit-invoice', async (req, res) => {
  try {
    const { sha256Hash, hashcode } = req.body;
    if (!sha256Hash || !hashcode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await contractService.submitInvoice(sha256Hash, hashcode);
    res.json(result);
  } catch (error) {
    console.error('Error submitting invoice:', error);
    res.status(500).json({ error: error.message });
  }
});

// Revoke an invoice
router.post('/revoke-invoice', async (req, res) => {
  try {
    const { hashcode } = req.body;
    if (!hashcode) {
      return res.status(400).json({ error: 'Missing hashcode field' });
    }
    const result = await contractService.revokeInvoice(hashcode);
    res.json(result);
  } catch (error) {
    console.error('Error revoking invoice:', error);
    res.status(500).json({ error: error.message });
  }
});

// Complete an invoice
router.post('/complete-invoice', async (req, res) => {
  try {
    const { hashcode } = req.body;
    if (!hashcode) {
      return res.status(400).json({ error: 'Missing hashcode field' });
    }
    const result = await contractService.completeInvoice(hashcode);
    res.json(result);
  } catch (error) {
    console.error('Error completing invoice:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a signer
router.post('/add-signer', async (req, res) => {
  try {
    const { signerAddress } = req.body;
    if (!signerAddress) {
      return res.status(400).json({ error: 'Missing signerAddress field' });
    }
    const result = await contractService.addSigner(signerAddress);
    res.json(result);
  } catch (error) {
    console.error('Error adding signer:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove a signer
router.post('/remove-signer', async (req, res) => {
  try {
    const { signerAddress } = req.body;
    if (!signerAddress) {
      return res.status(400).json({ error: 'Missing signerAddress field' });
    }
    const result = await contractService.removeSigner(signerAddress);
    res.json(result);
  } catch (error) {
    console.error('Error removing signer:', error);
    res.status(500).json({ error: error.message });
  }
});

// Pause contract
router.post('/pause', async (req, res) => {
  try {
    const result = await contractService.pauseContract();
    res.json(result);
  } catch (error) {
    console.error('Error pausing contract:', error);
    res.status(500).json({ error: error.message });
  }
});

// Unpause contract
router.post('/unpause', async (req, res) => {
  try {
    const result = await contractService.unpauseContract();
    res.json(result);
  } catch (error) {
    console.error('Error unpausing contract:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 