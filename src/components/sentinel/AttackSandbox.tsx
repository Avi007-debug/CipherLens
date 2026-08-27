import { useState } from "react";
import { ATTACK_SCENARIOS } from "@/data/sentinel";
import { Section, SectionHead, StatusBadge } from "./shared";

const VULNERABLE_CONFIG = `# /etc/ipsec.conf — VULNERABLE PRODUCTION CONFIG
conn site-to-site-vpn
    authby=secret
    ike=3des-sha1-modp2048!     # WEAK: Sweet32 + SHA1 + Classical DH
    esp=3des-sha1!              # CRITICAL: 64-bit block cipher collision
    aggressive=yes              # CRITICAL: Exposes PSK hash in the clear
    ikelifetime=28800s          # 8 hour exposure window
    rekeymargin=3m
    keyingtries=1
    auto=start`;

const REMEDIATED_CONFIG = `# /etc/ipsec.conf — CIPHERLENS REMEDIATED CONFIG (CNSA 2.0)
conn site-to-site-vpn
    authby=pubkey
    leftcert=gateway_ecdsa384.crt
    leftsigkey=tpm2_bound
    ike=chacha20poly1305-prfsha384-curve25519-mlkem768!  # PQC HYBRID
    esp=aes256gcm128-curve25519!                          # AEAD HIGH CONF
    aggressive=no                                         # Strict IKEv2
    ikelifetime=3600s                                     # 1h SA rekey
    replay_window=1024                                    # ESN Anti-Replay
    auto=start`;

export function AttackSandbox() {
  const [selectedAtk, setSelectedAtk] = useState(ATTACK_SCENARIOS[0].id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);

  const activeScenario =
    ATTACK_SCENARIOS.find((a) => a.id === selectedAtk) || ATTACK_SCENARIOS[0];

  const runAttackSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);
    setTimeout(() => setSimStep(2), 700);
    setTimeout(() => setSimStep(3), 1500);
    setTimeout(() => {
      setSimStep(4);
      setIsSimulating(false);
    }, 2300);
  };

  return (
    <Section id="sandbox">
      <SectionHead
        tag="Tier 2 · SBX-05 & POL-04"
        title="Attack-Replay Sandbox & Policy Diff Simulator"
        lede="Test defensive resilience against known IPsec exploit primitives in an isolated container sandbox, and simulate configuration diffs with instant security posture scoring."
      />

      {/* Main Grid: Attack Sandbox on Left, Policy Diff on Right */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Left: Interactive Attack Replay Sandbox */}
        <div className="border border-border bg-surface p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              [1] Attack Replay Sandbox
            </h3>
            <span className="font-mono text-[10px] text-destructive border border-destructive/40 px-2 py-0.5 bg-destructive/10">
              Isolated Testbed
            </span>
          </div>

          {/* Scenario Selector */}
          <div className="mt-4 flex flex-wrap gap-2">
            {ATTACK_SCENARIOS.map((atk) => (
              <button
                key={atk.id}
                type="button"
                onClick={() => {
                  setSelectedAtk(atk.id);
                  setSimStep(0);
                }}
                className={`border p-2 font-mono text-[11px] uppercase tracking-wider transition-all text-left truncate max-w-[240px] ${
                  selectedAtk === atk.id
                    ? "border-destructive bg-destructive/15 text-destructive font-bold"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {atk.name}
              </button>
            ))}
          </div>

          {/* Attack Details */}
          <div className="mt-4 border border-border/80 bg-background/60 p-4 font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">{activeScenario.name}</span>
              <StatusBadge status={activeScenario.severity} />
            </div>

            <div className="flex gap-4 text-[10.5px] text-muted-foreground">
              <span>CVE: <strong className="text-destructive">{activeScenario.cve}</strong></span>
              <span>VECTOR: <strong className="text-slate-300">{activeScenario.vector}</strong></span>
            </div>

            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {activeScenario.description}
            </p>

            <div className="pt-2 border-t border-border/50">
              <button
                type="button"
                onClick={runAttackSimulation}
                disabled={isSimulating}
                className="hover-glow w-full border border-destructive/60 bg-destructive/20 py-2 font-mono text-xs uppercase tracking-widest text-destructive hover:bg-destructive/30 font-bold transition-all"
              >
                {isSimulating ? "REPLAYING EXPLOIT IN SANDBOX..." : "▶ Replay Exploit in Sandbox"}
              </button>
            </div>

            {/* Simulation Telemetry Output */}
            {simStep > 0 && (
              <div className="mt-3 border border-destructive/40 bg-black/80 p-3 text-[10.5px] font-mono text-slate-300 space-y-1">
                <div className="text-primary font-bold">[STEP 1] Ingesting crafted payload exchange...</div>
                {simStep >= 2 && (
                  <div className="text-amber-400">
                    [STEP 2] Intercepted responder hash: {activeScenario.sentinelDetection}
                  </div>
                )}
                {simStep >= 3 && (
                  <div className="text-destructive font-bold">
                    [STEP 3] Exploit Succeeded on Vulnerable Node (Score Drop: -52 pts)
                  </div>
                )}
                {simStep >= 4 && (
                  <div className="text-teal-300 font-bold border-t border-border/60 pt-1">
                    [CIPHERLENS MITIGATION]: {activeScenario.remediation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Policy Diff Simulator */}
        <div className="border border-border bg-surface p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              [2] Live IPsec Policy Diff Simulator
            </h3>
            <span className="font-mono text-[10px] text-primary border border-primary/50 px-2 py-0.5 bg-primary/10">
              +52 Posture Delta
            </span>
          </div>

          <div className="mt-4 grid gap-3 font-mono text-[10.5px]">
            <div>
              <span className="text-destructive font-bold block mb-1">
                − Current Policy (ipsec.conf) · Score: 42/100
              </span>
              <pre className="border border-destructive/30 bg-destructive/5 p-3 text-destructive/90 overflow-x-auto whitespace-pre leading-relaxed">
                {VULNERABLE_CONFIG}
              </pre>
            </div>

            <div>
              <span className="text-primary font-bold block mb-1">
                + CipherLens Remediated Policy · Score: 94/100
              </span>
              <pre className="border border-primary/30 bg-primary/5 p-3 text-teal-300 overflow-x-auto whitespace-pre leading-relaxed">
                {REMEDIATED_CONFIG}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
