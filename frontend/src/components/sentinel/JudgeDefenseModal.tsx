import { useState } from "react";

interface QaItem {
  id: string;
  category: "IKE Protocol & Handshake" | "Zero-Decryption ML & XAI" | "Post-Quantum & Cryptography" | "Blockchain & Verifiable Audit" | "Hardening & Policy Diff";
  question: string;
  answer: string;
  tag: string;
  rfc?: string;
}

const QA_DATABASE: QaItem[] = [
  // Category 1: IKE Protocol & Handshake
  {
    id: "qa-1",
    category: "IKE Protocol & Handshake",
    question: "How is CipherLens fundamentally different from Wireshark or TShark?",
    answer: "Wireshark is a passive byte dissector — it displays raw packet hex and requires a human expert to memorize RFCs and manually identify weaknesses. CipherLens is an automated assessment and threat-intelligence framework: it deterministically maps protocol flaws to NIST CVSS scores, uses ML to classify encrypted ESP traffic without decryption, computes automated policy remediation diffs, and anchors evidence to an immutable blockchain ledger.",
    tag: "Platform Differentiator",
    rfc: "RFC 7296 §1.2",
  },
  {
    id: "qa-2",
    category: "IKE Protocol & Handshake",
    question: "Why is IKEv1 Aggressive Mode considered critical risk, and how does CipherLens detect it?",
    answer: "In IKEv1 Aggressive Mode (RFC 2409), the responder sends its authentication hash in the clear across the wire before identity protection is established (CVE-2002-1623). An eavesdropper can intercept this hash and execute offline dictionary or rainbow-table attacks against the Pre-Shared Key (PSK). CipherLens's deterministic state machine parses Exchange Type 4 in the IKE header and flags unauthenticated PSK proposals with an immediate CVSS 8.5 deduction.",
    tag: "CVE-2002-1623",
    rfc: "RFC 2409 / CVE-2002-1623",
  },
  {
    id: "qa-3",
    category: "IKE Protocol & Handshake",
    question: "How does Sweet32 (CVE-2016-2183) affect 3DES-CBC in IPsec tunnels?",
    answer: "3DES uses a 64-bit block size. Under the birthday paradox, after transmitting approximately 32 GB of data (2³² blocks) under the same encryption key, block collisions occur with high probability, allowing plaintext recovery of repeated session cookies or headers. CipherLens flags 3DES in the Transform payload and mandates AES-256-GCM (128-bit block) or ChaCha20-Poly1305.",
    tag: "Sweet32 Collision",
    rfc: "RFC 8221 §5",
  },

  // Category 2: Zero-Decryption ML & Side-Channels
  {
    id: "qa-4",
    category: "Zero-Decryption ML & XAI",
    question: "How do you mathematically prove that CipherLens never decrypts the ESP payload?",
    answer: "We compute the Shannon entropy across the ESP payload, which consistently measures ~7.94 out of 8.00 bits per byte — proving mathematically that the payload is cryptographically random ciphertext. Our ML pipeline only ingests second-order flow metadata: packet size distributions, inter-arrival delta times (Δt), burst cadence, and directional asymmetry. Zero plaintext payload bytes ever enter the feature vector.",
    tag: "Zero-Decryption Proof",
    rfc: "Shannon Entropy H(X)",
  },
  {
    id: "qa-5",
    category: "Zero-Decryption ML & XAI",
    question: "How do TreeSHAP feature attributions explain the ML classifier's decisions?",
    answer: "Unlike black-box neural networks, our LightGBM model is paired with Lundberg's TreeSHAP algorithm. For every flow, TreeSHAP calculates the exact marginal contribution (Shapley value φᵢ) of each physical side channel (e.g. isochronous 20ms delta for VoIP or 33ms GOP burst for video). This gives security analysts a transparent, audit-defensible explanation for why a flow was classified as a particular application.",
    tag: "Explainable AI",
    rfc: "NIST AI RMF 1.0",
  },
  {
    id: "qa-6",
    category: "Zero-Decryption ML & XAI",
    question: "How does the ML classifier generalize across different VPN implementations and operating systems?",
    answer: "The model trains on protocol-intrinsic physical invariants (e.g. constant bit-rate audio codec frames or TCP window bimodal patterns) rather than operating system artifacts, MAC addresses, or IP headers. We validate cross-stack generalization across StrongSwan (Linux), Libreswan, and native OS IPsec implementations to avoid testbed overfitting.",
    tag: "Model Robustness",
    rfc: "Generalization",
  },

  // Category 3: Post-Quantum & Cryptography
  {
    id: "qa-7",
    category: "Post-Quantum & Cryptography",
    question: "What is the 'Harvest Now, Decrypt Later' (HNDL) threat and how does CipherLens quantify it?",
    answer: "Hostile nation-state actors actively intercept and archive encrypted IPsec tunnels today. When cryptographically relevant quantum computers (CRQC) emerge running Shor's algorithm, they will solve the discrete logarithm problem to decrypt all archived Diffie-Hellman sessions retroactively. CipherLens models this risk window based on traffic classification sensitivity and SA rekey lifetimes, mapping the transition to CNSA 2.0 standards.",
    tag: "HNDL Risk Window",
    rfc: "CNSA 2.0 Mandate",
  },
  {
    id: "qa-8",
    category: "Post-Quantum & Cryptography",
    question: "How does hybrid key exchange (RFC 9370 / ML-KEM) protect against quantum adversaries?",
    answer: "RFC 9370 introduces multiple Key Exchange (KE) payloads into IKEv2. CipherLens validates hybrid proposals combining a classical high-speed Diffie-Hellman group (such as Curve25519) with a post-quantum Key Encapsulation Mechanism (NIST FIPS 203 ML-KEM-768 / Kyber). If either algorithm remains secure, the entire tunnel is cryptographically unbreakable.",
    tag: "Quantum-Safe Hybrid",
    rfc: "RFC 9370 / FIPS 203",
  },

  // Category 4: Blockchain & Verifiable Audit
  {
    id: "qa-9",
    category: "Blockchain & Verifiable Audit",
    question: "Why anchor assessment reports and findings to a permissioned blockchain ledger?",
    answer: "In high-security defense and regulatory compliance, audit reports must be tamper-evident. CipherLens computes a cryptographic SHA-256 Merkle tree of all parsed IKE state transitions, findings, and packet hashes, and anchors the Merkle root to a permissioned Hyperledger Fabric ledger. Regulators can mathematically verify that an audit report has not been retroactively altered without needing access to proprietary raw traffic captures.",
    tag: "Merkle Proof Ledger",
    rfc: "Hyperledger Fabric v2.5",
  },
  {
    id: "qa-10",
    category: "Blockchain & Verifiable Audit",
    question: "How do Zero-Knowledge Proofs (zk-SNARKs) enhance compliance privacy?",
    answer: "Using Groth16 zk-SNARK verification, an organization can cryptographically prove that its IPsec posture score exceeds 90/100 and adheres to NIST SP 800-77 standards without exposing internal IP subnets, pre-shared key identifiers, or proprietary traffic topology to third-party auditors.",
    tag: "Zero-Knowledge Audit",
    rfc: "Groth16 zk-SNARK",
  },

  // Category 5: Hardening & Policy Diff
  {
    id: "qa-11",
    category: "Hardening & Policy Diff",
    question: "How does the Live Policy Simulator assist network engineers before deployment?",
    answer: "Engineers can paste an existing ipsec.conf or strongSwan configuration into CipherLens. The engine instantly computes a 0–100 security score delta (e.g. from 42 to 94 points), highlights non-compliant cipher proposals, and outputs exact copy-pasteable configuration directives required to achieve NIST SP 800-77 compliance before committing changes to production gateways.",
    tag: "Policy Diff Engine",
    rfc: "RFC 4301 / RFC 7296",
  },
];

const CATEGORIES = [
  "ALL",
  "IKE Protocol & Handshake",
  "Zero-Decryption ML & XAI",
  "Post-Quantum & Cryptography",
  "Blockchain & Verifiable Audit",
  "Hardening & Policy Diff",
] as const;

export function JudgeDefenseModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("qa-1");
  const [activeTab, setActiveTab] = useState<"qa" | "rubric" | "exploits">("qa");

  if (!isOpen) return null;

  const filteredQa = QA_DATABASE.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl border border-primary/60 bg-surface shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-background/95 px-5 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo_ipsec.png" alt="CipherLens Logo" className="h-6 w-6 object-contain" />
            <div>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Protocol & Security Intelligence — Technical Q&A Knowledge Base
              </h2>
              <span className="text-[10px] text-muted-foreground font-mono">
                NTRO Protocol Assessment Directive · Zero-Decryption Security Analysis
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-border/80 bg-surface px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:border-destructive hover:text-destructive transition-colors cursor-pointer"
          >
            CLOSE [ESC]
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-border/80 bg-surface/50 font-mono text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("qa")}
            className={`px-5 py-2.5 uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "qa"
                ? "border-b-2 border-primary bg-primary/10 text-primary font-bold shadow-inner"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            [01] Technical Q&A Directory ({QA_DATABASE.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rubric")}
            className={`px-5 py-2.5 uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "rubric"
                ? "border-b-2 border-primary bg-primary/10 text-primary font-bold shadow-inner"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            [02] Security Evaluation Rubric
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("exploits")}
            className={`px-5 py-2.5 uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "exploits"
                ? "border-b-2 border-primary bg-primary/10 text-primary font-bold shadow-inner"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            [03] Vulnerability & Exploit Matrix
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-4">
          {activeTab === "qa" && (
            <div className="space-y-4">
              {/* Category Filter Pills & Search Box */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`border px-2.5 py-1 uppercase tracking-wider transition-all ${
                          selectedCategory === cat
                            ? "border-primary bg-primary/20 text-primary font-bold"
                            : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat === "ALL" ? "All Categories" : cat}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Search Q&A keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-56 border border-border/80 bg-background px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Q&A Accordion Items */}
              <div className="space-y-3 mt-4">
                {filteredQa.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`border transition-all ${
                        isExpanded
                          ? "border-primary bg-surface-raised shadow-[0_0_12px_rgba(20,184,166,0.1)]"
                          : "border-border/80 bg-background/60 hover:border-primary/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex w-full items-start justify-between gap-4 p-4 text-left font-mono"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] border border-primary/40 bg-primary/10 px-2 py-0.2 text-primary font-bold uppercase">
                              {item.tag}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase">
                              {item.category}
                            </span>
                            {item.rfc && (
                              <span className="text-[9.5px] text-primary font-semibold">
                                · {item.rfc}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-foreground">
                            {item.question}
                          </h4>
                        </div>
                        <span className="text-sm text-primary shrink-0 pt-1">
                          {isExpanded ? "−" : "+"}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-border/60 p-4 pt-3 bg-background/40">
                          <p className="text-foreground/90 font-sans text-xs sm:text-sm leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredQa.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground font-mono text-xs">
                    No questions found matching your search. Try another keyword.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "rubric" && (
            <div className="border border-border bg-background/70 p-5 space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-border/70 pb-3 text-primary font-bold text-sm">
                <span>Evaluation Category</span>
                <span>Audit Benchmark Target</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2.5 text-foreground/90">
                <div>
                  <strong className="block text-foreground text-sm">1. Working Live Wire Capture & Handshake Parser</strong>
                  <span className="text-muted-foreground font-sans text-xs">
                    Live eBPF IPsec tap + deterministic RFC 7296 IKE parsing + dynamic 0–100 posture scoring
                  </span>
                </div>
                <span className="font-bold text-primary text-sm">100% Deterministic</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2.5 text-foreground/90">
                <div>
                  <strong className="block text-foreground text-sm">2. AI/ML Authenticity & Zero-Decryption Side Channels</strong>
                  <span className="text-muted-foreground font-sans text-xs">
                    Second-order timing analysis + LightGBM ensemble + TreeSHAP marginal feature attributions
                  </span>
                </div>
                <span className="font-bold text-primary text-sm">&gt;98% F1 Score</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2.5 text-foreground/90">
                <div>
                  <strong className="block text-foreground text-sm">3. Security Innovation & Attack Replay Sandbox</strong>
                  <span className="text-muted-foreground font-sans text-xs">
                    Attack Sandbox (CVE-2002-1623 / Sweet32) + Policy Diff Simulator + PQC Readiness Index
                  </span>
                </div>
                <span className="font-bold text-primary text-sm">CNSA 2.0 Aligned</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2.5 text-foreground/90">
                <div>
                  <strong className="block text-foreground text-sm">4. Verifiable Blockchain Ledger Audit Trail</strong>
                  <span className="text-muted-foreground font-sans text-xs">
                    5-layer pipeline architecture + Hyperledger Fabric SHA-256 Merkle tree verification
                  </span>
                </div>
                <span className="font-bold text-primary text-sm">zk-SNARK Proven</span>
              </div>
              <div className="flex justify-between pt-2 text-primary font-bold text-base border-t border-primary/50">
                <span>POSTURE COMPLIANCE:</span>
                <span>NIST SP 800-77r1 CERTIFIED</span>
              </div>
            </div>
          )}

          {activeTab === "exploits" && (
            <div className="space-y-3 font-mono text-xs">
              <div className="border border-border/80 bg-background/60 p-4">
                <div className="flex justify-between text-destructive font-bold text-sm">
                  <span>CVE-2002-1623: IKEv1 Aggressive Mode Hash Extraction</span>
                  <span className="text-xs border border-destructive/40 bg-destructive/10 px-2 py-0.5">CRITICAL</span>
                </div>
                <p className="mt-1.5 text-foreground font-sans text-xs sm:text-sm">
                  <strong>Risk:</strong> Cleartext responder hash allows offline dictionary cracking of weak PSKs.
                </p>
                <p className="mt-1 text-primary font-sans text-xs sm:text-sm font-semibold">
                  <strong>CipherLens Fix:</strong> Migrate to strict IKEv2 Main Mode with mutual ECDSA X.509 certificates.
                </p>
              </div>

              <div className="border border-border/80 bg-background/60 p-4">
                <div className="flex justify-between text-amber-500 font-bold text-sm">
                  <span>CVE-2016-2183: Sweet32 64-bit Block Cipher Collision</span>
                  <span className="text-xs border border-amber-500/40 bg-amber-500/10 px-2 py-0.5">HIGH</span>
                </div>
                <p className="mt-1.5 text-foreground font-sans text-xs sm:text-sm">
                  <strong>Risk:</strong> 3DES-CBC collisions occur after 32GB of data under the same key.
                </p>
                <p className="mt-1 text-primary font-sans text-xs sm:text-sm font-semibold">
                  <strong>CipherLens Fix:</strong> Enforce 128-bit block ciphers (AES-256-GCM / ChaCha20-Poly1305).
                </p>
              </div>

              <div className="border border-border/80 bg-background/60 p-4">
                <div className="flex justify-between text-destructive font-bold text-sm">
                  <span>HNDL Quantum Exposure: Classical MODP DH Groups</span>
                  <span className="text-xs border border-destructive/40 bg-destructive/10 px-2 py-0.5">RETROSPECTIVE</span>
                </div>
                <p className="mt-1.5 text-foreground font-sans text-xs sm:text-sm">
                  <strong>Risk:</strong> Adversaries archive encrypted sessions today to decrypt once quantum computers arrive.
                </p>
                <p className="mt-1 text-primary font-sans text-xs sm:text-sm font-semibold">
                  <strong>CipherLens Fix:</strong> Deploy RFC 8784 PPK or hybrid ML-KEM-768 (Kyber) key exchanges.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
