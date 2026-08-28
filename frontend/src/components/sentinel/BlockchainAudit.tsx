import { useState } from "react";
import { PROJECT, LIVE_TELEMETRY } from "@/data/sentinel";
import { Section, SectionHead } from "./shared";

const LEAF_NODES = [
  { id: "L1", label: "IKEv2 Handshake State", hash: "0x8f2a...19e0" },
  { id: "L2", label: "ESP Flow Distributions", hash: "0x34d1...88c4" },
  { id: "L3", label: "TreeSHAP Attributions", hash: "0x99a2...77f1" },
  { id: "L4", label: "Scoring Rubric Matrix", hash: "0x12b0...e439" },
];

export function BlockchainAudit() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1200);
  };

  return (
    <Section id="ledger" className="dot-bg">
      <SectionHead
        tag="Tier 3 · LDG-07 · NTRO PS 26160"
        title="Blockchain-Anchored Immutable Audit Trail & Cryptographic Verification"
        lede="Designed specifically for the NTRO Blockchain & Cybersecurity theme. Every assessment report is cryptographically committed as a SHA-256 Merkle tree anchored to a permissioned Hyperledger Fabric ledger. Regulators can mathematically verify report authenticity without viewing proprietary traffic."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Interactive Merkle Tree Visualizer */}
        <div className="border border-border bg-surface p-6 shadow-2xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-bold text-foreground uppercase tracking-wider">
              Assessment Merkle Tree Structure
            </h3>
            <span className="text-[10.5px] text-primary">SHA-256 Proof</span>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            {/* Merkle Root */}
            <div className="border border-primary bg-primary/15 p-3 text-center w-full max-w-md shadow-[0_0_15px_rgba(20,184,166,0.15)]">
              <span className="text-[10px] uppercase text-primary font-bold block">
                ANCHORED MERKLE ROOT (BLOCK #{LIVE_TELEMETRY.blockHeight})
              </span>
              <p className="mt-1 font-mono text-[10.5px] text-teal-300 select-all truncate">
                {LIVE_TELEMETRY.merkleRoot}
              </p>
            </div>

            {/* Connecting lines */}
            <div className="h-6 w-px bg-primary/60" />

            {/* Intermediate Node Row */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              <div className="border border-border bg-background/80 p-2 text-center text-[10px]">
                <span className="text-muted-foreground block">INTERNAL NODE H(1,2)</span>
                <span className="text-foreground/90 font-mono">0x77d8...33ba</span>
              </div>
              <div className="border border-border bg-background/80 p-2 text-center text-[10px]">
                <span className="text-muted-foreground block">INTERNAL NODE H(3,4)</span>
                <span className="text-foreground/90 font-mono">0x91c0...f82a</span>
              </div>
            </div>

            <div className="h-4 w-px bg-border" />

            {/* Leaf Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
              {LEAF_NODES.map((leaf) => (
                <div
                  key={leaf.id}
                  className="border border-border/70 bg-background/50 p-2 text-center text-[10px]"
                >
                  <span className="text-primary font-bold block">{leaf.id}</span>
                  <span className="text-foreground truncate block font-sans text-[11px] my-0.5">
                    {leaf.label}
                  </span>
                  <span className="text-muted-foreground block font-mono">{leaf.hash}</span>
                </div>
              ))}
            </div>
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
              className="hover-glow w-full border border-primary/70 bg-primary/15 py-2.5 font-mono text-xs uppercase tracking-widest text-primary font-bold hover:bg-primary/25 transition-all"
            >
              {isVerifying ? "VERIFYING MERKLE PATH ON LEDGER..." : "✓ Re-Verify Cryptographic Proof"}
            </button>

            {isVerified && !isVerifying && (
              <p className="mt-2 text-center text-[10.5px] text-primary">
                ✓ Merkle inclusion path confirmed in Block #{LIVE_TELEMETRY.blockHeight}
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
