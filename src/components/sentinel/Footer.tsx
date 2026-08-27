import { PROJECT, LIVE_TELEMETRY } from "@/data/sentinel";

const RESOURCES = [
  {
    label: "Technical Architecture Whitepaper",
    meta: "PDF · RFC 7296 & LightGBM XAI Formulation",
    href: "#",
  },
  {
    label: "Deterministic Scoring Rubric Specification v2.0",
    meta: "JSON / YAML · NIST SP 800-77r1 Mapped",
    href: "#",
  },
  {
    label: "GitHub Source Repository",
    meta: "Docker · eBPF Tap · Scapy Tests · Models",
    href: "#",
  },
  {
    label: "Hyperledger Merkle Proof Explorer",
    meta: `Block #${LIVE_TELEMETRY.blockHeight} · zk-SNARK Verified`,
    href: "#",
  },
];

export function Footer() {
  return (
    <footer id="docs" className="border-t border-border/80 bg-background px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Project Overview */}
          <div>
            <div className="flex items-center gap-2 font-mono text-sm tracking-tight">
              <span className="inline-block h-2.5 w-2.5 bg-primary" aria-hidden="true" />
              <span className="font-bold text-foreground">CIPHER<span className="text-primary">LENS</span></span>
              <span className="border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground uppercase">
                {PROJECT.version}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {PROJECT.tagline}
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
              Built for <strong className="text-foreground">{PROJECT.event}</strong> ·{" "}
              <strong className="text-primary">{PROJECT.ps}</strong> · {PROJECT.org} · Theme:{" "}
              {PROJECT.theme}.
            </p>

            <div className="mt-6 font-mono text-xs text-muted-foreground space-y-1">
              <div>COMPLIANCE: <span className="text-slate-300">{PROJECT.compliance}</span></div>
              <div>COMMIT HASH: <span className="text-primary select-all">{PROJECT.commit}</span></div>
            </div>
          </div>

          {/* Right Column: Key Resources */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold mb-3">
              Technical Documentation & Deliverables
            </p>
            <ul className="grid gap-px border border-border bg-border">
              {RESOURCES.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    className="hover-glow flex items-center justify-between gap-4 bg-surface px-5 py-3.5 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{r.label}</span>
                    <span className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-wider">
                      {r.meta}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>© 2026 {PROJECT.name} · SIH 26160 NTRO</span>
          <span className="text-primary">
            zero payload bytes decrypted · 100% mathematical integrity
          </span>
        </div>
      </div>
    </footer>
  );
}
