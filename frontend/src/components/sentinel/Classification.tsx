import { useState } from "react";
import { TRAFFIC_SCENARIOS } from "@/data/sentinel";
import { Section, SectionHead } from "./shared";

export function Classification() {
  const [selectedId, setSelectedId] = useState("voip");
  const [isScanning, setIsScanning] = useState(false);

  const activeScenario =
    TRAFFIC_SCENARIOS.find((s) => s.id === selectedId) ?? TRAFFIC_SCENARIOS[0]!;

  const handleSelectScenario = (id: string) => {
    setSelectedId(id);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1000);
  };

  return (
    <Section id="classify" className="dot-bg">
      <SectionHead
        tag="Tier 1 · WOW-01 & WOW-02"
        title="Zero-Decryption ESP Traffic Fingerprinting & Explainable AI (XAI)"
        lede="CipherLens never needs to inspect plaintext or break encryption. By analyzing second-order timing, packet size histograms, and burst entropy, our LightGBM ensemble resolves the application protocol with >98% accuracy accompanied by mathematical TreeSHAP feature attributions."
      />

      {/* Scenario Selector Tabs */}
      <div className="mt-8 flex flex-wrap gap-2.5">
        {TRAFFIC_SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedId;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectScenario(sc.id)}
              className={`hover-glow border px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/20 text-primary font-bold shadow-[0_0_15px_rgba(20,184,166,0.25)]"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {sc.label}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Demo Container */}
      <div className="panel mt-6 overflow-hidden border-border/90 bg-surface/90 shadow-2xl">
        {/* Telemetry Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="text-primary font-bold">FLOW: {activeScenario.protocol}</span>
            <span className="text-border">|</span>
            <span>SAMPLE: <code className="text-slate-300">{activeScenario.pcapSample}</code></span>
          </div>

          <div className="flex items-center gap-4">
            <span>BURST ENTROPY: <strong className="text-foreground">{activeScenario.burstEntropy}</strong></span>
            <button
              type="button"
              onClick={() => handleSelectScenario(selectedId)}
              className="hover-glow border border-primary/60 bg-primary/15 px-3 py-1 text-primary font-bold hover:bg-primary/25"
            >
              Scan Window
            </button>
          </div>
        </div>

        {/* Encrypted Packet Stream Visualizer */}
        <div className="relative flex h-52 items-end gap-[3px] overflow-hidden px-6 py-6 bg-background/50">
          {activeScenario.distribution.map((height, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="flex-1 border-t border-primary/60 bg-primary/25 transition-[height,background-color] duration-500 hover:bg-primary/60"
              style={{
                height: `${height}%`,
                backgroundColor: isScanning
                  ? "rgba(100, 116, 139, 0.35)"
                  : "color-mix(in oklab, var(--primary) 35%, transparent)",
              }}
            />
          ))}

          {/* Sweeping Laser Line */}
          {isScanning && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-36 animate-[sweep_1s_linear] bg-[linear-gradient(90deg,transparent,rgba(45,212,191,0.6),transparent)] shadow-[0_0_25px_rgba(45,212,191,0.8)]"
              style={{ left: 0 }}
            />
          )}

          {/* Overlay Status */}
          <div className="absolute top-3 left-6 font-mono text-xs text-muted-foreground bg-background/90 px-3 py-1 border border-border flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isScanning ? "bg-amber-400 animate-ping" : "bg-primary"}`} />
            <span>{isScanning ? "EXTRACTING MARKOV TIMING TRANSITIONS..." : "PAYLOAD OPAQUE · SIDE-CHANNELS RESOLVED (ZERO DECRYPTION)"}</span>
          </div>
        </div>

        {/* Classification Result & ENLARGED SHAP Feature Attributions */}
        <div className="grid gap-6 border-t border-border p-6 lg:grid-cols-[1fr_1fr] lg:items-stretch bg-surface/70">
          {/* Left: Classification Result & Confidence */}
          <div className="flex flex-col justify-between border border-border/80 bg-background/60 p-5 shadow-inner">
            <div>
              <div className="flex items-baseline justify-between border-b border-border/70 pb-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Zero-Decryption Inference Verdict
                  </p>
                  <h3 className="mt-1 font-mono text-2xl sm:text-3xl font-bold text-foreground">
                    Class: <span className="text-primary">{activeScenario.label}</span>
                  </h3>
                </div>

                <div className="text-right">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Confidence
                  </p>
                  <p className="mt-1 font-mono text-3xl sm:text-4xl font-bold tabular-nums text-primary">
                    {isScanning ? "--.-%" : `${activeScenario.conf.toFixed(1)}%`}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-200">
                {activeScenario.hint}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/70 pt-4 font-mono text-xs">
              <div className="bg-surface/80 p-2.5 border border-border/60">
                <span className="text-muted-foreground block text-[10.5px] uppercase">AVG PACKET SIZE</span>
                <span className="text-foreground font-bold text-sm mt-0.5 block">{activeScenario.avgSize}</span>
              </div>
              <div className="bg-surface/80 p-2.5 border border-border/60">
                <span className="text-muted-foreground block text-[10.5px] uppercase">CADENCE</span>
                <span className="text-foreground font-bold text-sm mt-0.5 block">{activeScenario.cadence}</span>
              </div>
              <div className="bg-surface/80 p-2.5 border border-border/60">
                <span className="text-muted-foreground block text-[10.5px] uppercase">DIRECTION RATIO</span>
                <span className="text-foreground font-bold text-sm mt-0.5 block">{activeScenario.directionRatio}</span>
              </div>
            </div>
          </div>

          {/* Right: ENLARGED, PROMINENT SHAP Feature Attributions Box */}
          <div className="flex flex-col justify-between border border-primary/40 bg-surface-raised p-5 shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-3 font-mono">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Top SHAP Feature Attributions
                  </h4>
                  <p className="text-[11px] text-muted-foreground">TreeSHAP Local Explanation Engine (Lundberg et al.)</p>
                </div>
                <span className="border border-primary/50 bg-primary/10 px-2 py-0.5 text-xs text-primary font-bold">
                  Marginal Weights (φᵢ)
                </span>
              </div>

              {/* Feature Attribution List with Increased Font Size and Progress Visualizer */}
              <div className="mt-4 space-y-3.5">
                {activeScenario.shapFeatures.map((feat) => {
                  const numericVal = parseFloat(feat.value.replace("+", "")) || 0.2;
                  const barWidth = Math.min(100, Math.round((numericVal / 0.5) * 100));

                  return (
                    <div key={feat.name} className="space-y-1.5 font-mono">
                      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <span className="font-semibold text-slate-200">
                          {feat.name.replace(/_/g, " ")}
                        </span>
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-primary text-sm tabular-nums">
                            {feat.value} φ
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 border font-semibold uppercase ${
                              feat.impact === "high"
                                ? "border-primary bg-primary/20 text-primary font-bold"
                                : "border-border bg-surface text-muted-foreground"
                            }`}
                          >
                            {feat.impact} Impact
                          </span>
                        </div>
                      </div>

                      {/* Visual Contribution Bar */}
                      <div className="h-2 w-full overflow-hidden bg-background/80 border border-border/60">
                        <div
                          className={`h-full transition-all duration-500 ${
                            feat.impact === "high"
                              ? "bg-primary shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                              : "bg-teal-600/70"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 border-t border-border/70 pt-3 font-mono text-xs text-muted-foreground">
              <p className="leading-relaxed">
                <strong className="text-primary font-semibold">Mathematical Formulation:</strong> Shapley value{" "}
                <code className="text-teal-300 bg-background px-1 py-0.5 border border-border">φᵢ(v) = ∑ [|S|!(|N|-|S|-1)! / |N|!] · [v(S ∪ {"{i}"}) - v(S)]</code>{" "}
                proves exact marginal contribution of each physical side-channel over the baseline expectation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes sweep { from { transform: translateX(-100%); } to { transform: translateX(calc(100% + 100vw)); } }`}</style>
    </Section>
  );
}
