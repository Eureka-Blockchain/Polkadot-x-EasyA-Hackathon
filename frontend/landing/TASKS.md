### Eureka Wait‑list — 3‑Step Build (Next.js v14+) ✅/❌

1. [ ] **Landing page UI (`/page.tsx`)**  
   * Next.js App‑Router + Tailwind.  
   * Inputs: **email** (required), **name** (optional).  
   * Client‑side email regex and inline success/error banners.

2. [ ] **Serverless handler (`/api/subscribe/route.ts`)**  
   * `POST { email, name }` → validate → call Airtable REST:  
     `POST https://api.airtable.com/v0/<BASE_ID>/<TABLE_ID>/records`.  
   * Return `{ ok: true, position: <int> }` or `{ error: "duplicate" }`.  
   * Basic anti‑bot: hidden honeypot field + IP rate‑limit (Edge Middleware).

3. [ ] **Deploy & wire secrets (Vercel)**  
   * Set env vars: `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID`.  
   * Add custom domain `eureka.xyz`; verify SSL.  
   * Smoke‑test: valid signup logs new row in Airtable, duplicate shows graceful “Already on list”.
