import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PROJECT, LIVE_TELEMETRY } from "@/data/sentinel";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  label?: string | undefined;
  isGateway?: boolean | undefined;
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

      const isLight = document.documentElement.classList.contains("light");

      // Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          if (!a || !b) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > 210) continue;
          const alpha = (1 - d / 210) * 0.38;

          // Animated dashed tunnel lines
          const gwColor = isLight ? `rgba(66, 133, 244, ${alpha * 1.5})` : `rgba(45, 212, 191, ${alpha * 1.5})`;
          const normColor = isLight ? `rgba(148, 163, 184, ${alpha * 0.7})` : `rgba(100, 116, 139, ${alpha * 0.8})`;

          ctx.strokeStyle = a.isGateway || b.isGateway ? gwColor : normColor;
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
            ctx.fillStyle = isLight ? `rgba(66, 133, 244, ${alpha * 2.8})` : `rgba(94, 234, 212, ${alpha * 2.8})`;
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
          ctx.fillStyle = isLight ? "rgba(66, 133, 244, 0.95)" : "rgba(45, 212, 191, 0.95)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = isLight ? "rgba(66, 133, 244, 0.35)" : "rgba(45, 212, 191, 0.35)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, 10 + Math.sin(t * 0.03 + n.x) * 3, 0, Math.PI * 2);
          ctx.stroke();

          // Label
          if (n.label) {
            ctx.font = "9px monospace";
            ctx.fillStyle = isLight ? "rgba(71, 85, 105, 0.9)" : "rgba(203, 213, 225, 0.65)";
            ctx.fillText(n.label, n.x + 8, n.y + 3);
          }
        } else {
          ctx.fillStyle = n.r > 2 
            ? (isLight ? "rgba(66, 133, 244, 0.75)" : "rgba(94, 234, 212, 0.75)") 
            : (isLight ? "rgba(148, 163, 184, 0.5)" : "rgba(148, 163, 184, 0.45)");
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
  const [activeTab, setActiveTab] = useState<"stream" | "handshake" | "entropy" | "raw">("stream");
  const [packetCount, setPacketCount] = useState(14820);

  // Periodic ticker for live simulation feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketCount((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-28 sm:px-8 lg:px-12">
      {/* Background technical textures */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-35" aria-hidden="true" />
      <NetworkCanvas />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,transparent_20%,var(--background)_82%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        {/* Left Column: Mission, Value Prop, CTAs */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Metadata badges */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em]">
              <span className="border border-primary/50 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                {PROJECT.ps}
              </span>
              <span className="border border-border bg-surface px-2.5 py-1 text-muted-foreground">
                {PROJECT.org}
              </span>
              <span className="border border-border bg-surface px-2.5 py-1 text-muted-foreground">
                {PROJECT.theme}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Audit the tunnel.
              <br />
              <span className="text-primary underline decoration-primary/40 decoration-1 underline-offset-8">
                Never decrypt the payload.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              <strong className="text-foreground font-semibold">CipherLens</strong> is an AI-powered IPsec VPN
              protocol analyzer and security assessment framework. It parses IKE handshakes deterministically,
              classifies encrypted ESP traffic via second-order statistical side channels with explainable ML, and generates
              blockchain-anchored posture scores — with zero plaintext exposure.
            </p>

            {/* Action CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#explore"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover-glow inline-flex items-center gap-2 border border-primary/70 bg-primary/15 px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-primary font-bold shadow-[0_0_15px_rgba(20,184,166,0.2)] cursor-pointer"
              >
                Explore Platform Modules
              </a>
              <Link
                to="/zero-decrypt"
                className="hover-glow inline-flex items-center gap-2 border border-border bg-surface px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-foreground/90 hover:text-foreground font-semibold"
              >
                Zero-Decrypt AI Lab
              </Link>
              <Link
                to="/security"
                className="hover-glow inline-flex items-center gap-2 border border-border bg-surface/60 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
              >
                Enter Threat Sandbox
              </Link>
            </div>
          </div>

          {/* Key Metric Indicators */}
          <div className="mt-10 grid grid-cols-2 gap-3 border-t border-border/80 pt-6 sm:grid-cols-4 font-mono">
            <div className="bg-surface/50 border border-border/50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Packets Ingested</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-foreground">2.48M+</p>
            </div>
            <div className="bg-surface/50 border border-border/50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Zero-Decrypt F1</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-primary">{LIVE_TELEMETRY.zeroDecryptionAccuracy}</p>
            </div>
            <div className="bg-surface/50 border border-border/50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Mean Latency</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{LIVE_TELEMETRY.meanInferenceLatency}</p>
            </div>
            <div className="bg-surface/50 border border-border/50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">HNDL Risk Window</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-destructive">{LIVE_TELEMETRY.pqcExposureRate}</p>
            </div>
          </div>
        </div>

        {/* Right Column: ENLARGED Live Interactive Telemetry Console */}
        <div className="panel scanlines flex min-h-[560px] flex-col overflow-hidden border-border/90 bg-surface/95 shadow-2xl">
          {/* Console Header / Tabs */}
          <div className="flex items-center justify-between border-b border-border bg-background/90 px-3.5 py-2.5 text-[11px] font-mono">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("stream")}
                className={`px-3 py-1 uppercase tracking-wider transition-colors ${
                  activeTab === "stream"
                    ? "border-b-2 border-primary bg-primary/15 text-primary font-bold shadow-[0_0_10px_rgba(20,184,166,0.15)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ● Live Stream
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("handshake")}
                className={`px-3 py-1 uppercase tracking-wider transition-colors ${
                  activeTab === "handshake"
                    ? "border-b-2 border-primary bg-primary/15 text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                IKEv2 Inspector
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("entropy")}
                className={`px-3 py-1 uppercase tracking-wider transition-colors ${
                  activeTab === "entropy"
                    ? "border-b-2 border-primary bg-primary/15 text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ESP Heatmap
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("raw")}
                className={`px-3 py-1 uppercase tracking-wider transition-colors ${
                  activeTab === "raw"
                    ? "border-b-2 border-primary bg-primary/15 text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Hex Frames
              </button>
            </div>

            <div className="flex items-center gap-2 text-primary font-mono text-[10.5px]">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="font-bold">eBPF TAP ACTIVE</span>
            </div>
          </div>

          {/* Sub-HUD Metrics Ribbon */}
          <div className="grid grid-cols-4 border-b border-border/70 bg-background/60 px-4 py-2 font-mono text-[10.5px] text-muted-foreground">
            <div>
              <span className="block text-[9px] uppercase tracking-wider">TAP DEV</span>
              <span className="text-foreground font-semibold">eth0 (PROMISC)</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider">FRAMES</span>
              <span className="text-primary font-bold tabular-nums">{packetCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider">THROUGHPUT</span>
              <span className="text-foreground font-semibold">142.4 Mbps</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider">ZERO-DECRYPT</span>
              <span className="text-primary font-bold">OPAQUE (100%)</span>
            </div>
          </div>

          {/* Console Tab Contents - Expanded vertical real estate */}
          <div className="flex-1 p-4 font-mono text-[11.5px] leading-relaxed overflow-y-auto">
            {activeTab === "stream" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5 text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  <span className="text-primary font-semibold">[KERNEL PASSIVE RING BUFFER]</span>
                  <span>UDP 500 / 4500 & IP PROTO 50</span>
                </div>

                <div className="space-y-1.5 font-mono text-[11.5px] text-foreground/90">
                  <div className="flex items-start gap-2 bg-background/60 p-1.5 border-l-2 border-primary/50">
                    <span className="text-muted-foreground shrink-0 text-[10.5px]">14:02:11.892</span>
                    <span className="text-primary font-bold shrink-0">[IKE_INIT]</span>
                    <span className="truncate">SPIi=0x8fa921c3 SPIr=0x00000000 · Flags: [INITIATOR] · Len=432B</span>
                  </div>

                  <div className="flex items-start gap-2 bg-destructive/10 p-1.5 border-l-2 border-destructive">
                    <span className="text-muted-foreground shrink-0 text-[10.5px]">14:02:11.894</span>
                    <span className="text-destructive font-bold shrink-0">[IKE_WARN]</span>
                    <span className="text-destructive">Aggressive Mode PSK proposal accepted (CVE-2002-1623)</span>
                  </div>

                  <div className="flex items-start gap-2 bg-amber-500/10 p-1.5 border-l-2 border-amber-500">
                    <span className="text-muted-foreground shrink-0 text-[10.5px]">14:02:11.895</span>
                    <span className="text-amber-500 font-bold shrink-0">[CRYPTO]</span>
                    <span className="text-amber-700 dark:text-amber-200">Transform: 3DES-CBC / HMAC-SHA1 / DH-Grp-14 [SWEET32 RISK]</span>
                  </div>

                  <div className="flex items-start gap-2 bg-background/60 p-1.5 border-l-2 border-primary/50">
                    <span className="text-muted-foreground shrink-0 text-[10.5px]">14:02:11.908</span>
                    <span className="text-primary font-bold shrink-0">[ESP_FLOW]</span>
                    <span>SPI=0x34a81b99 seq=10492 len=172B entropy=7.94 (opaque ciphertext)</span>
                  </div>

                  <div className="flex items-start gap-2 bg-primary/10 p-1.5 border-l-2 border-primary">
                    <span className="text-muted-foreground shrink-0 text-[10.5px]">14:02:11.928</span>
                    <span className="text-primary font-bold shrink-0">[ML_XAI]</span>
                    <span className="text-primary font-semibold">Class=VoIP (99.4%) · TreeSHAP top: isochronous_20ms_delta</span>
                  </div>

                  <div className="flex items-start gap-2 bg-destructive/10 p-1.5 border-l-2 border-destructive">
                    <span className="text-muted-foreground shrink-0 text-[10.5px]">14:02:11.940</span>
                    <span className="text-destructive font-bold shrink-0">[PQC_AUDIT]</span>
                    <span className="text-destructive">RFC 8784 PPK: Missing · ML-KEM: None · HNDL Risk: HIGH (~8 Yrs)</span>
                  </div>

                  <div className="flex items-start gap-2 bg-primary/10 p-1.5 border-l-2 border-primary">
                    <span className="text-muted-foreground shrink-0 text-[10.5px]">14:02:11.956</span>
                    <span className="text-primary font-bold shrink-0">[MERKLE_LOG]</span>
                    <span className="text-primary truncate">Committed finding hash 0x8f2a... to Block #{LIVE_TELEMETRY.blockHeight}</span>
                  </div>
                </div>

                <div className="mt-4 rounded border border-border/80 bg-background/80 p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-destructive">EVALUATION VERDICT: POSTURE SCORE 42/100 (AT RISK)</span>
                    <span className="text-primary font-mono text-[10px] animate-pulse">● Continuous Capture</span>
                  </div>
                  <p className="mt-1 text-[10.5px] text-muted-foreground font-sans">
                    Deterministic mapping against NIST SP 800-77 detected 3 critical vulnerabilities in cleartext IKE handshake.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "handshake" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10.5px] uppercase tracking-wider text-primary border-b border-border/40 pb-1">
                  <span>RFC 7296 IKE_SA_INIT Payload Tree</span>
                  <span className="text-muted-foreground">Deterministic Dissector</span>
                </div>
                <div className="border border-border/80 bg-background/60 p-3 space-y-1.5 text-foreground/90 font-mono text-[11px]">
                  <div>├─ HDR: Next=SA, Maj=2, Min=0, Exchange=IKE_SA_INIT (34), MessageID=0</div>
                  <div>├─ SA Payload: Length=48, Proposal #1 (Transform Count: 4)</div>
                  <div className="pl-5 text-destructive font-semibold">├─ ENCR: Transform ID=3 (3DES-CBC) [CVE-2016-2183 SWEET32]</div>
                  <div className="pl-5 text-amber-600 dark:text-amber-300">├─ PRF: Transform ID=2 (PRF_HMAC_SHA1) [DEPRECATED NIST]</div>
                  <div className="pl-5 text-muted-foreground">├─ INTEG: Transform ID=2 (AUTH_HMAC_SHA1_96)</div>
                  <div className="pl-5 text-destructive font-semibold">└─ D-H: Transform ID=14 (2048-bit MODP) [NO_PQC / HARVEST_RISK]</div>
                  <div>├─ KE Payload: DH Group=14, KeyExchangeData (256 bytes)</div>
                  <div>├─ Nonce Payload (Ni): NonceData (32 bytes entropy: 7.98 / 8.00)</div>
                  <div className="text-destructive font-semibold">└─ Notify: HTTP_CERT_LOOKUP_SUPPORTED (No mutual TPM cert binding)</div>
                </div>
              </div>
            )}

            {activeTab === "entropy" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10.5px] uppercase tracking-wider text-primary border-b border-border/40 pb-1">
                  <span>ESP Payload Byte Shannon Entropy Matrix</span>
                  <span className="text-primary font-semibold">Mean: 7.94 / 8.00 bits/byte</span>
                </div>
                <p className="text-[10.5px] text-muted-foreground font-sans">
                  Mathematical proof of ciphertext opacity: each 32-byte ESP payload chunk exhibits near-ideal random entropy, confirming zero plaintext leakage into inference engine.
                </p>
                <div className="grid grid-cols-8 gap-1.5 p-2.5 border border-border bg-background/70">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const val = (7.88 + ((i * 17) % 11) * 0.01).toFixed(2);
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-center p-2 border border-primary/30 bg-primary/10 text-[10px] font-mono text-primary hover:bg-primary/20 transition-colors"
                        title={`ESP Byte block #${i}: Shannon Entropy ${val} / 8.00 (Cryptographically Opaque)`}
                      >
                        <span className="font-bold">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "raw" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10.5px] uppercase tracking-wider text-primary border-b border-border/40 pb-1">
                  <span>Captured Raw Packet Frame Hex Dump (Scapy Stream)</span>
                  <span className="text-muted-foreground">ESP IP Proto 50</span>
                </div>
                <pre className="border border-border/80 bg-background/80 p-3 font-mono text-[10.5px] leading-snug text-foreground/90 overflow-x-auto">
{`0000  45 00 00 ec a1 b2 40 00  40 32 8c 4f c0 a8 01 0a  E.....@.@2.O....
0010  c0 a8 01 01 34 a8 1b 99  00 00 28 fc 9a 7d 11 b4  ....4.....(..}..
0020  2e 8c f1 99 43 a2 e9 18  55 1b dc 42 77 10 9f e0  ....C...U..Bw...
0030  e4 71 83 29 b5 61 ce 09  da fe 18 3c 7a 41 b8 d2  .q.).a.....<zA..
0040  91 e3 f0 2b 4c 11 ac 7e  69 34 20 bb 01 02 03 04  ...+L..~i4 .....
[ENC_PAYLOAD]: 128 Bytes Opaque Ciphertext · IV: 16B · ICV: 16B`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
