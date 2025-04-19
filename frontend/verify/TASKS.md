# Eureka – Build Checklist  ✅/❌

## 0. Repository & CI
- [ ] **Repo scaffolding**
  - [ ] `Eureka` repo with folders: `contracts/`, `web/`, `docs/`
  - [ ] MIT `LICENSE` and `CODEOWNERS`
- [ ] **Continuous Integration**
  - [ ] GitHub Actions workflow runs `cargo test --all-features`
  - [ ] GitHub Actions workflow runs `pnpm test` in `/web`

---

## 1. Smart Contract (`contracts/Eureka`)
- [ ] **Spec & design**
  - [ ] `docs/contract-spec.md` describes storage, events, failure modes
  - [ ] Edge‑case matrix (duplicate hash, over‑payment, re‑entrancy) complete
- [ ] **Implementation (`lib.rs`)**
  - [ ] `add_invoice(hash, payee, amount, due)`
  - [ ] `mark_paid(hash)` (payable; emits `InvoicePaid`)
  - [ ] `verify(hash) -> Option<Invoice>`
  - [ ] Unit tests cover success & failure paths (≥ 90 % coverage)
- [ ] **Local deployment**
  - [ ] Deployed to ink!athon local node; address captured in `.env`
  - [ ] `deployment.md` shows CLI output for `upload` and `instantiate`
- [ ] **Performance & security**
  - [ ] Weight benchmarks recorded (`cargo contract contract-call-dry-run`)
  - [ ] `cargo contract fuzz` + static scan run; findings fixed or documented

---

## 2. Invoice‑Issuer SDK / CLI (`scripts/`)
- [ ] **Canonical hashing**
  - [ ] Pure JS/TS function: `canonicalHash(file) -> sha256`
  - [ ] Hex result matches Rust test vector
- [ ] **Mint script**
  - [ ] `mint_invoice.ts` publishes hash + metadata via RPC
  - [ ] Generates QR PNG and short‑code (`HB‑XXXX‑YYYY`) locally
- [ ] **Optional IPFS support**
  - [ ] `--ipfs` flag pins file via Web3.storage and stores CID on‑chain
  - [ ] CID retrieval verified in browser

---

## 3. Public Verification Web (`web/`)
- [ ] **Framework setup**
  - [ ] Next.js 18 App Router, Tailwind, `@polkadot/api-contract`
- [ ] **Verify page**
  - [ ] Dynamic route `/verify/[code]`
  - [ ] Auto‑fetch blob (IPFS or CDN), hash in browser, call `verify()`
  - [ ] Badge UI with three states: `Valid Unpaid`, `Valid Paid`, `Unknown`
  - [ ] Displays amount, due‑date, payee address
- [ ] **Manual entry fallback**
  - [ ] Accessible form to paste short‑code
  - [ ] Robust errors: network fail, wrong chain, RPC timeout
- [ ] **Deploy**
  - [ ] Production build on Vercel at `verify.myutility.com`
  - [ ] Branch‑preview links enabled

---

## 4. Internal Issuer Dashboard (stretch)
- [ ] Create‑invoice form (drag & drop, preview, “Publish” button)
- [ ] Signs with issuer wallet (polkadot{.js} extension or Ledger)
- [ ] SQLite (or Supabase) stores tx‑hash + customer metadata

---

## 5. End‑to‑End Tests
- [ ] **Node‑level integration**  
  `tests/e2e.rs`: spin up local node → deploy contract → mint invoice → assert `verify() == Unpaid`
- [ ] **Browser‑level test**  
  Playwright script loads `/verify/HB‑XXXX` and checks for green badge
- [ ] CI job `e2e.yml` runs both suites on every PR

---

## 6. DevOps & Hosting
- [ ] **RPC endpoints**  
  - [ ] Primary: OnFinality community node  
  - [ ] Fallback: Dwellir open RPC
- [ ] **DNS & SSL**  
  - [ ] `verify.myutility.com` CNAME → Vercel  
  - [ ] Cloudflare IPFS gateway subdomain configured (if IPFS enabled)
- [ ] **Secrets management**  
  - [ ] GitHub‑encrypted JSON for deploy key & Web3.storage token
  - [ ] Vercel env vars for RPC URLs and contract address

---

## 7. Documentation & Media
- [ ] **README.md**
  - [ ] ≤ 150‑char summary
  - [ ] Problem → Solution → Why Polkadot Asset Hub
  - [ ] Architecture diagram (PNG/SVG)
  - [ ] Run‑locally instructions (`cargo`, `pnpm`, deploy)
  - [ ] Contract addresses, gas table, links to slides & Loom video
- [ ] **Canva deck** (6 slides: Team • Problem • Solution • Demo • Tech • Roadmap)
- [ ] **Demo GIF** (e.g. `assets/scan-demo.gif` showing green badge)
- [ ] **Loom video** (repo walk‑through + live testnet demo, ≤ 3 min)

---

## 8. Submission Package
- [ ] Git tag `v1.0-hackathon` created
- [ ] GitHub Release contains compiled `.contract` bundle + slide PDF
- [ ] Hackathon submission form completed (repo, summary, Canva, Loom)
- [ ] Smoke‑test: Scan printed QR on fresh phone & public Wi‑Fi

---

> Tick every box before you hit **Submit**—nothing here is boilerplate; each item maps to a judging rubric point. Good luck and happy hashing! 🚀
