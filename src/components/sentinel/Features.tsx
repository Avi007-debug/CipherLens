import { useState } from "react";
import { FEATURES } from "@/data/sentinel";
import { Section, SectionHead } from "./shared";

export function Features({
  onRunCli,
}: {
  onRunCli?: (cmd: string) => void;
}) {
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [openId, setOpenId] = useState<string | null>("WOW-01");

  const filteredFeatures =
    selectedTier === "ALL"
      ? FEATURES
      : FEATURES.filter((f) => f.tier === selectedTier);

  return (
    <Section id="features">
      <SectionHead
        tag="Differentiators & Capabilities"
        title="Three tiers of technical capability, indexed by technique ID"
        lede="Tier 1 delivers the fundamental research breakthroughs in zero-decryption signal analysis, Tier 2 builds the operational simulation sandbox, and Tier 3 delivers enterprise blockchain auditability and SOC-grade SIEM integrations."
        action={
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {["ALL", "TIER 1", "TIER 2", "TIER 3"].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedTier(tier)}
                className={`hover-glow border px-3 py-1.5 uppercase tracking-wider transition-all ${
                  selectedTier === tier
                    ? "border-primary bg-primary/20 text-primary font-semibold"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {tier === "ALL" ? "All (10)" : tier}
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {filteredFeatures.map((f) => {
          const isOpen = openId === f.id;

          return (
            <div
              key={f.id}
              className={`hover-glow group flex flex-col justify-between bg-surface p-6 transition-all duration-200 ${
                isOpen ? "bg-surface-raised border-primary/40" : ""
              }`}
            >
              <div>
                {/* Header: Technique ID + Tier */}
                <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
                  <span className="font-bold text-primary border border-primary/40 bg-primary/10 px-2 py-0.5">
                    {f.id}
                  </span>
                  <span className="text-muted-foreground text-[10px]">{f.tier}</span>
                </div>

                {/* Category & Title */}
                <p className="mt-3 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  {f.category}
                </p>
                <h3 className="mt-1 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                  {f.title}
                </h3>

                {/* Summary Blurb */}
                <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                  {f.blurb}
                </p>
              </div>

              {/* Expandable Technical Detail */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : f.id)}
                  className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-primary hover:underline"
                >
                  <span>{isOpen ? "− Hide Technical Spec" : "+ View Technical Architecture"}</span>
                </button>

                <div
                  className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="mt-3 border-t border-border/80 pt-3 space-y-2.5">
                      <p className="font-mono text-[11px] leading-relaxed text-slate-300">
                        {f.detail}
                      </p>

                      <div className="flex items-center justify-between border-t border-border/50 pt-2 font-mono text-[10px] text-muted-foreground">
                        <span>RFC: <strong className="text-primary">{f.rfc}</strong></span>
                      </div>

                      {f.cliCmd && (
                        <div className="mt-2 rounded bg-background/80 p-2 font-mono text-[10px] text-teal-300 border border-border/70 flex items-center justify-between">
                          <code className="truncate mr-2">$ {f.cliCmd}</code>
                          {onRunCli && (
                            <button
                              type="button"
                              onClick={() => onRunCli(f.cliCmd)}
                              className="text-[9px] uppercase border border-primary/40 px-1.5 py-0.5 text-primary hover:bg-primary/20"
                            >
                              Run
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
