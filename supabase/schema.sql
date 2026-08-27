-- ============================================================================
-- CipherLens Database Schema (Supabase / PostgreSQL)
-- Problem Statement 26160 — AI IPsec VPN Protocol Analyzer (NTRO)
-- ============================================================================

-- 1. Assessment Reports Table
CREATE TABLE IF NOT EXISTS assessment_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tunnel_name VARCHAR(100) NOT NULL DEFAULT 'site-to-site-ipsec',
    protocol VARCHAR(20) NOT NULL DEFAULT 'IKEv2',
    posture_score INTEGER NOT NULL CHECK (posture_score >= 0 AND posture_score <= 100),
    rating VARCHAR(30) NOT NULL,
    ike_mode VARCHAR(50) NOT NULL,
    cipher_suite VARCHAR(50) NOT NULL,
    dh_group VARCHAR(50) NOT NULL,
    auth_method VARCHAR(50) NOT NULL,
    pfs_enabled BOOLEAN NOT NULL DEFAULT true,
    pqc_hybrid_enabled BOOLEAN NOT NULL DEFAULT false,
    hndl_exposure_years INTEGER NOT NULL DEFAULT 0,
    findings JSONB NOT NULL DEFAULT '[]'::jsonb,
    rubric_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    raw_config_text TEXT,
    remediated_config_text TEXT,
    merkle_root VARCHAR(66) NOT NULL,
    block_height BIGINT NOT NULL DEFAULT 1840291,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ESP Flow Telemetry & Classification Logs
CREATE TABLE IF NOT EXISTS telemetry_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES assessment_reports(id) ON DELETE CASCADE,
    flow_id VARCHAR(50) NOT NULL,
    predicted_class VARCHAR(50) NOT NULL,
    confidence_pct NUMERIC(5,2) NOT NULL,
    uncertainty_pct NUMERIC(5,2) NOT NULL DEFAULT 0.50,
    packet_count INTEGER NOT NULL DEFAULT 56,
    avg_packet_size_bytes NUMERIC(8,2) NOT NULL,
    mean_delta_ms NUMERIC(8,2) NOT NULL,
    burst_entropy NUMERIC(5,2) NOT NULL,
    shannon_entropy NUMERIC(5,2) NOT NULL DEFAULT 7.94,
    direction_ratio NUMERIC(5,2) NOT NULL DEFAULT 1.00,
    shap_top_feature VARCHAR(100) NOT NULL,
    shap_attributions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Attack Sandbox Simulation Events
CREATE TABLE IF NOT EXISTS attack_sandbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id VARCHAR(30) NOT NULL,
    exploit_name VARCHAR(100) NOT NULL,
    cve_identifier VARCHAR(50),
    mitre_technique VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    score_drop INTEGER NOT NULL DEFAULT 0,
    detection_telemetry JSONB NOT NULL DEFAULT '[]'::jsonb,
    mitigation_directive TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Merkle Ledger Attestation Receipts
CREATE TABLE IF NOT EXISTS merkle_ledger_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merkle_root VARCHAR(66) UNIQUE NOT NULL,
    block_height BIGINT NOT NULL,
    zk_proof_type VARCHAR(50) NOT NULL DEFAULT 'Groth16 zk-SNARK',
    ledger_network VARCHAR(100) NOT NULL DEFAULT 'Hyperledger Fabric v2.5',
    attestation_status VARCHAR(30) NOT NULL DEFAULT 'COMMITTED',
    leaf_nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE assessment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE attack_sandbox_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE merkle_ledger_proofs ENABLE ROW LEVEL SECURITY;

-- Allow public read & insert for hackathon evaluation demo
CREATE POLICY "Public Read assessment_reports" ON assessment_reports FOR SELECT USING (true);
CREATE POLICY "Public Insert assessment_reports" ON assessment_reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read telemetry_flows" ON telemetry_flows FOR SELECT USING (true);
CREATE POLICY "Public Insert telemetry_flows" ON telemetry_flows FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read attack_sandbox_events" ON attack_sandbox_events FOR SELECT USING (true);
CREATE POLICY "Public Insert attack_sandbox_events" ON attack_sandbox_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read merkle_ledger_proofs" ON merkle_ledger_proofs FOR SELECT USING (true);
CREATE POLICY "Public Insert merkle_ledger_proofs" ON merkle_ledger_proofs FOR INSERT WITH CHECK (true);

-- Seed Initial Reference Report
INSERT INTO assessment_reports (
    tunnel_name, protocol, posture_score, rating, ike_mode,
    cipher_suite, dh_group, auth_method, pfs_enabled, pqc_hybrid_enabled,
    hndl_exposure_years, merkle_root
) VALUES (
    'site-to-site-demo', 'IKEv2', 94, 'HARDENED', 'Identity Protection',
    'ChaCha20-Poly1305 / AES-256-GCM', 'Curve25519 + ML-KEM-768', 'Mutual ECDSA P-384',
    true, true, 0, '0x3f7a91bc829e102df081c7429184a5697203b8e21948baef0091823746cba941'
);
