import { foundMessage, paidMessage } from "./flows.js";
import { deliverToHandle } from "./session.js";
import { controllerTick } from "./web.js";

const INTERVAL_MS = 30_000;

export function startTickLoop(): void {
  const secret = process.env.INTERNAL_SECRET?.trim();
  if (!secret) {
    console.warn("[tick] INTERNAL_SECRET unset — tick loop idle");
    return;
  }
  console.log(`[tick] every ${INTERVAL_MS / 1000}s → POST /api/controller/tick`);
  const run = async () => {
    try {
      const actions = await controllerTick();
      for (const action of actions) {
        if (action.kind === "nudged" || action.nudge?.length) {
          for (const nudge of action.nudge ?? []) {
            if (!nudge.handle || !nudge.text) continue;
            const status = await deliverToHandle(nudge.handle, nudge.text);
            console.log(`[tick] nudge ${status} bounty=${action.bountyId}`);
          }
        }
        // found/paid fanout would need holder handles from web; S1-05 delivers
        // controller nudges. Explicit found/paid texts are available for /send.
        if (action.kind === "refunded") {
          console.log(`[tick] refunded bounty=${action.bountyId}`);
        }
      }
    } catch (error) {
      console.warn("[tick] failed", error instanceof Error ? error.message : "unknown");
    }
  };
  void run();
  setInterval(() => void run(), INTERVAL_MS);
}

/** Helpers for outbound lifecycle messages triggered via POST /send kinds. */
export function lifecycleText(kind: "nudge" | "found" | "paid", cents?: number, explorerUrl?: string): string {
  if (kind === "found") return foundMessage();
  if (kind === "paid") return paidMessage(cents ?? 0, explorerUrl);
  return "This search is stalling. Pass it to someone closer if you can.";
}
