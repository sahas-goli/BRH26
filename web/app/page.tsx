"use client";

import { useEffect, useState } from "react";
import type { PublicBounty } from "../lib/types";
import styles from "./post/pages.module.css";

export default function HomePage() {
  const [featured, setFeatured] = useState<PublicBounty | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        let bountyId = new URLSearchParams(window.location.search).get("bounty");
        if (!bountyId) {
          const stats = await fetch("/api/stats", { signal: controller.signal, cache: "no-store" });
          if (!stats.ok) return;
          const data = await stats.json();
          if (typeof data.bountyId !== "string") return;
          bountyId = data.bountyId;
        }
        const response = await fetch(`/api/bounties/${encodeURIComponent(bountyId!)}`, { signal: controller.signal, cache: "no-store" });
        if (response.ok) {
          const bounty = await response.json();
          if (bounty.hint && typeof bounty.bountyCents === "number") setFeatured(bounty);
        }
      } catch { /* The game explanation remains usable while the featured API is offline. */ }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, []);
  return <main className={styles.shell}><div className={styles.content}>
    <nav className={styles.nav} aria-label="Main navigation"><a href="/">SIX HOPS</a><a href="/live">Watch the search ↗</a></nav>
    <p className={styles.eyebrow}>Someone you know knows someone</p>
    <h1 className={styles.title}>Find your person.<br />One friend at a time.</h1>
    <p className={styles.intro}>Looking for a particular kind of experience? Put out a hint card. Friends pass it closer, and the successful chain shares the reward.</p>
    <ol className={styles.steps}><li>Describe their skills and experience, without names or addresses.</li><li>Each person passes the card to up to three people, for at most eight hops.</li><li>The person opts in. The successful chain gets paid.</li></ol>
    <div className={styles.actions}><a className={styles.button} href="/post">Start a search</a></div>
    <section className={styles.card} aria-labelledby="featured-title" aria-live="polite">
      <p className={styles.eyebrow}>Featured search</p><h2 id="featured-title">A connection in the making</h2>
      {loading ? <p>Loading the featured search…</p> : featured ? <>
        <p className={styles.amount}>{(featured.bountyCents / 100).toLocaleString("en-US", { style:"currency", currency:"USD" })} reward</p>
        <ul className={styles.steps}>{Object.entries(featured.hint).map(([key, value]) => <li key={key}>{value}</li>)}</ul>
        <p className={styles.muted}>Status: {featured.status}. Join through a personal link from a friend.</p>
        <a href={`/live?bounty=${encodeURIComponent(featured.id)}`}>Follow this search ↗</a>
      </> : <p className={styles.muted}>No featured search is available right now. Start one of your own.</p>}
    </section>
    <p className={styles.muted}>Hackathon demo: rewards use test or simulated money. Nobody pays to join a chain.</p>
  </div></main>;
}
