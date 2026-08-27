"""
Unit Tests for NIST SP 800-77 & CNSA 2.0 Security Scorer
"""

import pytest
from backend.engine.scoring_engine import NISTSecurityScorer


def test_vulnerable_configuration_score():
    scorer = NISTSecurityScorer()
    params = {
        "ike_version": 1,
        "is_aggressive": True,
        "cipher": "3DES-CBC",
        "dh_group": 14,
        "auth_method": "PSK",
        "pfs": False,
        "sa_lifetime_hours": 8,
        "pqc_hybrid": False,
    }

    res = scorer.calculate_score(params)

    assert res["total_score"] <= 50
    assert res["rating"] == "AT_RISK"
    assert res["hndl_exposure_years"] >= 10
    assert len(res["breakdown"]) == 5


def test_hardened_pqc_configuration_score():
    scorer = NISTSecurityScorer()
    params = {
        "ike_version": 2,
        "is_aggressive": False,
        "cipher": "CHACHA20-POLY1305",
        "dh_group": 9370,
        "auth_method": "ECDSA X.509 TPM 2.0",
        "pfs": True,
        "sa_lifetime_hours": 1,
        "pqc_hybrid": True,
    }

    res = scorer.calculate_score(params)

    assert res["total_score"] >= 85
    assert res["rating"] == "HARDENED"
    assert res["hndl_exposure_years"] == 0
