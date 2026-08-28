import { PROJECT, LIVE_TELEMETRY } from "@/data/sentinel";

const RESOURCES = [
  {
    label: "Technical Architecture Whitepaper",
    meta: "PDF · RFC 7296 & LightGBM XAI Formulation",
    href: "#pipeline",
  },
  {
    label: "Deterministic Scoring Rubric Specification v2.0",
    meta: "JSON / YAML · NIST SP 800-77r1 Mapped",
    href: "#score",
  },
  {
    label: "Attack Sandbox & Policy Simulator",
    meta: "CVE-2002-1623 & CNSA 2.0 Hardening",
    href: "#sandbox",
  },
  {
    label: "Hyperledger Merkle Proof Explorer",
    meta: `Block #${LIVE_TELEMETRY.blockHeight} · zk-SNARK Verified`,
    href: "#ledger",
  },
];

export function Footer() {
  return (
    <footer id="docs" className="border-t border-border/80 bg-background px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Project Overview */}
          <div>
            <div className="flex items-center gap-3 font-mono text-sm tracking-tight">
              <div className="flex h-7 w-7 items-center justify-center border border-primary/40 bg-surface p-0.5">
                <img
                  src="/logo_ipsec.png"
                  alt="CipherLens Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-bold text-foreground">
                CIPHER<span className="text-primary">LENS</span>
              </span>
              <span className="border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground uppercase">
                {PROJECT.version}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {PROJECT.tagline}
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Built for <strong className="text-foreground">{PROJECT.event}</strong> ·{" "}
              <strong className="text-primary">{PROJECT.ps}</strong> · {PROJECT.org} · Theme:{" "}
              {PROJECT.theme}.
            </p>

            <div className="mt-6 font-mono text-xs text-muted-foreground space-y-1.5 border-l-2 border-primary/40 pl-3">
              <div>COMPLIANCE: <span className="text-foreground font-semibold">{PROJECT.compliance}</span></div>
              <div>COMMIT HASH: <span className="text-primary font-bold select-all">{PROJECT.commit}</span></div>
              <div>TELEMETRY TAP: <span className="text-primary">eBPF Passive Kernel Tap (eth0)</span></div>
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
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-6 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <span>© 2026 {PROJECT.name} · NTRO PS 26160</span>
          <span className="text-primary font-bold">
            Zero Payload Bytes Decrypted · 100% Mathematical Integrity
          </span>
        </div>
      </div>
    </footer>
  );
}
