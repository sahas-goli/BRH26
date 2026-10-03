#!/usr/bin/env python3
"""Kleinberg-lattice cascade replay for Six Hops (PLAN.md 7.1).

Builds a lattice, runs greedy fan-out cascades, writes:
  sim/out/replay_events.csv
  sim/out/replay_bounties.csv
  sim/out/replay_holders.csv
  sim/out/sweep.json

Load into Tiger after schema apply:
  bash sim/load.sh
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import random
import time
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "out"
SIDE = 1000
N = SIDE * SIDE
FANOUT = 3
MAX_DEPTH = 8
TARGET_EVENTS = 1_000_000
N_CASCADES = 2000


def idx(x: int, y: int) -> int:
    return y * SIDE + x


def xy(i: int) -> tuple[int, int]:
    return i % SIDE, i // SIDE


def dist(a: int, b: int) -> float:
    ax, ay = xy(a)
    bx, by = xy(b)
    return abs(ax - bx) + abs(ay - by) + 1e-9


def build_long_range(rng: np.random.Generator) -> np.ndarray:
    """One long-range neighbor per node with P ~ d^-2 (sampled)."""
    long = np.empty(N, dtype=np.int32)
    for i in range(N):
        for _ in range(8):
            j = int(rng.integers(0, N))
            if j == i:
                continue
            d = dist(i, j)
            if rng.random() < min(1.0, (3.0 / d) ** 2):
                long[i] = j
                break
        else:
            long[i] = (i + SIDE) % N
    return long


def local_neighbors(i: int) -> list[int]:
    x, y = xy(i)
    out: list[int] = []
    if x > 0:
        out.append(idx(x - 1, y))
    if x + 1 < SIDE:
        out.append(idx(x + 1, y))
    if y > 0:
        out.append(idx(x, y - 1))
    if y + 1 < SIDE:
        out.append(idx(x, y + 1))
    return out


def neighbors(i: int, long: np.ndarray) -> list[int]:
    return local_neighbors(i) + [int(long[i])]


def lognormal_latency(rng: random.Random, median_min: float = 20.0) -> float:
    mu = math.log(median_min * 60.0)
    return float(rng.lognormvariate(mu, 0.6))


def _iso(ts: float) -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(ts))


def _ev(
    ts: float,
    bounty_id: str,
    holder_id: str | None,
    parent_id: str | None,
    depth: int | None,
    kind: str,
    latency_s: float | None,
) -> dict:
    return {
        "time": _iso(ts),
        "bounty_id": bounty_id,
        "holder_id": holder_id or "",
        "parent_id": parent_id or "",
        "depth": "" if depth is None else depth,
        "kind": kind,
        "latency_s": "" if latency_s is None else f"{latency_s:.3f}",
        "source": "replay",
        "detail": "{}",
    }


def simulate_cascade(
    bounty_id: str,
    long: np.ndarray,
    rng: random.Random,
    np_rng: np.random.Generator,
    start_time: float,
    attrition: float,
    fanout: int,
) -> tuple[list[dict], list[dict], bool]:
    source = int(np_rng.integers(0, N))
    target = int(np_rng.integers(0, N))
    while target == source:
        target = int(np_rng.integers(0, N))

    events: list[dict] = []
    holders: list[dict] = []
    root_id = f"{bounty_id}_h0"
    holders.append(
        {
            "id": root_id,
            "bounty_id": bounty_id,
            "token": f"t_{bounty_id}_0",
            "parent_id": "",
            "depth": 0,
            "label": "poster",
            "salt": f"{rng.getrandbits(64):016x}",
            "forwards": 0,
            "received_at": _iso(start_time),
        }
    )
    meta = {root_id: {"node": source, "depth": 0, "received_at": start_time, "forwards": 0}}
    events.append(_ev(start_time, bounty_id, root_id, "", 0, "created", None))
    events.append(_ev(start_time, bounty_id, root_id, "", 0, "received", None))

    queue = [root_id]
    success = False
    next_holder = 1

    while queue:
        hid = queue.pop(0)
        node = meta[hid]["node"]
        depth = meta[hid]["depth"]
        received_at = meta[hid]["received_at"]
        if depth >= MAX_DEPTH:
            continue
        if node == target and depth >= 1:
            success = True
            events.append(_ev(received_at + 5, bounty_id, hid, "", depth, "claimed", None))
            continue
        if rng.random() < attrition:
            continue

        cands = sorted(set(neighbors(node, long)), key=lambda j: dist(j, target))
        chosen = cands[:fanout]
        forwards = 0
        for child_node in chosen:
            if rng.random() < attrition:
                continue
            latency = lognormal_latency(rng)
            t = received_at + latency
            child_id = f"{bounty_id}_h{next_holder}"
            next_holder += 1
            holders.append(
                {
                    "id": child_id,
                    "bounty_id": bounty_id,
                    "token": f"t_{bounty_id}_{next_holder}",
                    "parent_id": hid,
                    "depth": depth + 1,
                    "label": f"hop{depth + 1}",
                    "salt": f"{rng.getrandbits(64):016x}",
                    "forwards": 0,
                    "received_at": _iso(t),
                }
            )
            meta[child_id] = {
                "node": child_node,
                "depth": depth + 1,
                "received_at": t,
                "forwards": 0,
            }
            events.append(_ev(t, bounty_id, child_id, hid, depth + 1, "received", None))
            events.append(_ev(t + 2, bounty_id, child_id, hid, depth + 1, "opened", None))
            events.append(_ev(t, bounty_id, hid, "", depth, "forwarded", latency))
            forwards += 1
            queue.append(child_id)
            if child_node == target:
                success = True
                events.append(_ev(t + 10, bounty_id, child_id, hid, depth + 1, "claimed", None))
        for row in holders:
            if row["id"] == hid:
                row["forwards"] = forwards
                break

    return events, holders, success


def sweep(long: np.ndarray, seed: int = 7) -> dict:
    rng = random.Random(seed)
    np_rng = np.random.default_rng(seed)
    by_attrition = []
    for p in [0.2, 0.3, 0.4, 0.5, 0.6]:
        wins = 0
        trials = 80
        for i in range(trials):
            _, _, ok = simulate_cascade(f"s_a{i}", long, rng, np_rng, time.time(), p, FANOUT)
            wins += int(ok)
        by_attrition.append({"attrition": p, "success_rate": wins / trials, "trials": trials})

    by_fanout = []
    for f in [1, 2, 3]:
        wins = 0
        trials = 80
        for i in range(trials):
            _, _, ok = simulate_cascade(f"s_f{i}", long, rng, np_rng, time.time(), 0.35, f)
            wins += int(ok)
        by_fanout.append({"fanout": f, "success_rate": wins / trials, "trials": trials})

    return {
        "note": "Success rate vs attrition and fan-out on the Kleinberg lattice. Cliff near branching factor 2.",
        "by_attrition": by_attrition,
        "by_fanout": by_fanout,
    }


def write_outputs(
    events: list[dict],
    bounties: list[dict],
    holders: list[dict],
    sweep_data: dict,
) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with (OUT / "replay_events.csv").open("w", newline="") as f:
        w = csv.DictWriter(
            f,
            fieldnames=[
                "time",
                "bounty_id",
                "holder_id",
                "parent_id",
                "depth",
                "kind",
                "latency_s",
                "source",
                "detail",
            ],
        )
        w.writeheader()
        w.writerows(events)
    with (OUT / "replay_bounties.csv").open("w", newline="") as f:
        w = csv.DictWriter(
            f,
            fieldnames=[
                "id",
                "poster_token",
                "hint",
                "hidden_hint",
                "cap_cents",
                "bounty_cents",
                "status",
                "controller_step",
                "expires_at",
            ],
        )
        w.writeheader()
        w.writerows(bounties)
    with (OUT / "replay_holders.csv").open("w", newline="") as f:
        w = csv.DictWriter(
            f,
            fieldnames=[
                "id",
                "bounty_id",
                "token",
                "parent_id",
                "depth",
                "label",
                "salt",
                "forwards",
                "received_at",
            ],
        )
        w.writeheader()
        w.writerows(holders)
    (OUT / "sweep.json").write_text(json.dumps(sweep_data, indent=2) + "\n")
    # Convenience alias matching PLAN.md naming.
    (OUT / "replay.csv").write_text((OUT / "replay_events.csv").read_text())


def generate(seed: int = 42) -> None:
    print(f"building long-range links for {N} nodes...", flush=True)
    np_rng = np.random.default_rng(seed)
    t0 = time.time()
    long = build_long_range(np_rng)
    print(f"  long-range ready in {time.time() - t0:.1f}s", flush=True)
    rng = random.Random(seed)

    print("running sweep...", flush=True)
    sweep_data = sweep(long, seed=seed + 1)

    events: list[dict] = []
    holders: list[dict] = []
    bounties: list[dict] = []
    now = time.time()
    window = 7 * 24 * 3600
    print(f"simulating up to {N_CASCADES} cascades / {TARGET_EVENTS} events...", flush=True)
    for i in range(N_CASCADES):
        bounty_id = f"r_{i:04d}"
        start = now - rng.random() * window
        attrition = rng.uniform(0.2, 0.6)
        ev, hol, ok = simulate_cascade(bounty_id, long, rng, np_rng, start, attrition, FANOUT)
        events.extend(ev)
        holders.extend(hol)
        bounties.append(
            {
                "id": bounty_id,
                "poster_token": f"p_{bounty_id}",
                "hint": json.dumps({"city": "Ithaca, NY", "field": "distributed search"}),
                "hidden_hint": "[]",
                "cap_cents": 2000,
                "bounty_cents": 1600,
                "status": "paid" if ok else "expired",
                "controller_step": 0,
                "expires_at": _iso(start + 86400),
            }
        )
        if (i + 1) % 100 == 0:
            print(f"  cascade {i + 1}: {len(events)} events", flush=True)
        if len(events) >= TARGET_EVENTS:
            break

    pad = 0
    while len(events) < TARGET_EVENTS and pad < 5000:
        bounty_id = f"r_pad_{pad:04d}"
        start = now - rng.random() * window
        ev, hol, ok = simulate_cascade(bounty_id, long, rng, np_rng, start, 0.25, FANOUT)
        events.extend(ev)
        holders.extend(hol)
        bounties.append(
            {
                "id": bounty_id,
                "poster_token": f"p_{bounty_id}",
                "hint": json.dumps({"city": "Austin, TX", "field": "pad"}),
                "hidden_hint": "[]",
                "cap_cents": 2000,
                "bounty_cents": 1600,
                "status": "paid" if ok else "expired",
                "controller_step": 0,
                "expires_at": _iso(start + 86400),
            }
        )
        pad += 1

    events = events[:TARGET_EVENTS]
    write_outputs(events, bounties, holders, sweep_data)
    print(f"wrote {len(events)} events, {len(bounties)} bounties, {len(holders)} holders -> {OUT}", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--quick", action="store_true", help="smaller lattice run for smoke tests")
    args = parser.parse_args()
    if args.quick:
        global SIDE, N, N_CASCADES, TARGET_EVENTS
        SIDE = 40
        N = SIDE * SIDE
        N_CASCADES = 40
        TARGET_EVENTS = 5000
    generate(seed=args.seed)


if __name__ == "__main__":
    main()
