# CipherLens — Implementation Analysis & Complete Setup Roadmap
**SIH 2026 · PS 26160 · NTRO · Blockchain & Cybersecurity**  
_Document Version: v1.0 | Last Updated: 2026-09-28_

---

## 1. Backend Readiness Analysis

### 1.1 What Is Actually Implemented

| Module | File | Status | Nature |
|:---|:---|:---|:---|
| IKE Parser | `engine/ike_parser.py` | ✅ Implemented | **REAL logic** — parses raw 28-byte IKE headers, maps transform IDs, detects aggressive mode, CVE references |
| ESP Feature Extractor | `engine/feature_extractor.py` | ✅ Implemented | **REAL math** — numpy-based: mean/std/percentiles, delta-t, isochronous score, direction ratio, MTU saturation |
| Traffic Classifier | `engine/traffic_classifier.py` | ⚠️ Partial | **Rule-based heuristics**, NOT a trained LightGBM model. Decision boundaries are hardcoded `if/elif` on feature thresholds |
| Security Scorer | `engine/scoring_engine.py` | ✅ Implemented | **REAL logic** — NIST SP 800-77 5-dimension weighted rubric, configurable, defensible |
| Policy Simulator | `engine/policy_simulator.py` | ✅ Implemented | **REAL logic** — regex parses `ipsec.conf`, calls scorer, generates remediated config diff |
| Attack Simulator | `engine/attack_simulator.py` | ✅ Implemented | **Static scenarios** — hardcoded CVE steps (no actual packet injection), returns step telemetry |
| Merkle Audit | `engine/merkle_audit.py` | ✅ Implemented | **REAL crypto** — actual SHA-256 Merkle tree construction over 4 leaves |
| FastAPI server | `app.py` | ✅ Implemented | All endpoints defined and working |

### 1.2 Critical Gap: PCAP Upload Pipeline Is Mocked

**Current `/api/scan/pcap` reads the file then discards it:**

```python
content = await file.read()
file_size = len(content)
return {
    # HARDCODED static response — ignores actual file bytes
    "filename": file.filename,
    "posture_score": 94,          # always 94
    "esp_classification": { "predicted_class": "VoIP Telephony" },  # always VoIP
}
```

The actual pipeline (Scapy rdpcap → IKE parser → ESP extractor → classifier → scorer) is **never called**.

### 1.3 What Needs to Be Wired

```
PCAP file bytes
    ↓
Scapy rdpcap()
    ↓
Filter IKE packets (port 500/4500)  →  DeterministicIKEParser.parse_header()
Filter ESP packets (proto 50)       →  ESPFeatureExtractor.extract_flow_features()
    ↓
IKE result  →  NISTSecurityScorer.calculate_score()
ESP result  →  ESPTrafficClassifier.classify_flow()
    ↓
MerkleAuditLedger.generate_attestation_receipt({ike, esp, shap, score})
    ↓
Return full JSON response to frontend
```

### 1.4 Traffic Classifier — Real vs. Heuristic

The current classifier uses hardcoded `if/elif` thresholds. The ">98% F1" claim needs a real trained model.

| Step | What to Do |
|:---|:---|
| Generate labeled flows | Run Docker testbed, capture PCAPs per traffic type |
| Extract features | Use `ESPFeatureExtractor` per flow window |
| Train LightGBM | ~200-500 flows per class (5 classes) |
| Save model | `joblib.dump(model, 'models/esp_lgbm.pkl')` |
| Load in classifier | Replace `if/elif` with `model.predict()` + `shap.TreeExplainer()` |

### 1.5 Missing Backend Dependencies

```
# requirements.txt is missing:
lightgbm>=4.3.0       # ML model
shap>=0.45.0          # TreeSHAP explainability
joblib>=1.3.0         # Model serialization
websockets>=12.0      # Live WebSocket streaming
python-multipart      # PCAP upload (already listed as needed by FastAPI)
```

---

## 2. Frontend to Backend Connection Status

### 2.1 Current State

**The frontend does NOT call the backend at all.** Every metric shown is hardcoded in `src/data/sentinel.ts` or inline component state. No `fetch()` or API call exists anywhere in the frontend code.

### 2.2 API Endpoints vs. Frontend Components

| Endpoint | Method | Frontend Component Needs It | Wired? |
|:---|:---|:---|:---|
| `GET /api/telemetry/live` | GET | Nav HUD strip + Hero stats | ❌ No |
| `GET /api/handshake/inspect?scenario=vulnerable` | GET | Classification page (IKE display) | ❌ No |
| `POST /api/classify/esp` | POST | Classification page (SHAP + class) | ❌ No |
| `POST /api/simulate/policy` | POST | Security page (policy score) | ❌ No |
| `POST /api/sandbox/replay` | POST | AttackSandbox | ❌ No |
| `GET /api/ledger/receipt` | GET | BlockchainAudit | ❌ No |
| `POST /api/scan/pcap` | POST | PcapUploadModal | ❌ No |

---

## 3. Docker & IPsec Testbed — Full Setup Requirements

### 3.1 Why Docker Is Required

CipherLens analyzes **real IPsec tunnels**. StrongSwan is a Linux kernel IPsec implementation. It **cannot run on Windows natively**. Docker containers (on WSL2 or a Linux host) provide isolated Linux environments where StrongSwan can establish real IKEv2 tunnels that produce genuine IKE + ESP packets for capture.

### 3.2 System Requirements

| Requirement | Spec | Notes |
|:---|:---|:---|
| OS | Linux Ubuntu 22.04 / WSL2 | Docker on Windows works for backend+frontend; testbed needs WSL2 or Linux VM |
| Docker Engine | 24.0+ | Must support `privileged: true` and `NET_ADMIN` cap |
| Docker Compose | v2.0+ | |
| RAM | 4 GB+ | |
| Disk | 10 GB free | Container images + PCAPs |
| Python | 3.11+ | Backend |
| Node.js | 20+ | Frontend |

### 3.3 Critical Bug in Current Docker Compose

```yaml
# testbed/docker-compose.yml — BROKEN:
image: vishnu/strongswan:latest   # Does NOT exist on Docker Hub
```

**Fix: Use a real image or build a Dockerfile:**

Option A — Use a known community image:
```yaml
image: philplckthun/strongswan    # Maintained community StrongSwan image
```

Option B — Build your own (most reliable):
```dockerfile
# testbed/Dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \
    strongswan strongswan-pki \
    libcharon-extra-plugins \
    tcpdump iperf3 && \
    rm -rf /var/lib/apt/lists/*
CMD ["ipsec", "start", "--nofork"]
```

### 3.4 IPsec Configuration Matrix (5 Scenarios)

| Scenario | IKE Ver | Mode | Cipher | DH Group | Auth | Score Target |
|:---|:---|:---|:---|:---|:---|:---|
| `vuln-aggressive` | IKEv1 | Aggressive | 3DES-CBC | 14 | PSK | ~30 (CRITICAL) |
| `weak-main` | IKEv1 | Main | AES-128-CBC | 14 | PSK | ~55 (AT_RISK) |
| `acceptable` | IKEv2 | Standard | AES-256-GCM | 19 | PSK | ~70 (TRANSITIONAL) |
| `strong-cert` | IKEv2 | Standard | AES-256-GCM | 19 | X.509 | ~85 (HARDENED) |
| `pqc-gold` | IKEv2 | Standard | ChaCha20-Poly1305 | 31+ML-KEM-768 | X.509+TPM | ~94 (HARDENED PQC) |

### 3.5 Traffic Generation Per Scenario

For each scenario, generate 5 labeled traffic types inside the tunnel:

| Traffic Class | Tool | Mimics |
|:---|:---|:---|
| VoIP / RTP | `iperf3 -u -b 128k -l 172 -t 60` | G.711a codec — 172B UDP every 20ms |
| HD Video / H.264 | `iperf3 -b 5M -t 60` | Bursty GOP key + P-frame train |
| Bulk Exfil / SFTP | `iperf3 -b 100M -t 30` | MTU-saturating continuous stream |
| DNS-over-VPN | `dig` loop at 2/sec | Short query-response pairs |
| Web / QUIC | `curl` loop | Small uplink, large downlink bursts |

### 3.6 Capture Commands

```bash
# Find the ipsec_net bridge interface name
docker network ls
docker network inspect cipherlens_ipsec_net | grep -A5 "Config"

# Capture from host bridge (replace br-XXXXX with actual)
sudo tcpdump -i br-XXXXX -w captures/scenario-01-voip.pcap proto 50 or port 500 or port 4500

# OR: capture inside the container
docker exec cipherlens_initiator tcpdump -w /tmp/cap.pcap -G 60 -W 1 &
docker exec cipherlens_initiator iperf3 -u -b 128k -l 172 -t 50 -c 192.168.100.20
docker cp cipherlens_initiator:/tmp/cap.pcap captures/scenario-01-voip.pcap
```

---

## 4. Prioritised Next-Steps Roadmap

### Phase A — Critical: Real Analysis (Priority 1)

| Task | File to Edit | What to Do |
|:---|:---|:---|
| **A1** Fix Docker image | `testbed/docker-compose.yml` | Replace `vishnu/strongswan` with working image or custom Dockerfile |
| **A2** Fix PCAP endpoint | `backend/app.py` | Replace static stub with Scapy rdpcap → real engine pipeline |
| **A3** Add dependencies | `backend/requirements.txt` | Add `lightgbm`, `shap`, `joblib`, `websockets` |
| **A4** Generate dataset | `scripts/generate_dataset.sh` | 5 scenarios x 5 traffic types = 25 labeled PCAPs |
| **A5** Train model | `scripts/train_classifier.py` | Extract features, train LightGBM, save `models/esp_lgbm.pkl` |
| **A6** Load real model | `engine/traffic_classifier.py` | Replace `if/elif` with `model.predict()` + real SHAP values |

### Phase B — High: Wire Frontend (Priority 2)

| Task | Component | Endpoint |
|:---|:---|:---|
| **B1** PCAP upload + results | `PcapUploadModal.tsx` | `POST /api/scan/pcap` |
| **B2** Classification display | `Classification.tsx` | `POST /api/classify/esp` |
| **B3** IKE handshake info | `Classification.tsx` | `GET /api/handshake/inspect` |
| **B4** Attack sandbox | `AttackSandbox.tsx` | `POST /api/sandbox/replay` |
| **B5** Merkle proof | `BlockchainAudit.tsx` | `GET /api/ledger/receipt` |
| **B6** Live HUD telemetry | `Nav.tsx` | `GET /api/telemetry/live` (poll 5s) |

### Phase C — Enhancement (Priority 3)

- WebSocket live stream for real-time anomaly alerts in HUD
- Multi-scenario demo flow: Upload vulnerable PCAP (score 42) → hardened PCAP (score 94)
- Side-by-side `ipsec.conf` diff display (vulnerable vs. remediated)
- Downloadable PDF/JSON security assessment report
- Supabase persistence for session history

### Phase D — Grand Finale (Priority 4)

- Offline fallback mode with pre-recorded PCAPs
- Demo walkthrough video recording
- Open dataset packaging with data card
- Single `docker compose up` for entire stack

---

## 5. Step-by-Step Setup

### 5.1 Install Prerequisites (Linux/WSL2)

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2 python3.11 python3-pip nodejs npm tcpdump
sudo usermod -aG docker $USER && newgrp docker
```

### 5.2 Backend

```bash
cd CipherLens/backend
pip install -r requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
# Swagger docs: http://localhost:8000/docs
```

### 5.3 Testbed

```bash
cd CipherLens/testbed
docker compose up -d
docker exec cipherlens_initiator ipsec status   # Should show: ESTABLISHED
```

### 5.4 Frontend

```bash
cd CipherLens/frontend
npm install && npm run dev
# http://localhost:5173
```

---

## 6. Honest Summary Table

| Feature | Status |
|:---|:---|
| IKE parsing (raw bytes) | ✅ Real |
| ESP feature extraction | ✅ Real |
| NIST scoring rubric | ✅ Real |
| Policy simulator (ipsec.conf) | ✅ Real |
| Merkle SHA-256 chain | ✅ Real |
| Traffic classification | ⚠️ Heuristic (not trained model) |
| PCAP upload → full analysis | ❌ Mocked (static JSON) |
| Frontend calls backend | ❌ Not wired |
| Real packet capture | ❌ Needs testbed fix |
| LightGBM trained model | ❌ Not yet trained |
