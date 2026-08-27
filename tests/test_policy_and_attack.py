"""
Unit Tests for Policy Simulator and Attack Replay Sandbox
"""

import pytest
from backend.engine.policy_simulator import PolicySimulator
from backend.engine.attack_simulator import AttackSimulator
from backend.engine.merkle_audit import MerkleAuditLedger


def test_policy_simulator_vulnerable_diff():
    sim = PolicySimulator()
    raw_conf = """conn test-vpn
    aggressive=yes
    ike=3des-sha1-modp2048!
    esp=3des-sha1!
    authby=secret
    """

    res = sim.simulate_policy(raw_conf)

    assert res["current_score"] <= 50
    assert res["remediated_score"] >= 85
    assert "+" in res["posture_delta"]
    assert "conn hardened-ipsec-vpn" in res["remediated_config"]


def test_attack_simulator_replay():
    atk = AttackSimulator()
    res = atk.replay_scenario("atk-01")

    assert res["scenario_id"] == "atk-01"
    assert res["cve"] == "CVE-2002-1623"
    assert res["execution_status"] == "EXPLOIT_VERIFIED_IN_SANDBOX"
    assert res["score_reduction"] == 52


def test_merkle_audit_root_generation():
    ledger = MerkleAuditLedger()
    res = ledger.generate_attestation_receipt({"ike_state": "IKEv2", "rubric_score": 94})

    assert res["merkle_root"].startswith("0x")
    assert len(res["leaves"]) == 4
    assert res["attestation_status"] == "COMMITTED_AND_IMMUTABLE"
