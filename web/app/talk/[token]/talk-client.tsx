"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  browserWsProtocols,
  floatToPcm16Base64,
  GROK_PCM_RATE,
  pcm16Base64ToFloat,
  runVoiceTool,
  sessionUpdateEvent,
} from "../../../lib/grok";

type Status = "idle" | "connecting" | "live" | "blocked" | "error";

/**
 * Grok Voice talk page (S3-06): mint ephemeral token, stream mic PCM,
 * play assistant audio, and execute get_bounty / forward_to / claim.
 */
export default function TalkClient({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [log, setLog] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [lastForward, setLastForward] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playTimeRef = useRef(0);
  const pendingToolsRef = useRef(0);

  const push = useCallback((line: string) => {
    setLog((rows) => [...rows.slice(-50), line]);
  }, []);

  function cleanupMedia() {
    processorRef.current?.disconnect();
    processorRef.current = null;
    mediaRef.current?.getTracks().forEach((t) => t.stop());
    mediaRef.current = null;
    void audioCtxRef.current?.close();
    audioCtxRef.current = null;
    playTimeRef.current = 0;
  }

  function hangUp() {
    wsRef.current?.close();
    wsRef.current = null;
    cleanupMedia();
    setStatus("idle");
    push("Session ended");
  }

  useEffect(() => () => {
    wsRef.current?.close();
    cleanupMedia();
  }, []);

  function playPcmBase64(base64: string) {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const floats = pcm16Base64ToFloat(base64);
    const buffer = ctx.createBuffer(1, floats.length, GROK_PCM_RATE);
    buffer.copyToChannel(Float32Array.from(floats), 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    const start = Math.max(ctx.currentTime, playTimeRef.current);
    source.start(start);
    playTimeRef.current = start + buffer.duration;
  }

  async function handleToolCall(ws: WebSocket, event: {
    name?: string; call_id?: string; arguments?: string;
  }) {
    const name = event.name ?? "";
    const callId = event.call_id ?? "";
    let args: Record<string, unknown> = {};
    try {
      args = event.arguments ? JSON.parse(event.arguments) as Record<string, unknown> : {};
    } catch {
      args = {};
    }
    push(`tool → ${name}(${JSON.stringify(args)})`);
    pendingToolsRef.current += 1;
    try {
      const result = await runVoiceTool(name, args, token);
      if (name === "forward_to" && result && typeof result === "object" && "recipients" in result) {
        const recipients = (result as { recipients: { label: string; link: string }[] }).recipients;
        const first = recipients[0];
        if (first) setLastForward(`${first.label}: ${first.link}`);
      }
      ws.send(JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: callId,
          output: JSON.stringify(result),
        },
      }));
      push(`tool ← ${name} ok`);
    } catch {
      ws.send(JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: callId,
          output: JSON.stringify({ error: "tool_failed" }),
        },
      }));
      push(`tool ← ${name} failed`);
    } finally {
      pendingToolsRef.current -= 1;
      if (pendingToolsRef.current <= 0) {
        pendingToolsRef.current = 0;
        ws.send(JSON.stringify({ type: "response.create" }));
      }
    }
  }

  async function startMic(ws: WebSocket) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
    });
    mediaRef.current = stream;
    const ctx = new AudioContext({ sampleRate: GROK_PCM_RATE });
    audioCtxRef.current = ctx;
    await ctx.resume();
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;
    processor.onaudioprocess = (ev) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const input = ev.inputBuffer.getChannelData(0);
      // Resample if the browser ignored our preferred rate.
      let samples = input;
      if (ctx.sampleRate !== GROK_PCM_RATE) {
        const ratio = GROK_PCM_RATE / ctx.sampleRate;
        const out = new Float32Array(Math.floor(input.length * ratio));
        for (let i = 0; i < out.length; i++) {
          out[i] = input[Math.min(input.length - 1, Math.floor(i / ratio))]!;
        }
        samples = out;
      }
      ws.send(JSON.stringify({
        type: "input_audio_buffer.append",
        audio: floatToPcm16Base64(samples),
      }));
    };
    const mute = ctx.createGain();
    mute.gain.value = 0;
    source.connect(processor);
    processor.connect(mute);
    mute.connect(ctx.destination);
  }

  async function connect() {
    if (status === "connecting" || status === "live") return;
    setStatus("connecting");
    setLastForward(null);
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
      };
      if (!response.ok || !data.clientSecret || !data.wsUrl) {
        setStatus("blocked");
        push(`BLOCKED: ${data.error ?? response.status} — set GROK_ENABLED=true and XAI_API_KEY`);
        return;
      }
      push(`Token ok · ${data.model ?? "grok-voice"}`);
      const ws = new WebSocket(data.wsUrl, browserWsProtocols(data.clientSecret));
      wsRef.current = ws;
      ws.onopen = async () => {
        ws.send(JSON.stringify(sessionUpdateEvent()));
        push("session.update sent (get_bounty, forward_to, claim)");
        try {
          await startMic(ws);
          setStatus("live");
          push("Mic live — speak in any language");
        } catch {
          setStatus("live");
          push("Mic unavailable — use the text box below");
        }
      };
      ws.onmessage = (event) => {
        let msg: {
          type?: string;
          name?: string;
          call_id?: string;
          arguments?: string;
          delta?: string;
        };
        try {
          msg = JSON.parse(String(event.data)) as typeof msg;
        } catch {
          return;
        }
        if (msg.type === "response.function_call_arguments.done") {
          void handleToolCall(ws, msg);
          return;
        }
        if (
          (msg.type === "response.output_audio.delta" || msg.type === "response.audio.delta")
          && typeof msg.delta === "string"
        ) {
          playPcmBase64(msg.delta);
          return;
        }
        if (msg.type === "error") {
          push(`server error: ${JSON.stringify(msg)}`);
          setStatus("error");
        }
      };
      ws.onerror = () => {
        push("WebSocket error");
        setStatus("error");
      };
      ws.onclose = () => {
        cleanupMedia();
        wsRef.current = null;
        if (status !== "blocked") setStatus("idle");
        push("WebSocket closed");
      };
    } catch {
      setStatus("error");
      push("Failed to reach /api/grok/token");
    }
  }

  function sendText() {
    const ws = wsRef.current;
    const line = text.trim();
    if (!ws || ws.readyState !== WebSocket.OPEN || !line) return;
    ws.send(JSON.stringify({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: line }],
      },
    }));
    ws.send(JSON.stringify({ type: "response.create" }));
    push(`you: ${line}`);
    setText("");
  }

  return (
    <main style={{ fontFamily: "Georgia, serif", padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <p style={{ letterSpacing: "0.12em", fontSize: 12, fontWeight: 700 }}>
        <a href={`/h/${encodeURIComponent(token)}`} referrerPolicy="no-referrer">← Hint card</a>
        {" · SIX HOPS · TALK"}
      </p>
      <h1>Talk instead</h1>
      <p>
        Speak (or type) in any language. Grok reads the hint card and can forward or claim through tools.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "16px 0" }}>
        {status !== "live" && status !== "connecting" ? (
          <button type="button" onClick={() => void connect()}>
            Start voice session
          </button>
        ) : (
          <button type="button" onClick={hangUp} disabled={status === "connecting"}>
            Hang up
          </button>
        )}
        <span role="status" style={{ alignSelf: "center" }}>{status}</span>
      </div>
      {status === "blocked" && (
        <p role="alert">
          Voice is unavailable until <code>GROK_ENABLED=true</code> and <code>XAI_API_KEY</code> are set.
          Use the hint card form to forward without voice.
        </p>
      )}
      {status === "live" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendText(); }}
            placeholder="Or type: forward this to Ada"
            style={{ flex: 1, padding: 8 }}
          />
          <button type="button" onClick={sendText}>Send</button>
        </div>
      )}
      {lastForward && (
        <p role="status" style={{ background: "#f0f4f1", padding: 12 }}>
          Forward created — {lastForward}
        </p>
      )}
      <ol style={{ fontSize: 13, lineHeight: 1.5, paddingLeft: 20, color: "#333" }}>
        {log.map((line, i) => <li key={`${i}-${line.slice(0, 12)}`}>{line}</li>)}
      </ol>
    </main>
  );
}
