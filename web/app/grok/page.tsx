"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "../post/pages.module.css";

const DEMO_HREF = "https://sash.select/h/demo-hop";
const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export default function GrokPage() {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [rewardCents, setRewardCents] = useState<number | null>(null);
  const [hours, setHours] = useState<number | null>(null);
  const imageUrlRef = useRef("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    const description = String(data.get("description") ?? "").trim();
    if (!description) {
      setError("Describe who you are looking for.");
      return;
    }
    const capCents = Math.round(Number(data.get("cap")) * 100);
    if (!Number.isSafeInteger(capCents) || capCents < 1000) {
      setError("Set a reward cap of at least $10.");
      return;
    }
    const searchHours = Number(data.get("hours"));
    if (!Number.isFinite(searchHours) || searchHours < 1 || searchHours > 8760) {
      setError("Set a search duration between 1 and 8760 hours.");
      return;
    }
    busy.current = true;
    setPending(true);
    setError("");
    setRewardCents(null);
    setHours(null);
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = "";
      setImageUrl("");
    }
    try {
      const response = await fetch("/api/grok/imagine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!response.ok) {
        let message = "Could not generate the portrait.";
        try {
          const body = await response.json() as { error?: unknown };
          if (typeof body.error === "string" && body.error) message = body.error;
        } catch { /* use default */ }
        setError(message);
        return;
      }
      const url = URL.createObjectURL(await response.blob());
      imageUrlRef.current = url;
      setImageUrl(url);
      setRewardCents(Math.round(capCents * 0.6));
      setHours(searchHours);
    } catch {
      setError("Could not generate the portrait.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <main className={styles.shell}>
      <div className={styles.content}>
        <nav className={styles.nav} aria-label="Main navigation">
          <a href="/">SIX HOPS</a>
          <a href="/live">Live searches ↗</a>
        </nav>
        <p className={styles.eyebrow}>Start a search</p>
        <h1 className={styles.title}>
          Who do you need
          <br />
          to connect with?
        </h1>
        <p className={styles.intro}>
          Describe the person in plain language. We strip names and street addresses before anyone else sees it.
        </p>
        <form onSubmit={submit} className={styles.card} aria-busy={pending}>
          <h2>Describe who you need</h2>
          <p className={styles.muted}>
            Grok Imagine draws an illustrated portrait from your description — flat color, not a photograph, no name.
          </p>
          <label className={styles.field}>
            Free-text request
            <textarea
              name="description"
              maxLength={4000}
              placeholder="Someone who has worked on a launch team near Starbase, maybe bilingual in Amharic…"
              disabled={pending}
              required
            />
          </label>
          <h2>Reward and deadline</h2>
          <div className={styles.row}>
            <label className={styles.field}>
              Maximum reward (USD)
              <input
                name="cap"
                type="number"
                min="10"
                max="21474836.47"
                step="0.01"
                defaultValue="20"
                required
                disabled={pending}
              />
            </label>
            <label className={styles.field}>
              Search duration (hours)
              <input
                name="hours"
                type="number"
                min="1"
                max="8760"
                step="1"
                defaultValue="24"
                required
                disabled={pending}
              />
            </label>
          </div>
          <p className={styles.muted}>
            The initial offer is 60% of your cap; the remaining 40% is held in reserve. This demo uses test or simulated money.
          </p>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={pending}>
              {pending ? "Creating your search…" : "Create search →"}
            </button>
          </div>
        </form>
        {imageUrl && rewardCents !== null && hours !== null ? (
          <section className={styles.card} aria-label="Search preview" aria-live="polite">
            <p className={styles.eyebrow}>Your search is ready</p>
            <p className={styles.amount}>{money(rewardCents)}</p>
            <p className={styles.muted}>
              Current reward shared by the successful chain · open · {hours} hour search window (demo)
            </p>
            <img
              src={imageUrl}
              alt="Illustrated portrait of the kind of person described"
              style={{ width: "100%", height: "auto", borderRadius: 12, marginTop: 16 }}
            />
            <div className={styles.actions}>
              <a className={styles.button} href={DEMO_HREF} referrerPolicy="no-referrer">
                Demo hop link →
              </a>
            </div>
            <p className={styles.muted}>
              Demo hop link:{" "}
              <a href={DEMO_HREF} referrerPolicy="no-referrer">
                {DEMO_HREF}
              </a>
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
