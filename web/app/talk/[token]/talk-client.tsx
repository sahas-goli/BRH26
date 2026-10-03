"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Minimal voice probe for S3-06a: mint ephemeral token, open realtime WS,
 * send session.update with one client tool (get_bounty). Full UX is S3-06.
 */
export default function TalkClient({ token }: { token: string }) {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const push = useCallback((line: string) => {
    setLog((rows) => [...rows.slice(-40), line]);
  }, []);

  async function connect() {
    if (busy) return;
    setBusy(true);
    push("Requesting ephemeral token…");
    try {
      const response = await fetch("/api/grok/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json() as {
        error?: string;
        clientSecret?: string;
        wsUrl?: string;
        model?: string;
        expiresAt?: string;
      };
      if (!response.ok || !data.clientSecret || !data.wsUrl) {
        push(`BLOCKED: ${data.error ?? response.status} — set GROK_ENABLED=true and XAI_API_KEY`);
        return;
      }
      push(`Token ok (expires ${data.expiresAt ?? "?"}, model ${data.model ?? "?"})`);
      const ws = new WebSocket(data.wsUrl, [`xai-client-secret.${data.clientSecret}`]);
      wsRef.current = ws;
      ws.onopen = () => {
        push("WebSocket open — sending session.update with get_bounty tool");
        ws.send(JSON.stringify({
          type: "session.update",
          session: {
            instructions: "Read the hint card; help pick who to forward to. Use get_bounty when asked.",
            turn_detection: { type: "server_vad" },
            tools: [{
              type: "function",
              name: "get_bounty",
              description: "Load the public hint card for this holder token",
              parameters: { type: "object", properties: {}, additionalProperties: false },
            }],
          },
        }));
      };
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(String(event.data)) as { type?: string };
          push(`← ${msg.type ?? "event"}`);
        } catch {
          push("← (non-JSON frame)");
        }
      };
      ws.onerror = () => push("WebSocket error");
      ws.onclose = () => push("WebSocket closed");
    } catch {
      push("Failed to reach /api/grok/token");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ fontFamily: "Georgia, serif", padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <p style={{ letterSpacing: "0.12em", fontSize: 12, fontWeight: 700 }}>SIX HOPS · TALK</p>
      <h1>Voice probe</h1>
      <p>S3-06a: mint an ephemeral Grok Voice token and open one realtime session with a client tool.</p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void connect()}
        style={{
          marginTop: 16, padding: "12px 18px", border: 0, borderRadius: 10,
          background: "#184d3b", color: "white", fontWeight: 700, cursor: "pointer",
        }}
      >
        {busy ? "Connecting…" : "Connect voice session"}
      </button>
      <pre style={{ marginTop: 24, padding: 16, background: "#f4f1ea", borderRadius: 12, whiteSpace: "pre-wrap" }}>
        {log.join("\n") || "Log appears here."}
      </pre>
      <p style={{ color: "#526453", fontSize: 14 }}>
        Full talk UX (mic PCM, forward/claim tools) is S3-06. Never paste XAI_API_KEY in the browser.
      </p>
    </main>
  );
}
