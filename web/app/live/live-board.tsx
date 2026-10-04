"use client";

import { useEffect, useMemo, useState } from "react";
import { FEATURED_PANEL_CENTS, nessiePanel } from "../../lib/nessie-panel";
import type { AttackComparison, GraphPayload, PublicBounty, Stats } from "../../lib/types";
import { Cascade } from "./cascade";

type SweepPoint = { attrition?: number; fanout?: number; success_rate: number; trials: number };
type Sweep = {
  note?: string;
  by_attrition: SweepPoint[];
  by_fanout: SweepPoint[];
};

const DEMO_STATS: Stats = {
  bountyId: "b_demo",
  b: 1.73,
  matureHolders: 11,
  frontier: 7,
  holders: 18,
  maxDepth: 4,
  p75LatencyS: 540,
  controllerStep: 2,
  status: "open",
  asOf: new Date().toISOString(),
  series: Array.from({ length: 24 }, (_, i) => ({
    bucket: new Date(Date.now() - (23 - i) * 60_000).toISOString(),
    received: 2 + ((i * 3) % 5),
    forwarded: 1 + ((i * 2) % 4),
    maxDepth: Math.min(4, 1 + Math.floor(i / 6)),
  })),
};

const DEMO_GRAPH: GraphPayload = {
  nodes: [
    { id: "h0", depth: 0, label: "poster", isTarget: false },
    { id: "h1", depth: 1, label: "TA", isTarget: false, paidCents: 100 },
    { id: "h2", depth: 2, label: "labmate", isTarget: false, paidCents: 100 },
    { id: "h3", depth: 3, label: "cousin", isTarget: false, paidCents: 100 },
    { id: "h4", depth: 4, label: "target", isTarget: true, paidCents: 1300 },
    { id: "h5", depth: 1, label: "dead end", isTarget: false },
    { id: "h6", depth: 2, label: "stalled", isTarget: false },
  ],
  edges: [
    { from: "h0", to: "h1", at: "2026-10-03T12:01:00.000Z", memoSig: "edge_h1" },
    { from: "h1", to: "h2", at: "2026-10-03T12:08:00.000Z", memoSig: "edge_h2" },
    { from: "h2", to: "h3", at: "2026-10-03T12:20:00.000Z" },
    { from: "h3", to: "h4", at: "2026-10-03T12:40:00.000Z" },
    { from: "h0", to: "h5", at: "2026-10-03T12:02:00.000Z" },
    { from: "h5", to: "h6", at: "2026-10-03T12:15:00.000Z" },
  ],
  payoutSig: "61a5bLrJdUqZkYqjvptTqJ5KGqj2dGWdhvSjoDrgJG16sTwwNqkdNbTcdbbRphtmxRyFjFbz3kuMqgbPU7NjQiXS",
  explorerUrl:
    "https://explorer.solana.com/tx/61a5bLrJdUqZkYqjvptTqJ5KGqj2dGWdhvSjoDrgJG16sTwwNqkdNbTcdbbRphtmxRyFjFbz3kuMqgbPU7NjQiXS?cluster=devnet",
};

function zoneFor(b: number | null): "red" | "amber" | "green" {
  if (b == null || b < 2) return "red";
  if (b < 2.5) return "amber";
  return "green";
}

function needleAngle(b: number | null): number {
  const clamped = Math.max(0, Math.min(3, b ?? 0));
  return -90 + (clamped / 3) * 180;
}

function SeriesChart({ series }: { series: NonNullable<Stats["series"]> }) {
  const width = 320;
  const height = 90;
  const maxY = Math.max(1, ...series.map((point) => Math.max(point.received, point.forwarded)));
  const forwarded = series
    .map((point, i) => {
      const x = (i / Math.max(1, series.length - 1)) * (width - 8) + 4;
      const y = height - 8 - (point.forwarded / maxY) * (height - 16);
      return `${x},${y}`;
    })
    .join(" ");
  const received = series
    .map((point, i) => {
      const x = (i / Math.max(1, series.length - 1)) * (width - 8) + 4;
      const y = height - 8 - (point.received / maxY) * (height - 16);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="live-series" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Per-minute received and forwarded">
      <polyline fill="none" stroke="#6ec8ff" strokeWidth="2" points={received} />
      <polyline fill="none" stroke="#b6f24a" strokeWidth="2" points={forwarded} />
      <line x1="4" x2={width - 4} y1={height - 8} y2={height - 8} stroke="#2a342d" />
    </svg>
  );
}

function SweepChart({
  points,
  cursor,
  label,
}: {
  points: { x: number; y: number }[];
  cursor: number;
  label: string;
}) {
  const width = 320;
  const height = 90;
  if (!points.length) return <p className="live-muted">No sweep points.</p>;
  const maxX = Math.max(...points.map((p) => p.x), 1e-6);
  const maxY = Math.max(...points.map((p) => p.y), 0.05);
  const poly = points
    .map((point, i) => {
      const x = (i / Math.max(1, points.length - 1)) * (width - 8) + 4;
      const y = height - 8 - (point.y / maxY) * (height - 16);
      return `${x},${y}`;
    })
    .join(" ");
  const cursorIdx = Math.min(points.length - 1, Math.max(0, Math.round(cursor * (points.length - 1))));
  const cx = (cursorIdx / Math.max(1, points.length - 1)) * (width - 8) + 4;
  const cy = height - 8 - (points[cursorIdx]!.y / maxY) * (height - 16);
  return (
    <svg className="live-series" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <polyline fill="none" stroke="#6ec8ff" strokeWidth="2" points={poly} />
      <line x1="4" x2={width - 4} y1={height - 8} y2={height - 8} stroke="#2a342d" />
      <circle cx={cx} cy={cy} r="4" fill="#b6f24a" />
      <text x={8} y={14} fill="#9aab9f" fontSize="10">
        max x={maxX.toFixed(2)}
      </text>
    </svg>
  );
}

function money(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function LiveBoard({ initialBountyId }: { initialBountyId: string | null }) {
  const [bountyId, setBountyId] = useState(initialBountyId ?? "b_demo");
  const [stats, setStats] = useState<Stats | null>(null);
  const [graph, setGraph] = useState<GraphPayload | null>(null);
  const [usingDemo, setUsingDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [h, setH] = useState(4);
  const [k, setK] = useState(2);
  const [attack, setAttack] = useState<AttackComparison | null>(null);
  const [attackError, setAttackError] = useState<string | null>(null);
  const [replayT, setReplayT] = useState(0.65);
  const [sweep, setSweep] = useState<Sweep | null>(null);
  const [publicBounty, setPublicBounty] = useState<PublicBounty | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    let delayMs = 5000;

    async function poll() {
      try {
        const statsUrl = bountyId ? `/api/stats?bounty=${encodeURIComponent(bountyId)}` : "/api/stats";
        const statsRes = await fetch(statsUrl, { cache: "no-store" });
        if (!statsRes.ok) throw new Error(`stats ${statsRes.status}`);
        const nextStats = (await statsRes.json()) as Stats;
        const graphRes = await fetch(`/api/graph/${encodeURIComponent(nextStats.bountyId)}`, { cache: "no-store" });
        if (!graphRes.ok) throw new Error(`graph ${graphRes.status}`);
        const nextGraph = (await graphRes.json()) as GraphPayload;
        const bountyRes = await fetch(`/api/bounties/${encodeURIComponent(nextStats.bountyId)}`, { cache: "no-store" });
        const nextBounty = bountyRes.ok ? ((await bountyRes.json()) as PublicBounty) : null;
        if (cancelled) return;
        setStats(nextStats);
        setGraph(nextGraph);
        setPublicBounty(nextBounty);
        setBountyId(nextStats.bountyId);
        setUsingDemo(false);
        setError(null);
        delayMs = 5000;
      } catch (err) {
        if (cancelled) return;
        setStats(DEMO_STATS);
        setGraph(DEMO_GRAPH);
        setPublicBounty(null);
        setUsingDemo(true);
        setError(err instanceof Error ? err.message : "offline");
        // Avoid hammering 503s in the console while DATABASE_URL is unset.
        delayMs = 60_000;
      }
      if (!cancelled) timer = window.setTimeout(() => void poll(), delayMs);
    }

    void poll();
    return () => {
      cancelled = true;
      if (timer != null) window.clearTimeout(timer);
    };
  }, [bountyId]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const res = await fetch("/api/attack", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ h, k, budgetCents: 1600 }),
      });
      if (cancelled) return;
      if (!res.ok) {
        setAttack(null);
        setAttackError(`attack ${res.status}`);
        return;
      }
      setAttack((await res.json()) as AttackComparison);
      setAttackError(null);
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [h, k]);

  useEffect(() => {
    let cancelled = false;
    async function loadSweep() {
      const paths = ["/api/sim/sweep", "/sim/sweep.json"];
      for (const path of paths) {
        try {
          const res = await fetch(path, { cache: "force-cache" });
          if (!res.ok) continue;
          const body = (await res.json()) as Sweep;
          if (!cancelled && Array.isArray(body.by_attrition) && Array.isArray(body.by_fanout)) {
            setSweep(body);
            return;
          }
        } catch {
          /* try next */
        }
      }
    }
    void loadSweep();
    return () => {
      cancelled = true;
    };
  }, []);

  const zone = zoneFor(stats?.b ?? null);
  const angle = needleAngle(stats?.b ?? null);
  const series = stats?.series ?? [];
  const controllerLabels = ["healthy", "nudge", "widen", "raise"] as const;
  const balances = nessiePanel(
    publicBounty
      ? { capCents: publicBounty.capCents, bountyCents: publicBounty.bountyCents, status: publicBounty.status }
      : stats || usingDemo
        ? { ...FEATURED_PANEL_CENTS, status: stats?.status ?? "open" }
        : null,
    stats?.status,
  );

  const attritionPoints = useMemo(
    () => (sweep?.by_attrition ?? []).map((p) => ({ x: p.attrition ?? 0, y: p.success_rate })),
    [sweep],
  );
  const fanoutPoints = useMemo(
    () => (sweep?.by_fanout ?? []).map((p) => ({ x: p.fanout ?? 0, y: p.success_rate })),
    [sweep],
  );
  const scrubIdx = Math.min(
    Math.max(attritionPoints.length - 1, 0),
    Math.round(replayT * Math.max(attritionPoints.length - 1, 0)),
  );
  const scrubPoint = attritionPoints[scrubIdx];
  const replayNote = useMemo(() => {
    if (!scrubPoint) {
      if (replayT < 0.33) return "Early hops: fan-out still forming.";
      if (replayT < 0.66) return "Cliff region: b dips under 2, controller arms.";
      return "Late cascade: paid path glows; salts publish on settle.";
    }
    const rate = (scrubPoint.y * 100).toFixed(1);
    if (scrubPoint.y < 0.05) return `Attrition ${scrubPoint.x.toFixed(1)} · success ${rate}% — past the b≈2 cliff.`;
    if (scrubPoint.y < 0.2) return `Attrition ${scrubPoint.x.toFixed(1)} · success ${rate}% — cliff forming.`;
    return `Attrition ${scrubPoint.x.toFixed(1)} · success ${rate}% — cascades still land.`;
  }, [replayT, scrubPoint]);

  return (
    <div className="live-shell">
      <header className="live-top">
        <div>
          <p className="live-muted" style={{ marginBottom: 4 }}>
            BigRed//Hacks demo screen
          </p>
          <h1 className="live-brand">
            Six <span>Hops</span>
          </h1>
        </div>
        <div className="live-meta">
          <span>bounty {stats?.bountyId ?? "—"}</span>
          <span>status {stats?.status ?? "—"}</span>
          <span>as of {stats ? new Date(stats.asOf).toLocaleTimeString() : "—"}</span>
          {graph?.explorerUrl ? (
            <a href={graph.explorerUrl} target="_blank" rel="noreferrer">
              Explorer payout
            </a>
          ) : null}
        </div>
      </header>

      {usingDemo ? (
        <div className="live-banner">
          Showing seeded demo cascade ({error}). Set DATABASE_URL + FEATURED_BOUNTY for live Tiger data.
        </div>
      ) : null}

      <div className="live-grid">
        <section className="live-panel live-cascade">
          <h2>Cascade</h2>
          <Cascade graph={graph} />
        </section>

        <aside className="live-side">
          <section className="live-panel">
            <h2>Branching factor b</h2>
            <div className="live-dial-wrap">
              <div className="live-dial" aria-hidden>
                <svg viewBox="0 0 140 90">
                  <path d="M10 70 A60 60 0 0 1 130 70" fill="none" stroke="#2a342d" strokeWidth="10" strokeLinecap="round" />
                  <path d="M10 70 A60 60 0 0 1 70 10" fill="none" stroke="#ff5a45" strokeWidth="10" strokeLinecap="round" />
                  <path d="M70 10 A60 60 0 0 1 100 18" fill="none" stroke="#f0b429" strokeWidth="10" strokeLinecap="round" />
                  <path d="M100 18 A60 60 0 0 1 130 70" fill="none" stroke="#b6f24a" strokeWidth="10" strokeLinecap="round" />
                  <g className="live-dial-needle" style={{ transform: `rotate(${angle}deg)` }}>
                    <line x1="70" y1="70" x2="70" y2="22" stroke="#e8f0e9" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="70" cy="70" r="5" fill="#e8f0e9" />
                  </g>
                </svg>
              </div>
              <div>
                <p className="live-b-readout" data-zone={zone}>
                  {stats?.b == null ? "—" : stats.b.toFixed(2)}
                </p>
                <p className="live-muted">threshold 2.0 · p75 {stats?.p75LatencyS ?? 600}s</p>
                <div className="live-steps" title={`controller: ${controllerLabels[stats?.controllerStep ?? 0]}`}>
                  {[0, 1, 2, 3].map((step) => (
                    <i key={step} className={(stats?.controllerStep ?? 0) >= step ? "on" : undefined} />
                  ))}
                </div>
              </div>
            </div>
            <div className="live-stats-row" style={{ marginTop: 12 }}>
              <div>
                <strong>{stats?.holders ?? 0}</strong>
                holders
              </div>
              <div>
                <strong>{stats?.frontier ?? 0}</strong>
                frontier
              </div>
              <div>
                <strong>{stats?.maxDepth ?? 0}</strong>
                max depth
              </div>
            </div>
          </section>

          <section className="live-panel">
            <h2>Per-minute flow</h2>
            {series.length ? <SeriesChart series={series} /> : <p className="live-muted">No bounty_minute buckets yet.</p>}
            <p className="live-muted">blue received · lime forwarded</p>
          </section>

          <section className="live-panel">
            <h2>Balances (Nessie)</h2>
            <p className="live-muted">{balances.note}</p>
            <div className="live-stats-row" style={{ marginTop: 10 }}>
              <div>
                <strong>{balances.available ? money(balances.checkingCents) : "—"}</strong>
                Nessie checking
              </div>
              <div>
                <strong>{balances.available ? money(balances.escrowCents) : "—"}</strong>
                escrow
              </div>
              <div>
                <strong>{balances.status}</strong>
                status
              </div>
            </div>
          </section>
        </aside>

        <div className="live-bottom">
          <section className="live-panel">
            <h2>Attack slider</h2>
            <label className="live-muted" htmlFor="attack-h">
              honest depth h = {h}
            </label>
            <input id="attack-h" className="live-slider" type="range" min={1} max={8} value={h} onChange={(e) => setH(Number(e.target.value))} />
            <label className="live-muted" htmlFor="attack-k">
              fake hops k = {k}
            </label>
            <input id="attack-k" className="live-slider" type="range" min={0} max={4} value={k} onChange={(e) => setK(Number(e.target.value))} />
            <div className="live-attack-bars">
              <div className="live-bar">
                <div>ours gain {attack?.ours.gainPct.toFixed(1) ?? "0.0"}%</div>
                <div className="fill">
                  <span style={{ width: `${Math.min(100, attack?.ours.gainPct ?? 0)}%` }} />
                </div>
              </div>
              <div className="live-bar mit">
                <div>MIT gain {attack?.mit.gainPct.toFixed(1) ?? "0.0"}%</div>
                <div className="fill">
                  <span style={{ width: `${Math.min(100, attack?.mit.gainPct ?? 0)}%` }} />
                </div>
              </div>
            </div>
            {attackError ? <p className="live-muted">Attack API: {attackError}</p> : null}
            {attack ? (
              <p className="live-muted">
                poster pays {money(attack.ours.posterPays)} either way · h={attack.h} k={attack.k}
              </p>
            ) : null}
          </section>

          <section className="live-panel">
            <h2>Replay / sweep</h2>
            <input
              className="live-slider"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={replayT}
              onChange={(e) => setReplayT(Number(e.target.value))}
              aria-label="Replay progress"
            />
            <p className="live-muted">{replayNote}</p>
            {attritionPoints.length ? (
              <>
                <p className="live-muted">success vs attrition (scrubber cursor)</p>
                <SweepChart points={attritionPoints} cursor={replayT} label="Success rate versus attrition" />
                <p className="live-muted" style={{ marginTop: 8 }}>
                  success vs fan-out
                </p>
                <SweepChart points={fanoutPoints} cursor={replayT} label="Success rate versus fan-out" />
              </>
            ) : (
              <p className="live-muted">Loading offline sweep.json…</p>
            )}
            {sweep?.note ? <p className="live-muted">{sweep.note}</p> : null}
          </section>

          <section className="live-panel">
            <h2>Winning salts</h2>
            {graph?.revealedSalts ? (
              <pre className="live-muted" style={{ whiteSpace: "pre-wrap", margin: 0, maxHeight: 120, overflow: "auto" }}>
                {Object.entries(graph.revealedSalts)
                  .map(([id, salt]) => `${id} ${salt.slice(0, 10)}…`)
                  .join("\n")}
              </pre>
            ) : (
              <p className="live-muted">Salts publish only after status=paid.</p>
            )}
          </section>

          <section className="live-panel">
            <h2>Watch</h2>
            <label className="live-muted" htmlFor="bounty-id">
              bounty id
            </label>
            <input
              id="bounty-id"
              value={bountyId}
              onChange={(e) => setBountyId(e.target.value.trim())}
              style={{
                width: "100%",
                marginTop: 6,
                background: "#101612",
                border: "1px solid #2a342d",
                color: "#e8f0e9",
                fontFamily: "var(--mono)",
                padding: "8px",
                borderRadius: 3,
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
