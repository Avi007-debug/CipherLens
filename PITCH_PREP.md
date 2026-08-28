# CipherLens: Executive Pitch & Deep Knowledge Preparation

This document serves as your ultimate presentation cheat-sheet and knowledge repository for **NTRO Problem Statement 26160 (Smart India Hackathon)**. It is divided into three sections: **The Pitch**, **Deep Domain Knowledge**, and **Anticipated Judge Q&A**.

---

## Part 1: The Pitch & Strategic Impact

### The Core Problem (Why are we here?)
Currently, cybersecurity analysts and defense agencies rely on **passive packet capture tools** like Wireshark and `tcpdump`.
While Wireshark is excellent for dissecting *unencrypted* packets, it is effectively blind when confronted with **encrypted IPsec tunnels** (ESP - Encapsulating Security Payload).
When an agency captures gigabytes of ESP traffic, traditional tools can only tell them "this is encrypted data." They cannot classify the underlying traffic type, they cannot assess if the encryption policy is weak, and they cannot detect if the tunnel is vulnerable to known cryptographic exploits—unless they possess the private keys to decrypt it, which violates privacy and is often mathematically impossible.

### The CipherLens Solution
**CipherLens** is an AI-powered, zero-decryption IPsec analyzer and assessment framework. We solve the NTRO's problem through three core pillars:
1. **Deterministic Exploit Parsing:** We parse the initial, unencrypted IKE handshake to immediately detect fatal misconfigurations (like Aggressive Mode / CVE-2002-1623) and weak ciphers (like 3DES / Sweet32).
2. **Zero-Decryption AI (Explainable):** We use a LightGBM machine learning model to classify the *contents* of the encrypted ESP payload (Voice, Video, File Transfer) based purely on side-channel telemetry (packet size, inter-arrival time) **without ever decrypting a single byte**.
3. **Immutable Compliance Ledger:** We score the tunnel against the NIST SP 800-77 rubric and anchor the resulting assessment report to a Hyperledger blockchain using Merkle trees, ensuring the audit is tamper-evident and regulator-ready.

### The Impact
By automating the assessment of IPsec tunnels without requiring decryption keys, CipherLens allows NTRO to scale its threat intelligence across thousands of endpoints, drastically reducing manual analysis time from hours to milliseconds, while respecting zero-trust privacy boundaries.

---

## Part 2: Deep Domain Knowledge (What you must know)

To defend this project, you must deeply understand the underlying protocols and math.

### 1. IPsec (Internet Protocol Security)
IPsec is a suite of protocols that secure network traffic at the IP layer.
- **IKE (Internet Key Exchange):** The control plane. It runs on UDP port 500. It negotiates the encryption keys (Security Associations or SAs) and ciphers. Phase 1 establishes a secure channel; Phase 2 negotiates the actual IPsec SAs.
- **ESP (Encapsulating Security Payload):** The data plane (Protocol 50). It provides confidentiality (encryption) and integrity. Once IKE finishes, the actual data flows through ESP. To Wireshark, ESP payload is just random noise.

### 2. The Cryptographic Flaws (CVEs)
- **CVE-2002-1623 (IKEv1 Aggressive Mode):** In normal IKEv1 "Main Mode", 6 messages are exchanged, and identities are protected. In "Aggressive Mode", to speed things up (3 messages), the responder sends its authentication hash *in the clear*. An attacker can sniff this hash and run offline dictionary attacks (e.g., using Hashcat) to crack the Pre-Shared Key (PSK).
- **Sweet32 (CVE-2016-2183):** 3DES uses a 64-bit block size. If you send ~32GB of data over the same IPsec tunnel (using 3DES-CBC), the birthday paradox guarantees a block collision. An attacker can use this collision to recover plaintext (like session cookies). Modern IPsec *must* use AES-GCM (128-bit blocks).

### 3. Zero-Decryption Machine Learning
How do we know what's inside the tunnel if it's encrypted? **Side Channels.**
- **Inter-Arrival Time ($\Delta t$):** VoIP traffic sends small packets at very strict intervals (e.g., exactly every 20ms). File transfers send massive bursts as fast as TCP allows.
- **Packet Length Histograms:** Video streaming uses large, variable-sized packets (I-frames) followed by smaller packets (P/B-frames).
- **Shannon Entropy ($H$):** We calculate the entropy of the ESP payload. If it's near $8.00$ bits/byte, the encryption is strong.
- **TreeSHAP (Explainable AI):** Black-box neural networks are unacceptable for defense agencies. We use TreeSHAP to assign a "Shapley value" to every feature. If the model says a flow is "VoIP," TreeSHAP mathematically proves it was *because* the inter-arrival time was 20ms, making the AI trustworthy.

### 4. Post-Quantum Cryptography (PQC) & HNDL
- **HNDL (Harvest Now, Decrypt Later):** Nation-state adversaries are recording encrypted IPsec tunnels today. They store them in massive data centers. In 10-15 years, when cryptographically relevant quantum computers (CRQCs) exist, they will run Shor's algorithm to break the Diffie-Hellman keys and read the stored data.
- **CNSA 2.0 / ML-KEM:** The NSA's Commercial National Security Algorithm Suite 2.0 mandates the transition to lattice-based cryptography (like FIPS 203 ML-KEM). CipherLens calculates the "HNDL Risk Window" to tell administrators exactly how long their captured data remains secure against quantum attacks.

### 5. Blockchain Merkle Ledger
- **Merkle Tree:** A cryptographic hash tree where every leaf node is a hash of a data block (in our case, an IPsec assessment report). The root of the tree (Merkle Root) securely summarizes all data.
- **zk-SNARKs:** Zero-Knowledge proofs allow us to prove to an auditor that an assessment report was included in the blockchain without revealing the contents of the report itself.

---

## Part 3: Anticipated Judge Q&A

**Q: How is this different from just using Wireshark?**
> "Wireshark is a passive dissector; it requires a human expert to manually read the hex and cross-reference RFCs. It cannot analyze the contents of ESP without the private keys. CipherLens is an automated engine: it uses deterministic logic to flag CVEs and an ML model to classify encrypted payloads via side-channels, drastically reducing analysis time."

**Q: If the traffic is encrypted, how do you know what's inside?**
> "We don't break the encryption. We analyze the physical side-channels—specifically the packet size histograms and the inter-arrival delta times. For example, VoIP (RTP) generates highly isochronous traffic (packets every 20ms), while video generates massive, bursty I-frames. Our LightGBM model learns these fingerprints."

**Q: How do you prove your ML model isn't just hallucinating?**
> "We implemented Lundberg's TreeSHAP algorithm. Instead of a black box, every prediction outputs a Shapley value matrix. The system explicitly tells the analyst: 'I classified this as VoIP because the inter-arrival time feature contributed +2.4 points to the decision.' It provides mathematically sound explainability."

**Q: What is the 'HNDL Risk Window' on your dashboard?**
> "HNDL stands for Harvest Now, Decrypt Later. Adversaries are storing encrypted traffic today to break it with quantum computers tomorrow. We calculate the risk window by correlating the traffic type (e.g., highly sensitive intellectual property) against the strength of the IKE key exchange (e.g., classical Diffie-Hellman vs. ML-KEM hybrid), telling the admin exactly how exposed their data is to future quantum decryption."

**Q: Why do you need a blockchain for a network analyzer?**
> "For compliance and legal auditability. When assessing critical infrastructure, the assessment reports must be tamper-evident. By hashing our posture scores into a Merkle tree and anchoring the root to Hyperledger Fabric, we guarantee that the security audit was not retroactively altered by an insider or compromised admin."
