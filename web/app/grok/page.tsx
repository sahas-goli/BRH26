"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "../post/pages.module.css";

const DEMO_HREF = "https://sash.select/h/demo-hop";

export default function GrokPage() {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const imageUrlRef = useRef("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const description = String(new FormData(event.currentTarget).get("description") ?? "").trim();
    if (!description) {
      setError("Describe who you are looking for.");
      setSubmitted(true);
      return;
    }
    busy.current = true;
    setPending(true);
    setError("");
    setSubmitted(true);
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
          const data = await response.json() as { error?: unknown };
          if (typeof data.error === "string" && data.error) message = data.error;
        } catch { /* use default */ }
        setError(message);
        return;
      }
      const url = URL.createObjectURL(await response.blob());
      imageUrlRef.current = url;
      setImageUrl(url);
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
          <a href="/grok">Grok</a>
        </nav>
        <h1 className={styles.title}>Grok portrait</h1>
        <form onSubmit={submit}>
          <label className={styles.field}>
            Who are you looking for?
            <textarea name="description" rows={4} disabled={pending} required />
          </label>
          <button className={styles.button} type="submit" disabled={pending}>
            {pending ? "Generating…" : "Generate"}
          </button>
        </form>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        {imageUrl ? (
          <img className={styles.preview} src={imageUrl} alt="Illustrated portrait of the kind of person described" />
        ) : null}
        {submitted ? (
          <p className={styles.muted}>
            <a href={DEMO_HREF}>demo link</a>
          </p>
        ) : null}
      </div>
    </main>
  );
}
