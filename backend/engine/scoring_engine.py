"""
NIST SP 800-77 Rev.1 & CNSA 2.0 Weighted Security Posture Scoring Engine
"""

from typing import Dict, Any, List


class NISTSecurityScorer:
    """
    Computes a defensible, standards-linked 0-100 security posture score.
    """

    def calculate_score(self, config_params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates posture score across 5 weighted dimensions:
        1. IKE Negotiation Mode (25%)
        2. Cipher Suite & Transforms (25%)
        3. Authentication & Key Binding (20%)
        4. Perfect Forward Secrecy & Rekey (15%)
        5. Post-Quantum Cryptographic Readiness (15%)
        """
        # Default baseline: Vulnerable
        ike_ver = config_params.get("ike_version", 1)
        is_aggressive = config_params.get("is_aggressive", True)
        cipher = config_params.get("cipher", "3DES-CBC")
        dh_group = config_params.get("dh_group", 14)
        auth = config_params.get("auth_method", "PSK")
        pfs = config_params.get("pfs", False)
        lifetime = config_params.get("sa_lifetime_hours", 8)
        pqc = config_params.get("pqc_hybrid", False)

        # 1. IKE Negotiation (max 25)
        if ike_ver == 2 and not is_aggressive:
            ike_score = 98
        elif ike_ver == 1 and not is_aggressive:
            ike_score = 65
        else:
            ike_score = 34  # Aggressive Mode vulnerability

        # 2. Cipher Suite (max 25)
        if cipher in ["CHACHA20-POLY1305", "AES-GCM-256"]:
            cipher_score = 96
        elif cipher in ["AES-CBC-256", "AES-GCM-128"]:
            cipher_score = 85
        elif cipher == "AES-CBC-128":
            cipher_score = 70
        else:
            cipher_score = 41  # 3DES / DES

        # 3. Authentication (max 20)
        if "ECDSA" in auth or "TPM" in auth or "X.509" in auth:
            auth_score = 94
        elif "RSA-3072" in auth:
            auth_score = 80
        else:
            auth_score = 28  # Static PSK

        # 4. PFS & Rekey (max 15)
        if pfs and lifetime <= 2:
            pfs_score = 92
        elif pfs and lifetime <= 8:
            pfs_score = 75
        elif not pfs and lifetime <= 8:
            pfs_score = 55
        else:
            pfs_score = 35

        # 5. PQC Readiness (max 15)
        if pqc or dh_group in [768, 9370]:
            pqc_score = 90
            hndl_years = 0
            pqc_status = "QUANTUM_RESISTANT"
        else:
            pqc_score = 12
            hndl_years = max(10, int(lifetime * 2.5))
            pqc_status = "CRITICAL_EXPOSURE"

        # Weighted Total Score
        total = round(
            (ike_score * 0.25)
            + (cipher_score * 0.25)
            + (auth_score * 0.20)
            + (pfs_score * 0.15)
            + (pqc_score * 0.15)
        )

        rating = "HARDENED" if total >= 80 else "TRANSITIONAL" if total >= 60 else "AT_RISK"

        return {
            "total_score": total,
            "rating": rating,
            "compliance_standard": "NIST SP 800-77 Rev.1 / CNSA 2.0",
            "breakdown": [
                {
                    "dimension": "IKE_NEGOTIATION",
                    "label": "IKE Handshake State Machine",
                    "score": ike_score,
                    "weight": "25%",
                    "rfc": "RFC 7296 §1.2",
                    "status": "COMPLIANT" if ike_score >= 80 else "VULNERABLE",
                },
                {
                    "dimension": "CRYPTO_SUITE",
                    "label": "Transform & Cipher Suite Strength",
                    "score": cipher_score,
                    "weight": "25%",
                    "rfc": "RFC 8221 §5",
                    "status": "COMPLIANT" if cipher_score >= 80 else "VULNERABLE",
                },
                {
                    "dimension": "AUTH_METHOD",
                    "label": "Authentication & Identity Binding",
                    "score": auth_score,
                    "weight": "20%",
                    "rfc": "RFC 7296 §2.15",
                    "status": "COMPLIANT" if auth_score >= 80 else "VULNERABLE",
                },
                {
                    "dimension": "PFS_REKEY",
                    "label": "Perfect Forward Secrecy & Rekeying",
                    "score": pfs_score,
                    "weight": "15%",
                    "rfc": "RFC 7296 §1.3.1",
                    "status": "COMPLIANT" if pfs_score >= 80 else "SUBOPTIMAL",
                },
                {
                    "dimension": "PQC_READINESS",
                    "label": "Post-Quantum Cryptographic Readiness",
                    "score": pqc_score,
                    "weight": "15%",
                    "rfc": "RFC 8784 / RFC 9370",
                    "status": pqc_status,
                },
            ],
            "hndl_exposure_years": hndl_years,
        }
