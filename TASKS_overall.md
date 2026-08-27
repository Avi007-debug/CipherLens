# TASKS.md — IPsec Sentinel (SIH 26160)
_AI-Powered IPsec VPN Protocol Analyzer and Security Assessment Framework_

Use this as the single source of truth. Check items off as completed (`- [x]`). Sections are ordered by priority: **Internal Round** first (what you actually need soon), then the full phase-wise build for the grand finale.

---

## 🎯 PRIORITY 0 — Internal Round Demo (do these first)

### Lab & Protocol
- [ ] strongSwan up between two Docker nodes, one working IPsec tunnel
- [ ] Config variant A: Tunnel mode + AES-256 + PFS on
- [ ] Config variant B: Transport mode + AES-GCM + PFS off
- [ ] One traffic type flowing through the tunnel (video or VoIP preferred over ICMP/email for demo impact)
- [ ] Capture pipeline: tcpdump/dumpcap saving IKE + ESP traffic

### Deterministic Parser
- [ ] IKE/ISAKMP parser (Scapy/PyShark) extracting: protocol, IKE version, mode, cipher, DH group, PFS status
- [ ] Parser output displayed live (console or basic UI) matching known ground truth

### AI Classifier (the "wow" that must work)
- [ ] Extract ESP flow features: packet size stats, inter-arrival timing, burst stats
- [ ] Train baseline RandomForest/XGBoost on 1 traffic type vs. "other"
- [ ] Live/near-live prediction demo: correctly labels the traffic type from encrypted ESP

### Scoring (simplified)
- [ ] 4–5 factor scoring rubric (cipher strength, DH strength, PFS, key lifetime) — skip the full NIST/CNSA weighting for now
- [ ] Score changes visibly when switching between config A and config B

### Dashboard (minimum viable)
- [ ] Basic web page/dashboard showing: current config, parser output, classifier prediction, score
- [ ] Live numbers/update — even a manual refresh is fine, avoid a static slideshow

### Pick ONE differentiator to actually build
- [ ] **Attack-replay demo** — trigger a weak-cipher config live, watch score drop in real time
  — OR —
- [ ] **Policy simulator** — paste/select a config, get instant score without a live tunnel

### Pitch & Fallback
- [ ] 2–3 min pitch script: problem → hard part (traffic inference w/o decryption) → build → live demo → roadmap
- [ ] 1 architecture slide (5-layer pipeline, mark what's built vs. planned)
- [ ] Answers ready: "how is this different from Wireshark", "does the classifier generalise or just memorise your lab", "what about quantum computers breaking this"
- [ ] Screen-recorded backup of the full demo in case live networking fails in the room

### Explicitly SKIP for internal round
- [ ] ~~Multi-implementation testbed (Libreswan/native OS)~~
- [ ] ~~IPv6~~
- [ ] ~~Blockchain audit ledger~~
- [ ] ~~LLM copilot~~
- [ ] ~~SIEM/SOC export~~
- [ ] ~~PQC readiness index~~
- [ ] ~~Adversarial robustness testing~~
- [ ] ~~Polished two-tier report generation~~
> Mention these as "planned / on roadmap" in the pitch — do not attempt to build them now.

---

## 📋 PRIORITY 1 — Full Phase-Wise Build (post internal round → grand finale)

### Phase 1: Foundation & Lab Bring-up (Week 1–2)
- [ ] Finalise architecture, confirm scope with mentors
- [ ] Shared repo, project board, coding standards, Docker base images
- [ ] strongSwan + Libreswan node pairs in Docker/GNS3
- [ ] Tunnel vs Transport mode variants
- [ ] AES-128, AES-256, AES-GCM, AES-CBC+HMAC cipher variants
- [ ] DH group variations + PFS on/off toggles
- [ ] IPv4 and IPv6 dual-stack connectivity
- [ ] Native OS IPsec nodes (Windows/macOS) for cross-vendor coverage
- [ ] Traffic generator scripts: iperf3, SIPp (VoIP), ffmpeg (video), curl/Selenium (web), swaks (email), ping/ping6 (ICMP)
- [ ] Smoke-test every mode × cipher × DH-group × PFS × IP-version combo
- [ ] Configuration matrix spreadsheet drafted
- **Exit criteria:** every config axis brought up with one script/command; every traffic type runs end-to-end unattended

### Phase 2: Dataset Generation & Deterministic IKE Parsing (Week 2–3)
- [ ] Full config matrix × traffic-type capture sweep with tcpdump/dumpcap
- [ ] Ground-truth metadata tagging on every capture
- [ ] ISAKMP/IKEv2 grammar parser built (SPI, exchange type, cipher/DH/PRF/integrity proposals, aggressive-vs-main mode)
- [ ] Parser validated at 100% match against ground truth
- [ ] ESP-side flow feature extraction (packet size dist., inter-arrival timing, burst stats, directionality, flow duration)
- [ ] Labeled feature dataset assembled
- [ ] Dataset packaged with a data card (methodology documented)
- [ ] Explicit IPv6-only validation pass (don't fold silently into IPv4 pass)
- **Exit criteria:** parser 100% accurate on all captures; dataset covers every config axis and traffic type

### Phase 3: ML Classification Engine v1 (Week 3–5)
- [ ] RandomForest/XGBoost baseline trained on full feature dataset
- [ ] Cross-validated across strongSwan/Libreswan/native-OS and IPv4/IPv6
- [ ] SHAP explainability integrated (every prediction ships an explanation)
- [ ] Classifier exposed via prediction + confidence + explanation API
- [ ] 1D-CNN / FlowPic-style stretch model built and benchmarked vs. baseline
- [ ] Adversarial robustness harness (padding/fragmentation/jitter-shaped ESP flows)
- [ ] Robustness score reported (clean vs. adversarial accuracy delta)
- **Exit criteria:** ≥90% accuracy on held-out cross-implementation test data; every prediction has a human-readable explanation

### Phase 4: Security Scoring Engine + Dashboard v1 (Week 4–6)
- [ ] NIST SP 800-77 / CNSA 2.0 weighted rubric encoded (cipher, DH, PFS, key lifetime, replay window, mode/version risk, metadata exposure)
- [ ] Rubric unit-tested against hand-scored reference configs
- [ ] PQC-readiness sub-score built (flag harvest-now-decrypt-later risk, suggest hybrid migration)
- [ ] Scoring engine wired to parser + classifier outputs end-to-end
- [ ] React/Next.js dashboard shell: live posture score, threat matrix, AI confidence view
- [ ] FastAPI + WebSocket live feed wired to dashboard
- [ ] Threat Matrix mapped onto MITRE ATT&CK technique IDs
- [ ] First internal end-to-end demo (capture → parse → classify → score → dashboard)
- **Exit criteria:** any config produces a rubric-traceable score ("why 42" answerable); dashboard updates live from a running capture

### Phase 5: Differentiator / Wow-Feature Build-out (Week 6–7.5)
- [ ] Pre-Deployment Policy Simulator (paste/upload config → instant score + threat matrix)
- [ ] Active Attack-Replay Sandbox (Aggressive Mode PSK exposure, DH downgrade, replay-window abuse, weak-cipher forcing)
- [ ] Sandbox attacks visibly move the dashboard score in real time
- [ ] Auto-Generated Remediation Config Diffs (strongSwan/Libreswan snippets per finding)
- [ ] Natural-Language Executive Report Generation (two-tier executive/technical)
- [ ] India-context compliance mapping (CERT-In / NIC-GIGW references)
- [ ] Live Mode streaming anomaly detection (SA-rekey anomalies, DH renegotiation, replay-counter irregularities)
- [ ] Classifier run across full multi-implementation testbed matrix, generalisation numbers recorded
- **Exit criteria:** a jury member can trigger a known attack and watch the score drop live, unscripted; every finding has a concrete remediation snippet

### Phase 6: Tier-3 Strategic Add-ons (Week 7–8)
- [ ] Audit-ledger hashing service (hash every finalized report + evidence bundle into an append-only chain)
- [ ] Decide scope: simple hash-chain vs. permissioned Hyperledger Fabric channel
- [ ] SIEM/SOC export connector (CEF/Syslog + Splunk/ELK-compatible JSON feed)
- [ ] Low-confidence feedback queue in dashboard + periodic retraining job wiring
- [ ] LLM analyst copilot (constrained, report/evidence-grounded Q&A)
- [ ] Copilot guardrailed to only answer from retrieved rubric rows/evidence (no free-form claims)
- [ ] All Tier-3 services integrated into main dashboard navigation
- [ ] Regression test: Tier-3 additions don't break Phase 3–5 pipeline or degrade demo latency
- **Exit criteria:** a report's hash independently re-verifiable against the ledger; copilot answers a "why this score" question correctly with no hallucination

### Phase 7: Reporting, Documentation & Packaging (Week 8–9)
- [ ] Final executive + technical report templates with real packet-level evidence, PDF/DOCX export
- [ ] Technical documentation written (architecture, API spec, model cards)
- [ ] Labeled IPsec dataset packaged and published with data card
- [ ] Docker Compose stack frozen as single-command prototype
- [ ] Demonstration video scripted/shot around the attack-replay sandbox's live score drop
- [ ] Full run-through against the actual PS-deliverable checklist
- [ ] Internal dry-run judging session with mentors
- [ ] Fix-list triage: functional issues prioritised over cosmetic
- **Exit criteria:** every PS "Expected Solution/Deliverables" item has a working artifact; stack stands up from README with no undocumented steps

### Phase 8: Hardening, Rehearsal & Grand-Finale Readiness (Final week)
- [ ] Final cross-implementation validation run
- [ ] Load-test dashboard/live-mode pipeline under rapid-fire Q&A pace
- [ ] Fallback paths built for every live-demo component (pre-recorded clip, offline pcap replay, cached scores)
- [ ] Full demo script rehearsed end-to-end 3+ times with timing
- [ ] Answers prepped for anticipated jury probes
- [ ] Final polish pass on visuals/report formatting ONLY — no new features
- [ ] Codebase frozen, grand-finale release tagged
- [ ] Final rehearsal with mentors as hostile/skeptical jury
- **Exit criteria:** full demo completed twice in a row without facilitator prompt

---

## 🗂️ Deliverables Checklist (map to PS requirements)
- [ ] Working software prototype (Docker Compose stack)
- [ ] AI classification engine (parser + classifier + XAI + robustness score)
- [ ] Interactive dashboard (score, threat matrix, confidence, copilot, feedback queue)
- [ ] Security assessment report (executive + technical, hash-anchored)
- [ ] Demonstration video
- [ ] Technical documentation
- [ ] Dataset used for training/testing (published)
- [ ] (Bonus) SOC-ready SIEM export connector
- [ ] (Bonus) Blockchain/hash-chain audit trail

## ⚠️ Risk Watch-list (revisit each phase)
- [ ] Classifier overfitting to one implementation — always report cross-implementation numbers
- [ ] Attack-replay sandbox schedule slip — build first in Phase 5, keep static-recording fallback
- [ ] Tier-3 add-ons destabilising core pipeline — regression test after every integration
- [ ] Venue network/hardware failure during live demo — rehearsed fallback paths
- [ ] IPv6/native-OS edge cases under-tested — explicit separate validation passes
- [ ] Copilot hallucination — strict retrieval-only constraint
- [ ] Documentation deferred to the end — write incrementally, phase by phase

---
_Last updated: keep this file in the repo root and update checkboxes as you go — it doubles as your standup reference and your "what's left before demo" view._
