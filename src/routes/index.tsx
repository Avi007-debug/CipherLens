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
  const [activeCliCmd, setActiveCliCmd] = useState<string | undefined>(undefined);

  const handleOpenCliWithCmd = (cmd?: string) => {
    setActiveCliCmd(cmd);
    setIsCliOpen(true);
  };

  return (
    <div id="top" className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Nav onOpenCli={() => handleOpenCliWithCmd()} />
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

      <CliTerminalModal
        isOpen={isCliOpen}
        onClose={() => setIsCliOpen(false)}
        initialCmd={activeCliCmd}
      />
    </div>
  );
}
