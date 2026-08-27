"""
Unit Tests for ESP Traffic Classifier with TreeSHAP Attributions
"""

import pytest
from backend.engine.traffic_classifier import ESPTrafficClassifier


def test_voip_classification():
    classifier = ESPTrafficClassifier()

    # VoIP signature: 172-byte payload, isochronous 20ms delta
    packet_lengths = [172] * 40
    deltas = [20.0] * 40

    res = classifier.classify_flow(packet_lengths, deltas)

    assert res["class_id"] == "voip"
    assert res["confidence_pct"] >= 95.0
    assert len(res["shap_attributions"]) > 0
    assert res["shap_attributions"][0]["feature"] == "isochronous_delta_20ms"


def test_video_classification():
    classifier = ESPTrafficClassifier()

    # Video signature: large MTU frames (>1350) + high jitter
    packet_lengths = [1380, 1380, 1380, 450, 450, 1380, 1380]
    deltas = [5.0, 5.0, 33.0, 33.0, 5.0, 33.0, 5.0]

    res = classifier.classify_flow(packet_lengths, deltas)

    assert res["class_id"] == "video"
    assert res["confidence_pct"] >= 90.0
    assert res["zero_decryption_certified"] is True
