import { useState } from "react";

const SAMPLE_COMMANDS = [
  {
    cmd: "cipherlens scan --iface eth0 --target 198.51.100.2",
    output: `[+] Listening on eth0 (eBPF passive hook initialized)
[+] Captured IKE_SA_INIT exchange (SPIi: 0x8fa921c3)
[!] CRITICAL: IKEv1 Aggressive Mode proposal accepted
[!] CVE-2002-1623: PSK hash exposed to dictionary attack
[!] WEAK: 3DES-CBC / SHA-1 in proposal transform set
[*] Posture Score: 42/100 (HIGH RISK)`,
  },
  {
    cmd: "cipherlens classify --stream esp0 --mode zero-decryption",
    output: `[+] Analyzing 56-packet ESP window (mean entropy: 7.94 bits/byte)
[+] Side-channel feature vector extracted in 0.42ms:
    - Markov inter-arrival mean: 20.02ms (variance: 0.12)
    - Payload bimodal peak: 172 Bytes
    - Directional ratio: 1.01
[+] LightGBM Verdict: VoIP Telephony (RTP/G.711a)
[+] Calibrated Confidence: 99.4% [Uncertainty: ±0.4%]`,
  },
  {
    cmd: "cipherlens xai --flow esp:0x34a81b99 --top-k 3",
    output: `[+] Local TreeSHAP Feature Attributions for flow 0x34a81b99:
    1. isochronous_delta_20ms ...... +0.44 SHAP [HIGH]
    2. bimodal_payload_172b ........ +0.38 SHAP [HIGH]
    3. symmetric_stream_ratio ...... +0.18 SHAP [MED]
[*] Baseline Expectation: 0.25 -> Model Output: 0.994`,
  },
  {
    cmd: "cipherlens pqc --eval-cnsa --pcap /pcaps/ikev2.pcap",
    output: `[+] Evaluating Post-Quantum Cryptographic Agility against CNSA 2.0:
    - DH Key Exchange: DH Group 14 (MODP 2048) -> QUANTUM VULNERABLE
    - RFC 8784 PPKs: NOT CONFIGURED
    - ML-KEM-768 Hybrid: MISSING
[!] HNDL Retrospective Exposure Window: ~16 Years
[*] Recommendation: Transition to RFC 9370 ML-KEM hybrid key exchange`,
  },
  {
    cmd: "cipherlens ledger verify --block 1840291",
    output: `[+] Querying Hyperledger Fabric permissioned ledger:
[+] Block Height: #1840291
[+] Merkle Root: 0x3f7a91bc829e102df081c7429184a5697203b8e21948baef0091823746cba941
[+] Zero-Knowledge Proof: zk-SNARK Groth16 verification PASSED
[*] Status: IMMUTABLE AUDIT TRAIL CONFIRMED`,
  },
];

export function CliTerminalModal({
  isOpen,
  onClose,
  initialCmd,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialCmd?: string | undefined;
}) {
  const [activeOutput, setActiveOutput] = useState<string>(
    SAMPLE_COMMANDS[0]!.output
  );
  const [inputVal, setInputVal] = useState<string>(
    initialCmd || SAMPLE_COMMANDS[0]!.cmd
  );

  if (!isOpen) return null;

  const handleRun = (cmdStr: string) => {
    setInputVal(cmdStr);
    const match = SAMPLE_COMMANDS.find((c) => c.cmd.includes(cmdStr.trim().split(" ")[1] || ""));
    if (match) {
      setActiveOutput(match.output);
    } else {
      setActiveOutput(`[+] Executing: ${cmdStr}\n[+] Running analysis pipeline...\n[*] Completed with status 0.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl border border-primary/50 bg-surface shadow-2xl overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-border bg-background/90 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-destructive/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-warn/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-primary/80 inline-block" />
            <span className="ml-2 font-bold text-foreground">
              cipherlens-cli v2.4.0 (Interactive Sandbox)
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-border/80 bg-surface px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
          >
            CLOSE
          </button>
        </div>

        {/* Quick Command Selector */}
        <div className="border-b border-border bg-background/50 p-2 text-[11px] overflow-x-auto flex gap-2">
          {SAMPLE_COMMANDS.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleRun(c.cmd)}
              className="border border-border/80 bg-surface px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors whitespace-nowrap cursor-pointer"
            >
              {c.cmd.split(" ")[1]}
            </button>
          ))}
        </div>

        {/* Terminal Screen */}
        <div className="p-4 bg-black/90 text-[11.5px] leading-relaxed min-h-[260px] max-h-[360px] overflow-y-auto">
          <div className="text-muted-foreground mb-3">
            # Type or select a command below to execute simulated protocol inspection:
          </div>
          <pre className="text-teal-300 whitespace-pre-wrap">{activeOutput}</pre>
        </div>

        {/* Input prompt */}
        <div className="border-t border-border bg-surface p-3 flex items-center gap-2 text-xs">
          <span className="text-primary font-bold">sentinel@analyzer:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRun(inputVal);
            }}
            placeholder="e.g. cipherlens scan --iface eth0"
            className="flex-1 bg-transparent text-foreground outline-none border-none font-mono"
          />
          <button
            type="button"
            onClick={() => handleRun(inputVal)}
            className="border border-primary/50 bg-primary/10 px-3 py-1 text-primary uppercase text-[11px] font-bold hover:bg-primary/20"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
}
