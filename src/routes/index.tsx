import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/sentinel/Nav";
import { Hero } from "@/components/sentinel/Hero";
import { ProblemSolution } from "@/components/sentinel/ProblemSolution";
import { ScoreGauge } from "@/components/sentinel/ScoreGauge";
import { Classification } from "@/components/sentinel/Classification";
import { Features } from "@/components/sentinel/Features";
import { Architecture } from "@/components/sentinel/Architecture";
import { PqcMatrix } from "@/components/sentinel/PqcMatrix";
import { AttackSandbox } from "@/components/sentinel/AttackSandbox";
import { BlockchainAudit } from "@/components/sentinel/BlockchainAudit";
import { TechStack } from "@/components/sentinel/TechStack";
import { Roadmap } from "@/components/sentinel/Roadmap";
import { Team } from "@/components/sentinel/Team";
import { Footer } from "@/components/sentinel/Footer";
import { CliTerminalModal } from "@/components/sentinel/CliTerminalModal";
import { JudgeDefenseModal } from "@/components/sentinel/JudgeDefenseModal";
import { PcapUploadModal } from "@/components/sentinel/PcapUploadModal";
import { SupabaseSettingsModal } from "@/components/sentinel/SupabaseSettingsModal";

const TITLE = "CipherLens — AI IPsec VPN Protocol Analyzer & Assessment Framework";
const DESC =
  "CipherLens: AI-powered IPsec VPN protocol analyzer and security assessment framework: deterministic IKE parsing, zero-decryption ESP classification with SHAP explainability, and blockchain-anchored posture scoring. Built for SIH 2026 PS 26160 (NTRO).";

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
  component: Index,
});

function Index() {
  const [isCliOpen, setIsCliOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
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
        onOpenPitch={() => setIsPitchOpen(true)}
        onOpenPcap={() => setIsPcapOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
      />

      <main>
        <Hero />
        <ProblemSolution />
        <ScoreGauge />
        <Classification />
        <Features onRunCli={handleOpenCliWithCmd} />
        <Architecture />
        <PqcMatrix />
        <AttackSandbox />
        <BlockchainAudit />
        <TechStack />
        <Roadmap />
        <Team />
      </main>

      <Footer />

      {/* Floating Demo Control Speed-Dial on bottom right */}
      <aside aria-label="Demo Controls" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 font-mono text-[11px]">
        <button
          type="button"
          onClick={() => setIsPitchOpen(true)}
          className="hover-glow flex items-center gap-1.5 border border-primary/70 bg-primary/20 px-3.5 py-2 font-bold text-primary shadow-2xl backdrop-blur-md transition-all hover:scale-105"
        >
          <span>★</span> 2-Min Pitch & Q&A
        </button>
        <button
          type="button"
          onClick={() => setIsPcapOpen(true)}
          className="hover-glow hidden sm:flex items-center gap-1.5 border border-border bg-surface px-3 py-2 text-slate-300 shadow-xl backdrop-blur-md hover:text-foreground"
        >
          <span>📁</span> PCAP
        </button>
        <button
          type="button"
          onClick={() => handleOpenCliWithCmd()}
          className="hover-glow flex items-center gap-1.5 border border-border bg-surface px-3 py-2 text-slate-300 shadow-xl backdrop-blur-md hover:text-foreground"
        >
          <span>&gt;_</span> CLI
        </button>
      </aside>

      {/* Interactive Modals */}
      <CliTerminalModal
        isOpen={isCliOpen}
        onClose={() => setIsCliOpen(false)}
        initialCmd={activeCliCmd}
      />

      <JudgeDefenseModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
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
