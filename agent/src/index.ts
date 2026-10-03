/**
 * Six Hops Photon/Spectrum agent — S1-01 echo + /send stub.
 *
 * Env:
 *   SPECTRUM_PROJECT_ID / SPECTRUM_PROJECT_SECRET (or PROJECT_ID / PROJECT_SECRET)
 *   INTERNAL_SECRET — shared with web for POST /send
 *   AGENT_PORT — default 8787
 *   PHOTON_ENABLED=true — attach iMessage provider
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Spectrum } from "spectrum-ts";
import { imessage } from "spectrum-ts/providers/imessage";
import { terminal } from "spectrum-ts/providers/terminal";

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
      json(res, 200, { ok: true, photon: PHOTON });
      return;
    }
    if (req.method === "POST" && (req.url === "/send" || req.url === "/send/")) {
      if (!INTERNAL || req.headers["x-six-hops-secret"] !== INTERNAL) {
        json(res, 401, { error: "unauthorized" });
        return;
      }
      let payload: { handle?: unknown; text?: unknown };
      try {
        payload = JSON.parse(await readBody(req)) as { handle?: unknown; text?: unknown };
      } catch {
        json(res, 400, { error: "invalid_json" });
        return;
      }
      if (typeof payload.handle !== "string" || typeof payload.text !== "string") {
        json(res, 400, { error: "invalid_input" });
        return;
      }
      console.log(`[send] handle=${payload.handle.slice(0, 4)}… textLen=${payload.text.length}`);
      json(res, 200, { ok: true });
      return;
    }
    json(res, 404, { error: "not_found" });
  });
  server.listen(PORT, () => {
    console.log(`[agent] POST /send on :${PORT}`);
  });
}

function contentType(content: { type: string }): string {
  return content.type;
}

async function main(): Promise<void> {
  startSendServer();

  const projectId = process.env.SPECTRUM_PROJECT_ID?.trim() || process.env.PROJECT_ID?.trim();
  const projectSecret = process.env.SPECTRUM_PROJECT_SECRET?.trim() || process.env.PROJECT_SECRET?.trim();

  const app = PHOTON && projectId && projectSecret
    ? await Spectrum({
        projectId,
        projectSecret,
        providers: [imessage.config()],
      })
    : await Spectrum({
        providers: [terminal.config()],
      });

  if (PHOTON && projectId && projectSecret) {
    console.log("[agent] iMessage provider enabled");
  } else {
    console.log("[agent] terminal provider only — set PHOTON_ENABLED=true + Spectrum credentials for go/no-go A");
  }

  console.log("[agent] listening for Spectrum messages (echo)");
  for await (const [space, message] of app.messages) {
    const started = Date.now();
    try {
      const kind = contentType(message.content);
      if (kind === "reaction") {
        await space.send("Got your tapback. (Six Hops echo — S1-01)");
        console.log(`[echo] reaction replied in ${Date.now() - started}ms`);
        continue;
      }
      if (kind === "text" && "text" in message.content && typeof message.content.text === "string") {
        const text = message.content.text.trim();
        const preview = text.length > 80 ? `${text.slice(0, 80)}…` : text;
        console.log(`[inbound] ${message.platform} ${message.sender?.id ?? "?"}: ${preview}`);
        await space.send(`Six Hops echo: ${text.slice(0, 200)}`);
        console.log(`[echo] text replied in ${Date.now() - started}ms`);
        continue;
      }
      console.log(`[inbound] non-text type=${kind}`);
      await space.send("Six Hops received a non-text message (logged for VERIFY A).");
    } catch (error) {
      console.error("[echo] reply failed", error instanceof Error ? error.message : "unknown");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
