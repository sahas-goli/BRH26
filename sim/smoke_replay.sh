#!/usr/bin/env bash
# Offline S3-03 smoke: small Kleinberg run + CSV header checks (no DATABASE_URL).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/sim"
pick_py() {
  for cand in python3 python py; do
    if command -v "$cand" >/dev/null 2>&1; then
      if [ "$cand" = py ]; then
        py -3 -c "import sys" >/dev/null 2>&1 && { echo "py -3"; return; }
      else
        "$cand" -c "import sys" >/dev/null 2>&1 && { echo "$cand"; return; }
      fi
    fi
  done
  echo "ERROR: need a working Python 3 on PATH (numpy required)" >&2
  exit 1
}
# shellcheck disable=SC2206
PY=($(pick_py))
"${PY[@]}" replay.py --quick --seed 1
"${PY[@]}" - <<'PY'
import csv
from pathlib import Path
out = Path("out")
required = {
    "replay_events.csv": ["time", "bounty_id", "holder_id", "parent_id", "depth", "kind", "latency_s", "source", "detail"],
    "replay_bounties.csv": ["id", "poster_token", "hint", "hidden_hint", "cap_cents", "bounty_cents", "status", "controller_step", "expires_at"],
    "replay_holders.csv": ["id", "bounty_id", "token", "parent_id", "depth", "label", "salt", "forwards", "received_at"],
}
for name, cols in required.items():
    path = out / name
    assert path.exists(), f"missing {path}"
    with path.open(newline="") as f:
        header = next(csv.reader(f))
    assert header == cols, f"{name}: {header} != {cols}"
    rows = sum(1 for _ in path.open()) - 1
    assert rows > 0, f"{name} empty"
print("smoke_replay ok", {k: (out / k).stat().st_size for k in required})
assert (out / "sweep.json").exists()
PY
echo "Next human step after Tiger apply: bash sim/load.sh && fill submission/tiger.md benchmarks."
