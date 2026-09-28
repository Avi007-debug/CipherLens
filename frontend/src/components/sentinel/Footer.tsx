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

          <div className="flex items-center gap-4">
            {/* GitHub Repository Link */}
            <a
              href="https://github.com/Avi007-debug/CipherLens"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-glow flex items-center gap-1.5 border border-border/60 bg-surface px-3 py-1.5 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
              title="View on GitHub"
            >
              {/* GitHub SVG icon */}
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="text-[10px] normal-case font-semibold">Avi007-debug/CipherLens</span>
            </a>

            <span className="text-primary font-bold">
              Zero Payload Bytes Decrypted · 100% Mathematical Integrity
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
