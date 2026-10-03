"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { GraphPayload } from "../../lib/types";

const DEPTH_COLORS = ["#6ec8ff", "#8fd3ff", "#b6f24a", "#d4ff6a", "#f0b429", "#ff9f6b", "#ff5a45", "#ff7ad1", "#c9a0ff"];

type SimNode = GraphPayload["nodes"][number] & d3.SimulationNodeDatum;
type SimLink = { source: string | SimNode; target: string | SimNode; memoSig?: string; at: string };

export function Cascade({ graph }: { graph: GraphPayload | null }) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgEl = ref.current;
    if (!svgEl || !graph) return;

    const width = svgEl.clientWidth || 640;
    const height = svgEl.clientHeight || 360;
    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const nodes: SimNode[] = graph.nodes.map((node) => ({ ...node }));
    const links: SimLink[] = graph.edges.map((edge) => ({
      source: edge.from,
      target: edge.to,
      memoSig: edge.memoSig,
      at: edge.at,
    }));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((node) => node.id)
          .distance(54)
          .strength(0.7),
      )
      .force("charge", d3.forceManyBody().strength(-180))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force(
        "y",
        d3
          .forceY<SimNode>((node) => 40 + (node.depth / 8) * (height - 80))
          .strength(0.85),
      )
      .force("collide", d3.forceCollide(16));

    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", (d) => (d.memoSig ? "link has-memo" : "link"))
      .on("click", (_event, d) => {
        if (!d.memoSig) return;
        window.open(`https://explorer.solana.com/tx/${d.memoSig}?cluster=devnet`, "_blank", "noopener,noreferrer");
      });

    const drag = d3
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.25).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const node = svg
      .append("g")
      .selectAll<SVGCircleElement, SimNode>("circle")
      .data(nodes)
      .join("circle")
      .attr("class", (d) => ["node", d.paidCents != null ? "paid" : "", d.isTarget ? "target" : ""].filter(Boolean).join(" "))
      .attr("r", (d) => (d.isTarget ? 10 : d.paidCents != null ? 8 : 6))
      .attr("fill", (d) => DEPTH_COLORS[Math.min(d.depth, DEPTH_COLORS.length - 1)])
      .call(drag);

    node.append("title").text((d) => `${d.label ?? d.id} · depth ${d.depth}${d.paidCents != null ? ` · ${d.paidCents}¢` : ""}`);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      node.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);
    });

    return () => {
      simulation.stop();
    };
  }, [graph]);

  return <svg ref={ref} className="live-cascade-svg" role="img" aria-label="Bounty cascade graph" />;
}
