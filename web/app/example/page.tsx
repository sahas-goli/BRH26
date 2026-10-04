import { Fraunces, IBM_Plex_Mono, Sora } from "next/font/google";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import type { GraphPayload } from "../../lib/types";
import { Cascade } from "../live/cascade";
import "../live/live.css";
import "./example.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const sans = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "What each hop pays · Six Hops",
  description: "A $16 example chain: Poster unpaid, Riley $1, Sam $6, Alex $9.",
};

const exampleChain: GraphPayload = {
  nodes: [
    { id: "poster", depth: 0, label: "Poster", isTarget: false },
    { id: "riley", depth: 1, label: "Riley", isTarget: false, paidCents: 100 },
    { id: "sam", depth: 2, label: "Sam", isTarget: false, paidCents: 600 },
    { id: "alex", depth: 3, label: "Alex", isTarget: true, paidCents: 900 },
  ],
  edges: [
    { from: "poster", to: "riley", at: "2026-10-04T16:00:00.000Z" },
    { from: "riley", to: "sam", at: "2026-10-04T16:01:00.000Z" },
    { from: "sam", to: "alex", at: "2026-10-04T16:02:00.000Z" },
  ],
};

export default function ExamplePage() {
  return (
    <main
      className={`live-root example-root ${display.variable} ${sans.variable} ${mono.variable}`}
      style={
        {
          ["--display" as string]: "var(--font-fraunces), Georgia, serif",
          ["--sans" as string]: "var(--font-sora), sans-serif",
          ["--mono" as string]: "var(--font-plex), monospace",
        } as CSSProperties
      }
    >
      <div className="live-shell example-shell">
        <header className="live-top">
          <div>
            <p className="live-muted">Slide example · not a live search</p>
            <h1 className="live-brand">
              What each hop <span>pays</span>
            </h1>
          </div>
          <p className="live-meta">
            <a href="/">Six Hops</a>
            <a href="/about">How it works</a>
          </p>
        </header>
        <section className="live-panel example-panel" aria-labelledby="chain-title">
          <h2 id="chain-title">One chain</h2>
          <Cascade graph={exampleChain} layout="column" />
          <p className="example-caption">
            $16 reward. After the first pass the match stays at $9. Sam, who handed Alex the link, gets $6. Riley gets $1.
          </p>
        </section>
      </div>
    </main>
  );
}
