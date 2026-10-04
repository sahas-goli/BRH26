"use client";

import { useState, type FormEvent } from "react";
import styles from "../post/pages.module.css";

const errors: Record<string, string> = {
  invalid_phone: "Enter the phone number your iMessage uses, like (607) 555-0123.",
  photon_full: "Photon couldn't assign a line right now. Try again in a minute, or start a search on the website.",
  photon_unavailable: "Photon is unavailable right now. You can still start a search on the website.",
};

function display(line: string): string {
  const us = line.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  return us ? `(${us[1]}) ${us[2]}-${us[3]}` : line;
}

export default function TextPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [line, setLine] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError("");
    try {
      const response = await fetch("/api/photon/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: new FormData(event.currentTarget).get("phone") }),
      });
      const data = await response.json() as { line?: string; error?: string };
      if (!response.ok || !data.line) throw new Error(errors[data.error ?? ""] ?? errors.photon_unavailable);
      setLine(data.line);
    } catch (e) {
      setError(e instanceof Error ? e.message : errors.photon_unavailable);
    } finally {
      setPending(false);
    }
  }

  return <main className={styles.shell}><div className={styles.content}>
    <nav className={styles.nav} aria-label="Main navigation"><a href="/">SIX HOPS</a><a href="/live">Watch the search ↗</a></nav>
    <p className={styles.eyebrow}>Six Hops on iMessage</p>
    <h1 className={styles.title}>Post a search by text.</h1>
    {line ? <section className={styles.card} aria-live="polite">
      <p className={styles.eyebrow}>Your Photon line</p>
      <p className={styles.amount}>{display(line)}</p>
      <p className={styles.intro}>Text <strong>new search</strong> to this number. Photon asks who you are looking for and how long to search, then gives you a wallet to fund the reward.</p>
      <div className={styles.actions}><a className={styles.button} href={`sms:${line}&body=new%20search`}>Open Messages</a></div>
      <p className={styles.muted}>Got a personal link from a friend? Paste it to this number to pass it on by text.</p>
    </section> : <>
      <p className={styles.intro}>Enter the number your iMessage uses. We register it with Photon and show you the line to text.</p>
      <form onSubmit={submit}>
        <label className={styles.field}>Phone number
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="(607) 555-0123" disabled={pending} />
        </label>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <button className={styles.button} type="submit" disabled={pending}>{pending ? "Getting your line…" : "Get my Photon line"}</button>
      </form>
      <p className={styles.muted}>Your number is used only to route iMessages from Photon.</p>
    </>}
  </div></main>;
}
