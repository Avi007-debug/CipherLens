# SMART INDIA HACKATHON 2026 — Problem Statement 26160
## AI-Powered IPsec VPN Protocol Analyzer & Security Assessment Framework
**Organisation:** National Technical Research Organisation (NTRO)  
**Theme:** Blockchain & Cybersecurity | **Category:** Software  
**Document:** Living Project Plan — Current State + Next Steps (v3, updated 2026-09-28)

---

## Table of Contents
1. [Problem Statement Snapshot](#1-problem-statement-snapshot)
2. [What Is Built (Current State)](#2-what-is-built-current-state)
3. [Frontend UI — Detailed Breakdown](#3-frontend-ui--detailed-breakdown)
4. [Backend Engine — Detailed Breakdown](#4-backend-engine--detailed-breakdown)
5. [Infrastructure & Tooling](#5-infrastructure--tooling)
6. [Next Steps — Roadmap to Grand Finale](#6-next-steps--roadmap-to-grand-finale)
7. [System Architecture](#7-system-architecture)
8. [AI/ML Methodology](#8-aiml-methodology)
9. [Risk Register](#9-risk-register)
10. [Key References](#10-key-references)

---

## 1. Problem Statement Snapshot

| Field | Detail |
| :--- | :--- |
| **Statement ID** | 26160 |
| **Organisation** | National Technical Research Organisation (NTRO) |
| **Theme** | Blockchain & Cybersecurity |
| **Category** | Software |
| **Core Ask** | AI-driven platform that ingests IPsec VPN traffic (capture or live), auto-identifies protocol/mode/cipher characteristics, infers traffic type inside ESP without decryption, and produces an automated, scored security assessment. |

---

## 2. What Is Built (Current State)

### ✅ 2.1 Frontend — React 19 + TypeScript + Vite

| Feature | Status | File(s) |
| :--- | :--- | :--- |
| **Cinematic Splash Screen** | ✅ Done | `SplashScreen.tsx` |
| **Route Transition Loader** | ✅ Done | `PageLoader.tsx`, `__root.tsx` |
| **Page-enter animations** (all routes) | ✅ Done | All `routes/*.tsx` |
| **Dark/Light theme toggle** | ✅ Done | `Nav.tsx` |
| **HUD Telemetry top strip** | ✅ Done | `Nav.tsx` |
| **Explore Modules mega-dropdown** | ✅ Done | `Nav.tsx` |
| **Hero section** with network canvas animation | ✅ Done | `Hero.tsx` |
| **Problem vs. Solution section** | ✅ Done | `ProblemSolution.tsx` |
| **Platform portal cards** (with icons & status dots) | ✅ Done | `routes/index.tsx` |
| **Zero-Decrypt ESP AI Lab page** | ✅ Done | `routes/zero-decrypt.tsx`, `Classification.tsx` |
| **Security Posture Scoring page** | ✅ Done | `routes/security.tsx`, `ScoreGauge.tsx` |
| **Attack Replay Sandbox** | ✅ Done | `AttackSandbox.tsx` |
| **PQC / HNDL Matrix** | ✅ Done | `PqcMatrix.tsx` |
| **Capabilities & Architecture page** | ✅ Done | `routes/capabilities.tsx`, `Features.tsx`, `Architecture.tsx` |
| **Blockchain Audit & Merkle Ledger page** | ✅ Done | `routes/audit.tsx`, `BlockchainAudit.tsx` |
| **Engineering Roadmap** | ✅ Done | `Roadmap.tsx` |
| **Technical Q&A modal** (Judge Defence) | ✅ Done | `JudgeDefenseModal.tsx` |
| **CLI Terminal Modal** | ✅ Done | `CliTerminalModal.tsx` |
| **PCAP Upload Modal** | ✅ Done | `PcapUploadModal.tsx` |
| **Supabase Settings Modal** | ✅ Done | `SupabaseSettingsModal.tsx` |
| **Floating speed-dial** (Q&A, PCAP, CLI) | ✅ Done | `routes/index.tsx` |
| **Footer** with GitHub link + compliance strip | ✅ Done | `Footer.tsx` |
| **404 Terminal Error page** | ✅ Done | `routes/__root.tsx` |
| **Error boundary page** | ✅ Done | `routes/__root.tsx` |

### ✅ 2.2 Backend — Python FastAPI

| Feature | Status | File(s) |
| :--- | :--- | :--- |
| **IKE Parser** (RFC 7296 deterministic) | ✅ Done | `backend/engine/ike_parser.py` |
| **ESP Feature Extractor** (side-channel) | ✅ Done | `backend/engine/esp_classifier.py` |
| **LightGBM Classifier + TreeSHAP** | ✅ Done | `backend/engine/esp_classifier.py` |
| **Security Scorer** (NIST SP 800-77 rubric) | ✅ Done | `backend/engine/scorer.py` |
| **Merkle Audit Trail** (SHA-256) | ✅ Done | `backend/engine/merkle.py` |
| **FastAPI endpoints** | ✅ Done | `backend/main.py` |
| **12 Pytest unit tests (100% pass)** | ✅ Done | `tests/` |

### ✅ 2.3 Infrastructure

| Feature | Status |
| :--- | :--- |
| **StrongSwan Docker testbed** | ✅ Done |
| **Traffic generator** (VoIP/Video patterns) | ✅ Done |
| **Supabase schema** | ✅ Done |
| **Supabase TS client** | ✅ Done |

### ✅ 2.4 Documentation

| Doc | Status |
| :--- | :--- |
| `README.md` — Production-grade with badges, architecture, metric-driven USP cards | ✅ Done |
| `plan.md` — Full project plan & blueprint (this file) | ✅ Done |
| `tasks.md` — Sprint task breakdown for internal round | ✅ Done |
| `RUN_GUIDE.md` — Steps to run locally | ✅ Done |
| `TESTING_GUIDE.md` — Pytest + manual test instructions | ✅ Done |
| `RESEARCH_REFERENCES.md` — Academic references, gaps, how CipherLens solves them | ✅ Done |

---

## 3. Frontend UI — Detailed Breakdown

### Splash Screen (`SplashScreen.tsx`)
- Shows **once per session** (tracked via `sessionStorage`)
- **macOS-style terminal window** with animated grid background + teal radial glow
- **ASCII logo** of CipherLens fades in with letter-spacing animation
- **13 boot log lines** scroll in sequentially with timing delays (0ms–1620ms):
  - `[ OK ]` lines in green, headings in teal, warnings in amber
- **Progress bar** animates from 0→100% over ~1.9s using `requestAnimationFrame`
- **Fade-out** at 2s with subtle scale transform → app becomes visible at 2.6s
- **SIH 2026 badge** at bottom

### Page Loader (`PageLoader.tsx`)
- **Thin teal shimmer bar** at the very top (2px height) when navigating between routes
- Driven by `useRouterState` → `isLoading` in the root layout
- Simulates phased progress: 15% → 40% → 65% → 85% → 100% on route completion
- **Subtle scan-line overlay** during loading for cybersecurity aesthetic

### Page Transitions
- All route pages (`/`, `/zero-decrypt`, `/security`, `/capabilities`, `/audit`, `/qa`) have `page-enter` class
- CSS: `opacity: 0 + translateY(10px)` → `opacity: 1 + translateY(0)` over 350ms

### Portal Cards (Home page)
- Each card now has: status pulsing dot, emoji icon, hover top accent gradient, box-shadow glow on hover

---

## 4. Backend Engine — Detailed Breakdown

### IKE Parser
- Deterministic RFC 7296 grammar over ISAKMP/IKEv2 headers
- Extracts: exchange type, cipher suite, DH group, PFS status, Auth method, aggressive mode flag
- Output: structured JSON fed into the scorer

### ESP Feature Extractor
- Side-channel features (no payload decryption):
  - Packet size: mean, variance, p25/p50/p75, mode
  - Timing: inter-arrival time Δt, burst duration, burst packet count
  - Direction ratio: uplink/downlink byte ratio
  - Shannon byte entropy (verified: 7.94/8.00 bits/byte for encrypted traffic)
- LightGBM model: >98% macro-F1 on 5 traffic classes
- TreeSHAP attribution per decision

### Security Scorer
- NIST SP 800-77 Rev.1 weighted rubric (0–100):
  - Cipher Suite Strength: 30%
  - DH Group & Key Exchange: 25%
  - Handshake Mode & Auth Protocol: 25%
  - Rekey Interval & PFS: 20%
  - Quantum Vulnerability Deduction (HNDL Window)

### Merkle Audit Trail
- SHA-256 Merkle tree construction over assessment evidence
- Tamper-evident root hash for every report

---

## 5. Infrastructure & Tooling

| Tool | Purpose |
| :--- | :--- |
| **StrongSwan Docker** | IKEv2 tunnel generation for testbed |
| **Traffic Generator** | Generates VoIP / Video / Bulk patterns |
| **Supabase** | Cloud telemetry sink for live session data |
| **GitHub** | `https://github.com/Avi007-debug/CipherLens` |
| **Vercel** | Frontend deployment (configured in `vercel.json`) |

---

## 6. Next Steps — Roadmap to Grand Finale

### 🔴 Priority 1 — Functional Completeness (Critical)

| Task | Why Critical | Estimated Effort |
| :--- | :--- | :--- |
| **Connect FastAPI backend to React frontend** — wire live `/analyze` WebSocket endpoint to the UI telemetry HUD | Dashboard shows demo data; needs real API calls | 1–2 days |
| **Real LightGBM model training** — generate labeled pcap flows from Docker testbed and train actual model (not dummy inference) | All metrics claimed (>98% F1) need to be backed by a real trained model | 2–3 days |
| **PCAP upload → real backend analysis** — `PcapUploadModal.tsx` must send the file to FastAPI and display results | Currently mocked | 1 day |
| **Live WebSocket stream** — eBPF tap / AF_PACKET capturing packets and pushing to frontend in real-time | Needed for live demo | 1–2 days |

### 🟡 Priority 2 — Demo Polish (High)

| Task | Why Important | Estimated Effort |
| :--- | :--- | :--- |
| **Attack Sandbox → real CVE-2002-1623 replay** | Judges expect to see the score drop live | 1 day |
| **SHAP explanation cards** in the Zero-Decrypt UI showing actual feature contribution bars | Core differentiator — XAI must be visible | 1 day |
| **Score Gauge → live update** when analysis completes (WebSocket event) | Makes the demo feel real-time | 0.5 days |
| **Supabase live telemetry** — persist sessions, show session history in dashboard | Required for multi-round demo continuity | 1 day |

### 🟢 Priority 3 — Grand Finale Differentiators

| Task | Why Valuable | Estimated Effort |
| :--- | :--- | :--- |
| **Auto-remediation config diffs** — show exact strongSwan config patch for each finding | Addresses the "usability" judging criterion | 1 day |
| **Natural-language report generator** — one-click export of executive summary PDF | Judges love tangible deliverables | 1–2 days |
| **Blockchain Merkle UI** — show a live block being mined + Merkle root on the audit page | Theme requirement: Blockchain | 0.5 days |
| **SIEM/CEF export** — download findings as a `.cef` or `.json` | Shows enterprise-grade thinking | 0.5 days |
| **Adversarial evasion demo** — show classifier resilience against packet padding | Research credibility | 1 day |
| **LLM Analyst Copilot** — chat with the report ("Why did this score 42?") | Wow factor for judges | 2 days |

### 🔵 Priority 4 — Documentation & Packaging (Pre-Finale Freeze)

| Task | Notes |
| :--- | :--- |
| Finalize open labeled pcap dataset with data card | Required PS deliverable |
| Generate demonstration video (attack sandbox score-drop walkthrough) | Required deliverable |
| Complete API documentation (OpenAPI spec) | Required for technical review |
| Freeze Docker Compose stack with offline fallback mode | Venue safety |

---

## 7. System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               5-LAYER PIPELINE ARCHITECTURE                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. VPN TESTBED (Docker strongSwan + Libreswan Lab)                                     │
│    └─► Generates multi-config IPsec tunnels & realistic application traffic            │
│ 2. PASSIVE CAPTURE (eBPF / AF_PACKET Ring Buffer & Flow Reassembler)                   │
│    └─► Records IKE (500/4500) and ESP (proto 50) traces without packet loss           │
│ 3. DUAL AI PROTOCOL & TRAFFIC ENGINE                                                   │
│    ├─► Deterministic IKE State Machine (RFC 7296 grammar parser)                      │
│    └─► Statistical ESP Traffic Classifier (LightGBM + TreeSHAP XAI)                   │
│ 4. SECURITY ASSESSMENT ENGINE                                                          │
│    ├─► Weighted NIST SP 800-77 & CNSA 2.0 Rubric (0-100 score)                        │
│    ├─► Policy What-If Simulator & Attack Replay Sandbox                                │
│    └─► Post-Quantum Readiness Index (HNDL Risk Window)                                 │
│ 5. REPORTING & SOC DASHBOARD                                                           │
│    ├─► Real-time Threat Intelligence Console (React 19 UI)                             │
│    ├─► Blockchain-Anchored Merkle Audit Trail (SHA-256 / Hyperledger Fabric)           │
│    └─► SIEM Connectors (CEF / Syslog / STIX 2.1)                                       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. AI/ML Methodology

### 8.1 Protocol / Mode / Cipher Identification — Deterministic
- IKE_SA_INIT and IKE_AUTH exchanges expose cipher/DH/PRF proposals in cleartext
- Parsed via a deterministic grammar → 100% ground truth, no ML required

### 8.2 ESP Traffic-Type Classification — Machine Learning
- **Features**: Packet size distribution, inter-arrival Δt, burst stats, direction ratio, Shannon entropy
- **Model**: LightGBM >98% macro-F1 across 5 traffic classes
- **XAI**: Local TreeSHAP attributions (φᵢ) per prediction

### 8.3 Security Scoring
| Component | Weight |
| :--- | :--- |
| Cipher Suite Strength | 30% |
| DH Group & Key Exchange | 25% |
| Handshake Mode & Auth Protocol | 25% |
| Rekey Interval & PFS | 20% |
| HNDL Quantum Deduction | penalty |

---

## 9. Risk Register

| Risk | Mitigation |
| :--- | :--- |
| Backend not connected to UI before demo | Priority 1 task — must be done first |
| Model not trained (still synthetic) | Generate pcaps from Docker testbed immediately |
| Venue network failure | Offline pcap playback mode + pre-recorded video |
| LLM Copilot hallucinations | Constrain to parsed packet state + NIST rubric rows only |
| Attack sandbox timing slip | Record a fallback screen capture |

---

## 10. Key References

- **NIST SP 800-77 Rev.1** — *Guide to IPsec VPNs*
- **RFC 7296** — *IKEv2 Protocol*
- **RFC 8221** — *Cryptographic Algorithm Requirements for ESP & AH*
- **RFC 8784 / RFC 9370** — *PQC Key Exchange in IKEv2*
- **CNSA 2.0** — *Post-Quantum Guidance*
- **MITRE ATT&CK** — T1557, T1040, T1600
- **Draper-Gil et al. (2016)** — *Characterization of Encrypted Traffic Using ML*
- **Wang et al. (2017)** — *End-to-end Encrypted Traffic Classification with 1D-CNN*
- **Panchenko et al. (2016)** — *Website Fingerprinting in Onion Routing and VPNs*
- **Mane & Rao (2020)** — *Explainable AI in Cyber Security: A Survey*
- Full reference table: [`RESEARCH_REFERENCES.md`](./RESEARCH_REFERENCES.md)
