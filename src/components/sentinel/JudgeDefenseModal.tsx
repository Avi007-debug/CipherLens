import { useState } from "react";

export function JudgeDefenseModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"pitch" | "qa" | "rubric">("pitch");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl border border-primary/60 bg-surface shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-background/90 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              SIH 26160 — Internal Round Presentation & Defense HUD
            </h2>
            <span className="border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-semibold">
              15 Marks Strategy
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm font-bold"
          >
            ✕ Close
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-border bg-background/50 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab("pitch")}
            className={`px-5 py-2.5 uppercase tracking-wider transition-colors ${
              activeTab === "pitch"
                ? "border-b-2 border-primary bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ⏱ 2.5-Min Pitch Script
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("qa")}
            className={`px-5 py-2.5 uppercase tracking-wider transition-colors ${
              activeTab === "qa"
                ? "border-b-2 border-primary bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🛡 Judge Defense Q&A (4 Tough Questions)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rubric")}
            className={`px-5 py-2.5 uppercase tracking-wider transition-colors ${
              activeTab === "rubric"
                ? "border-b-2 border-primary bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📊 15-Mark Evaluation Criteria
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {activeTab === "pitch" && (
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4 py-1">
                <div className="flex items-center justify-between text-primary font-bold text-[11.5px] uppercase">
                  <span>[0:00 - 0:30] 1. The Problem & NTRO Context</span>
                  <a
                    href="#problem"
                    onClick={onClose}
                    className="text-[10px] text-teal-400 underline"
                  >
                    Jump to Problem Section →
                  </a>
                </div>
                <p className="mt-1.5 text-slate-300 leading-relaxed font-sans text-xs">
                  "Good morning, judges. Today, defense and enterprise networks rely on IPsec VPNs. Under NTRO Problem Statement 26160, the core challenge is evaluating security posture and inferring traffic type <strong>without decrypting the payload</strong>. Decrypting violates privacy and breaks zero-trust boundaries, while manual Wireshark inspection is unscalable and error-prone."
                </p>
              </div>

              <div className="border-l-2 border-primary pl-4 py-1">
                <div className="flex items-center justify-between text-primary font-bold text-[11.5px] uppercase">
                  <span>[0:30 - 1:00] 2. Our Innovation: Dual-Engine Architecture</span>
                  <a
                    href="#pipeline"
                    onClick={onClose}
                    className="text-[10px] text-teal-400 underline"
                  >
                    Jump to 5-Layer Pipeline →
                  </a>
                </div>
                <p className="mt-1.5 text-slate-300 leading-relaxed font-sans text-xs">
                  "We built <strong>CipherLens</strong> with a two-part approach: First, a <strong>deterministic IKE state machine</strong> parses the initial cleartext negotiation (ciphers, DH groups, auth, PFS) with 100% RFC-grounded accuracy. Second, a <strong>zero-decryption ML engine</strong> analyzes second-order timing and packet-size side channels to classify application traffic inside opaque ESP frames with over 98% accuracy and TreeSHAP explainability."
                </p>
              </div>

              <div className="border-l-2 border-primary pl-4 py-1">
                <div className="flex items-center justify-between text-primary font-bold text-[11.5px] uppercase">
                  <span>[1:00 - 2:00] 3. Live Demonstration</span>
                  <div className="flex gap-2">
                    <a
                      href="#score"
                      onClick={onClose}
                      className="text-[10px] text-teal-400 underline"
                    >
                      [Score Gauge]
                    </a>
                    <a
                      href="#classify"
                      onClick={onClose}
                      className="text-[10px] text-teal-400 underline"
                    >
                      [Zero-Decrypt ESP]
                    </a>
                    <a
                      href="#sandbox"
                      onClick={onClose}
                      className="text-[10px] text-teal-400 underline"
                    >
                      [Attack Sandbox]
                    </a>
                  </div>
                </div>
                <p className="mt-1.5 text-slate-300 leading-relaxed font-sans text-xs">
                  "Let us show you this live. Here is our active IPsec tunnel. CipherLens intercepts the handshake and rates posture at <strong>42/100 (At Risk)</strong> due to IKEv1 Aggressive Mode and 3DES. Watch our Attack Sandbox: replaying the PSK crack triggers instant detection. Now watch our Zero-Decryption classifier: even though traffic is fully encrypted, our LightGBM model detects isochronous 20ms delta pulses and resolves the <strong>VoIP stream with 99.4% confidence</strong> and SHAP attributions."
                </p>
              </div>

              <div className="border-l-2 border-primary pl-4 py-1">
                <div className="flex items-center justify-between text-primary font-bold text-[11.5px] uppercase">
                  <span>[2:00 - 2:30] 4. Impact & Next Steps</span>
                  <a
                    href="#roadmap"
                    onClick={onClose}
                    className="text-[10px] text-teal-400 underline"
                  >
                    Jump to Roadmap →
                  </a>
                </div>
                <p className="mt-1.5 text-slate-300 leading-relaxed font-sans text-xs">
                  "Scores are benchmarked against NIST SP 800-77 and cryptographically anchored to a Merkle proof ledger. CipherLens turns manual packet inspection into an automated, explainable, and provable security audit. Thank you."
                </p>
              </div>
            </div>
          )}

          {activeTab === "qa" && (
            <div className="space-y-4">
              <div className="border border-border/80 bg-background/60 p-4 space-y-2">
                <p className="text-primary font-bold text-[11.5px]">
                  Q1: "How is this different from Wireshark / TShark?"
                </p>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  <strong>Answer:</strong> "Wireshark is a passive byte dissector — it displays raw packets and requires a human expert to read RFCs and manually spot weaknesses. CipherLens is an automated assessment and threat-intelligence platform: it deterministically maps protocol flaws to NIST CVSS scores, uses ML to classify encrypted ESP traffic without decryption, computes automated remediation diffs, and anchors evidence to a blockchain ledger."
                </p>
              </div>

              <div className="border border-border/80 bg-background/60 p-4 space-y-2">
                <p className="text-primary font-bold text-[11.5px]">
                  Q2: "How do you prove you aren't secretly decrypting the ESP payload?"
                </p>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  <strong>Answer:</strong> "We calculate Shannon entropy across the ESP payload, which sits at ~7.94 out of 8.00 bits per byte — mathematically confirming high ciphertext entropy. Our classifier only ingests flow metadata: packet size histograms, inter-arrival time $\Delta t$, burst count, and directional asymmetry. Zero plaintext payload bytes ever enter our feature vector."
                </p>
              </div>

              <div className="border border-border/80 bg-background/60 p-4 space-y-2">
                <p className="text-primary font-bold text-[11.5px]">
                  Q3: "How do you know your ML model isn't just memorizing one testbed?"
                </p>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  <strong>Answer:</strong> "We extract protocol-intrinsic physical characteristics (e.g. VoIP's fixed 20ms codec clock or video's GOP I-frame cadence) rather than IP addresses or hardware artifacts. In our full roadmap (Phase 8), we validate cross-vendor generalization across strongSwan, Libreswan, and native OS stacks."
                </p>
              </div>

              <div className="border border-border/80 bg-background/60 p-4 space-y-2">
                <p className="text-primary font-bold text-[11.5px]">
                  Q4: "What happens when Quantum Computers emerge?"
                </p>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  <strong>Answer:</strong> "That is why we built our PQC Readiness Index in Tier 2. We calculate the 'Harvest Now, Decrypt Later' (HNDL) exposure risk window based on SA lifetime, and model hybrid key exchange migration to NIST FIPS 203 ML-KEM (Kyber) and RFC 9370."
                </p>
              </div>
            </div>
          )}

          {activeTab === "rubric" && (
            <div className="border border-border bg-background/60 p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-border/60 pb-2 text-primary font-bold">
                <span>Evaluation Category</span>
                <span>Marks</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5 text-slate-300">
                <span>1. Working Live Demo (IPsec tunnel + live IKE parsing + dashboard)</span>
                <span className="font-bold text-foreground">6 / 6</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5 text-slate-300">
                <span>2. AI/ML Authenticity (Zero-decryption ESP classification + XAI)</span>
                <span className="font-bold text-foreground">4 / 4</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5 text-slate-300">
                <span>3. Innovation & Differentiators (Attack Sandbox + Policy Diff)</span>
                <span className="font-bold text-foreground">3 / 3</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5 text-slate-300">
                <span>4. Pitch Clarity, 5-Layer Architecture & Defense Q&A</span>
                <span className="font-bold text-foreground">2 / 2</span>
              </div>
              <div className="flex justify-between pt-2 text-teal-300 font-bold text-sm">
                <span>TOTAL TARGET SCORE:</span>
                <span>15 / 15 MARKS</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
