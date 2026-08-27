"""
IPsec Policy Simulator & Auto-Remediation Diff Generator
"""

import re
from typing import Dict, Any, List
from backend.engine.scoring_engine import NISTSecurityScorer


class PolicySimulator:
    """
    Parses strongSwan/Libreswan ipsec.conf configurations and calculates posture deltas.
    """

    def __init__(self):
        self.scorer = NISTSecurityScorer()

    def parse_config_text(self, conf_str: str) -> Dict[str, Any]:
        """
        Extracts key security parameters from ipsec.conf syntax.
        """
        params = {
            "ike_version": 2,
            "is_aggressive": False,
            "cipher": "AES-GCM-256",
            "dh_group": 19,
            "auth_method": "X.509",
            "pfs": True,
            "sa_lifetime_hours": 2,
            "pqc_hybrid": False,
        }

        # Check Aggressive Mode
        if re.search(r"aggressive\s*=\s*(yes|1|true)", conf_str, re.IGNORECASE):
            params["is_aggressive"] = True
            params["ike_version"] = 1

        # Check Auth Method
        if re.search(r"authby\s*=\s*secret", conf_str, re.IGNORECASE):
            params["auth_method"] = "PSK"
        elif re.search(r"leftcert\s*=", conf_str, re.IGNORECASE):
            params["auth_method"] = "ECDSA X.509 TPM 2.0"

        # Check Cipher
        if re.search(r"3des", conf_str, re.IGNORECASE):
            params["cipher"] = "3DES-CBC"
        elif re.search(r"chacha20", conf_str, re.IGNORECASE):
            params["cipher"] = "CHACHA20-POLY1305"
        elif re.search(r"aes256gcm", conf_str, re.IGNORECASE):
            params["cipher"] = "AES-GCM-256"

        # Check PQC
        if re.search(r"(mlkem|kyber|rfc8784)", conf_str, re.IGNORECASE):
            params["pqc_hybrid"] = True
            params["dh_group"] = 9370

        # Check Lifetime
        life_match = re.search(r"ikelifetime\s*=\s*(\d+)([shm]?)", conf_str, re.IGNORECASE)
        if life_match:
            val = int(life_match.group(1))
            unit = life_match.group(2).lower()
            if unit == "s":
                params["sa_lifetime_hours"] = max(1, val // 3600)
            elif unit == "m":
                params["sa_lifetime_hours"] = max(1, val // 60)
            else:
                params["sa_lifetime_hours"] = val

        return params

    def simulate_policy(self, raw_config: str) -> Dict[str, Any]:
        """
        Simulates an ipsec.conf configuration and returns the score, findings, and remediation.
        """
        parsed_params = self.parse_config_text(raw_config)
        evaluation = self.scorer.calculate_score(parsed_params)

        remediated_config = """# /etc/ipsec.conf — CIPHERLENS HARDENED CNSA 2.0 POLICY
conn hardened-ipsec-vpn
    type=tunnel
    auto=start
    authby=pubkey
    leftcert=gateway_ecdsa384.crt
    leftsigkey=tpm2_bound
    ike=chacha20poly1305-prfsha384-curve25519-mlkem768!  # PQC HYBRID
    esp=aes256gcm128-curve25519!                          # AEAD STRONG
    aggressive=no                                         # Strict IKEv2
    ikelifetime=3600s                                     # 1h Rekey Limit
    replay_window=1024                                    # ESN 64-bit Anti-Replay
"""

        remediated_params = {
            "ike_version": 2,
            "is_aggressive": False,
            "cipher": "CHACHA20-POLY1305",
            "dh_group": 9370,
            "auth_method": "ECDSA X.509 TPM 2.0",
            "pfs": True,
            "sa_lifetime_hours": 1,
            "pqc_hybrid": True,
        }
        remediated_eval = self.scorer.calculate_score(remediated_params)

        delta = remediated_eval["total_score"] - evaluation["total_score"]

        return {
            "current_score": evaluation["total_score"],
            "current_rating": evaluation["rating"],
            "breakdown": evaluation["breakdown"],
            "hndl_exposure_years": evaluation["hndl_exposure_years"],
            "remediated_score": remediated_eval["total_score"],
            "posture_delta": f"+{delta} pts" if delta > 0 else f"{delta} pts",
            "remediated_config": remediated_config,
        }
