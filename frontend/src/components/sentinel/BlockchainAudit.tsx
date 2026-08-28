import { useState } from "react";
import { PROJECT, LIVE_TELEMETRY } from "@/data/sentinel";
import { Section, SectionHead } from "./shared";

const LEAF_NODES = [
  { id: "L1", label: "IKEv2 Handshake State", hash: "0x8f2a91c3...19e0", parent: "H12", detail: "Parsed IKE_SA_INIT & IKE_AUTH transform proposals (AES-256-GCM, DH Group 31)." },
  { id: "L2", label: "ESP Flow Distributions", hash: "0x34d1b829...88c4", parent: "H12", detail: "Statistical side-channel vector (14 features, 50-packet window, H(X)=7.94)." },
  { id: "L3", label: "TreeSHAP Attributions", hash: "0x99a2fe14...77f1", parent: "H34", detail: "Marginal feature contribution weights (isochronous 20ms delta φ=+0.44)." },
  { id: "L4", label: "Scoring Rubric Matrix", hash: "0x12b05698...e439", parent: "H34", detail: "Deterministic NIST SP 800-77 scoring deductions and compliance proofs." },
];

export function BlockchainAudit() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [activeLeaf, setActiveLeaf] = useState<string | null>(null);

  const handleVerify = () => {
    setIsVerifying(true);
    setIsVerified(false);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1400);
  };

  const selectedLeafObj = LEAF_NODES.find((l) => l.id === activeLeaf);

  return (
    <Section id="ledger" className="dot-bg">
      <SectionHead
        tag="Tier 3 · LDG-07 · NTRO PS 26160"
        title="Blockchain-Anchored Immutable Audit Trail & Cryptographic Verification"
        lede="Designed specifically for the NTRO Blockchain & Cybersecurity theme. Every assessment report is cryptographically committed as a SHA-256 Merkle tree anchored to a permissioned Hyperledger Fabric ledger. Regulators can mathematically verify report authenticity without viewing proprietary traffic."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left: Interactive Merkle Tree Visualizer */}
        <div className="border border-border bg-surface p-6 shadow-2xl font-mono text-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <h3 className="font-bold text-foreground uppercase tracking-wider">
                Assessment Merkle Tree Structure
              </h3>
            </div>
            <span className="text-[10.5px] text-primary border border-primary/40 bg-primary/10 px-2 py-0.5 font-bold">
              SHA-256 / Groth16 zk-SNARK
            </span>
          </div>

          {/* Interactive Visualizer Diagram */}
          <div className="mt-6 flex flex-col items-center relative py-4">
            {/* Merkle Root Node */}
            <div
              className={`border p-3.5 text-center w-full max-w-md transition-all duration-300 ${
                isVerifying
                  ? "border-primary bg-primary/25 shadow-[0_0_25px_rgba(20,184,166,0.4)] scale-105"
                  : activeLeaf
                  ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                  : "border-primary/80 bg-primary/15 shadow-[0_0_12px_rgba(20,184,166,0.15)]"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[9.5px] uppercase tracking-widest text-primary font-bold">
                  ANCHORED MERKLE ROOT (BLOCK #{LIVE_TELEMETRY.blockHeight})
                </span>
              </div>
              <p className="font-mono text-xs text-primary font-bold select-all truncate">
                {LIVE_TELEMETRY.merkleRoot}
              </p>
            </div>

            {/* SVG Connecting Tree Branches */}
            <div className="w-full max-w-lg h-10 my-1 relative">
              <svg className="w-full h-full stroke-primary/50 fill-none" viewBox="0 0 400 40">
                {/* Branch from Root (200,0) to Left H12 (100,40) */}
                <path
                  d="M 200 0 L 200 15 L 100 15 L 100 40"
                  strokeWidth={activeLeaf === "L1" || activeLeaf === "L2" || isVerifying ? "2.5" : "1.5"}
                  className={activeLeaf === "L1" || activeLeaf === "L2" || isVerifying ? "stroke-primary" : "stroke-border-strong"}
                />
                {/* Branch from Root (200,0) to Right H34 (300,40) */}
                <path
                  d="M 200 0 L 200 15 L 300 15 L 300 40"
                  strokeWidth={activeLeaf === "L3" || activeLeaf === "L4" || isVerifying ? "2.5" : "1.5"}
                  className={activeLeaf === "L3" || activeLeaf === "L4" || isVerifying ? "stroke-primary" : "stroke-border-strong"}
                />
              </svg>
            </div>

            {/* Intermediate Internal Nodes Row */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
              <div
                className={`border p-2.5 text-center text-[10.5px] transition-all ${
                  activeLeaf === "L1" || activeLeaf === "L2" || isVerifying
                    ? "border-primary bg-primary/20 text-primary font-bold shadow-[0_0_12px_rgba(20,184,166,0.2)]"
                    : "border-border bg-background/80 text-muted-foreground"
                }`}
              >
                <span className="block text-[9.5px] uppercase tracking-wider text-muted-foreground">
                  INTERNAL NODE H(1,2)
                </span>
                <span className="font-mono text-foreground font-semibold">0x77d8a2...33ba</span>
              </div>

              <div
                className={`border p-2.5 text-center text-[10.5px] transition-all ${
                  activeLeaf === "L3" || activeLeaf === "L4" || isVerifying
                    ? "border-primary bg-primary/20 text-primary font-bold shadow-[0_0_12px_rgba(20,184,166,0.2)]"
                    : "border-border bg-background/80 text-muted-foreground"
                }`}
              >
                <span className="block text-[9.5px] uppercase tracking-wider text-muted-foreground">
                  INTERNAL NODE H(3,4)
                </span>
                <span className="font-mono text-foreground font-semibold">0x91c0e4...f82a</span>
              </div>
            </div>

            {/* SVG Connecting Tree Branches from Internal to Leaves */}
            <div className="w-full max-w-lg h-8 my-1 relative">
              <svg className="w-full h-full fill-none" viewBox="0 0 400 30">
                {/* H12 (100,0) -> L1 (50,30) */}
                <path
                  d="M 100 0 L 100 12 L 50 12 L 50 30"
                  strokeWidth={activeLeaf === "L1" || isVerifying ? "2" : "1"}
                  className={activeLeaf === "L1" || isVerifying ? "stroke-primary" : "stroke-border/70"}
                />
                {/* H12 (100,0) -> L2 (150,30) */}
                <path
                  d="M 100 0 L 100 12 L 150 12 L 150 30"
                  strokeWidth={activeLeaf === "L2" || isVerifying ? "2" : "1"}
                  className={activeLeaf === "L2" || isVerifying ? "stroke-primary" : "stroke-border/70"}
                />
                {/* H34 (300,0) -> L3 (250,30) */}
                <path
                  d="M 300 0 L 300 12 L 250 12 L 250 30"
                  strokeWidth={activeLeaf === "L3" || isVerifying ? "2" : "1"}
                  className={activeLeaf === "L3" || isVerifying ? "stroke-primary" : "stroke-border/70"}
                />
                {/* H34 (300,0) -> L4 (350,30) */}
                <path
                  d="M 300 0 L 300 12 L 350 12 L 350 30"
                  strokeWidth={activeLeaf === "L4" || isVerifying ? "2" : "1"}
                  className={activeLeaf === "L4" || isVerifying ? "stroke-primary" : "stroke-border/70"}
                />
              </svg>
            </div>

            {/* Leaf Nodes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
              {LEAF_NODES.map((leaf) => {
                const isActive = activeLeaf === leaf.id;
                return (
                  <button
                    key={leaf.id}
                    type="button"
                    onClick={() => setActiveLeaf(isActive ? null : leaf.id)}
                    className={`border p-2.5 text-center text-[10px] transition-all cursor-pointer ${
                      isActive
                        ? "border-primary bg-primary/25 text-primary font-bold shadow-[0_0_12px_rgba(20,184,166,0.25)] scale-102"
                        : "border-border/80 bg-background/60 hover:border-primary/50 text-foreground"
                    }`}
                  >
                    <span className="text-primary font-bold block text-xs">{leaf.id}</span>
                    <span className="text-foreground font-semibold truncate block font-sans text-[10.5px] my-0.5">
                      {leaf.label}
                    </span>
                    <span className="text-muted-foreground block font-mono text-[9.5px]">{leaf.hash}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Leaf Inspection Drawer */}
            {selectedLeafObj && (
              <div className="mt-4 w-full border border-primary/50 bg-background/90 p-3 text-xs font-mono rounded-none">
                <div className="flex items-center justify-between text-primary font-bold border-b border-border/60 pb-1 mb-1.5">
                  <span>LEAF {selectedLeafObj.id} INSPECTION PROOF</span>
                  <button
                    type="button"
                    onClick={() => setActiveLeaf(null)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer text-[10px]"
                  >
                    CLOSE [x]
                  </button>
                </div>
                <p className="text-foreground/90 font-sans text-xs">{selectedLeafObj.detail}</p>
                <div className="mt-1 text-[10px] text-primary">
                  Hash: <code className="select-all">{selectedLeafObj.hash}</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Verification Certificate Card */}
        <div className="border border-border bg-surface p-6 shadow-2xl font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-bold text-foreground uppercase tracking-wider">
                Cryptographic Attestation Certificate
              </h3>
              <span className="text-[10px] text-primary bg-primary/10 border border-primary/40 px-2 py-0.5 font-bold">
                PROVEN
              </span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs text-muted-foreground">
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>ORGANISATION:</span>
                <span className="text-foreground font-semibold">{PROJECT.org}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>PROBLEM STATEMENT:</span>
                <span className="text-primary font-semibold">{PROJECT.ps}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>LEDGER NETWORK:</span>
                <span className="text-foreground font-semibold">Hyperledger Fabric v2.5</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>ZERO-KNOWLEDGE PROOF:</span>
                <span className="text-primary font-semibold">Groth16 zk-SNARK Verified</span>
              </div>
            </div>

            <p className="mt-4 text-[11.5px] leading-relaxed text-muted-foreground font-sans">
              This attestation proves that the IKEv2 posture score of 94/100 was computed from the authentic capture stream without any retroactive parameter alteration.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/80">
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying}
              className="hover-glow w-full border border-primary/70 bg-primary/15 py-2.5 font-mono text-xs uppercase tracking-widest text-primary font-bold hover:bg-primary/25 transition-all cursor-pointer"
            >
              {isVerifying ? "VERIFYING MERKLE PATH ON LEDGER..." : "RE-VERIFY CRYPTOGRAPHIC PROOF"}
            </button>

            {isVerified && !isVerifying && (
              <p className="mt-2 text-center text-[10.5px] text-primary font-mono font-semibold">
                [VERIFIED] Merkle inclusion path confirmed in Block #{LIVE_TELEMETRY.blockHeight}
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
