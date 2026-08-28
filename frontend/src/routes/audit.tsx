import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/sentinel/Nav";
import { BlockchainAudit } from "@/components/sentinel/BlockchainAudit";
import { Roadmap } from "@/components/sentinel/Roadmap";
import { Team } from "@/components/sentinel/Team";
import { Footer } from "@/components/sentinel/Footer";
import { CliTerminalModal } from "@/components/sentinel/CliTerminalModal";
import { JudgeDefenseModal } from "@/components/sentinel/JudgeDefenseModal";
import { PcapUploadModal } from "@/components/sentinel/PcapUploadModal";
import { SupabaseSettingsModal } from "@/components/sentinel/SupabaseSettingsModal";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Blockchain Audit & Compliance Governance | CipherLens" },
      {
        name: "description",
        content:
          "Blockchain-anchored immutable audit trail, SHA-256 Merkle tree verification, zk-SNARK attestation, and engineering roadmap.",
      },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
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
              <span className="text-primary font-bold">Audit & Governance</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Blockchain-Anchored Audit Trail & Compliance Governance
            </h1>

            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              Cryptographically anchor posture findings as SHA-256 Merkle trees to permissioned ledgers. Regulators and enterprise auditors can mathematically verify assessment reports via zero-knowledge proofs without accessing sensitive network captures.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
              <div className="border border-border bg-background/80 px-3 py-1.5">
                <span className="text-muted-foreground mr-2">LEDGER:</span>
                <strong className="text-foreground">Hyperledger Fabric v2.5</strong>
              </div>
              <div className="border border-border bg-background/80 px-3 py-1.5">
                <span className="text-muted-foreground mr-2">PROOF TYPE:</span>
                <strong className="text-primary">Groth16 zk-SNARK</strong>
              </div>
              <div className="border border-border bg-background/80 px-3 py-1.5">
                <span className="text-muted-foreground mr-2">INTEGRITY:</span>
                <strong className="text-primary font-bold">SHA-256 Merkle Root</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Audit & Merkle Proof Visualizer */}
        <BlockchainAudit />

        {/* Engineering Roadmap */}
        <Roadmap />

        {/* Technical Team & Roles */}
        <Team />
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
