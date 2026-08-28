# CipherLens — Complete Run & Demonstration Guide

This guide provides step-by-step instructions to run the frontend console, FastAPI backend, strongSwan Docker testbed, Supabase database, and deliver the 15-mark internal college demonstration.

---

## ⚡ Quick Start Summary (Under 60 Seconds)

```bash
# 1. Start the React/Vite Frontend (Port 5173)
cd frontend
npm run dev

# 2. Start the FastAPI Backend Engine (Port 8000)
# (In a new terminal window at the project root)
python -m uvicorn backend.app:app --reload --port 8000
```
- Open your browser at: **`http://localhost:5173/`**
- API Documentation at: **`http://localhost:8000/docs`**

---

## 1. Frontend Setup & Execution

### Prerequisites
- Node.js v18+ (tested on Node v24.18)
- NPM or Bun

### Running Locally
```bash
cd frontend

# Install dependencies
npm install

# Start Vite Development Server
npm run dev

# Build production bundle
npm run build
```

---

## 2. Python Backend & AI Engine

### Prerequisites
- Python 3.10+ (tested on Python 3.13)

### Running the API Server
```bash
# Start FastAPI backend with hot reloading
python -m uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

### Verified Backend Endpoints
- `GET http://localhost:8000/api/telemetry/live` — Live packet counter & eBPF tap metrics.
- `GET http://localhost:8000/api/handshake/inspect?scenario=vulnerable` — Deterministic IKE state machine parser.
- `POST http://localhost:8000/api/classify/esp` — Zero-decryption ESP flow classifier with local TreeSHAP attributions.
- `POST http://localhost:8000/api/simulate/policy` — Live `ipsec.conf` policy diff simulator.
- `POST http://localhost:8000/api/sandbox/replay` — Active attack sandbox exploit replayer.
- `GET http://localhost:8000/api/ledger/receipt` — SHA-256 Merkle root attestation receipt generator.

---

## 3. Supabase Cloud Database Setup (Optional & Recommended)

You can connect Supabase in **under 2 minutes** to store live assessment reports and flow telemetry.

### Steps:
1. Log in to [Supabase](https://supabase.com) and click **New Project** (e.g. `cipherlens-db`).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open [`supabase/schema.sql`](file:///c:/Coding/CipherLens/supabase/schema.sql), copy its entire contents, paste into the SQL editor, and click **RUN**.
4. Go to **Project Settings $\rightarrow$ API** and copy:
   - `Project URL`
   - `anon public key`
5. Create a `.env` file in the project root:
   ```ini
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
6. Restart `npm run dev` — the top HUD bar will automatically show `☁ SUPABASE: CONNECTED`.

---

## 4. StrongSwan Docker Testbed (Optional Live Container Demo)

If demonstrating on a machine with Docker Desktop installed:

```bash
cd testbed

# Spin up initiator (192.168.100.10) & responder (192.168.100.20)
docker compose up -d

# Check IPsec status inside initiator container
docker exec -it cipherlens_initiator ipsec statusall

# Generate live VoIP traffic through the tunnel
python traffic_generator.py --type voip --target 192.168.100.20 --duration 20
```

---

## 5. Winning 3-Minute Live Demo Walkthrough (For 15/15 Marks)

Follow this exact flow during your presentation:

### Step 1: Open the Dashboard (0:00 - 0:30)
- Navigate to `http://localhost:5173/`.
- Point out the **Live HUD Bar** (`STATUS: ONLINE`, `TAP: eBPF PASSIVE`, `INFERENCE: 0.78ms`, `BLOCK #1840291`).
- Mention the headline: *"Audit the tunnel. Never decrypt the payload."*
- Click **"IKEv2 Inspector"** and **"ESP Heatmap"** in the Hero terminal to show the $7.94 / 8.00\text{ bits/byte}$ Shannon entropy proof.

### Step 2: Show the Scoring Engine & Remediation (0:30 - 1:15)
- Scroll to the **Security Posture Scoring Engine**.
- Highlight the **42/100 (At Risk)** score dial and explain why (IKEv1 Aggressive Mode, 3DES Sweet32, static PSK).
- Click the **"Remediated (94)"** button — watch the circular gauge climb in real time to **94/100** and show green $+\Delta$ badges.

### Step 3: Demonstrate Zero-Decryption AI Fingerprinting (1:15 - 2:00)
- Scroll to **Zero-Decryption ESP Traffic Fingerprinting**.
- Click **"VoIP Telephony"** $\rightarrow$ Click **"Scan Window"**.
- Point out the **99.4% confidence** and the **TreeSHAP attributions** (`isochronous_delta_20ms: +0.44`).
- Switch to **"HD Video Conference"** to show the GOP keyframe burst detection ($98.1\%$).

### Step 4: Trigger the Attack Sandbox & Policy Diff (2:00 - 2:30)
- Scroll to **Attack-Replay Sandbox**.
- Click **"▶ Replay Exploit in Sandbox"** — step-by-step diagnostic logs appear live on the screen showing the simulated exploit detection and $-52$ score penalty.
- Point to the **Policy Diff Simulator** on the right showing the `ipsec.conf` before/after fix.

### Step 5: Wrap up with Blockchain & Pitch Helper (2:30 - 3:00)
- Scroll to **Blockchain-Anchored Audit Trail** and click **"✓ Re-Verify Cryptographic Proof"**.
- Click the **`★ Pitch & Q&A`** button in the top navigation to show judges the pre-prepared defense sheet for their questions.

---

## 6. Offline / Fallback Preparedness

If local WiFi or projector network fails in the presentation hall:
1. CipherLens is built with **100% offline fallback**. The dashboard will automatically use embedded ground-truth telemetry if the Python backend is unreachable.
2. A high-definition screen recording of the working demo is saved as a fail-safe backup.
