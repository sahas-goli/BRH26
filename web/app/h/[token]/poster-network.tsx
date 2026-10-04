"use client";

import { useEffect, useState } from "react";
import { Cascade } from "../../live/cascade";
import type { GraphPayload } from "../../../lib/types";
import "./poster-network.css";

export function PosterNetwork({ token }: { token: string }) {
  const [graph, setGraph] = useState<GraphPayload | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function load() {
      try {
        const response = await fetch(`/api/h/${encodeURIComponent(token)}/network`, {
          cache: "no-store",
          referrerPolicy: "no-referrer",
          signal: controller.signal,
        });
        if (response.ok) setGraph(await response.json() as GraphPayload);
      } catch { /* the hint card still works if the map is briefly down */ }
      if (!controller.signal.aborted) timer = setTimeout(() => void load(), 4000);
    }
    void load();
    return () => { controller.abort(); if (timer) clearTimeout(timer); };
  }, [token]);

  const people = graph?.nodes.length ?? 0;
  const helpers = Math.max(0, people - 1);
  const deepest = graph?.nodes.reduce((max, node) => Math.max(max, node.depth), 0) ?? 0;

  return (
    <section className="poster-net" aria-label="Your search so far">
      <p className="poster-net-kicker">Your search so far</p>
      <h2>Who has the link</h2>
      <p className="poster-net-note">Names stay off this map. Each dot is one person. You are at the top. The chain grows downward.</p>
      <div className="poster-net-counts">
        <span><strong>{helpers}</strong> {helpers === 1 ? "person" : "people"} helping</span>
        <span><strong>{deepest}</strong> {deepest === 1 ? "hop" : "hops"} deep</span>
      </div>
      <div className="poster-net-map">
        {graph ? <Cascade graph={graph} /> : <p className="poster-net-note">Loading the map…</p>}
      </div>
    </section>
  );
}
