import { useEffect, useRef, useState } from "react";
import { PROJECT, LIVE_TELEMETRY } from "@/data/sentinel";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  label?: string;
  isGateway?: boolean;
};

function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nodes: Node[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      nodes.length = 0;
      const count = Math.max(16, Math.min(36, Math.round((w * h) / 28000)));
      for (let i = 0; i < count; i++) {
        const isGw = i < 4;
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * (isGw ? 0.06 : 0.14),
          vy: (Math.random() - 0.5) * (isGw ? 0.06 : 0.14),
          r: isGw ? 4 : Math.random() > 0.8 ? 2.5 : 1.5,
          isGateway: isGw,
          label: isGw ? `GW-0${i + 1}` : undefined,
        });
      }
    };

    resize();
    seed();

    let t = 0;
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
        }
        if (n.x < 10 || n.x > w - 10) n.vx *= -1;
        if (n.y < 10 || n.y > h - 10) n.vy *= -1;
      }

      // Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > 210) continue;
          const alpha = (1 - d / 210) * 0.38;

          // Animated dashed tunnel lines
          ctx.strokeStyle =
            a.isGateway || b.isGateway
              ? `rgba(45, 212, 191, ${alpha * 1.5})`
              : `rgba(100, 116, 139, ${alpha * 0.8})`;
          ctx.lineWidth = a.isGateway && b.isGateway ? 1.5 : 1;
          ctx.setLineDash([4, 6]);
          ctx.lineDashOffset = reduced ? 0 : -t * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          // Packet particle moving along tunnel
          if (!reduced && d < 180) {
            const p = ((t * 0.005 + (i * 3 + j) * 0.19) % 1);
            ctx.setLineDash([]);
            ctx.fillStyle = `rgba(94, 234, 212, ${alpha * 2.8})`;
            ctx.beginPath();
            ctx.arc(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw nodes
      ctx.setLineDash([]);
      for (const n of nodes) {
        if (n.isGateway) {
          // Gateway node with glowing radar ping
          ctx.fillStyle = "rgba(45, 212, 191, 0.95)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "rgba(45, 212, 191, 0.35)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, 10 + Math.sin(t * 0.03 + n.x) * 3, 0, Math.PI * 2);
          ctx.stroke();

          // Label
          if (n.label) {
            ctx.font = "9px monospace";
            ctx.fillStyle = "rgba(203, 213, 225, 0.65)";
            ctx.fillText(n.label, n.x + 8, n.y + 3);
          }
        } else {
          ctx.fillStyle = n.r > 2 ? "rgba(94, 234, 212, 0.75)" : "rgba(148, 163, 184, 0.45)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    const ro = new ResizeObserver(() => {
      resize();
      seed();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-65" />;
}

export function Hero() {
  const [activeTab, setActiveTab] = useState<"stream" | "handshake" | "entropy">("stream");

  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-32 sm:px-8 lg:px-12">
      {/* Background technical textures */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-35" aria-hidden="true" />
      <NetworkCanvas />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,transparent_20%,var(--background)_82%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        {/* Left Column: Mission, Value Prop, CTAs */}
        <div>
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em]">
            <span className="border border-primary/50 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
              {PROJECT.ps}
            </span>
            <span className="border border-border bg-surface px-2.5 py-1 text-slate-300">
              {PROJECT.org}
            </span>
            <span className="border border-border bg-surface px-2.5 py-1 text-slate-400">
              {PROJECT.theme}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Audit the tunnel.
            <br />
            <span className="text-primary underline decoration-primary/40 decoration-1 underline-offset-8">
              Never decrypt the payload.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            <strong className="text-foreground font-semibold">CipherLens</strong> is an AI-powered IPsec VPN
            protocol analyzer and security assessment framework. It parses IKE handshakes deterministically,
            classifies encrypted ESP traffic via second-order statistical side channels with explainable ML, and generates
            blockchain-anchored posture scores — with zero plaintext exposure.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#pipeline"
              className="hover-glow inline-flex items-center gap-2 border border-primary/70 bg-primary/15 px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-primary"
            >
              <span>▶</span> Inspect 5-Layer Pipeline
            </a>
            <a
              href="#score"
              className="hover-glow inline-flex items-center gap-2 border border-border bg-surface px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-300 hover:text-foreground"
            >
              Run Security Score Engine
            </a>
            <a
              href="#classify"
              className="hover-glow inline-flex items-center gap-2 border border-border bg-surface/50 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
            >
              Zero-Decrypt Demo
            </a>
          </div>

          {/* Key Metric Indicators */}
          <div className="mt-12 grid grid-cols-2 gap-3 border-t border-border/80 pt-6 sm:grid-cols-4 font-mono">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Packets Analyzed</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-foreground">2.48M+</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Zero-Decrypt F1</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-primary">{LIVE_TELEMETRY.zeroDecryptionAccuracy}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Inference Latency</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{LIVE_TELEMETRY.meanInferenceLatency}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">PQC Exposure</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-destructive">{LIVE_TELEMETRY.pqcExposureRate}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Telemetry Console */}
        <div className="panel scanlines overflow-hidden border-border/90 bg-surface/90 shadow-2xl">
          {/* Console Header / Tabs */}
          <div className="flex items-center justify-between border-b border-border bg-background/80 px-3 py-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("stream")}
                className={`px-2.5 py-1 uppercase tracking-wider transition-colors ${
                  activeTab === "stream"
                    ? "border-b-2 border-primary bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Live Stream
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("handshake")}
                className={`px-2.5 py-1 uppercase tracking-wider transition-colors ${
                  activeTab === "handshake"
                    ? "border-b-2 border-primary bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                IKEv2 Inspector
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("entropy")}
                className={`px-2.5 py-1 uppercase tracking-wider transition-colors ${
                  activeTab === "entropy"
                    ? "border-b-2 border-primary bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ESP Heatmap
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-primary text-[10px]">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Console Tab Contents */}
          <div className="p-4 font-mono text-[11.5px] leading-relaxed">
            {activeTab === "stream" && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1 mb-2 flex justify-between">
                  <span>[ETH0] PASSIVE TAP CAPTURE</span>
                  <span>UDP 500 / 4500 & IP PROTO 50</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre text-slate-300 font-mono text-[11px] space-y-1">
                  <div>
                    <span className="text-muted-foreground">14:02:11.892</span>{" "}
                    <span className="text-primary font-semibold">[IKE_INIT]</span>{" "}
                    <span>SPIi=0x8fa921c3 SPIr=0x00000000</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">14:02:11.894</span>{" "}
                    <span className="text-destructive font-semibold">[IKE_WARN]</span>{" "}
                    <span className="text-destructive">Aggressive Mode PSK proposal accepted (CVE-2002-1623)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">14:02:11.895</span>{" "}
                    <span className="text-amber-400 font-semibold">[CRYPTO]</span>{" "}
                    <span className="text-amber-300">Transform: 3DES-CBC / HMAC-SHA1 / DH-Grp-14</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">14:02:11.908</span>{" "}
                    <span className="text-primary font-semibold">[ESP_FLOW]</span>{" "}
                    <span>SPI=0x34a81b99 seq=10492 len=172B</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">14:02:11.928</span>{" "}
                    <span className="text-teal-400 font-semibold">[ML_XAI]</span>{" "}
                    <span className="text-primary">Class=VoIP (99.4%) · SHAP top: isochronous_20ms</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">14:02:11.940</span>{" "}
                    <span className="text-destructive font-semibold">[PQC_AUDIT]</span>{" "}
                    <span className="text-destructive">RFC 8784 PPK: Missing · ML-KEM: None · HNDL Risk: HIGH</span>
                  </div>
                </pre>
                <div className="mt-3 border-t border-border/60 pt-2 flex items-center justify-between text-[10.5px]">
                  <span className="text-destructive font-medium">VERDICT: POSTURE SCORE 42/100 (AT RISK)</span>
                  <span className="text-primary caret">monitoring</span>
                </div>
              </div>
            )}

            {activeTab === "handshake" && (
              <div className="space-y-2 text-[11px]">
                <p className="text-primary text-[10px] uppercase tracking-wider">
                  RFC 7296 IKE_SA_INIT Payload Tree
                </p>
                <div className="border border-border/80 bg-background/50 p-2.5 space-y-1 text-slate-300 font-mono text-[10.5px]">
                  <div>├─ HDR: Next=SA, Maj=2, Min=0, Exchange=IKE_SA_INIT (34)</div>
                  <div>├─ SA Payload: Length=48, Proposal #1 (Transform Count: 4)</div>
                  <div className="pl-4 text-destructive">├─ ENCR: Transform ID=3 (3DES-CBC) [VULNERABLE]</div>
                  <div className="pl-4 text-amber-300">├─ PRF: Transform ID=2 (PRF_HMAC_SHA1) [WEAK]</div>
                  <div className="pl-4 text-slate-400">├─ INTEG: Transform ID=2 (AUTH_HMAC_SHA1_96)</div>
                  <div className="pl-4 text-amber-300">└─ D-H: Transform ID=14 (2048-bit MODP) [NO_PQC]</div>
                  <div>├─ KE Payload: DH Group=14, KeyExchangeData (256 bytes)</div>
                  <div>├─ Nonce Payload (Ni): NonceData (32 bytes entropy: 7.98)</div>
                  <div className="text-destructive">└─ Notify: HTTP_CERT_LOOKUP_SUPPORTED (No mutual cert binding)</div>
                </div>
              </div>
            )}

            {activeTab === "entropy" && (
              <div>
                <p className="text-primary text-[10px] uppercase tracking-wider mb-2">
                  ESP Payload Byte Entropy Matrix (Opaque Shading)
                </p>
                <div className="grid grid-cols-8 gap-1 p-2 border border-border bg-background/60">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const val = (7.88 + ((i * 17) % 11) * 0.01).toFixed(2);
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-center p-1.5 border border-primary/20 bg-primary/10 text-[9px] font-mono text-teal-300"
                        title={`Byte block #${i}: Entropy ${val} / 8.00 (Encrypted)`}
                      >
                        <span>{val}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Mean Shannon Entropy: 7.94 / 8.00 bits per byte — Mathematical proof that payload is 100% encrypted and uninspected.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
