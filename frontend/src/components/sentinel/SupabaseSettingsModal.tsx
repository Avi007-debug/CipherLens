import { useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";

export function SupabaseSettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(
    typeof window !== "undefined" ? localStorage.getItem("cipherlens_supabase_url") || "" : ""
  );
  const [key, setKey] = useState(
    typeof window !== "undefined" ? localStorage.getItem("cipherlens_supabase_anon_key") || "" : ""
  );
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cipherlens_supabase_url", url.trim());
      localStorage.setItem("cipherlens_supabase_anon_key", key.trim());
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg border border-primary/60 bg-surface shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-background/90 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Supabase Cloud Database Settings
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-border/80 bg-surface px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
          >
            CLOSE
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="border border-border bg-background/60 p-3 text-[11px] text-muted-foreground font-sans leading-relaxed">
            Connect your Supabase project to persist real-time IPsec assessment reports, ESP flow classifications, and attack sandbox logs in PostgreSQL.
          </div>

          <div>
            <label className="block text-muted-foreground text-[10.5px] uppercase tracking-wider mb-1 font-bold">
              Supabase Project URL:
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project-ref.supabase.co"
              className="w-full border border-border/80 bg-background/80 p-2.5 font-mono text-xs text-primary outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-muted-foreground text-[10.5px] uppercase tracking-wider mb-1 font-bold">
              Supabase Anon Public Key:
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full border border-border/80 bg-background/80 p-2.5 font-mono text-xs text-primary outline-none focus:border-primary"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="hover-glow w-full border border-primary/70 bg-primary/20 py-2.5 font-mono text-xs uppercase tracking-widest text-primary font-bold hover:bg-primary/30 transition-all cursor-pointer"
            >
              {saved ? "CREDENTIALS SAVED! RELOADING..." : "Connect & Save to LocalStorage"}
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            Database Schema available at: <strong className="text-primary">supabase/schema.sql</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
