import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Section, SectionHead } from "./shared";

const BEFORE_POINTS = [
  {
    title: "Manual Wireshark Trawling",
    desc: "Analysts spend hours manually stepping through thousands of opaque ESP frames and IKE records with zero automation.",
  },
  {
    title: "Expert-Bound RFC Memorization",
    desc: "Subtle protocol flaws (e.g. 3DES fallback, weak MODP groups) are only caught if an expert recalls specific RFC clauses.",
  },
  {
    title: "Black-Box 'All Clear' Illusions",
    desc: "Legacy tools output pass/fail verdicts with no explainable mathematical rationale or evidence trail.",
  },
  {
    title: "Zero Post-Quantum Visibility",
    desc: "No metrics on 'Harvest Now, Decrypt Later' (HNDL) exposure, leaving encrypted secrets vulnerable to quantum adversaries.",
  },
  {
    title: "Unrepeatable, Subjective Audits",
    desc: "Two security engineers produce conflicting audit scores on the exact same packet capture.",
  },
];

const AFTER_POINTS = [
  {
    title: "Deterministic IKE Parsing (RFC-Mapped)",
    desc: "Finite-state machine analyzes all SA proposals, transforms, and notify payloads, automatically citing exact RFC violations.",
  },
  {
    title: "Zero-Decryption ML Fingerprinting",
    desc: "Second-order side-channel analysis classifies traffic classes inside ESP tunnels with >98% accuracy without plaintext access.",
  },
  {
    title: "Explainable XAI Attributions",
    desc: "TreeSHAP attributions and calibrated confidence intervals accompany every prediction, making every finding audit-defensible.",
  },
  {
    title: "PQC Readiness & HNDL Risk Engine",
    desc: "Quantifies quantum vulnerability window and models RFC 8784 / ML-KEM hybrid key exchange adoption in real time.",
  },
  {
    title: "Blockchain-Anchored Immutable Proof",
    desc: "Merkle root of every finding and packet hash is anchored to a permissioned ledger for tamper-evident audit integrity.",
  },
];

export function ProblemSolution() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [activeMode, setActiveMode] = useState<"split" | "before" | "after">("split");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.3"] });

  const beforeOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.35]);
  const afterOpacity = useTransform(scrollYProgress, [0.2, 0.8], [0.4, 1]);
  const lineW = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <Section id="problem">
      <SectionHead
        tag="NTRO PS 26160 · Defense Assessment"
        title="From opaque, manual packet inspection to explainable automated defense"
        lede="NTRO's problem statement requires security evaluation of IPsec VPN implementations where payloads cannot be decrypted. Traditional audits are manual, expert-bound, and subjective. CipherLens transforms this into an automated, explainable, and tamper-evident framework."
        action={
          <div className="flex items-center gap-2 border border-border bg-surface p-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveMode("split")}
              className={`px-3 py-1 uppercase tracking-wider ${
                activeMode === "split" ? "bg-primary/20 text-primary border border-primary/50" : "text-muted-foreground"
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("before")}
              className={`px-3 py-1 uppercase tracking-wider ${
                activeMode === "before" ? "bg-destructive/20 text-destructive border border-destructive/50" : "text-muted-foreground"
              }`}
            >
              Legacy Pain
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("after")}
              className={`px-3 py-1 uppercase tracking-wider ${
                activeMode === "after" ? "bg-primary/20 text-primary border border-primary/50" : "text-muted-foreground"
              }`}
            >
              CipherLens
            </button>
          </div>
        }
      />

      <div ref={ref} className="mt-12">
        {/* Progress Tracker line */}
        <div className="h-px w-full bg-border overflow-hidden">
          <motion.div className="h-px bg-primary" style={{ width: lineW }} />
        </div>

        {/* Comparison Grid */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Before: Legacy State */}
          {(activeMode === "split" || activeMode === "before") && (
            <motion.div
              className={`panel border-destructive/30 bg-destructive/5 p-6 shadow-xl ${
                activeMode === "before" ? "col-span-2" : ""
              }`}
              style={activeMode === "split" ? { opacity: beforeOpacity } : {}}
            >
              <div className="flex items-center justify-between border-b border-destructive/20 pb-3">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-destructive">
                  STATE: BEFORE (LEGACY & MANUAL)
                </p>
                <span className="font-mono text-[10px] text-destructive/80 border border-destructive/30 px-2 py-0.5">
                  High Error Rate
                </span>
              </div>

              <ul className="mt-6 space-y-4 font-mono">
                {BEFORE_POINTS.map((item, i) => (
                  <li key={i} className="border-l-2 border-destructive/50 pl-4 py-1">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-sans">
                      {item.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* After: CipherLens State */}
          {(activeMode === "split" || activeMode === "after") && (
            <motion.div
              className={`panel border-primary/40 bg-primary/5 p-6 shadow-2xl ${
                activeMode === "after" ? "col-span-2" : ""
              }`}
              style={activeMode === "split" ? { opacity: afterOpacity } : {}}
            >
              <div className="flex items-center justify-between border-b border-primary/20 pb-3">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  STATE: AFTER (CIPHERLENS FRAMEWORK)
                </p>
                <span className="font-mono text-[10px] text-primary border border-primary/50 px-2 py-0.5 bg-primary/10">
                  Automated & RFC-Grounded
                </span>
              </div>

              <ul className="mt-6 space-y-4 font-mono">
                {AFTER_POINTS.map((item, i) => (
                  <li key={i} className="border-l-2 border-primary pl-4 py-1">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-sans">
                      {item.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </Section>
  );
}
