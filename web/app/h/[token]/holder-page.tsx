"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { H } from "../../../lib/types";
import type { ForwardRecipient, ForwardResult, HolderView, Rail } from "../../../lib/types";
import styles from "./hop.module.css";

const labels: Record<string, string> = { city: "City", organizationType: "Organization", field: "Field", skill: "Skill", language: "Language", experience: "Experience" };
const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export default function HolderPage() {
  const { token } = useParams<{ token: string }>();
  const [view, setView] = useState<HolderView | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [rail, setRail] = useState<Rail>("custodial");
  const [wallet, setWallet] = useState("");
  const [editDestination, setEditDestination] = useState(false);
  const [recipients, setRecipients] = useState<ForwardRecipient[]>([{ label: "", handle: "" }]);
  const [sent, setSent] = useState<ForwardResult["recipients"]>([]);
  const [copyStatus, setCopyStatus] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    fetch(`/api/h/${encodeURIComponent(token)}`, { cache: "no-store", referrerPolicy: "no-referrer", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 404 ? "This personal link was not found. Ask the sender for their link again." : "The bounty is unavailable right now. Please try again.");
        return response.json() as Promise<HolderView>;
      }).then((data) => {
        if (controller.signal.aborted) return;
        setView(data); setRail(data.rail); setWallet(""); setEditDestination(false);
        setRecipients((rows) => rows.slice(0, Math.max(1, Math.min(3, data.forwardsLeft))));
      })
      .catch((e: unknown) => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Unable to load this bounty."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [token, attempt]);

  async function forward(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!view || inFlight.current) return;
    inFlight.current = true; setBusy(true); setError("");
    try {
      const response = await fetch("/api/forward", {
        method: "POST", headers: { "Content-Type": "application/json" }, referrerPolicy: "no-referrer",
        body: JSON.stringify({ token, recipients: recipients.map((r) => ({ label: r.label.trim(), ...(r.handle?.trim() ? { handle: r.handle.trim() } : {}) })), ...(editDestination ? { rail, ...(rail === "wallet" ? { solAddress: wallet.trim() } : {}) } : {}) }),
      });
      const data = await response.json();
      if (!response.ok) {
        const errors: Record<string, string> = { fanout_exceeded: "There are fewer forwards left than requested. Refresh the bounty before trying again.", too_deep: "This chain has reached its final hop.", closed: "This bounty is closed for forwarding.", invalid_wallet: "Enter a valid Solana wallet address.", delivery_unavailable: "iMessage delivery is unavailable. Remove the optional handle to create a link instead." };
        throw new Error(errors[data.error] ?? "The forward was not confirmed. Refresh before retrying to check your remaining forwards.");
      }
      const result = data as ForwardResult;
      setSent((current) => [...current, ...result.recipients]);
      const left = Math.max(0, view.forwardsLeft - result.recipients.length);
      setView({ ...view, rail: editDestination ? rail : view.rail, forwardsLeft: left, canForward: view.canForward && left > 0 });
      setEditDestination(false); setWallet("");
      setRecipients([{ label: "", handle: "" }]);
    } catch (e) { setError(e instanceof Error ? e.message : "The request could not be confirmed. Refresh before retrying."); }
    finally { inFlight.current = false; setBusy(false); }
  }

  return <main className={styles.page}>
    <a href="/" referrerPolicy="no-referrer">Six Hops</a>
    <h1>Who do you know?</h1>
    {loading && <p role="status">Loading your hint card…</p>}
    {error && <div role="alert" className={styles.error}>{error}<br /><button disabled={busy} onClick={() => setAttempt((a) => a + 1)}>Refresh bounty</button></div>}
    {!loading && view && <>
      <section className={styles.card} aria-label="Bounty hint card">
        <p className={styles.amount}>{money(view.bounty.bountyCents)}</p>
        <p>Current reward shared by the successful chain · {view.bounty.status}</p>
        <img className={styles.image} src={`/api/og/${encodeURIComponent(view.bounty.id)}`} alt="Wanted card for this bounty" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.hidden = true; }} />
        <dl>{Object.entries(view.bounty.hint).map(([key, value]) => <div key={key}><dt>{labels[key] ?? key}</dt><dd>{value}</dd></div>)}</dl>
        <p>{view.depth === 0 ? "You are the poster. The root holder does not receive a reward." : `You are hop ${view.depth} of at most ${H}.`}</p>
        {view.parentLabel && <p>Your sender labeled your link “{view.parentLabel}”.</p>}
        <p className={styles.muted}>Deadline: <time dateTime={view.bounty.expiresAt}>{new Date(view.bounty.expiresAt).toLocaleString()}</time>. Demo rewards use test funds.</p>
      </section>
      <h2>{view.forwardsLeft} forwards remaining</h2>
      <p>Choose someone closer to these clues. Share each personal link only with its intended recipient.</p>
      {view.canForward ? <form onSubmit={forward}>
        <fieldset disabled={busy}><legend>Your recipients</legend>
          {recipients.map((recipient, index) => <div key={index}>
            <label htmlFor={`label-${index}`}>Recipient {index + 1} label</label>
            <input id={`label-${index}`} required maxLength={80} value={recipient.label} placeholder="My lab partner" onChange={(e) => setRecipients((rows) => rows.map((r, i) => i === index ? { ...r, label: e.target.value } : r))} />
            <label htmlFor={`handle-${index}`}>iMessage phone or email (optional)</label>
            <input id={`handle-${index}`} maxLength={254} autoComplete="off" value={recipient.handle ?? ""} onChange={(e) => setRecipients((rows) => rows.map((r, i) => i === index ? { ...r, handle: e.target.value } : r))} />
            {recipients.length > 1 && <button type="button" onClick={() => setRecipients((rows) => rows.filter((_, i) => i !== index))}>Remove recipient {index + 1}</button>}
          </div>)}
          {recipients.length < Math.min(3, view.forwardsLeft) && <button type="button" onClick={() => setRecipients((rows) => [...rows, { label: "", handle: "" }])}>Add recipient</button>}
        </fieldset>
        <p className={styles.muted}>iMessage delivery is for registered numbers. You will receive a shareable link when delivery is unavailable.</p>
        <fieldset disabled={busy}><legend>Your reward destination</legend>
          <p>Current option: {view.rail === "wallet" ? "your saved Solana wallet" : view.rail === "bank" ? "demo bank account" : "demo wallet managed for you"}.</p>
          <button type="button" aria-expanded={editDestination} onClick={() => { setEditDestination((editing) => !editing); setRail(view.rail); setWallet(""); }}>{editDestination ? "Keep saved destination" : "Change reward destination"}</button>
          {editDestination && <>
          <label htmlFor="rail">Payment option</label>
          <select id="rail" value={rail} onChange={(e) => setRail(e.target.value as Rail)}><option value="custodial">Demo wallet managed for me</option><option value="wallet">My Solana wallet</option><option value="bank">Demo bank account</option></select>
          {rail === "wallet" && <><label htmlFor="wallet">Solana public address</label><input id="wallet" required minLength={32} maxLength={44} pattern="[1-9A-HJ-NP-Za-km-z]{32,44}" autoComplete="off" spellCheck={false} value={wallet} onChange={(e) => setWallet(e.target.value)} /><p className={styles.muted}>Enter a public address only.</p></>}
          </>}
        </fieldset>
        <button disabled={busy} type="submit">{busy ? "Creating personal links…" : "Pass it on"}</button>
      </form> : <p>This link cannot forward further. The bounty may be closed, at its last hop, or out of forwards.</p>}
      {sent.length > 0 && <section className={styles.card} aria-label="Created recipient links"><h2>Your personal links</h2><p role="status">{sent.length} recipient links created.</p>{sent.map((r) => <div key={r.link}><h3>{r.label}</h3><p>{r.delivered === "imessage" ? "Delivered by iMessage" : "Link ready — share it with this recipient"}</p><input aria-label={`Personal link for ${r.label}`} readOnly value={r.link} onFocus={(e) => e.currentTarget.select()} /><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(r.link); setCopyStatus(`Copied the link for ${r.label}.`); } catch { setCopyStatus("Select the link above and copy it manually."); } }}>Copy link</button></div>)}<p role="status">{copyStatus}</p></section>}
      <nav className={styles.actions} aria-label="Other ways to participate"><a href={`/talk/${encodeURIComponent(token)}`} referrerPolicy="no-referrer">Talk instead</a>{view.depth > 0 && view.bounty.status === "open" && <a href={`/claim/${encodeURIComponent(token)}`} referrerPolicy="no-referrer">This is me</a>}</nav>
    </>}
  </main>;
}
