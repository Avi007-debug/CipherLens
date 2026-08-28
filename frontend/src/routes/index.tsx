import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/sentinel/Nav";
import { Hero } from "@/components/sentinel/Hero";
import { ProblemSolution } from "@/components/sentinel/ProblemSolution";
import { Footer } from "@/components/sentinel/Footer";
import { CliTerminalModal } from "@/components/sentinel/CliTerminalModal";
import { JudgeDefenseModal } from "@/components/sentinel/JudgeDefenseModal";
import { PcapUploadModal } from "@/components/sentinel/PcapUploadModal";
import { SupabaseSettingsModal } from "@/components/sentinel/SupabaseSettingsModal";

const TITLE = "CipherLens | AI IPsec Sentinel";
const DESC =
  "CipherLens: AI-powered IPsec VPN protocol analyzer and security assessment framework: deterministic IKE parsing, zero-decryption ESP classification with SHAP explainability, and blockchain-anchored posture scoring. Built for NTRO Directive PS 26160.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const EXPLORE_PORTALS = [
  {
    to: "/zero-decrypt" as const,
    badge: "Tier 1 Research",
    title: "Zero-Decryption AI Lab & XAI",
    desc: "Classify live encrypted ESP traffic via second-order timing, burst entropy, and packet size histograms with exact TreeSHAP feature attributions.",
    metrics: ">98% F1 Score · 100% Ciphertext Opacity",
    cta: "Launch AI Lab →",
  },
  {
    to: "/capabilities" as const,
    badge: "10 Differentiators",
    title: "Capabilities & 5-Layer Architecture",
    desc: "Interactive technical capability explorer across research, operational tooling, and enterprise SIEM pipelines, backed by a 5-stage dataflow.",
    metrics: "10 Capabilities · RFC 7296 / RFC 8221",
    cta: "Explore Architecture →",
  },
  {
    to: "/security" as const,
    badge: "NIST SP 800-77",
    title: "Posture Scoring & Attack Sandbox",
    desc: "Benchmark 0–100 security scores with line-by-line RFC proof, replay CVE-2002-1623 exploits in a sandbox, and calculate PQC quantum exposure.",
    metrics: "CVE Replay · HNDL Risk Window · Policy Diff",
    cta: "Enter Threat Lab →",
  },
  {
    to: "/audit" as const,
    badge: "Hyperledger Fabric",
    title: "Blockchain Audit & Compliance",
    desc: "Anchor posture assessment reports as SHA-256 Merkle trees to permissioned ledgers with Groth16 zk-SNARK proof verification.",
    metrics: "zk-SNARK Proven · Tamper-Evident Ledger",
    cta: "Verify Merkle Proofs →",
  },
];

function HomePage() {
  const [isCliOpen, setIsCliOpen] = useState(false);
  const [isQaOpen, setIsQaOpen] = useState(false);
  const [isPcapOpen, setIsPcapOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [activeCliCmd, setActiveCliCmd] = useState<string | undefined>(undefined);

  const handleOpenCliWithCmd = (cmd?: string) => {
    setActiveCliCmd(cmd);
    setIsCliOpen(true);
  };

  return (
    <div id="top" className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Nav
        onOpenCli={() => handleOpenCliWithCmd()}
        onOpenQa={() => setIsQaOpen(true)}
        onOpenPcap={() => setIsPcapOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
      />

      <main>
        {/* Hero Section with Enlarged Live Telemetry Stream */}
        <Hero />

        {/* Executive Problem vs Solution Section */}
        <ProblemSolution />

        {/* Dedicated Explore Section: 4 High-Impact Platform Portals */}
        <section id="explore" className="border-t border-border/80 bg-surface/50 px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-6 font-mono">
              <div>
                <span className="border border-primary/50 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                  Platform Exploration Hub
                </span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Explore Dedicated Framework Modules
                </h2>
                <p className="mt-2 text-sm text-slate-300 font-sans max-w-2xl">
                  CipherLens is architected into dedicated operational workspaces. Select a specialized module below for in-depth analysis, simulations, and cryptographic verification.
                </p>
              </div>

              <Link
                to="/qa"
                className="hover-glow border border-border bg-surface px-4 py-2 text-xs font-mono text-slate-200 hover:text-foreground"
              >
                Browse Technical Q&A Directory →
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {EXPLORE_PORTALS.map((portal) => (
                <Link
                  key={portal.to}
                  to={portal.to}
                  className="hover-glow group flex flex-col justify-between border border-border/80 bg-surface p-7 shadow-xl transition-all duration-200 hover:border-primary/60 hover:bg-surface-raised"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-bold">
                          {portal.badge}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {portal.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-300 font-sans">
                      {portal.desc}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-4 flex items-center justify-between font-mono text-xs">
                    <span className="text-muted-foreground text-[11px] truncate mr-2">
                      {portal.metrics}
                    </span>
                    <span className="text-primary font-bold shrink-0 group-hover:translate-x-1 transition-transform">
                      {portal.cta}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Floating Demo Control Speed-Dial on bottom right */}
      <aside aria-label="Demo Controls" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setIsQaOpen(true)}
          className="hover-glow flex items-center gap-1.5 border border-primary/80 bg-primary/20 px-4 py-2.5 font-bold text-primary shadow-2xl backdrop-blur-md transition-all hover:scale-105"
        >
          Technical Q&A
        </button>
        <button
          type="button"
          onClick={() => setIsPcapOpen(true)}
          className="hover-glow hidden sm:flex items-center gap-1.5 border border-border bg-surface px-3.5 py-2.5 text-slate-300 shadow-xl backdrop-blur-md hover:text-foreground"
        >
          PCAP
        </button>
        <button
          type="button"
          onClick={() => handleOpenCliWithCmd()}
          className="hover-glow flex items-center gap-1.5 border border-border bg-surface px-3.5 py-2.5 text-slate-300 shadow-xl backdrop-blur-md hover:text-foreground"
        >
          CLI
        </button>
      </aside>

      {/* Interactive Modals */}
      <CliTerminalModal
        isOpen={isCliOpen}
        onClose={() => setIsCliOpen(false)}
        initialCmd={activeCliCmd}
      />

      <JudgeDefenseModal
        isOpen={isQaOpen}
        onClose={() => setIsQaOpen(false)}
      />

      <PcapUploadModal
        isOpen={isPcapOpen}
        onClose={() => setIsPcapOpen(false)}
      />

      <SupabaseSettingsModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />
    </div>
  );
}
