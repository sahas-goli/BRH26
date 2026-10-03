import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Sweep = {
  note?: string;
  source?: string;
  by_attrition: { attrition: number; success_rate: number; trials: number }[];
  by_fanout: { fanout: number; success_rate: number; trials: number }[];
};

function loadSweep(): Sweep {
  const candidates = [
    join(process.cwd(), "public", "sim", "sweep.json"),
    join(process.cwd(), "..", "sim", "out", "sweep.json"),
    join(process.cwd(), "sim", "out", "sweep.json"),
  ];
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    return JSON.parse(readFileSync(path, "utf8")) as Sweep;
  }
  throw new Error("sweep_missing");
}

export async function GET(): Promise<Response> {
  try {
    const sweep = loadSweep();
    if (!Array.isArray(sweep.by_attrition) || !Array.isArray(sweep.by_fanout)) {
      return Response.json({ error: "invalid_sweep" }, { status: 500 });
    }
    return Response.json(sweep, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  } catch {
    return Response.json({ error: "sweep_unavailable" }, { status: 404 });
  }
}
