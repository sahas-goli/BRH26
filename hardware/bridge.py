#!/usr/bin/env python3
"""Poll GET /api/stats and drive the physical b gauge over serial (PLAN.md 7.8).

Writes lines like:  B 1.73\\n  at 9600 baud.

Usage:
  # Print-only (no Arduino attached) against local or preview:
  python hardware/bridge.py --base http://localhost:3000 --mock-serial

  # Real serial (adjust COM port /dev/ttyUSB0):
  python hardware/bridge.py --base https://YOUR.vercel.app --port COM3

Requires FEATURED_BOUNTY (or --bounty) so /api/stats has a target.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request


def fetch_b(base: str, bounty: str | None, timeout: float) -> float | None:
    params = {}
    if bounty:
        params["bounty"] = bounty
    url = base.rstrip("/") + "/api/stats"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        body = json.loads(resp.read().decode("utf-8"))
    if not isinstance(body, dict):
        return None
    b = body.get("b")
    if b is None:
        return None
    return float(b)


def open_serial(port: str, baud: int):
    try:
        import serial  # type: ignore
    except ImportError as exc:
        raise SystemExit(
            "pyserial not installed. pip install pyserial  (or use --mock-serial)"
        ) from exc
    return serial.Serial(port, baudrate=baud, timeout=1)


def main() -> int:
    parser = argparse.ArgumentParser(description="Six Hops gauge serial bridge")
    parser.add_argument("--base", default="http://localhost:3000", help="Web origin")
    parser.add_argument("--bounty", default=None, help="bounty id (else FEATURED_BOUNTY on server)")
    parser.add_argument("--port", default=None, help="Serial port, e.g. COM3 or /dev/ttyUSB0")
    parser.add_argument("--baud", type=int, default=9600)
    parser.add_argument("--interval", type=float, default=5.0, help="Poll seconds")
    parser.add_argument("--mock-serial", action="store_true", help="Print B lines to stdout")
    parser.add_argument("--once", action="store_true", help="Single poll then exit")
    args = parser.parse_args()

    if not args.mock_serial and not args.port:
        print("Pass --port COMx or --mock-serial", file=sys.stderr)
        return 2

    ser = None
    if not args.mock_serial:
        ser = open_serial(args.port, args.baud)
        print(f"serial open {args.port} @ {args.baud}", flush=True)

    print(f"polling {args.base}/api/stats every {args.interval}s", flush=True)
    while True:
        try:
            b = fetch_b(args.base, args.bounty, timeout=10.0)
            if b is None:
                line = "B nan\n"
                print("stats: b missing (set FEATURED_BOUNTY or --bounty)", file=sys.stderr)
            else:
                line = f"B {b:.2f}\n"
            if ser is not None:
                ser.write(line.encode("ascii"))
                ser.flush()
            else:
                sys.stdout.write(line)
                sys.stdout.flush()
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError) as exc:
            print(f"poll error: {exc}", file=sys.stderr)
        if args.once:
            break
        time.sleep(args.interval)
    if ser is not None:
        ser.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
