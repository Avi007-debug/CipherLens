import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/sentinel/Nav";
import { Features } from "@/components/sentinel/Features";
import { Architecture } from "@/components/sentinel/Architecture";
import { TechStack } from "@/components/sentinel/TechStack";
import { Footer } from "@/components/sentinel/Footer";
import { CliTerminalModal } from "@/components/sentinel/CliTerminalModal";
import { JudgeDefenseModal } from "@/components/sentinel/JudgeDefenseModal";
import { PcapUploadModal } from "@/components/sentinel/PcapUploadModal";
import { SupabaseSettingsModal } from "@/components/sentinel/SupabaseSettingsModal";

export const Route = createFileRoute("/capabilities")({
  head: () => ({
    meta: [
      { title: "Platform Capabilities & Architecture | CipherLens" },
      {
        name: "description",
        content:
          "Ten technical capabilities across research, simulation, and enterprise tiers, backed by a 5-layer deterministic pipeline from passive wire capture to blockchain verification.",
      },
    ],
  }),
  component: CapabilitiesPage,
});

function CapabilitiesPage() {
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Nav
        onOpenCli={() => handleOpenCliWithCmd()}
        onOpenQa={() => setIsQaOpen(true)}
        onOpenPcap={() => setIsPcapOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
      />

      <main className="pt-24">
        {/* Page Hero Header */}
        <div className="border-b border-border/80 bg-surface/50 px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
              <span>CipherLens Platform</span>
              <span>/</span>
              <span className="text-primary font-bold">Capabilities & Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Technical Capabilities & System Architecture
            </h1>

            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-300">
              Explore CipherLens's 10 technical differentiators across research breakthroughs, operational attack sandboxing, and enterprise SIEM pipelines — supported by a 5-layer deterministic dataflow from kernel wire capture to verified cryptographic ledgers.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
              <div className="border border-border bg-background/80 px-3 py-1.5">
                <span className="text-muted-foreground mr-2">TIER 1:</span>
                <strong className="text-primary">Research & XAI (3)</strong>
              </div>
              <div className="border border-border bg-background/80 px-3 py-1.5">
                <span className="text-muted-foreground mr-2">TIER 2:</span>
                <strong className="text-primary">Sandbox & PQC (3)</strong>
              </div>
              <div className="border border-border bg-background/80 px-3 py-1.5">
                <span className="text-muted-foreground mr-2">TIER 3:</span>
                <strong className="text-primary">Enterprise & Audit (4)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Technical Capabilities Explorer */}
        <Features onRunCli={handleOpenCliWithCmd} />

        {/* 5-Layer Pipeline Architecture */}
        <Architecture />

        {/* Engineering Technology Stack */}
        <TechStack />
      </main>

      <Footer />

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
