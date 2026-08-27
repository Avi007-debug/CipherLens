"""
Unit Tests for Zero-Decryption ESP Feature Extractor & Shannon Entropy
"""

import pytest
import os
from backend.engine.feature_extractor import ESPFeatureExtractor


def test_shannon_entropy_calculation():
    extractor = ESPFeatureExtractor()

    # Low entropy payload (repeated bytes)
    low_entropy_bytes = b"AAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    h_low = extractor.compute_shannon_entropy(low_entropy_bytes)
    assert h_low == 0.0

    # High entropy payload (pseudo-random / ciphertext)
    high_entropy_bytes = os.urandom(2048)
    h_high = extractor.compute_shannon_entropy(high_entropy_bytes)
    assert h_high >= 7.85  # Real ciphertext is > 7.85 bits/byte


def test_flow_features_extraction():
    extractor = ESPFeatureExtractor()

    # 56 VoIP packets at 172 bytes with 20ms delta
    packet_lengths = [172] * 56
    deltas = [20.0] * 56

    features = extractor.extract_flow_features(packet_lengths, deltas)

    assert features["packet_count"] == 56
    assert features["size_mean"] == 172.0
    assert features["delta_mean_ms"] == 20.0
    assert features["isochronous_20ms_score"] == 1.0
