import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { PROJECT, LIVE_TELEMETRY } from "@/data/sentinel";
import { isSupabaseConfigured } from "@/lib/supabase";

interface NavModule {
  id: string;
  href: string;
  num: string;
  label: string;
  category: "Core Intelligence" | "Defense & Simulation" | "Architecture & Verification";
  desc: string;
  badge?: string;
}

const NAV_MODULES: NavModule[] = [
  {
    id: "problem",
    href: "/#problem",
    num: "01",
    label: "Problem & Context",
    category: "Core Intelligence",
    desc: "Manual Wireshark limitations & automated paradigm",
  },
  {
    id: "score",
    href: "/security#score",
    num: "02",
    label: "Security Posture Score",
    category: "Core Intelligence",
    desc: "0–100 rubric with line-by-line RFC clauses",
    badge: "NIST SP 800-77",
  },
  {
    id: "classify",
    href: "/zero-decrypt",
    num: "03",
    label: "Zero-Decrypt ESP Fingerprint",
    category: "Core Intelligence",
    desc: "Second-order side-channel ML with TreeSHAP",
    badge: ">98% F1",
  },
  {
    id: "features",
    href: "/capabilities",
    num: "04",
    label: "Platform Capabilities",
    category: "Defense & Simulation",
    desc: "10 technical differentiators across 3 tiers",
  },
  {
    id: "pipeline",
    href: "/capabilities#pipeline",
    num: "05",
    label: "5-Layer Architecture",
    category: "Defense & Simulation",
    desc: "Passive wire capture to blockchain commitment",
  },
  {
    id: "pqc",
    href: "/security#pqc",
    num: "06",
    label: "PQC & HNDL Matrix",
    category: "Defense & Simulation",
    desc: "Quantum exposure window & ML-KEM hybrid",
    badge: "CNSA 2.0",
  },
  {
    id: "sandbox",
    href: "/security#sandbox",
    num: "07",
    label: "Attack-Replay Sandbox",
    category: "Architecture & Verification",
    desc: "Live CVE exploit replay & policy diff engine",
  },
  {
    id: "ledger",
    href: "/audit#ledger",
    num: "08",
    label: "Blockchain Merkle Ledger",
    category: "Architecture & Verification",
    desc: "zk-SNARK & Hyperledger Fabric audit trails",
    badge: "Hyperledger",
  },
  {
    id: "roadmap",
    href: "/audit#roadmap",
    num: "09",
    label: "Engineering Roadmap",
    category: "Architecture & Verification",
    desc: "8 phases from testbed bring-up to validation",
  },
];

export function Nav({
  onOpenCli,
  onOpenQa,
  onOpenPcap,
  onOpenSupabase,
}: {
  onOpenCli?: () => void;
  onOpenQa?: () => void;
  onOpenPcap?: () => void;
  onOpenSupabase?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Group modules by category
  const categories = Array.from(new Set(NAV_MODULES.map((m) => m.category)));

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
            <span className="flex items-center gap-1.5 font-bold text-primary">
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
                className="flex items-center gap-1 text-teal-300 hover:underline"
              >
                ☁ {isSupabaseConfigured ? "SUPABASE: CONNECTED" : "SUPABASE: LOCAL"}
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">{PROJECT.ps}</span>
            <span className="text-border">|</span>
            <span className="text-primary/90">BLOCK #{LIVE_TELEMETRY.blockHeight}</span>
            <span className="text-border">|</span>
            <span className="font-mono text-[9px] text-slate-400">{PROJECT.compliance}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation bar - Clean & Modern */}
      <nav
        aria-label="Primary"
        className={`border-b border-border/80 transition-all duration-200 ${
          scrolled ? "bg-background/95 shadow-2xl backdrop-blur-md" : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-8 lg:px-12 relative">
          {/* Logo & ID Tag (Left aligned) */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 font-mono text-sm tracking-tight transition-transform hover:scale-[1.02] z-10"
          >
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden border border-primary/40 bg-surface p-0.5">
              <img
                src="/logo_ipsec.png"
                alt="CipherLens Logo"
                className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-foreground">
                CIPHER<span className="text-primary">LENS</span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                AI IPsec Sentinel
              </span>
            </div>
          </Link>

          {/* Absolute Centered Explore Modules Dropdown */}
          <div className="hidden lg:flex absolute inset-x-0 top-0 bottom-0 items-center justify-center pointer-events-none">
            <div className="relative pointer-events-auto" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`hover-glow flex items-center gap-2 border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                  dropdownOpen
                    ? "border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(20,184,166,0.25)]"
                    : "border-border/90 bg-surface/90 text-foreground hover:border-primary/60"
                }`}
                aria-expanded={dropdownOpen}
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-bold">Explore Modules</span>
                </div>
                <span className={`text-[10px] text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-primary" : ""}`}>
                  ▼
                </span>
              </button>

              {/* Centered Dropdown Menu Overlay */}
              {dropdownOpen && (
                <div className="absolute left-1/2 top-full mt-2 w-[92vw] max-w-3xl -translate-x-1/2 border border-border/90 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-border/70 pb-2.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-2 text-primary font-bold">
                      <span className="h-2 w-2 bg-primary" />
                      Platform Navigator
                    </span>
                    <span className="text-[10px]">9 Dedicated Views</span>
                  </div>

                  <div className="mt-3 grid gap-4 md:grid-cols-3">
                    {categories.map((cat) => (
                      <div key={cat} className="space-y-2">
                        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary/80 border-b border-border/40 pb-1">
                          {cat}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {NAV_MODULES.filter((m) => m.category === cat).map((mod) => (
                            <Link
                              key={mod.id}
                              to={mod.href}
                              onClick={() => setDropdownOpen(false)}
                              className="group flex flex-col gap-1 border border-border/40 bg-background/50 p-2 transition-all hover:border-primary/50 hover:bg-surface-raised"
                            >
                              <div className="flex items-center justify-between font-mono text-[10.5px]">
                                <span className="font-bold text-foreground group-hover:text-primary">
                                  <span className="text-muted-foreground mr-1">[{mod.num}]</span>
                                  {mod.label}
                                </span>
                                {mod.badge && (
                                  <span className="text-[9px] border border-primary/30 bg-primary/10 px-1 py-0.5 text-primary">
                                    {mod.badge}
                                  </span>
                                )}
                              </div>
                              <p className="font-sans text-[10px] text-muted-foreground leading-tight">
                                {mod.desc}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3.5 flex items-center justify-between border-t border-border/70 pt-2.5 font-mono text-[10px] text-muted-foreground">
                    <span className="text-slate-400">NTRO PS 26160 Security Suite</span>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(false)}
                      className="text-primary hover:underline"
                    >
                      Close [ESC]
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs (Right aligned) & Mobile Dropdown Fallback */}
          <div className="flex items-center gap-2 z-10">
            {/* Mobile Explore Dropdown Trigger (visible only on small screens) */}
            <div className="lg:hidden relative" ref={dropdownRef}>
               <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="hover-glow flex items-center gap-1.5 border border-border/90 bg-surface/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground hover:border-primary/60"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Explore
              </button>
               {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-[85vw] max-w-sm border border-border/90 bg-surface/95 p-3 shadow-2xl backdrop-blur-xl z-50 overflow-y-auto max-h-[80vh]">
                   <div className="space-y-3">
                    {categories.map((cat) => (
                      <div key={cat} className="space-y-1.5">
                        <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary/80 border-b border-border/40 pb-1">
                          {cat}
                        </div>
                        {NAV_MODULES.filter((m) => m.category === cat).map((mod) => (
                          <Link
                            key={mod.id}
                            to={mod.href}
                            onClick={() => setDropdownOpen(false)}
                            className="group flex flex-col gap-0.5 border border-border/40 bg-background/50 p-1.5 transition-all hover:border-primary/50 hover:bg-surface-raised"
                          >
                             <div className="font-mono text-[10px] font-bold text-foreground group-hover:text-primary">
                                {mod.label}
                             </div>
                             <p className="font-sans text-[9px] text-muted-foreground line-clamp-1">
                                {mod.desc}
                             </p>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
               )}
            </div>

            {onOpenQa && (
              <button
                type="button"
                onClick={onOpenQa}
                className="hover-glow inline-flex items-center gap-1.5 border border-primary/70 bg-primary/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary font-bold shadow-[0_0_12px_rgba(20,184,166,0.25)]"
              >
                <span>★</span> Q&A
              </button>
            )}

            {onOpenPcap && (
              <button
                type="button"
                onClick={onOpenPcap}
                className="hover-glow hidden sm:inline-flex items-center gap-1.5 border border-border bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300 hover:text-foreground"
              >
                <span>📁</span> PCAP
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
          </div>
        </div>
      </nav>
    </header>
  );
}
