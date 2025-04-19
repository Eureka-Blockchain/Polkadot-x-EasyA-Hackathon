### Public & External Functions in **`EurekaInvoiceRegistryV2`**

### Contract ID: 0x19C8500bf08dDc7941801Fb629a4307C2bCdcD7E

| # | Solidity signature | Visibility / state‑mutability | Access guard(s) | What it does |
|---|-------------------|--------------------------------|-----------------|--------------|
| **1** | `constructor()` | — (runs once) | — | Deploys the contract and sets the deployer as the **owner** (`Ownable`). |
| **2** | `addSigner(address signer)` | `external` | `onlyOwner` | Adds an address to the **whitelist** so it can submit / manage invoices. Emits `SignerAdded`. |
| **3** | `removeSigner(address signer)` | `external` | `onlyOwner` | Removes an address from the whitelist. Emits `SignerRemoved`. |
| **4** | `submitInvoice(bytes32 sha256Hash, string hashcode)` | `external` | `onlySigner`, `whenNotPaused` | Stores a new invoice (SHA‑256 + `INV‑XXXX‑XXXX`). Fails on duplicate code. Emits `InvoiceSubmitted`. |
| **5** | `revokeInvoice(string hashcode)` | `external` | `onlySigner`, `whenNotPaused` | Marks an invoice as **revoked** (cancelled). Cannot be called after completion. Emits `InvoiceRevoked`. |
| **6** | `completeInvoice(string hashcode)` | `external` | `onlySigner`, `whenNotPaused` | Marks an invoice as **completed** (paid). Cannot be called if revoked. Emits `InvoiceCompleted`. |
| **7** | `shaExists(bytes32 sha256Hash)` | `external view` | — | Returns **`true`/`false`** if a given SHA‑256 hash is already stored (`hashExists`). |
| **8** | `getInvoice(string hashcode) → Invoice` | `external view` | — | Fetches the full `Invoice` struct by its human code. |
| **9** | `pause()` | `external` | `onlyOwner` | Activates the global **pause** (blocks functions with `whenNotPaused`). |
| **10** | `unpause()` | `external` | `onlyOwner` | Lifts the pause. |

---

#### Auto‑generated & inherited helpers

| Source | Key functions exposed |
|--------|----------------------|
| **Mapping auto‑getters** | `invoices(string) → Invoice` &nbsp;•&nbsp; `hashExists(bytes32) → bool` &nbsp;•&nbsp; `whitelist(address) → bool` |
| **Ownable** | `owner()` • `transferOwnership(address)` • `renounceOwnership()` |
| **Pausable** | `paused()` |

All of these are `public view` except the ownership transfers, which are `onlyOwner`.

That’s the full callable surface of the latest SHA‑256–based registry.