/**
 * CipherLens Frontend API Client
 * Connects to the FastAPI backend with offline fallback support.
 */

const API_BASE_URL = "http://localhost:8000";

export async function fetchTelemetry() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/telemetry/live`);
    if (res.ok) return await res.json();
  } catch {
    // Graceful offline fallback
  }
  return null;
}

export async function inspectHandshake(scenario: "vulnerable" | "hardened" = "vulnerable") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/handshake/inspect?scenario=${scenario}`);
    if (res.ok) return await res.json();
  } catch {
    // Graceful offline fallback
  }
  return null;
}

export async function classifyEspFlow(packetLengths: number[], interArrivalsMs?: number[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/classify/esp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packet_lengths: packetLengths,
        inter_arrival_times_ms: interArrivalsMs,
      }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Graceful offline fallback
  }
  return null;
}

export async function simulatePolicyConfig(configText: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/simulate/policy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config_text: configText }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Graceful offline fallback
  }
  return null;
}

export async function triggerAttackReplay(scenarioId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/sandbox/replay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario_id: scenarioId }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Graceful offline fallback
  }
  return null;
}

export async function fetchLedgerReceipt() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ledger/receipt`);
    if (res.ok) return await res.json();
  } catch {
    // Graceful offline fallback
  }
  return null;
}
