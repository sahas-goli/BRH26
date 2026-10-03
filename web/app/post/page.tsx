"use client";

import { useRef, useState, type FormEvent } from "react";
import type { HintCard } from "../../lib/types";
import styles from "./pages.module.css";

type Created = { bountyId: string; posterToken: string; posterLink: string };
const fields = [["city", "City", "Austin, TX"], ["field", "Field", "Aerospace launch operations"], ["skill", "Skill", "Has hand-soldered a QFN chip"], ["language", "Language", "Amharic"], ["experience", "Experience", "Has worked on a launch team"]] as const;

export default function PostPage() {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Created | null>(null);
  const [copied, setCopied] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    const hint: HintCard = {};
    for (const [key] of fields) { const value = String(data.get(key) ?? "").trim(); if (value) hint[key] = value; }
    const organizationType = String(data.get("organizationType") ?? "");
    if (organizationType) hint.organizationType = organizationType as HintCard["organizationType"];
    if (!Object.keys(hint).length) { setError("Add at least one hint about the person’s skills, experience, or city."); return; }
    const capCents = Math.round(Number(data.get("cap")) * 100);
    if (!Number.isSafeInteger(capCents) || capCents < 1000) { setError("Set a reward cap of at least $10."); return; }
    busy.current = true; setPending(true); setError("");
    try {
      const response = await fetch("/api/bounties", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ hint, capCents, hours:Number(data.get("hours")), ...(String(data.get("badge") ?? "").trim() ? { targetBadgeId:String(data.get("badge")).trim() } : {}) }) });
      const result = await response.json();
      if (!response.ok) { setError(response.status === 503 ? "Search creation is not connected yet. Your details are still here; please try again later." : "We couldn’t create the search. Check your details and try again."); return; }
      if (typeof result.posterToken !== "string" || typeof result.bountyId !== "string" || typeof result.posterLink !== "string" || !/^\/h\/[A-Za-z0-9_-]+$/.test(result.posterLink)) throw new Error("Invalid result");
      setCreated(result);
    } catch { setError("We couldn’t confirm whether the search was created. Check your connection before trying again."); }
    finally { busy.current = false; setPending(false); }
  }
  async function copyDetails() {
    if (!created) return;
    try { await navigator.clipboard.writeText(`Bounty: ${created.bountyId}\nPoster token: ${created.posterToken}\nYour forwarding page: ${new URL(created.posterLink, window.location.origin).href}`); setCopied("Private details copied. Save them somewhere only you can access."); }
    catch { setCopied("Copy is unavailable. Select and save the private details below."); }
  }
  return <main className={styles.shell}><div className={styles.content}>
    <nav className={styles.nav} aria-label="Main navigation"><a href="/">SIX HOPS</a><a href="/live">Live searches ↗</a></nav>
    {created ? <section className={styles.card} aria-live="polite">
      <p className={styles.eyebrow}>Your search is ready</p><h1>Start with someone you know.</h1>
      <p className={styles.intro}>Open your forwarding page to create a personal link for each of your first contacts.</p>
      <h2>Save your private poster details</h2><p className={styles.muted}>You’ll need the poster token to approve a claim without a badge. Keep it private. These details disappear when you leave this page.</p>
      <p className={styles.secret}>Bounty: {created.bountyId}<br />Poster token: {created.posterToken}</p>
      <div className={styles.actions}><button className={`${styles.button} ${styles.secondary}`} onClick={copyDetails}>Copy private details</button><a className={styles.button} href={created.posterLink} referrerPolicy="no-referrer">Choose your first contacts →</a></div>
      <p role="status" className={styles.muted}>{copied}</p>
    </section> : <>
      <p className={styles.eyebrow}>Start a search</p><h1 className={styles.title}>Who do you need<br />to connect with?</h1>
      <p className={styles.intro}>Make an attributes-only hint card. Give people enough to recognize a good connection, without a name or street address.</p>
      <form onSubmit={submit} className={styles.card} aria-busy={pending}>
        <h2>The hint card</h2><p className={styles.muted}>Fill in at least one field. All hints below are visible to recipients.</p>
        {fields.map(([key, label, placeholder]) => <label className={styles.field} key={key}>{label}<input name={key} placeholder={placeholder} maxLength={80} disabled={pending} /></label>)}
        <label className={styles.field}>Organization type<select name="organizationType" disabled={pending}><option value="">No preference</option>{["company", "startup", "university", "lab", "nonprofit", "government", "other"].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
        <h2>Reward and deadline</h2><div className={styles.row}>
          <label className={styles.field}>Maximum reward (USD)<input name="cap" type="number" min="10" max="21474836.47" step="0.01" defaultValue="20" required disabled={pending} /></label>
          <label className={styles.field}>Search duration (hours)<input name="hours" type="number" min="1" max="8760" step="1" defaultValue="24" required disabled={pending} /></label>
        </div><p className={styles.muted}>The initial offer is 60% of your cap; the remaining 40% is held in reserve. This demo uses test or simulated money.</p>
        <details><summary>Venue game: optional target badge</summary><label className={styles.field}>Target badge ID<input name="badge" maxLength={80} disabled={pending} /></label><p className={styles.muted}>Use the ID supplied by the organizer. Without a badge, you approve the target’s claim.</p></details>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}><button className={styles.button} type="submit" disabled={pending}>{pending ? "Creating your search…" : "Create search →"}</button></div>
      </form>
    </>}
  </div></main>;
}
