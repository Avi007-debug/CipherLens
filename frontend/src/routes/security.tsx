import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/sentinel/Nav";
import { ScoreGauge } from "@/components/sentinel/ScoreGauge";
import { AttackSandbox } from "@/components/sentinel/AttackSandbox";
import { PqcMatrix } from "@/components/sentinel/PqcMatrix";
import { Footer } from "@/components/sentinel/Footer";
import { CliTerminalModal } from "@/components/sentinel/CliTerminalModal";
import { JudgeDefenseModal } from "@/components/sentinel/JudgeDefenseModal";
import { PcapUploadModal } from "@/components/sentinel/PcapUploadModal";
import { SupabaseSettingsModal } from "@/components/sentinel/SupabaseSettingsModal";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security Posture & Threat Lab Sandbox | CipherLens" },
      {
        name: "description",
        content:
          "Deterministic 0–100 security posture scoring, attack replay sandbox for CVE-2002-1623, live policy diff simulator, and Post-Quantum cryptographic readiness matrix.",
      },
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
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
              <span className="text-primary font-bold">Security Posture & Threat Lab</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Security Posture Scoring & Threat Replay Sandbox
            </h1>

            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-300">
              Benchmark IPsec configurations against NIST SP 800-77 standards with line-by-line RFC proof, replay exploit primitives in an isolated sandbox, and quantify 'Harvest Now, Decrypt Later' (HNDL) exposure against quantum adversaries.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
              <div className="border border-border bg-background/80 px-3 py-1.5">
                <span className="text-muted-foreground mr-2">BENCHMARK:</span>
                <strong className="text-foreground">NIST SP 800-77r1</strong>
              </div>
              <div className="border border-border bg-background/80 px-3 py-1.5">
                <span className="text-muted-foreground mr-2">SIMULATION DELTA:</span>
                <strong className="text-primary">+52 pts Remediation</strong>
              </div>
              <div className="border border-border bg-background/80 px-3 py-1.5">
                <span className="text-muted-foreground mr-2">PQC TRANSITION:</span>
                <strong className="text-teal-300">CNSA 2.0 / FIPS 203</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 0-100 Security Posture Scoring Engine */}
        <ScoreGauge />

        {/* Attack Replay Sandbox & Live Policy Simulator */}
        <AttackSandbox />

        {/* Post-Quantum Cryptographic Readiness Matrix */}
        <PqcMatrix />
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
