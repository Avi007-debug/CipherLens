import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/sentinel/Nav";
import { Footer } from "@/components/sentinel/Footer";
import { CliTerminalModal } from "@/components/sentinel/CliTerminalModal";
import { JudgeDefenseModal } from "@/components/sentinel/JudgeDefenseModal";
import { PcapUploadModal } from "@/components/sentinel/PcapUploadModal";
import { SupabaseSettingsModal } from "@/components/sentinel/SupabaseSettingsModal";

export const Route = createFileRoute("/qa")({
  head: () => ({
    meta: [
      { title: "Technical Q&A & Exploit Matrix | CipherLens" },
      {
        name: "description",
        content:
          "Authoritative answers to protocol, zero-decryption ML, post-quantum cryptography, and blockchain verification questions.",
      },
    ],
  }),
  component: QaPage,
});

const QA_ITEMS = [
  {
    cat: "Protocol & IKE Handshake",
    q: "How does CipherLens differ from Wireshark or TShark?",
    a: "Wireshark is a passive byte dissector that displays raw hex records. It requires an expert to manually read RFCs and spot weaknesses. CipherLens is an automated assessment and threat-intelligence platform: it deterministically maps protocol flaws to NIST CVSS scores, uses ML to classify encrypted ESP traffic without decryption, computes automated policy remediation diffs, and anchors evidence to an immutable blockchain ledger.",
    tag: "Core Differentiator",
  },
  {
    cat: "Protocol & IKE Handshake",
    q: "Why is IKEv1 Aggressive Mode considered critical risk, and how does CipherLens detect it?",
    a: "In IKEv1 Aggressive Mode (RFC 2409), the responder sends its authentication hash in the clear across the wire before identity protection is established (CVE-2002-1623). An eavesdropper can intercept this hash and execute offline dictionary attacks against the Pre-Shared Key (PSK). CipherLens flags this exchange with an immediate CVSS 8.5 deduction.",
    tag: "CVE-2002-1623",
  },
  {
    cat: "Protocol & IKE Handshake",
    q: "How does Sweet32 (CVE-2016-2183) compromise 3DES-CBC in IPsec tunnels?",
    a: "3DES uses a 64-bit block size. After transmitting ~32GB of data under the same key, block collisions occur with high probability, allowing plaintext recovery. CipherLens flags 3DES in the Transform payload and mandates 128-bit ciphers (AES-256-GCM / ChaCha20-Poly1305).",
    tag: "Sweet32 Collision",
  },
  {
    cat: "Zero-Decryption ML & Privacy",
    q: "How do you mathematically prove that CipherLens never decrypts the ESP payload?",
    a: "We compute Shannon entropy across the ESP payload, which measures ~7.94 out of 8.00 bits per byte — confirming high ciphertext randomness. Our ML pipeline only ingests second-order flow metadata: packet size distributions, inter-arrival delta times (Δt), burst cadence, and directional asymmetry. Zero plaintext bytes ever enter the model.",
    tag: "Zero-Decryption Proof",
  },
  {
    cat: "Zero-Decryption ML & Privacy",
    q: "How do TreeSHAP feature attributions explain the ML classifier's decisions?",
    a: "Unlike black-box neural networks, our LightGBM model is paired with Lundberg's TreeSHAP algorithm. For every flow, TreeSHAP calculates the exact marginal contribution (Shapley value φᵢ) of each physical side channel (e.g. isochronous 20ms delta for VoIP or 33ms GOP burst for video).",
    tag: "Explainable AI",
  },
  {
    cat: "Post-Quantum Cryptography",
    q: "What is the 'Harvest Now, Decrypt Later' (HNDL) threat and how does CipherLens quantify it?",
    a: "Adversaries intercept and archive encrypted IPsec tunnels today to decrypt with quantum computers running Shor's algorithm in the future. CipherLens models this risk window based on traffic classification and SA rekey lifetimes, mapping the transition to CNSA 2.0 and FIPS 203 ML-KEM hybrid key exchanges.",
    tag: "HNDL Threat Window",
  },
  {
    cat: "Blockchain Ledger & Verification",
    q: "Why anchor assessment reports to a permissioned blockchain ledger?",
    a: "Compliance audits must be tamper-evident. CipherLens commits assessment findings as SHA-256 Merkle trees on Hyperledger Fabric, allowing regulators to mathematically verify audit authenticity via zero-knowledge proofs without exposing proprietary packet captures.",
    tag: "Merkle Proof Ledger",
  },
];

const CATEGORIES = [
  "ALL",
  "Protocol & IKE Handshake",
  "Zero-Decryption ML & Privacy",
  "Post-Quantum Cryptography",
  "Blockchain Ledger & Verification",
];

function QaPage() {
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const [isCliOpen, setIsCliOpen] = useState(false);
  const [isQaOpen, setIsQaOpen] = useState(false);
  const [isPcapOpen, setIsPcapOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [activeCliCmd, setActiveCliCmd] = useState<string | undefined>(undefined);

  const filtered = QA_ITEMS.filter((item) => {
    const matchesCat = selectedCat === "ALL" || item.cat === selectedCat;
    const matchesSearch =
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()) ||
      item.tag.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Nav
        onOpenCli={() => {
          setActiveCliCmd(undefined);
          setIsCliOpen(true);
        }}
        onOpenQa={() => setIsQaOpen(true)}
        onOpenPcap={() => setIsPcapOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
      />

      <main className="pt-24">
        {/* Page Hero Header */}
        <div className="border-b border-border/80 bg-surface/50 px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
              <span>CipherLens Platform</span>
              <span>/</span>
              <span className="text-primary font-bold">Technical Q&A & Knowledge Base</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Technical Q&A & Exploit Reference Matrix
            </h1>

            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-300">
              Authoritative technical answers covering deterministic IKE state machines, zero-decryption ML signal extraction, post-quantum cryptographic transitions, and blockchain auditability.
            </p>
          </div>
        </div>

        {/* Q&A Explorer */}
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
          {/* Filters & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCat(cat)}
                  className={`border px-3 py-1.5 uppercase tracking-wider transition-all ${
                    selectedCat === cat
                      ? "border-primary bg-primary/20 text-primary font-bold shadow-[0_0_10px_rgba(20,184,166,0.15)]"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat === "ALL" ? "All Categories" : cat}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search Q&A keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 border border-border bg-surface px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
          </div>

          {/* Accordion Questions */}
          <div className="mt-6 space-y-3">
            {filtered.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={item.q}
                  className={`border transition-all ${
                    isOpen
                      ? "border-primary bg-surface-raised shadow-[0_0_15px_rgba(20,184,166,0.12)]"
                      : "border-border/80 bg-surface/70 hover:border-primary/40"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-4 p-5 text-left font-mono"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] border border-primary/40 bg-primary/10 px-2 py-0.5 text-primary font-bold uppercase">
                          {item.tag}
                        </span>
                        <span className="text-[10.5px] text-muted-foreground uppercase">
                          {item.cat}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        {item.q}
                      </h3>
                    </div>
                    <span className="text-base text-primary font-bold shrink-0 pt-1">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border/70 p-5 pt-3 bg-background/50">
                      <p className="text-slate-200 font-sans text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />

      {/* Interactive Modals */}
      <CliTerminalModal
        isOpen={isCliOpen}
        onClose={() => setIsCliOpen(false)}
        initialCmd={activeCliCmd}
      />

      <JudgeDefenseModal
        isOpen={isQaOpen}
        onClose={() => setIsQaOpen(false)}
      />

      <PcapUploadModal
        isOpen={isPcapOpen}
        onClose={() => setIsPcapOpen(false)}
      />

      <SupabaseSettingsModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />
    </div>
  );
}
