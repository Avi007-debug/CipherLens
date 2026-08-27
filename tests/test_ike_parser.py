"""
Unit Tests for Deterministic IKEv1/IKEv2 Parser
"""

import pytest
from backend.engine.ike_parser import DeterministicIKEParser


def test_ike_header_parsing_error():
    parser = DeterministicIKEParser()
    res = parser.parse_header(b"\x00" * 10)  # Too short (<28 bytes)
    assert "error" in res


def test_vulnerable_handshake_inspection():
    parser = DeterministicIKEParser()
    res = parser.inspect_simulated_handshake("vulnerable")

    assert res["protocol"] == "IKEv1"
    assert res["calculated_posture_score"] == 42
    assert res["status"] == "AT_RISK"
    assert any(f["code"] == "CVE-2002-1623" for f in res["findings"])
    assert any(f["code"] == "SWEET32" for f in res["findings"])


def test_hardened_handshake_inspection():
    parser = DeterministicIKEParser()
    res = parser.inspect_simulated_handshake("hardened")

    assert res["protocol"] == "IKEv2"
    assert res["calculated_posture_score"] == 94
    assert res["status"] == "HARDENED_PQC_READY"
    assert len(res["findings"]) == 0
    assert res["pqc_hybrid"] is True
