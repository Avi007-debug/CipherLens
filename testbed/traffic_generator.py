"""
CipherLens Multi-Traffic Generator
Generates VoIP (G.711), Video (H.264), Web (HTTP/3), and Exfiltration stream patterns.
"""

import time
import socket
import argparse
import random


def generate_voip_stream(target_ip: str, target_port: int, duration_sec: int = 10):
    """Generates isochronous 20ms G.711a voice packets (172 bytes)."""
    print(f"[*] Starting VoIP Stream -> {target_ip}:{target_port} for {duration_sec}s")
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    payload = b"\x80\x08" + b"\x00" * 170  # RTP header + G.711 audio

    start = time.time()
    packet_count = 0
    while time.time() - start < duration_sec:
        sock.sendto(payload, (target_ip, target_port))
        packet_count += 1
        time.sleep(0.020)  # Fixed 20ms codec clock

    print(f"[+] VoIP Stream Complete: Sent {packet_count} packets")


def generate_video_stream(target_ip: str, target_port: int, duration_sec: int = 10):
    """Generates WebRTC / H.264 video with periodic I-frame bursts (GOP)."""
    print(f"[*] Starting Video Conference Stream -> {target_ip}:{target_port}")
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    start = time.time()
    frame_idx = 0
    while time.time() - start < duration_sec:
        # Every 30 frames (~1s), send a large I-frame burst
        is_keyframe = (frame_idx % 30 == 0)
        burst_size = random.randint(8, 14) if is_keyframe else random.randint(1, 3)

        for _ in range(burst_size):
            packet_len = random.randint(1200, 1400)
            sock.sendto(b"\x90\x60" + b"\xFF" * (packet_len - 2), (target_ip, target_port))

        frame_idx += 1
        time.sleep(0.033)  # ~30 fps frame rate

    print(f"[+] Video Stream Complete: Sent {frame_idx} video frames")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CipherLens Tunnel Traffic Generator")
    parser.add_argument("--type", choices=["voip", "video", "web", "bulk"], default="voip")
    parser.add_argument("--target", default="192.168.100.20")
    parser.add_argument("--port", type=int, default=5004)
    parser.add_argument("--duration", type=int, default=10)

    args = parser.parse_args()

    if args.type == "voip":
        generate_voip_stream(args.target, args.port, args.duration)
    elif args.type == "video":
        generate_video_stream(args.target, args.port, args.duration)
