import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (typeof window !== "undefined" ? localStorage.getItem("cipherlens_supabase_url") : null) ||
  "";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof window !== "undefined" ? localStorage.getItem("cipherlens_supabase_anon_key") : null) ||
  "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function saveAssessmentReport(reportData: {
  tunnel_name?: string;
  protocol: string;
  posture_score: number;
  rating: string;
  ike_mode: string;
  cipher_suite: string;
  dh_group: string;
  auth_method: string;
  pfs_enabled: boolean;
  pqc_hybrid_enabled: boolean;
  hndl_exposure_years: number;
  findings?: any[];
  rubric_breakdown?: any[];
  raw_config_text?: string;
  remediated_config_text?: string;
  merkle_root: string;
}) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("assessment_reports")
      .insert([reportData])
      .select();

    if (error) {
      console.warn("[Supabase] Insert report warning:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("[Supabase] Failed to sync report:", err);
    return null;
  }
}

export async function fetchRecentReports() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("assessment_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function logEspTelemetry(flowData: {
  flow_id: string;
  predicted_class: string;
  confidence_pct: number;
  packet_count: number;
  avg_packet_size_bytes: number;
  mean_delta_ms: number;
  burst_entropy: number;
  shap_top_feature: string;
  shap_attributions?: any[];
}) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("telemetry_flows")
      .insert([flowData])
      .select();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}
