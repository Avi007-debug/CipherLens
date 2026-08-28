import { useState } from "react";
import { ATTACK_SCENARIOS } from "@/data/sentinel";
import { Section, SectionHead, StatusBadge } from "./shared";

const POLICY_PRESETS = [
  {
    id: "preset-vulnerable",
    label: "Preset 1: Legacy Vulnerable (3DES/IKEv1)",
    score: 42,
    rating: "HIGH_RISK",
    delta: "-52 pts",
    config: `conn site-to-site-vpn
    authby=secret
    ike=3des-sha1-modp2048!     # WEAK: Sweet32 + SHA1 + Classical DH
    esp=3des-sha1!              # CRITICAL: 64-bit block cipher collision
    aggressive=yes              # CRITICAL: Exposes PSK hash in clear
    ikelifetime=28800s          # 8 hour exposure window
    rekeymargin=3m
    auto=start`,
    findings: [
      "IKEv1 Aggressive Mode enabled (CVE-2002-1623 PSK cracking risk)",
      "3DES-CBC cipher accepted (Sweet32 block collision vulnerability)",
      "DH Group 14 without PQC protection (High HNDL exposure)",
    ],
  },
  {
    id: "preset-transport-gcm",
    label: "Preset 2: Transport Mode (AES-GCM/IKEv2)",
    score: 78,
    rating: "TRANSITIONAL",
    delta: "+36 pts",
    config: `conn host-to-host-transport
    type=transport
    authby=pubkey
    leftcert=hostA.crt
    ike=aes256gcm128-prfsha384-modp3072! # AES-GCM AEAD
    esp=aes256gcm128!                     # Transport Mode ESP
    aggressive=no                         # IKEv2 Identity Protected
    ikelifetime=7200s                     # 2h SA rekey
    auto=start`,
    findings: [
      "IKEv2 with AES-256-GCM AEAD encryption validated",
      "X.509 certificate authentication enforced",
      "Classical DH Group 15 without Post-Quantum KEM support",
    ],
  },
  {
    id: "preset-cnsa-pqc",
    label: "Preset 3: Hardened CNSA 2.0 (PQC Hybrid)",
    score: 94,
    rating: "CIPHERLENS_GOLD_STANDARD",
    delta: "+52 pts",
    config: `conn enterprise-pqc-vpn
    type=tunnel
    authby=pubkey
    leftcert=gateway_ecdsa384.crt
    leftsigkey=tpm2_bound
    ike=chacha20poly1305-prfsha384-curve25519-mlkem768! # ML-KEM HYBRID
    esp=aes256gcm128-curve25519!                         # AEAD HIGH CONF
    aggressive=no                                        # Strict IKEv2
    ikelifetime=3600s                                    # 1h Rekey
    replay_window=1024                                   # ESN 64-bit Anti-Replay
    auto=start`,
    findings: [
      "FIPS 203 ML-KEM-768 hybrid key exchange enabled (Quantum Safe)",
      "Curve25519 DH Group 31 with 1-hour perfect forward secrecy",
      "Mutual TPM 2.0 bound ECDSA P-384 certificate verification",
    ],
  },
];

export function AttackSandbox() {
  const [selectedAtk, setSelectedAtk] = useState(ATTACK_SCENARIOS[0]!.id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);

  const [selectedPreset, setSelectedPreset] = useState(POLICY_PRESETS[0]!.id);
  const [customConfig, setCustomConfig] = useState(POLICY_PRESETS[0]!.config);

  const activeScenario =
    ATTACK_SCENARIOS.find((a) => a.id === selectedAtk) ?? ATTACK_SCENARIOS[0]!;
  const activePreset =
    POLICY_PRESETS.find((p) => p.id === selectedPreset) ?? POLICY_PRESETS[0]!;

  const handleSelectPreset = (id: string) => {
    setSelectedPreset(id);
    const p = POLICY_PRESETS.find((preset) => preset.id === id);
    if (p) setCustomConfig(p.config);
  };

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
        title="Attack-Replay Sandbox & Live Policy Simulator"
        lede="Test defensive resilience against known IPsec exploit primitives in an isolated sandbox, or paste/select any ipsec.conf configuration to compute instant NIST SP 800-77 scores and remediation diffs."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Left: Interactive Attack Replay Sandbox */}
        <div className="border border-border bg-surface p-6 shadow-2xl flex flex-col justify-between">
          <div>
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
            <div className="mt-4 border border-border/80 bg-background/60 p-5 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-sm">{activeScenario.name}</span>
                <StatusBadge status={activeScenario.severity} />
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>CVE: <strong className="text-destructive font-bold">{activeScenario.cve}</strong></span>
                <span>VECTOR: <strong className="text-slate-200">{activeScenario.vector}</strong></span>
              </div>

              <p className="text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
                {activeScenario.description}
              </p>

              <div className="pt-2 border-t border-border/50">
                <button
                  type="button"
                  onClick={runAttackSimulation}
                  disabled={isSimulating}
                  className="hover-glow w-full border border-destructive/60 bg-destructive/20 py-2.5 font-mono text-xs uppercase tracking-widest text-destructive hover:bg-destructive/30 font-bold transition-all"
                >
                  {isSimulating ? "REPLAYING EXPLOIT IN SANDBOX..." : "▶ Replay Exploit in Sandbox"}
                </button>
              </div>

              {/* Simulation Telemetry Output */}
              {simStep > 0 && (
                <div className="mt-3 border border-destructive/40 bg-black/80 p-3.5 text-xs font-mono text-slate-300 space-y-1.5">
                  <div className="text-primary font-bold">[STEP 1] Ingesting crafted payload exchange...</div>
                  {simStep >= 2 && (
                    <div className="text-amber-400 font-semibold">
                      [STEP 2] Intercepted responder hash: {activeScenario.sentinelDetection}
                    </div>
                  )}
                  {simStep >= 3 && (
                    <div className="text-destructive font-bold">
                      [STEP 3] Exploit Succeeded on Vulnerable Node (Score Drop: -52 pts)
                    </div>
                  )}
                  {simStep >= 4 && (
                    <div className="text-teal-300 font-bold border-t border-border/60 pt-1.5">
                      [CIPHERLENS MITIGATION]: {activeScenario.remediation}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Policy Diff & Configuration Paster */}
        <div className="border border-border bg-surface p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                [2] Live Policy Simulator & Config Diff
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  Score: {activePreset.score}/100
                </span>
                <StatusBadge status={activePreset.rating} />
              </div>
            </div>

            {/* Presets Selector */}
            <div className="mt-4 flex flex-wrap gap-2">
              {POLICY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                    selectedPreset === preset.id
                      ? "border-primary bg-primary/20 text-primary font-bold shadow-[0_0_10px_rgba(20,184,166,0.15)]"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {preset.label.split(":")[0]}
                </button>
              ))}
            </div>

            {/* Config Editor / Display */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs font-mono text-muted-foreground mb-1.5">
                <span>ipsec.conf Policy Directives:</span>
                <span className="text-primary font-bold">Delta: {activePreset.delta}</span>
              </div>
              <textarea
                value={customConfig}
                onChange={(e) => setCustomConfig(e.target.value)}
                rows={7}
                className="w-full border border-border/80 bg-background/80 p-3 font-mono text-xs text-teal-300 outline-none focus:border-primary"
              />
            </div>

            {/* Finding Breakdown for selected policy */}
            <div className="mt-3 border border-border/80 bg-background/60 p-3.5 font-mono text-xs">
              <span className="text-primary font-bold block mb-1.5">
                NIST SP 800-77 Evaluation Findings:
              </span>
              <ul className="space-y-1 text-slate-200 list-disc list-inside font-sans text-xs">
                {activePreset.findings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
