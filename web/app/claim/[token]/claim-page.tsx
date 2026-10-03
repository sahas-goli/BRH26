"use client";

import { useRef, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import styles from "../../h/[token]/hop.module.css";

type ClaimResult = { status: "found" | "paid"; payoutSig?: string; explorerUrl?: string };
function safeExplorer(value?: string): string | undefined {
  if (!value) return;
  try { const url = new URL(value); if (url.protocol === "https:" && url.hostname === "explorer.solana.com" && !url.username && !url.password) return url.href; } catch { /* omit invalid links */ }
}

export default function ClaimPage() {
  const { token } = useParams<{ token: string }>();
  const [intro, setIntro] = useState("");
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ClaimResult | null>(null);

  async function claim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    if (!intro.trim()) { setError("Please write a short introduction."); return; }
    inFlight.current = true; setBusy(true); setError("");
    try {
      const response = await fetch("/api/claim", { method: "POST", headers: { "Content-Type": "application/json" }, referrerPolicy: "no-referrer", body: JSON.stringify({ token, introMessage: intro.trim() }) });
      const data = await response.json();
      if (!response.ok) {
        const messages: Record<string, string> = { already_claimed: "This bounty already has a claim. Return to your hint card to check its status.", closed: "This bounty is no longer open for claims.", not_found: "This personal link was not found." };
        throw new Error(messages[data.error] ?? "Your claim was not confirmed. Return to your hint card to check its status before retrying.");
      }
      if (data.status !== "found" && data.status !== "paid") throw new Error("The claim returned an unexpected result. Check the bounty status before retrying.");
      setResult(data as ClaimResult);
    } catch (e) { setError(e instanceof Error ? e.message : "Your claim could not be confirmed. Check its status before retrying."); }
    finally { inFlight.current = false; setBusy(false); }
  }

  const explorer = safeExplorer(result?.explorerUrl);
  return <main className={styles.page}>
    <a href="/" referrerPolicy="no-referrer">Six Hops</a>
    {result ? <section className={styles.card} aria-live="polite">
      <h1>{result.status === "paid" ? "Your chain has been paid." : "Your introduction is sent."}</h1>
      <p>{result.status === "paid" ? "The bounty is marked paid. Demo rewards use test funds." : "The bounty is marked found. Payment is pending the poster’s confirmation of your introduction."}</p>
      {explorer && <p><a href={explorer} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">View the payout on Solana Explorer</a></p>}
      {result.status === "paid" && !explorer && <p>No transaction link was returned for this payout.</p>}
    </section> : <>
      <h1>Are you the missing connection?</h1>
      <p>Claim only if the hint card describes you. Your introduction is shared with the poster when you choose to participate.</p>
      <form onSubmit={claim}>
        <fieldset disabled={busy}><legend>Make an introduction</legend>
          <label htmlFor="intro">A short introduction</label>
          <textarea id="intro" required maxLength={2000} value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="How do you match the clues, and what would you like the poster to know?" />
          <p className={styles.muted}>The poster confirms your introduction before payment.</p>
        </fieldset>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <button type="submit" disabled={busy}>{busy ? "Submitting introduction…" : "Opt in and send introduction"}</button>
      </form>
    </>}
    <p><a href={`/h/${encodeURIComponent(token)}`} referrerPolicy="no-referrer">Back to your hint card</a></p>
  </main>;
}
