"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { H } from "../../../lib/types";
import type { ForwardRecipient, ForwardResult, HolderView, Rail } from "../../../lib/types";
import styles from "./hop.module.css";

const labels: Record<string, string> = { city: "City", organizationType: "Organization", field: "Field", skill: "Skill", language: "Language", experience: "Experience" };
const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
function safeExplorer(value?: string): string {
  try { const url = new URL(value ?? ""); if (url.protocol === "https:" && url.hostname === "explorer.solana.com" && !url.username && !url.password) return url.href; } catch { /* omit invalid links */ }
  return "";
}
function payoutExplorer(address: string): string {
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) return "";
  return safeExplorer(`https://explorer.solana.com/address/${address}?cluster=devnet`);
}

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
  const [payoutAddress, setPayoutAddress] = useState("");
  const [addressCopy, setAddressCopy] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [posterToken, setPosterToken] = useState("");
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmNote, setConfirmNote] = useState("");
  const [explorer, setExplorer] = useState("");
  const revealPayout = useRef(false);

  useEffect(() => {
    if (!revealPayout.current || view?.bounty.status !== "paid") return;
    revealPayout.current = false;
    document.getElementById("payout")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [view]);

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
        if (data.depth === 0) {
          try {
            const key = `sixhops:poster:${data.bounty.id}`;
            const fromLink = new URLSearchParams(window.location.hash.slice(1)).get("k");
            if (fromLink) {
              sessionStorage.setItem(key, fromLink);
              history.replaceState(null, "", window.location.pathname);
            }
            setPosterToken(fromLink ?? sessionStorage.getItem(key) ?? "");
          } catch { setPosterToken(""); }
        }
        if (data.bounty.status === "paid") {
          fetch(`/api/graph/${encodeURIComponent(data.bounty.id)}`, { cache: "no-store", signal: controller.signal })
            .then((response) => response.ok ? response.json() as Promise<{ explorerUrl?: string }> : {})
            .then((graph) => { const url = safeExplorer((graph as { explorerUrl?: string }).explorerUrl); if (url) setExplorer(url); })
            .catch(() => { /* the paid card still renders without the link */ });
        }
      })
      .catch((e: unknown) => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Unable to load this bounty."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [token, attempt]);

  async function confirmClaim(accept: boolean) {
    if (!view || confirmBusy) return;
    if (!posterToken.trim()) {
      setError("Paste your private poster token from the create-search page to approve or reject.");
      return;
    }
    setConfirmBusy(true); setError(""); setConfirmNote("");
    try {
      const response = await fetch(`/api/bounties/${encodeURIComponent(view.bounty.id)}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ posterToken: posterToken.trim(), accept }),
      });
      const data = await response.json() as { error?: string; status?: string; explorerUrl?: string };
      if (!response.ok) {
        const errors: Record<string, string> = {
          not_found: "Poster token or bounty not found.",
          not_claimed: "There is no pending claim to confirm.",
          invalid_input: "Accept must be true or false.",
        };
        throw new Error(errors[data.error ?? ""] ?? "Confirmation failed. Check the poster token and try again.");
      }
      if (accept) { setExplorer(safeExplorer(data.explorerUrl)); revealPayout.current = true; }
      setConfirmNote(accept ? "" : "Claim rejected. The bounty is open again for another target.");
      setAttempt((a) => a + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Confirmation failed.");
    } finally {
      setConfirmBusy(false);
    }
  }

  async function forward(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!view || inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(""); setAddressCopy("");
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
      const nextAddress = typeof result.payoutAddress === "string" ? result.payoutAddress : "";
      if (editDestination && rail === "bank") setPayoutAddress("");
      else if (payoutExplorer(nextAddress)) setPayoutAddress(nextAddress);
      const left = Math.max(0, view.forwardsLeft - result.recipients.length);
      setView({ ...view, rail: editDestination ? rail : view.rail, forwardsLeft: left, canForward: view.canForward && left > 0 });
      setEditDestination(false); setWallet("");
      setRecipients([{ label: "", handle: "" }]);
    } catch (e) { setError(e instanceof Error ? e.message : "The request could not be confirmed. Refresh before retrying."); }
    finally { inFlight.current = false; setBusy(false); }
  }

  return <main className={styles.page}>
    <a className={styles.brand} href="/" referrerPolicy="no-referrer">SIX HOPS</a>
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
      {view.depth > 0 && view.bounty.status === "open" && (
        <div className={styles.claim}>
          <a className={styles.claimButton} href={`/claim/${encodeURIComponent(token)}`} referrerPolicy="no-referrer">This is me</a>
          <p className={styles.muted}>Only if the card describes you. Otherwise pass it on.</p>
        </div>
      )}
      {view.depth === 0 && view.bounty.status === "found" && (
        <section className={styles.card} aria-label="Pending claim confirmation">
          <h2>Someone claims to be the match</h2>
          <p>Read their introduction. Accepting pays the chain; rejecting reopens the search. You never see who forwarded.</p>
          {view.pendingClaim?.introMessage
            ? <blockquote className={styles.muted} style={{ whiteSpace: "pre-wrap" }}>{view.pendingClaim.introMessage}</blockquote>
            : <p className={styles.muted}>Introduction is unavailable; you can still accept or reject.</p>}
          <label htmlFor="poster-token">Private poster token</label>
          <input
            id="poster-token"
            autoComplete="off"
            spellCheck={false}
            value={posterToken}
            onChange={(e) => setPosterToken(e.target.value)}
            placeholder="From the create-search confirmation screen"
            disabled={confirmBusy}
          />
          <p className={styles.muted}>Saved in this browser after create when possible. Keep it private.</p>
          <button type="button" disabled={confirmBusy} onClick={() => void confirmClaim(true)}>
            {confirmBusy ? "Working…" : "Accept and pay"}
          </button>
          <button type="button" disabled={confirmBusy} onClick={() => void confirmClaim(false)} className={styles.secondary}>
            Reject claim
          </button>
        </section>
      )}
      {confirmNote && <p role="status">{confirmNote}</p>}
      {view.bounty.status === "paid" && (
        <section id="payout" className={`${styles.card} ${styles.paid}`} aria-label="Payout" aria-live="polite">
          <p className={styles.eyebrow}>Found and paid</p>
          <h2>{money(view.bounty.bountyCents)} sent to the route that worked.</h2>
          <p>{view.depth === 0 ? "You accepted the introduction, and the chain was paid in one Solana devnet transaction." : "The poster accepted the introduction, and everyone on the successful route was paid in one Solana devnet transaction."}</p>
          {explorer && <a className={styles.cta} href={explorer} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">View the payout on Solana Explorer ↗</a>}
        </section>
      )}
      {view.bounty.status === "found" && view.depth > 0 && <p className={styles.muted}>Someone has claimed this search. The poster is reading their introduction.</p>}
      {view.bounty.status === "cancelled" && <p className={styles.muted}>This search was stopped by the organizers.</p>}
      {view.canForward && <>
        <h2>{view.forwardsLeft} forwards remaining</h2>
        <p>Choose someone closer to these clues. Share each personal link only with its intended recipient.</p>
      </>}
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
        {view.depth > 0 && <fieldset disabled={busy}><legend>Your reward destination</legend>
          <p>Current option: {view.rail === "wallet" ? "your saved Solana wallet" : view.rail === "bank" ? "demo bank account" : "demo wallet managed for you"}.</p>
          <button type="button" aria-expanded={editDestination} onClick={() => { setEditDestination((editing) => !editing); setRail(editDestination ? view.rail : "wallet"); setWallet(""); }}>{editDestination ? "Keep saved destination" : "Use my own Solana wallet"}</button>
          {editDestination && <>
          <label htmlFor="rail">Payment option</label>
          <select id="rail" value={rail} onChange={(e) => setRail(e.target.value as Rail)}><option value="custodial">Demo wallet managed for me</option><option value="wallet">My Solana wallet</option><option value="bank">Demo bank account</option></select>
          {rail === "wallet" && <><label htmlFor="wallet">Solana public address</label><input id="wallet" required minLength={32} maxLength={44} pattern="[1-9A-HJ-NP-Za-km-z]{32,44}" autoComplete="off" spellCheck={false} value={wallet} onChange={(e) => setWallet(e.target.value)} /><p className={styles.muted}>Enter a public address only.</p></>}
          </>}
        </fieldset>}
        <button disabled={busy} type="submit">{busy ? "Creating personal links…" : "Pass it on"}</button>
      </form> : view.bounty.status === "open" && <p>This link cannot forward further. It is at its last hop or out of forwards.</p>}
      {payoutAddress && <section className={styles.card} aria-label="Payout address">
        <p role="status">Your share is paid to this address.</p>
        <p className={styles.address}>{payoutAddress}</p>
        <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(payoutAddress); setAddressCopy("Copied the payout address."); } catch { setAddressCopy("Select the address above and copy it manually."); } }}>Copy address</button>
        {payoutExplorer(payoutAddress) && <a className={styles.addressLink} href={payoutExplorer(payoutAddress)} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">View on Solana Explorer</a>}
        {addressCopy && <p role="status">{addressCopy}</p>}
      </section>}
      {sent.length > 0 && <section className={styles.card} aria-label="Created recipient links"><h2>Your personal links</h2><p role="status">{sent.length} recipient links created.</p>{sent.map((r) => <div key={r.link}><h3>{r.label}</h3><p>{r.delivered === "imessage" ? "Delivered by iMessage" : "Link ready — share it with this recipient"}</p><input aria-label={`Personal link for ${r.label}`} readOnly value={r.link} onFocus={(e) => e.currentTarget.select()} /><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(r.link); setCopyStatus(`Copied the link for ${r.label}.`); } catch { setCopyStatus("Select the link above and copy it manually."); } }}>Copy link</button></div>)}<p role="status">{copyStatus}</p></section>}
      <nav className={styles.actions} aria-label="Other ways to participate"><a href={`/talk/${encodeURIComponent(token)}`} referrerPolicy="no-referrer">Talk instead</a></nav>
    </>}
  </main>;
}
