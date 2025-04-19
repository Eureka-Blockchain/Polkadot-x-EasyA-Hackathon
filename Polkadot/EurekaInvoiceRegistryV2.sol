// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EurekaInvoiceRegistry
 * @notice On‑chain registry for **SHA‑256**‑hashed invoices.
 *         Only whitelisted signers can submit, revoke, or complete invoices.
 */
contract EurekaInvoiceRegistry is Ownable, Pausable {
    /* -------------------------------------------------------------------------- */
    /*                                   Types                                    */
    /* -------------------------------------------------------------------------- */

    struct Invoice {
        bytes32  hash;       // SHA‑256 digest of the original PDF
        string   hashcode;   // e.g. "INV‑4F7C‑92A1"
        address  issuer;     // signer who stored the invoice
        uint256  timestamp;  // block timestamp of submission
        bool     revoked;    // true once cancelled
        bool     completed;  // true once payment confirmed
    }

    /* -------------------------------------------------------------------------- */
    /*                              State variables                               */
    /* -------------------------------------------------------------------------- */

    mapping(string => Invoice) public invoices;   // hashcode → Invoice
    mapping(bytes32 => bool)  public hashExists;  // SHA‑256 → existence flag
    mapping(address => bool)  public whitelist;   // authorised signers

    /* -------------------------------------------------------------------------- */
    /*                                    Events                                  */
    /* -------------------------------------------------------------------------- */

    event SignerAdded(address indexed signer);
    event SignerRemoved(address indexed signer);

    event InvoiceSubmitted(string indexed hashcode, address indexed issuer, uint256 timestamp);
    event InvoiceRevoked  (string indexed hashcode, address indexed issuer);
    event InvoiceCompleted(string indexed hashcode, address indexed issuer);

    /* -------------------------------------------------------------------------- */
    /*                                    Errors                                  */
    /* -------------------------------------------------------------------------- */

    error NotAuthorised();
    error ZeroAddress();
    error InvalidHashcode();
    error InvoiceExists();
    error InvoiceUnknown();
    error AlreadyRevoked();
    error AlreadyCompleted();

    /* -------------------------------------------------------------------------- */
    /*                                   Modifiers                                */
    /* -------------------------------------------------------------------------- */

    modifier onlySigner() {
        if (!whitelist[msg.sender]) revert NotAuthorised();
        _;
    }

    /* -------------------------------------------------------------------------- */
    /*                                 Constructor                                */
    /* -------------------------------------------------------------------------- */

    constructor() Ownable(msg.sender) {}

    /* -------------------------------------------------------------------------- */
    /*                               Signer control                               */
    /* -------------------------------------------------------------------------- */

    function addSigner(address signer) external onlyOwner {
        if (signer == address(0)) revert ZeroAddress();
        whitelist[signer] = true;
        emit SignerAdded(signer);
    }

    function removeSigner(address signer) external onlyOwner {
        whitelist[signer] = false;
        emit SignerRemoved(signer);
    }

    /* -------------------------------------------------------------------------- */
    /*                                CRUD actions                                */
    /* -------------------------------------------------------------------------- */

    /** Submit a new invoice. */
    function submitInvoice(bytes32 sha256Hash, string calldata hashcode)
        external
        whenNotPaused
        onlySigner
    {
        if (!_validCode(hashcode)) revert InvalidHashcode();
        if (invoices[hashcode].timestamp != 0) revert InvoiceExists();

        invoices[hashcode] = Invoice({
            hash:       sha256Hash,
            hashcode:   hashcode,
            issuer:     msg.sender,
            timestamp:  block.timestamp,
            revoked:    false,
            completed:  false
        });
        hashExists[sha256Hash] = true;

        emit InvoiceSubmitted(hashcode, msg.sender, block.timestamp);
    }

    /** Revoke (cancel) an invoice. */
    function revokeInvoice(string calldata hashcode)
        external
        whenNotPaused
        onlySigner
    {
        Invoice storage inv = invoices[hashcode];
        if (inv.timestamp == 0)      revert InvoiceUnknown();
        if (inv.revoked)             revert AlreadyRevoked();
        if (inv.completed)           revert AlreadyCompleted();

        inv.revoked = true;
        emit InvoiceRevoked(hashcode, msg.sender);
    }

    /** Mark an invoice as completed/paid. */
    function completeInvoice(string calldata hashcode)
        external
        whenNotPaused
        onlySigner
    {
        Invoice storage inv = invoices[hashcode];
        if (inv.timestamp == 0)      revert InvoiceUnknown();
        if (inv.completed)           revert AlreadyCompleted();
        if (inv.revoked)             revert AlreadyRevoked();

        inv.completed = true;
        emit InvoiceCompleted(hashcode, msg.sender);
    }

    /* -------------------------------------------------------------------------- */
    /*                               View helpers                                 */
    /* -------------------------------------------------------------------------- */

    /// Quick existence check by SHA‑256 digest.
    function shaExists(bytes32 sha256Hash) external view returns (bool) {
        return hashExists[sha256Hash];
    }

    /// Fetch full invoice metadata by hashcode.
    function getInvoice(string calldata hashcode) external view returns (Invoice memory) {
        return invoices[hashcode];
    }

    /* -------------------------------------------------------------------------- */
    /*                                Pausable                                    */
    /* -------------------------------------------------------------------------- */

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    /* -------------------------------------------------------------------------- */
    /*                              Internal utils                                */
    /* -------------------------------------------------------------------------- */

    function _validCode(string calldata code) private pure returns (bool) {
        bytes calldata b = bytes(code);
        if (b.length != 13) return false;
        return b[0] == "I" && b[1] == "N" && b[2] == "V" && b[3] == "-";
    }
}
