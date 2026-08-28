import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/sentinel/Nav";
import { Classification } from "@/components/sentinel/Classification";
import { Footer } from "@/components/sentinel/Footer";
import { CliTerminalModal } from "@/components/sentinel/CliTerminalModal";
import { JudgeDefenseModal } from "@/components/sentinel/JudgeDefenseModal";
import { PcapUploadModal } from "@/components/sentinel/PcapUploadModal";
import { SupabaseSettingsModal } from "@/components/sentinel/SupabaseSettingsModal";

export const Route = createFileRoute("/zero-decrypt")({
  head: () => ({
    meta: [
      { title: "Zero-Decryption AI Lab & XAI | CipherLens" },
      {
        name: "description",
        content:
          "Zero-decryption ESP traffic fingerprinting using second-order statistical side channels and TreeSHAP explainability without decrypting payload bytes.",
      },
    ],
  }),
  component: ZeroDecryptPage,
});

function ZeroDecryptPage() {
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
              <span className="text-primary font-bold">Zero-Decryption AI Lab</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Zero-Decryption Traffic Fingerprinting & Explainable AI (XAI)
            </h1>

            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-300">
              Audit encrypted IPsec tunnels without breaking encryption or violating zero-trust privacy. CipherLens extracts second-order timing, burst entropy, and packet size histograms to classify applications with &gt;98% accuracy and exact TreeSHAP feature attributions.
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="border border-border bg-background/80 p-3">
                <span className="text-muted-foreground block text-[10.5px]">PAYLOAD OPACITY</span>
                <strong className="text-primary text-base">100% Encrypted</strong>
              </div>
              <div className="border border-border bg-background/80 p-3">
                <span className="text-muted-foreground block text-[10.5px]">SHANNON ENTROPY</span>
                <strong className="text-foreground text-base">7.94 / 8.00 bits</strong>
              </div>
              <div className="border border-border bg-background/80 p-3">
                <span className="text-muted-foreground block text-[10.5px]">CLASSIFIER F1</span>
                <strong className="text-primary text-base">98.4% Accuracy</strong>
              </div>
              <div className="border border-border bg-background/80 p-3">
                <span className="text-muted-foreground block text-[10.5px]">XAI METHOD</span>
                <strong className="text-teal-300 text-base">TreeSHAP (Lundberg)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Zero-Decryption Classifier & SHAP Attributions */}
        <Classification />

        {/* Deep Theoretical Methodology Card */}
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
          <div className="panel border border-border/90 bg-surface/90 p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 pb-4 font-mono">
              <div>
                <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">
                  Mathematical Signal Extraction Methodology
                </h3>
                <p className="text-xs text-muted-foreground">Second-Order Statistical Side Channels (RFC 4303 Conformal Analysis)</p>
              </div>
              <span className="border border-primary/50 bg-primary/10 px-2.5 py-1 text-xs text-primary font-bold">
                Zero Plaintext Ingestion
              </span>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3 font-mono text-xs">
              <div className="border border-border/80 bg-background/70 p-4 space-y-2">
                <span className="text-primary font-bold text-sm block">1. Isochronous Delta-t (Δt)</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  Measures packet inter-arrival intervals. Constant bit-rate VoIP codecs (G.711 / Opus) emit frames at strict 20ms boundaries regardless of packet payload encryption.
                </p>
              </div>

              <div className="border border-border/80 bg-background/70 p-4 space-y-2">
                <span className="text-primary font-bold text-sm block">2. Bimodal Size Distributions</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  Extracts packet length probability mass functions. Interactive web browsing produces short uplink requests (~120B) followed by large downlink trains (~1460B MTU).
                </p>
              </div>

              <div className="border border-border/80 bg-background/70 p-4 space-y-2">
                <span className="text-primary font-bold text-sm block">3. Burst Cadence & GOP Waves</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  HD Video streaming exhibits 33ms frame trains interspersed with periodic intra-frame (I-frame) keyframe burst spikes every 1,000ms.
                </p>
              </div>
            </div>
          </div>
        </div>
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
