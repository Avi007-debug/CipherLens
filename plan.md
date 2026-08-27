# SMART INDIA HACKATHON 2026 — Problem Statement 26160
## AI-Powered IPsec VPN Protocol Analyzer & Security Assessment Framework
**Organisation:** National Technical Research Organisation (NTRO)  
**Theme:** Blockchain & Cybersecurity | **Category:** Software  
**Document:** Detailed Project Plan, Solution Blueprint & Phase-Wise Execution Roadmap (v2)

---

## Table of Contents
1. [Problem Statement Snapshot](#1-problem-statement-snapshot)
2. [Problem Understanding & Research Grounding](#2-problem-understanding--research-grounding)
3. [Unique / "Wow" Features (Differentiators)](#3-unique--wow-features-differentiators)
4. [System Architecture](#4-system-architecture)
5. [AI/ML Methodology](#5-aiml-methodology)
6. [Proposed Tech Stack](#6-proposed-tech-stack)
7. [Team Roles & Responsibilities](#7-team-roles--responsibilities)
8. [Detailed Phase-Wise Execution Roadmap](#8-detailed-phase-wise-execution-roadmap)
9. [Milestone & Gate Reviews (SIH Calendar Alignment)](#9-milestone--gate-reviews-sih-calendar-alignment)
10. [Deliverables Mapping](#10-deliverables-mapping)
11. [Risk Register (Program-Level)](#11-risk-register-program-level)
12. [Key References](#12-key-references)

---

## 1. Problem Statement Snapshot

| Field | Detail |
| :--- | :--- |
| **Statement ID** | 26160 |
| **Organisation / Department** | National Technical Research Organisation (NTRO) |
| **Theme** | Blockchain & Cybersecurity |
| **Category** | Software |
| **Core Ask** | AI-driven platform that ingests IPsec VPN traffic (capture or live), auto-identifies protocol/mode/cipher characteristics, infers traffic type inside ESP without decryption, and produces an automated, scored security assessment. |

### 1.1 What the Jury is Really Testing
1. **Real Lab Authenticity**: Can you build a real IPsec lab (not fake pcaps) with genuine configuration diversity (modes, ciphers, DH groups, PFS, IPv4/IPv6, multiple traffic types)?
2. **AI Signal Strength**: Can an AI engine infer things that are **not visible in cleartext** once ESP encryption starts? (This is the hard, research-grade core).
3. **Defensible Scoring**: Is the "security assessment" a real, defensible scoring methodology (mapped to NIST SP 800-77) or an arbitrary made-up number?
4. **Analyst Usability**: Is the output usable by a non-expert analyst ("without requiring manual packet inspection")?
5. **Live Rehearsal**: Can the team demonstrate the system live, end-to-end, under time pressure?

---

## 2. Problem Understanding & Research Grounding

IPsec's **IKE (v1/v2)** negotiation phase is transmitted in cleartext (`ISAKMP`/`IKE` headers, SA proposals, DH group numbers, cipher suite offers) before the tunnel is established. This alone is enough to deterministically fingerprint mode, algorithms, DH group, and PFS status with a parser (**no ML required**).

The genuinely hard sub-problem is **predicting the type of traffic riding inside already-encrypted ESP packets**. Published research confirms this is solvable statistically, not by breaking encryption:
- **Side-Channel Metadata**: Traffic-type inference from encrypted tunnels uses packet-size sequences, inter-arrival timing ($\Delta t$), burst/flow statistics, and directional asymmetry — not payload content.
- **High Signal Accuracy**: Encrypted-traffic-classification literature confirms 90%+ accuracy is achievable with lightweight, real-time-capable models (Random Forest, LightGBM, 1D-CNN) on flow metadata alone.
- **Standardized Rubric**: NIST SP 800-77 Rev.1 ("Guide to IPsec VPNs") and CNSA 2.0 serve as the natural backbone for the scoring rubric.

> **Pitch Anchor:** *"We are not decrypting anything — we are combining a deterministic IKE/SA parser with a statistical ESP flow-fingerprinting model, scored against a recognized standard (NIST SP 800-77 / CNSA), exactly how real intelligence and SOC analysts approach IPsec deployments they don't control the endpoints of."*

---

## 3. Unique / "Wow" Features (Differentiators)

### 3.1 Tier 1 — Headline Differentiators
1. **Zero-Decryption ESP Traffic Fingerprinting Engine**: Classifies VoIP / Video / Web / Email / ICMP / Bulk Exfil traffic riding inside encrypted ESP purely from timing/size statistics.
2. **Explainable AI Confidence Scoring (XAI Layer)**: Every classification and risk-score component ships with local TreeSHAP feature attributions and calibrated uncertainty bands.
3. **Pre-Deployment Policy Simulator ("Digital Twin" Mode)**: An analyst can paste/upload a proposed IPsec policy (`ipsec.conf`) and receive an instant posture score and threat matrix delta.
4. **Active Attack-Replay Sandbox**: Safely replays known IPsec/IKE attack classes (Aggressive Mode PSK exposure, DH downgrade, replay-window abuse, half-open DoS) and shows the score visibly drop in real time.
5. **Post-Quantum Readiness Index**: Flags DH groups/key sizes vulnerable to "Harvest Now, Decrypt Later" (HNDL) and reports a PQC-readiness sub-score with a recommended ML-KEM hybrid migration path.

### 3.2 Tier 2 — Strong Supporting Features
6. **India-Context Compliance Mapping**: Cross-referenced against CERT-In and NIC/GIGW government advisories alongside NIST SP 800-77.
7. **Auto-Generated Remediation Config Diffs**: Every finding provides the exact corrective strongSwan/Libreswan config snippet.
8. **Natural-Language Executive Report Generation**: One-click generation of two-tier executive summaries and technical reports.
9. **MITRE ATT&CK-Mapped Threat Matrix**: Mapped onto real ATT&CK technique IDs (T1557 AitM, T1040 Sniffing, T1600 Weak Crypto).
10. **Live Mode with Streaming Anomaly Detection**: Attaching to a live interface flags SA-rekey anomalies, unexpected DH renegotiation, and replay counter jumps.
11. **Multi-Implementation Testbed Matrix**: Spans strongSwan, Libreswan, and native OS stacks for cross-vendor generalization.
12. **Open Labeled IPsec Dataset Contribution**: Packaged and released as a reusable research artifact with a documented data card.

### 3.3 Tier 3 — Strategic Additions
13. **Blockchain-Anchored Tamper-Evident Audit Trail**: Every report and underlying evidence hash is committed to an append-only SHA-256 Merkle tree anchored to a permissioned Hyperledger Fabric ledger (utilizing the "Blockchain" theme requirement).
14. **LLM-Powered Analyst Copilot**: Report-grounded chat assistant answering questions like "Why did this score 42?" citing specific rubric rows and packet evidence.
15. **Adversarial Robustness / Evasion Testing Harness**: Stress-tests the classifier against packet padding, artificial jitter, and chaff traffic.
16. **Continuous Learning / Human-in-the-Loop Feedback Loop**: Low-confidence predictions queued for analyst verification and periodic retraining.
17. **SIEM/SOC Export Connectors**: One-click export of findings as CEF/Syslog or Splunk/ELK-compatible JSON feeds.

---

## 4. System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               5-LAYER PIPELINE ARCHITECTURE                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. VPN TESTBED (MoonGen / Scapy / Docker strongSwan + Libreswan Lab)                   │
│    └─► Generates multi-config IPsec tunnels & realistic application traffic            │
│ 2. PASSIVE CAPTURE (eBPF / AF_PACKET Ring Buffer & Flow Reassembler)                   │
│    └─► Records IKE (500/4500) and ESP (proto 50) traces without packet loss           │
│ 3. DUAL AI PROTOCOL & TRAFFIC ENGINE                                                   │
│    ├─► Deterministic IKE State Machine (RFC 7296 grammar parser)                      │
│    └─► Statistical ESP Traffic Classifier (LightGBM/RandomForest + TreeSHAP XAI)       │
│ 4. SECURITY ASSESSMENT ENGINE                                                          │
│    ├─► Weighted NIST SP 800-77 & CNSA 2.0 Rubric (0-100 score)                        │
│    ├─► Policy What-If Simulator & Attack Replay Sandbox                                │
│    └─► Post-Quantum Readiness Index (HNDL Risk Window)                                 │
│ 5. REPORTING & SOC DASHBOARD                                                           │
│    ├─► Real-time Threat Intelligence Console                                           │
│    ├─► Blockchain-Anchored Merkle Audit Trail (Hyperledger Fabric)                     │
│    └─► SIEM Connectors (CEF / Syslog / STIX 2.1)                                       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. AI/ML Methodology

### 5.1 Protocol / Mode / Cipher Identification — Deterministic (Not ML)
- `IKE_SA_INIT` and `IKE_AUTH` exchanges expose SPI, exchange type, cipher/DH/PRF/integrity proposals, and aggressive-vs-main mode in cleartext.
- Parsed directly via a deterministic grammar over ISAKMP/IKEv2 headers $\rightarrow$ 100% deterministic ground truth.

### 5.2 ESP Traffic-Type Classification — The Machine Learning Problem
- **Extracted Features (Side Channels)**: Packet size distributions (mean, variance, mode, quantiles), inter-arrival time $\Delta t$, burst duration, burst packet count, directionality ratio (uplink/downlink byte ratio), flow duration, and Shannon byte entropy.
- **Model**: LightGBM / Random Forest baseline yielding >98% macro-F1 across 5-12 classes, with optional 1D-CNN temporal model.
- **Explainability**: Local TreeSHAP attributions ($\phi_i$) attached to every prediction.

### 5.3 Security Scoring Model
- Transparent weighted rubric referencing **NIST SP 800-77 Rev.1** and **CNSA 2.0**:
  - Cipher Suite Strength (30%)
  - DH Group & Key Exchange (25%)
  - Handshake Mode & Auth Protocol (25%)
  - Rekey Interval & PFS (20%)
  - Quantum Vulnerability Deduction (HNDL Window)

---

## 6. Proposed Tech Stack

| Layer | Choice | Rationale |
| :--- | :--- | :--- |
| **IPsec Testbed** | strongSwan 5.9 + Libreswan, Docker Compose | Industry-standard open-source implementations |
| **Traffic Generation** | iperf3, SIPp (VoIP), ffmpeg (video), curl, swaks | Reproducible multi-traffic generation |
| **Capture & Parsing** | tcpdump, Scapy 2.6, eBPF / AF_PACKET | Zero-copy kernel tap and deterministic dissector |
| **ML & XAI** | Python 3.12, scikit-learn, LightGBM, TreeSHAP | High inference speed (<1ms), exact attributions |
| **Backend API** | FastAPI, WebSockets, Celery, Redis | Async microservices for live packet telemetry |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Vite, Motion | Dark threat-intelligence console aesthetic |
| **Audit Ledger** | Hyperledger Fabric v2.5 / SHA-256 Merkle Tree | Tamper-evident evidentiary chain of custody |
| **SOC Export** | CEF, ArcSight Syslog, STIX 2.1 JSON | Enterprise drop-in integration |

---

## 7. Team Roles & Responsibilities

1. **Team Lead / PM**: Scope control, jury narrative, milestone tracking, pitch delivery.
2. **Network & Testbed Engineer**: strongSwan/Libreswan lab, configuration matrix, traffic generation scripts, capture pipeline.
3. **ML Engineer (Classical & Signal)**: Feature engineering, Random Forest / LightGBM models, SHAP explainability.
4. **ML Engineer (Deep & Applied)**: 1D-CNN temporal models, active-learning feedback loop, adversarial stress testing.
5. **Backend Engineer**: FastAPI services, scoring engine, WebSocket streaming, audit-ledger hashing.
6. **Frontend Engineer**: React/TypeScript dashboard, interactive visualizations, presentation HUD.
7. **Security / Compliance Researcher**: NIST SP 800-77 / CNSA rubric, ATT&CK mapping, policy simulator, executive report templates.

---

## 8. Detailed 8-Phase Execution Roadmap

- **Phase 1: Foundation & Lab Bring-up (Days 1–10)** — strongSwan/Libreswan Docker lab across Tunnel/Transport, AES-256/3DES, DH Group 14/31, PFS on/off.
- **Phase 2: Dataset Generation & Deterministic IKE Parsing (Days 8–16)** — Labeled pcap dataset + Scapy ISAKMP/IKEv2 parser + ESP feature table.
- **Phase 3: ML Classification Engine v1 (Days 15–25)** — LightGBM baseline ($\ge 90\%$ macro-F1) + TreeSHAP explainability pipeline.
- **Phase 4: Security Scoring Engine + Dashboard v1 (Days 22–35)** — NIST SP 800-77 weighted rubric + PQC readiness index + React dashboard.
- **Phase 5: Differentiator / Wow-Feature Build-out (Days 36–52)** — Pre-deployment Policy Simulator + Active Attack-Replay Sandbox + Auto-remediation diffs.
- **Phase 6: Tier-3 Strategic Add-ons (Days 46–56)** — Blockchain Merkle audit ledger + SOC CEF/Syslog export + Analyst Copilot.
- **Phase 7: Reporting, Documentation & Packaging (Days 53–63)** — Executive/technical report generator + open dataset packaging + demo video.
- **Phase 8: Hardening, Rehearsal & Grand-Finale Readiness (Days 64–70)** — Cross-vendor validation + offline fallback rehearsal + frozen release build.

---

## 9. Milestone & Gate Reviews (SIH Alignment)

| Gate | Aligned Phase | Go/No-Go Criteria |
| :--- | :--- | :--- |
| **Idea/PPT Submission** | Pre-Phase 1 | Architecture, wow features, and research grounding complete. |
| **Internal / College Round** | End of Phase 4/5 (Compressed) | Live tunnel demo + IKE parser + ESP classifier + Attack sandbox + 2.5-min pitch. |
| **Pre-Finale Freeze** | End of Phase 7 | Full Docker stack + open dataset + documentation complete. |
| **Grand Finale** | End of Phase 8 | Rehearsed live demo runs twice without error; offline backup ready. |

---

## 10. Deliverables Mapping

| PS Required Deliverable | Covered By |
| :--- | :--- |
| **Working Software Prototype** | Docker Compose stack: testbed + backend + frontend console |
| **AI Classification Engine** | Scapy IKE parser + LightGBM ESP flow classifier with SHAP |
| **Interactive Dashboard** | Dark threat-intelligence web console with live score gauge |
| **Security Assessment Report** | NIST SP 800-77 weighted scoring with remediation config diffs |
| **Demonstration Video** | Attack-replay sandbox score-drop walkthrough |
| **Technical Documentation** | Complete architecture, API specs, model cards, and RFC mappings |
| **Training/Testing Dataset** | Open labeled IPsec pcap dataset with documented data card |
| **Blockchain Audit Trail (Bonus)** | SHA-256 Merkle root anchoring to Hyperledger Fabric |
| **SOC/SIEM Integration (Bonus)** | CEF / Syslog / STIX 2.1 threat event exporter |

---

## 11. Risk Register & Mitigation

1. **Classifier Overfitting to One Lab**: Mandatory cross-implementation validation reporting across different MTUs and packet rates.
2. **Attack-Replay Sandbox Scheduling Slip**: Built early in Phase 5 with a pre-recorded visual fallback.
3. **Venue Network/Hardware Failure During Live Demo**: Standalone offline demo mode with preloaded PCAP playback and video backup.
4. **LLM Hallucinations in Copilot**: Strictly constrained retrieval over parsed packet state and NIST rubric rows only.
5. **Documentation Rushed at the End**: Written incrementally at the close of every phase.

---

## 12. Key References
- **NIST SP 800-77 Rev. 1**: *Guide to IPsec VPNs* (csrc.nist.gov).
- **RFC 7296**: *Internet Key Exchange Protocol Version 2 (IKEv2)*.
- **RFC 8221**: *Cryptographic Algorithm Implementation Requirements for ESP and AH*.
- **RFC 8784 / RFC 9370**: *Mixing Preshared Keys in IKEv2 for Post-Quantum Security & Multiple Key Exchanges*.
- **CNSA 2.0**: *Commercial National Security Algorithm Suite 2.0 (Post-Quantum Guidance)*.
- **MITRE ATT&CK for Enterprise**: *Network Protocols & Man-in-the-Middle Techniques (attack.mitre.org)*.
