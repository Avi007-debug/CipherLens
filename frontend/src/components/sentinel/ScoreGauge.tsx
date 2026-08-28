import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  SCORE_BASELINE,
  SCORE_REMEDIATED,
  SCORE_BREAKDOWN_BASELINE,
} from "@/data/sentinel";
import { Section, SectionHead, StatusBadge } from "./shared";

function colorFor(v: number) {
  if (v < 40) return "var(--destructive)";
  if (v < 70) return "var(--warn)";
  return "var(--primary)";
}

export function ScoreGauge() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [remediated, setRemediated] = useState(false);
  const [value, setValue] = useState(0);

  const targetScore = remediated ? SCORE_REMEDIATED : SCORE_BASELINE;

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(targetScore);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1000;
    const startVal = value;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(startVal + (targetScore - startVal) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, remediated, targetScore]);

  const R = 78;
  const C = 2 * Math.PI * R;
  const pct = value / 100;

  return (
    <Section id="score">
      <SectionHead
        tag="Security Posture Scoring Engine"
        title="A reproducible 0–100 posture score with line-by-line RFC proof"
        lede="Every point deduction is mathematically grounded in a parsed IKE field, a cryptographic vulnerability (CVE), or an RFC standard violation. Toggle the simulator to observe automated remediation."
        action={
          <div className="flex items-center gap-3 border border-border bg-surface p-1.5 font-mono text-xs">
            <span className="text-muted-foreground pl-2 text-[11px] uppercase tracking-wider">
              Simulation Mode:
            </span>
            <button
              type="button"
              onClick={() => setRemediated(false)}
              className={`px-3 py-1.5 transition-colors uppercase tracking-wider ${
                !remediated
                  ? "bg-destructive/20 border border-destructive text-destructive font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Vulnerable (42)
            </button>
            <button
              type="button"
              onClick={() => setRemediated(true)}
              className={`px-3 py-1.5 transition-colors uppercase tracking-wider ${
                remediated
                  ? "bg-primary/20 border border-primary text-primary font-medium shadow-[0_0_12px_rgba(20,184,166,0.2)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Remediated (94)
            </button>
          </div>
        }
      />

      <div ref={ref} className="mt-12 grid gap-10 lg:grid-cols-[340px_1fr] lg:items-start">
        {/* Left: Animated Score Dial */}
        <div className="panel relative flex flex-col items-center p-8 text-center bg-surface/80 border-border shadow-xl">
          <div className="absolute top-4 left-4">
            <StatusBadge
              status={remediated ? "CIPHERLENS_GOLD_STANDARD" : "HIGH_RISK"}
            />
          </div>

          <svg
            viewBox="0 0 200 200"
            className="h-56 w-56 -rotate-90 mt-4"
            role="img"
            aria-label={`Security posture score ${value} out of 100`}
          >
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="var(--border)"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={colorFor(value)}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              style={{ transition: "stroke 300ms linear" }}
            />
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-8">
            <span
              className="font-mono text-6xl font-bold tabular-nums tracking-tight transition-colors duration-300"
              style={{ color: colorFor(value) }}
            >
              {value}
            </span>
            <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              / 100 Posture
            </span>
          </div>

          <div className="mt-6 w-full border-t border-border pt-4 text-left font-mono text-xs space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>EVALUATION STATUS:</span>
              <span className={`font-bold ${remediated ? "text-primary" : "text-destructive"}`}>
                {remediated ? "HARDENED / PQC-READY" : "AT RISK / NON-COMPLIANT"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>COMPLIANCE SPEC:</span>
              <span className="text-slate-200 font-semibold">NIST SP 800-77r1</span>
            </div>
            <div className="flex justify-between">
              <span>HNDL RISK WINDOW:</span>
              <span className={`font-bold ${remediated ? "text-primary" : "text-destructive"}`}>
                {remediated ? "ZERO (<2030)" : "CRITICAL (EXPOSED)"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Rubric Dimension List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <span>Rubric Dimension & RFC Clause</span>
            <span>Sub-Score & Posture Delta</span>
          </div>

          {SCORE_BREAKDOWN_BASELINE.map((row, i) => {
            const currentScore = remediated ? row.remediatedValue : row.value;
            const delta = row.remediatedValue - row.value;

            return (
              <div
                key={row.key}
                className="panel hover-glow p-5 transition-all duration-200 bg-surface/80 border-border/80"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-4 font-mono text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-foreground text-sm">{row.label}</span>
                    <span className="border border-border/80 bg-background px-2 py-0.5 text-xs text-primary font-semibold">
                      {row.rfc}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {remediated ? (
                      <span className="text-xs text-teal-300 font-bold bg-primary/10 border border-primary/40 px-1.5 py-0.5">
                        +{delta} Δ
                      </span>
                    ) : null}
                    <span
                      className="text-base font-bold tabular-nums"
                      style={{ color: colorFor(currentScore) }}
                    >
                      {currentScore} / 100
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 w-full bg-background overflow-hidden border border-border/60">
                  <motion.div
                    className="h-full transition-colors duration-300"
                    style={{ background: colorFor(currentScore) }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${currentScore}%` } : { width: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: "easeOut" }}
                  />
                </div>

                {/* Technical Note / Remediation Directive */}
                <div className="mt-2.5 text-xs leading-relaxed">
                  {!remediated ? (
                    <p className="text-destructive/90 font-mono">
                      <span className="font-bold text-destructive">Finding:</span> {row.note}
                    </p>
                  ) : (
                    <p className="text-teal-300 font-mono">
                      <span className="font-bold text-primary">Remediated:</span> {row.fix}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
