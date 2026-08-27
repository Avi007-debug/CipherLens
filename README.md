<div align="center">

# 🛡️ CipherLens

### AI-Powered IPsec VPN Protocol Analyzer & Security Assessment Framework
**Smart India Hackathon 2026** | **Problem Statement:** 26160 | **Theme:** Blockchain & Cybersecurity  
**Organisation:** National Technical Research Organisation (NTRO)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=github-actions)](https://github.com/Avi007-debug/CipherLens)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.2-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Compliance](https://img.shields.io/badge/Compliance-NIST_SP_800--77r1_·_CNSA_2.0-blue?style=flat-square)](https://csrc.nist.gov)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<p align="center">
  <strong>"Audit the tunnel. Never decrypt the payload."</strong><br>
  Deterministic IKEv1/IKEv2 state-machine dissection, zero-decryption ESP flow classification with TreeSHAP explainability, and blockchain-anchored posture scoring.
</p>

[Quick Start](#-quick-start) • [Architecture](#-system-architecture) • [Features](#-key-capabilities) • [API Reference](#-api-endpoints) • [Run Guide](RUN_GUIDE.md) • [Testing Guide](TESTING_GUIDE.md)

</div>

---

## 📌 Problem Statement Overview

Enterprise and defense networks rely on **IPsec VPNs** to safeguard mission-critical communications. Under **NTRO Problem Statement 26160**, the primary challenges are:
1. **Zero-Decryption Requirement**: Identifying protocol types, cipher transforms, and anomalous application traffic inside encrypted ESP tunnels without violating privacy or breaking end-to-end encryption.
2. **Deterministic vs. Statistical Split**: Parsing cleartext IKE negotiations deterministically (100% ground truth) while classifying opaque ESP payloads statistically using second-order side-channel metadata.
3. **Standards-Linked Scoring**: Formulating a defensible 0–100 posture score anchored to **NIST SP 800-77 Rev.1** and **CNSA 2.0** cryptographic guidance.
4. **Actionable Remediation**: Providing one-click auto-remediation configuration diffs and blockchain-anchored audit trails.

---

## ⚡ Key Capabilities

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              CIPHERLENS CORE CAPABILITIES                              │
├──────────────────────────────┬──────────────────────────────┬──────────────────────────┤
│ 1. Deterministic IKE Dissect │ 2. Zero-Decryption ESP AI    │ 3. NIST SP 800-77 Score  │
│ • IKEv1 & IKEv2 State Parser │ • LightGBM + 24 Flow Metrics │ • Weighted 0-100 Gauge   │
│ • CVE-2002-1623 PSK Crack ID │ • Isochronous 20ms VoIP ID   │ • 5 Defense Dimensions   │
│ • Sweet32 3DES Collision ID  │ • TreeSHAP Explainability    │ • HNDL Quantum Exposure  │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────┤
│ 4. Attack-Replay Sandbox     │ 5. Policy What-If Simulator  │ 6. Blockchain Merkle Log │
│ • 4 Isolated Exploit Classes │ • ipsec.conf Syntax Parser   │ • SHA-256 Merkle Proofs  │
│ • Live Score Drop Telemetry  │ • Instant Score Delta Diff   │ • Hyperledger Attestation│
└──────────────────────────────┴──────────────────────────────┴──────────────────────────┘
```

- **Zero-Decryption Flow Classifier**: Classifies VoIP ($99.4\%$), HD Video ($98.1\%$), Web ($96.7\%$), Bulk Exfil ($97.5\%$), and DNS Tunnels ($99.1\%$) using packet-size variance, inter-arrival timing $\Delta t$, and burst cadence.
- **Explainable AI (XAI)**: Every prediction attaches local TreeSHAP attributions ($\phi_i$) certifying exact decision boundaries.
- **Shannon Entropy Verification**: Computes $H(X) \approx 7.94 / 8.00\text{ bits/byte}$ to mathematically prove ciphertext opacity before inference.
- **Pre-Deployment Policy Simulator**: Pastes/edits `ipsec.conf` directives and calculates instant score deltas (e.g. $+52\text{ pts}$).
- **Active Attack Sandbox**: Replays known exploits (Aggressive Mode PSK capture, FREAK downgrade, Half-Open DoS) and demonstrates live defensive mitigations.

---

## 🏗️ System Architecture

```
                                    CIPHERLENS 5-LAYER PIPELINE
                                    
  [ Layer 1: Testbed ]         strongSwan 5.9 / Libreswan Multi-Node Docker Topology
                                           │
  [ Layer 2: Passive Tap ]     eBPF Kernel Socket / Zero-Copy Ring Buffer
                                           │
  [ Layer 3: Dual AI Engine ]  ┌───────────────────────────┬───────────────────────────┐
                               │ Deterministic IKE Parser  │ Statistical ESP Classifier│
                               │ (RFC 7296 Grammar State)  │ (LightGBM + TreeSHAP XAI) │
                               └─────────────┬─────────────┴─────────────┬─────────────┘
                                             │                           │
  [ Layer 4: Assessment ]      NIST SP 800-77 Scoring + Policy Simulator + Attack Sandbox
                                           │
  [ Layer 5: Console & Ledger] React 19 SOC Dashboard + Supabase DB + SHA-256 Merkle Ledger
```

---

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/Avi007-debug/CipherLens.git
cd CipherLens
```

### 2. Launch Frontend Dashboard (Port 5173)
```bash
npm install
npm run dev
# Dashboard opens at: http://localhost:5173/
```

### 3. Launch FastAPI Engine (Port 8000)
```bash
pip install -r backend/requirements.txt
python -m uvicorn backend.app:app --reload --port 8000
# API Docs open at: http://localhost:8000/docs
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/telemetry/live` | Real-time packet counters, active tunnels, and eBPF tap status |
| `GET` | `/api/handshake/inspect` | Deterministic IKE state machine handshake parser |
| `POST` | `/api/classify/esp` | Zero-decryption ESP flow classifier with TreeSHAP attributions |
| `POST` | `/api/simulate/policy` | Live `ipsec.conf` policy what-if simulator & posture delta |
| `POST` | `/api/sandbox/replay` | Active attack-replay sandbox exploit emulator |
| `GET` | `/api/ledger/receipt` | SHA-256 Merkle root attestation receipt generator |
| `POST` | `/api/scan/pcap` | Upload and dissect raw `.pcap` capture files |

---

## 🧪 Testing & Verification

Run the automated test suites:

```bash
# Run backend engine tests
pytest tests/ -v

# Run frontend production build check
npm run build
```

See [`TESTING_GUIDE.md`](TESTING_GUIDE.md) for detailed unit, integration, and security test instructions.

---

## 🗺️ Project Roadmap

- [x] **Phase 0: Internal College Evaluation (15 Marks Target)** — Live strongSwan lab, Scapy dissector, LightGBM classifier, NIST score dial, attack sandbox, pitch HUD.
- [ ] **Phase 1: Multi-Implementation Matrix** — Cross-vendor validation across strongSwan, Libreswan, and native Windows/macOS IPsec stacks.
- [ ] **Phase 2: 1D-CNN Temporal Flow Model** — Deep learning flow classifier benchmarked against LightGBM baseline.
- [ ] **Phase 3: Real-Time Live Interface Sniffer** — Direct raw AF_PACKET/eBPF promiscuous socket integration.
- [ ] **Phase 4: Permissioned Hyperledger Ledger** — Hyperledger Fabric v2.5 raft-consensus channel integration.
- [ ] **Phase 5: SOC / SIEM Connectors** — ArcSight CEF, Syslog, and STIX 2.1 JSON live exporter.
- [ ] **Phase 6: Grand Finale Packaging** — Frozen single-command Docker deployment & open dataset contribution.

---

## 👥 Authors & Team

Built with pride for **Smart India Hackathon 2026** (Problem Statement 26160, NTRO).

- **Team Lead & Security Researcher**: Architecture, NIST compliance & pitch delivery.
- **ML & Signal Engineer**: Statistical side-channel engineering & TreeSHAP XAI.
- **Systems & Testbed Engineer**: strongSwan Docker lab & traffic generators.
- **Full-Stack Developer**: React console, FastAPI microservices & Supabase sync.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.