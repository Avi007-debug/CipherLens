import { useEffect, useState, useRef } from "react";

// ─── Boot sequence log lines ───────────────────────────────────────────────
const BOOT_LINES = [
  { delay: 0,    text: "CIPHERLENS SENTINEL FRAMEWORK v2.4.1" },
  { delay: 120,  text: "──────────────────────────────────────────────" },
  { delay: 240,  text: "[ OK ] Kernel module: eBPF passive tap loaded" },
  { delay: 380,  text: "[ OK ] IKEv2 grammar parser: RFC 7296 compiled" },
  { delay: 520,  text: "[ OK ] LightGBM inference engine: 847 trees warm" },
  { delay: 660,  text: "[ OK ] TreeSHAP explainer: 23 features indexed" },
  { delay: 800,  text: "[ OK ] NIST SP 800-77r1 rubric: 29 clauses loaded" },
  { delay: 940,  text: "[ OK ] Hyperledger Fabric client: chain connected" },
  { delay: 1080, text: "[ OK ] SHA-256 Merkle engine: tamper-proof active" },
  { delay: 1200, text: "[ OK ] Supabase telemetry sink: ready" },
  { delay: 1340, text: "──────────────────────────────────────────────" },
  { delay: 1480, text: "SYSTEM: NTRO PS 26160 · SIH 2026 CLASSIFICATION" },
  { delay: 1620, text: "STATUS: ALL SUBSYSTEMS NOMINAL — LAUNCHING UI…" },
];

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progressPct, setProgressPct] = useState(0);
  const [phase, setPhase] = useState<"boot" | "fadeout">("boot");
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  // Animate progress bar
  useEffect(() => {
    const total = 1900; // total duration ms
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      setProgressPct(Math.min((elapsed / total) * 100, 100));
      if (elapsed < total) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Reveal boot lines one by one
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((line, idx) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, idx]);
      }, line.delay);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Trigger fade-out then call onComplete
  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fadeout"), 2000);
    const doneTimer = setTimeout(() => onComplete(), 2600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`splash-root ${phase === "fadeout" ? "splash-fadeout" : ""}`}
      aria-label="CipherLens system boot"
      aria-live="polite"
    >
      {/* Background animated grid */}
      <div className="splash-grid" aria-hidden="true" />

      {/* Radial teal glow orb */}
      <div className="splash-orb" aria-hidden="true" />

      {/* Central terminal window */}
      <div className="splash-terminal">
        {/* Terminal title bar */}
        <div className="splash-titlebar">
          <div className="splash-dots">
            <span className="splash-dot splash-dot--red" />
            <span className="splash-dot splash-dot--yellow" />
            <span className="splash-dot splash-dot--green" />
          </div>
          <span className="splash-titlebar-text">
            cipherlens-boot — bash — 80×24
          </span>
          <div />
        </div>

        {/* Terminal body */}
        <div className="splash-body">
          {/* Logo ASCII block */}
          <pre className="splash-logo" aria-label="CipherLens ASCII logo">
{`   ___  _      _               _
  / __\(_)_ __| |__   ___ _ __| |    ___ _ __  ___
 / /   | | '_ \\ '_ \\ / _ \\ '__| |   / _ \\ '_ \\/ __|
/ /____| | |_) | | | |  __/ |  | |__|  __/ | | \\__ \\
\\______|_| .__/|_| |_|\\___|_|  |_____\\___|_| |_|___/
         |_|`}
          </pre>
          <p className="splash-subtitle">
            AI IPsec Sentinel · Zero-Decryption Protocol Analysis
          </p>
          <div className="splash-divider" />

          {/* Boot lines */}
          <div className="splash-lines" role="log">
            {BOOT_LINES.map((line, idx) => (
              <div
                key={idx}
                className={`splash-line ${visibleLines.includes(idx) ? "splash-line--visible" : ""}`}
              >
                <span className="splash-prompt">$ </span>
                <span
                  className={
                    line.text.startsWith("[ OK ]")
                      ? "splash-ok"
                      : line.text.startsWith("STATUS")
                      ? "splash-status"
                      : line.text.startsWith("SYSTEM")
                      ? "splash-system"
                      : line.text.startsWith("──")
                      ? "splash-divider-line"
                      : "splash-heading"
                  }
                >
                  {line.text}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="splash-progress-wrap" role="progressbar" aria-valuenow={Math.round(progressPct)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="splash-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="splash-progress-label">
            INITIALIZING… {Math.round(progressPct)}%
          </p>
        </div>
      </div>

      {/* Bottom badge */}
      <p className="splash-badge">
        SIH 2026 · PS 26160 · NTRO · Theme: Blockchain &amp; Cybersecurity
      </p>
    </div>
  );
}
