/**
 * Six Hops Photon agent — S1-05 flows.
 *
 * Env: SPECTRUM_PROJECT_ID, SPECTRUM_PROJECT_SECRET, PHOTON_ENABLED,
 *      INTERNAL_SECRET, PUBLIC_BASE_URL, AGENT_PORT
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Spectrum } from "spectrum-ts";
import { imessage } from "spectrum-ts/providers/imessage";
import { terminal } from "spectrum-ts/providers/terminal";
import { handleInboundText, handleReaction } from "./flows.js";
import { deliverToHandle, rememberSpace, resetSessions } from "./session.js";
import { lifecycleText, startTickLoop } from "./tick.js";

const PORT = Number(process.env.AGENT_PORT ?? 8787);
const INTERNAL = process.env.INTERNAL_SECRET?.trim() ?? "";
const PHOTON = process.env.PHOTON_ENABLED === "true";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function startSendServer(): void {
  const server = createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      json(res, 200, { ok: true, photon: PHOTON, flows: "S1-05" });
      return;
    }
    if (req.method === "POST" && (req.url === "/send" || req.url === "/send/")) {
      if (!INTERNAL || req.headers["x-six-hops-secret"] !== INTERNAL) {
        json(res, 401, { error: "unauthorized" });
        return;
      }
      let payload: { handle?: unknown; text?: unknown; kind?: unknown; cents?: unknown; explorerUrl?: unknown };
      try {
        payload = JSON.parse(await readBody(req)) as typeof payload;
      } catch {
        json(res, 400, { error: "invalid_json" });
        return;
      }
      if (typeof payload.handle !== "string") {
        json(res, 400, { error: "invalid_input" });
        return;
      }
      let text: string;
      if (typeof payload.text === "string") {
        text = payload.text;
      } else if (payload.kind === "found" || payload.kind === "paid" || payload.kind === "nudge") {
        text = lifecycleText(
          payload.kind,
          typeof payload.cents === "number" ? payload.cents : undefined,
          typeof payload.explorerUrl === "string" ? payload.explorerUrl : undefined,
        );
      } else {
        json(res, 400, { error: "invalid_input" });
        return;
      }
      const status = await deliverToHandle(payload.handle, text);
      json(res, 200, { ok: true, delivery: status });
      return;
    }
    if (req.method === "POST" && (req.url === "/reset" || req.url === "/reset/")) {
      if (!INTERNAL || req.headers["x-six-hops-secret"] !== INTERNAL) {
        json(res, 401, { error: "unauthorized" });
        return;
      }
      json(res, 200, { ok: true, cleared: resetSessions() });
      return;
    }
    json(res, 404, { error: "not_found" });
  });
  server.listen(PORT, () => console.log(`[agent] /send /reset /health on :${PORT}`));
}

async function main(): Promise<void> {
  startSendServer();
  startTickLoop();

  const projectId = process.env.SPECTRUM_PROJECT_ID?.trim() || process.env.PROJECT_ID?.trim();
  const projectSecret = process.env.SPECTRUM_PROJECT_SECRET?.trim() || process.env.PROJECT_SECRET?.trim();

  const app = PHOTON && projectId && projectSecret
    ? await Spectrum({ projectId, projectSecret, providers: [imessage.config()] })
    : await Spectrum({ providers: [terminal.config()] });

  console.log(PHOTON && projectId && projectSecret
    ? "[agent] iMessage provider enabled"
    : "[agent] terminal provider — set PHOTON_ENABLED=true + Spectrum credentials for live Photon");

  for await (const [space, message] of app.messages) {
    const handle = message.sender?.id ?? space.id;
    rememberSpace(handle, async (text) => {
      await space.send(text);
    });
    try {
      if (message.content.type === "reaction") {
        await space.send(handleReaction(handle));
        continue;
      }
      if (message.content.type === "text" && "text" in message.content && typeof message.content.text === "string") {
        const reply = await handleInboundText(handle, message.content.text);
        await space.send(reply);
        continue;
      }
      // Contact card / attachment: ask for a typed name (VERIFY A shape logged).
      console.log(`[inbound] type=${message.content.type}`);
      await space.send(handleReaction(handle));
    } catch (error) {
      console.error("[inbound] failed", error instanceof Error ? error.message : "unknown");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
