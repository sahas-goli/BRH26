import { Fraunces, IBM_Plex_Mono, Sora } from "next/font/google";
import type { CSSProperties } from "react";
import { LiveBoard } from "./live-board";
import "./live.css";

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

export const dynamic = "force-dynamic";

export default function LivePage() {
  const featured = process.env.FEATURED_BOUNTY || null;
  return (
    <main
      className={`live-root ${display.variable} ${sans.variable} ${mono.variable}`}
      style={
        {
          ["--display" as string]: "var(--font-fraunces), Georgia, serif",
          ["--sans" as string]: "var(--font-sora), sans-serif",
          ["--mono" as string]: "var(--font-plex), monospace",
        } as CSSProperties
      }
    >
      <LiveBoard initialBountyId={featured} />
    </main>
  );
}
