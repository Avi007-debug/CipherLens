import { useState } from "react";
import { TRAFFIC_SCENARIOS } from "@/data/sentinel";
import { Section, SectionHead } from "./shared";

export function Classification() {
  const [selectedId, setSelectedId] = useState("voip");
  const [isScanning, setIsScanning] = useState(false);

  const activeScenario =
    TRAFFIC_SCENARIOS.find((s) => s.id === selectedId) || TRAFFIC_SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    setSelectedId(id);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <Section id="classify" className="dot-bg">
      <SectionHead
        tag="Tier 1 · WOW-01 & WOW-02"
        title="Zero-Decryption ESP Traffic Fingerprinting & XAI Attributions"
        lede="CipherLens never needs to inspect plaintext or break encryption. By analyzing second-order timing, packet size histograms, and burst entropy, our LightGBM ensemble resolves the application protocol with >98% accuracy and exact SHAP feature attributions."
      />

      {/* Scenario Selector Tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {TRAFFIC_SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedId;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectScenario(sc.id)}
              className={`hover-glow border px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/15 text-primary font-semibold shadow-[0_0_12px_rgba(20,184,166,0.2)]"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {sc.label}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Demo Container */}
      <div className="panel mt-6 overflow-hidden border-border/90 bg-surface/85 shadow-2xl">
        {/* Telemetry Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="text-primary font-semibold">FLOW: {activeScenario.protocol}</span>
            <span>·</span>
            <span>PCAP: {activeScenario.pcapSample}</span>
          </div>

          <div className="flex items-center gap-4">
            <span>BURST ENTROPY: {activeScenario.burstEntropy}</span>
            <button
              type="button"
              onClick={() => handleSelectScenario(selectedId)}
              className="hover-glow border border-primary/50 bg-primary/10 px-2.5 py-1 text-primary hover:bg-primary/20"
            >
              Scan Window
            </button>
          </div>
        </div>

        {/* Encrypted Packet Stream Visualizer */}
        <div className="relative flex h-48 items-end gap-[3px] overflow-hidden px-5 py-6 bg-background/40">
          {activeScenario.distribution.map((height, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="flex-1 border-t border-primary/50 bg-primary/20 transition-[height,background-color] duration-500 hover:bg-primary/50"
              style={{
                height: `${height}%`,
                backgroundColor: isScanning
                  ? "rgba(100, 116, 139, 0.3)"
                  : "color-mix(in oklab, var(--primary) 28%, transparent)",
              }}
            />
          ))}

          {/* Sweeping Laser Line */}
          {isScanning && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-32 animate-[sweep_1.2s_linear] bg-[linear-gradient(90deg,transparent,rgba(45,212,191,0.5),transparent)] shadow-[0_0_20px_rgba(45,212,191,0.6)]"
              style={{ left: 0 }}
            />
          )}

          {/* Overlay Status */}
          <div className="absolute top-3 left-5 font-mono text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 border border-border">
            {isScanning ? "EXTRACTING MARKOV TRANSITIONS..." : "PAYLOAD OPAQUE · SIDE-CHANNELS RESOLVED"}
          </div>
        </div>

        {/* Classification Result & SHAP Feature Attributions */}
        <div className="grid gap-6 border-t border-border p-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start bg-surface/60">
          {/* Left: Classification Result & Confidence */}
          <div>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Inference Verdict
                </p>
                <h3 className="mt-1 font-mono text-2xl font-bold text-foreground">
                  Class: <span className="text-primary">{activeScenario.label}</span>
                </h3>
              </div>

              <div className="text-right">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Model Confidence
                </p>
                <p className="mt-1 font-mono text-3xl font-bold tabular-nums text-primary">
                  {isScanning ? "--.-%" : `${activeScenario.conf.toFixed(1)}%`}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {activeScenario.hint}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-3 font-mono text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">AVG PACKET SIZE</span>
                <span className="text-foreground font-semibold">{activeScenario.avgSize}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">CADENCE</span>
                <span className="text-foreground font-semibold">{activeScenario.cadence}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">DIRECTION RATIO</span>
                <span className="text-foreground font-semibold">{activeScenario.directionRatio}</span>
              </div>
            </div>
          </div>

          {/* Right: Real-time SHAP Attributions */}
          <div className="border border-border/80 bg-background/60 p-4">
            <div className="flex items-center justify-between border-b border-border pb-2 text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground">
              <span>Top SHAP Feature Attributions</span>
              <span className="text-primary">TreeSHAP Local</span>
            </div>

            <ul className="mt-3 space-y-2 font-mono text-[11px]">
              {activeScenario.shapFeatures.map((feat) => (
                <li key={feat.name} className="flex items-center justify-between gap-3">
                  <span className="text-slate-300 truncate max-w-[200px]">
                    {feat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">{feat.value}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 border uppercase ${
                        feat.impact === "high"
                          ? "border-primary/50 text-teal-300 bg-primary/10"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {feat.impact}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-3 border-t border-border/50 pt-2 font-mono text-[10px] text-muted-foreground">
              Formula: φᵢ(v) computes marginal feature contribution over the entire power set of flow characteristics.
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes sweep { from { transform: translateX(-100%); } to { transform: translateX(calc(100% + 100vw)); } }`}</style>
    </Section>
  );
}
