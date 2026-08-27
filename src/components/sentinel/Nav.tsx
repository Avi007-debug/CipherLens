import { useState, useEffect } from "react";
import { PROJECT, LIVE_TELEMETRY } from "@/data/sentinel";
import { isSupabaseConfigured } from "@/lib/supabase";

const NAV_LINKS = [
  { href: "#problem", label: "01.Problem", id: "problem" },
  { href: "#score", label: "02.Score", id: "score" },
  { href: "#classify", label: "03.Zero-Decrypt", id: "classify" },
  { href: "#features", label: "04.Capabilities", id: "features" },
  { href: "#pipeline", label: "05.Architecture", id: "pipeline" },
  { href: "#pqc", label: "06.PQC-Matrix", id: "pqc" },
  { href: "#sandbox", label: "07.Attack-Sandbox", id: "sandbox" },
  { href: "#ledger", label: "08.Blockchain", id: "ledger" },
  { href: "#roadmap", label: "09.Roadmap", id: "roadmap" },
];

export function Nav({
  onOpenCli,
  onOpenPitch,
  onOpenPcap,
  onOpenSupabase,
}: {
  onOpenCli?: () => void;
  onOpenPitch?: () => void;
  onOpenPcap?: () => void;
  onOpenSupabase?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.map((link) => link.id);
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      {/* Top HUD Telemetry strip */}
      <div className="border-b border-border/60 bg-background/95 px-4 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-primary font-bold">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              STATUS: ONLINE
            </span>
            <span className="text-border">|</span>
            <span className="text-slate-400">TAP: eBPF PASSIVE (eth0)</span>
            <span className="text-border">|</span>
            <span className="text-slate-400">INFERENCE: {LIVE_TELEMETRY.meanInferenceLatency}</span>
            <span className="text-border">|</span>
            {onOpenSupabase ? (
              <button
                type="button"
                onClick={onOpenSupabase}
                className="hover:underline flex items-center gap-1 text-teal-300"
              >
                ☁ {isSupabaseConfigured ? "SUPABASE: CONNECTED" : "SUPABASE: LOCAL"}
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">NTRO {PROJECT.ps}</span>
            <span className="text-border">|</span>
            <span className="text-primary/90">BLOCK #{LIVE_TELEMETRY.blockHeight}</span>
            <span className="text-border">|</span>
            <span className="text-slate-400 font-mono text-[9px]">{PROJECT.compliance}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation bar */}
      <nav
        aria-label="Primary"
        className={`border-b border-border/80 transition-all duration-200 ${
          scrolled ? "bg-background/90 shadow-2xl backdrop-blur-md" : "bg-background/70 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-12">
          {/* Logo & ID Tag */}
          <a
            href="#top"
            className="group flex items-center gap-2.5 font-mono text-sm tracking-tight transition-transform hover:scale-[1.02]"
          >
            <div className="relative flex h-6 w-6 items-center justify-center border border-primary/50 bg-primary/10">
              <span className="h-2 w-2 bg-primary group-hover:scale-125 transition-transform" />
              <div className="absolute inset-0 border border-primary/20 animate-ping opacity-30 pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold tracking-wider text-foreground">
                CIPHER<span className="text-primary">LENS</span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                IPsec Protocol Sentinel
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <ul className="hidden items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground lg:flex">
            {NAV_LINKS.map((l) => {
              const isActive = activeSection === l.id;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`transition-colors duration-200 hover:text-primary ${
                      isActive ? "text-primary border-b border-primary pb-1" : ""
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {onOpenPitch && (
              <button
                type="button"
                onClick={onOpenPitch}
                className="hover-glow inline-flex items-center gap-1.5 border border-primary/70 bg-primary/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary font-bold shadow-[0_0_12px_rgba(20,184,166,0.25)]"
              >
                <span>★</span> Pitch & Q&A
              </button>
            )}

            {onOpenPcap && (
              <button
                type="button"
                onClick={onOpenPcap}
                className="hover-glow hidden sm:inline-flex items-center gap-1.5 border border-border bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300 hover:text-foreground"
              >
                <span>📁</span> Ingest PCAP
              </button>
            )}

            {onOpenCli ? (
              <button
                type="button"
                onClick={onOpenCli}
                className="hover-glow hidden md:inline-flex items-center gap-1.5 border border-border bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300 hover:text-foreground"
              >
                <span>&gt;_</span> CLI
              </button>
            ) : null}

            <a
              href="#score"
              className="hover-glow hidden xl:inline-flex border border-border bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground"
            >
              Score
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
