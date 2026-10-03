#!/usr/bin/env node
/**
 * Apply db/schema.sql and db/caggs.sql to DATABASE_URL.
 * Tries Tiger/PLAN syntax first, then the VERIFY (E) fallbacks from PLAN.md 4.2.
 *
 * Usage:
 *   DATABASE_URL=... node db/apply.mjs
 *   node db/apply.mjs --dry-run   # parse/extract only; no DB (CI / go-no-go prep)
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(join(dirname(fileURLToPath(import.meta.url)), "../web/package.json"));
const pg = require("pg");

const root = dirname(fileURLToPath(import.meta.url));
const report = { applied: [], fallbacks: [], errors: [], relations: [] };
const dryRun = process.argv.includes("--dry-run");

function requireUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  return url;
}

/** SSL for Tiger matches web/lib/db.ts and PLAN.md 7.1. */
function pgSslOption(url) {
  if (url.includes("localhost") || url.includes("127.0.0.1")) return undefined;
  return { rejectUnauthorized: false };
}

async function exec(client, sql, label) {
  await client.query(sql);
  report.applied.push(label);
}

async function tryExec(client, sql, label) {
  try {
    await exec(client, sql, label);
    return true;
  } catch (error) {
    report.errors.push({ label, message: String(error.message || error) });
    return false;
  }
}

function relationsSql() {
  const sql = readFileSync(join(root, "schema.sql"), "utf8")
    .replace(
      /CREATE TABLE IF NOT EXISTS events \([\s\S]*?\) WITH \(tsdb\.hypertable, tsdb\.segmentby = 'bounty_id', tsdb\.orderby = 'time DESC'\);/,
      "",
    )
    .replace(/-- VERIFY \(E\):.*$/gm, "")
    .trim();
  if (!/CREATE TABLE IF NOT EXISTS bounties/i.test(sql)) {
    throw new Error("schema.relations missing bounties");
  }
  if (!/CREATE TABLE IF NOT EXISTS holders/i.test(sql)) {
    throw new Error("schema.relations missing holders");
  }
  if (/WITH \(tsdb\.hypertable/i.test(sql)) {
    throw new Error("schema.relations still contains events hypertable DDL");
  }
  return sql;
}

function dryRunPlan() {
  const relations = relationsSql();
  return {
    mode: "dry-run",
    relationsChars: relations.length,
    hasBounties: /bounties/i.test(relations),
    hasHolders: /holders/i.test(relations),
    hasPayouts: /payouts/i.test(relations),
    sslRemote: pgSslOption("postgres://x@example.tsdb.cloud.timescale.com/tsdb"),
    eventsStrategies: ["schema.events.tsdb", "schema.events.plain+hypertable"],
    caggStrategies: ["bounty_minute.toolkit|plain", "bounty_hour.rollup|plain", "columnstore|compress"],
    nextHumanStep:
      "Create Tiger Cloud service, set DATABASE_URL, run `node db/apply.mjs`, paste apply-report.json fallbacks into PLAN.md 4.2 if any.",
  };
}

const eventsTiger = `
CREATE TABLE IF NOT EXISTS events (
  time       TIMESTAMPTZ NOT NULL,
  bounty_id  TEXT NOT NULL,
  holder_id  TEXT,
  parent_id  TEXT,
  depth      INT,
  kind       TEXT NOT NULL,
  latency_s  DOUBLE PRECISION,
  source     TEXT NOT NULL DEFAULT 'live',
  detail     JSONB
) WITH (tsdb.hypertable, tsdb.segmentby = 'bounty_id', tsdb.orderby = 'time DESC');
`;

const eventsPlain = `
CREATE TABLE IF NOT EXISTS events (
  time       TIMESTAMPTZ NOT NULL,
  bounty_id  TEXT NOT NULL,
  holder_id  TEXT,
  parent_id  TEXT,
  depth      INT,
  kind       TEXT NOT NULL,
  latency_s  DOUBLE PRECISION,
  source     TEXT NOT NULL DEFAULT 'live',
  detail     JSONB
);
`;

async function applySchema(client) {
  await exec(client, relationsSql(), "schema.relations");
  if (await tryExec(client, eventsTiger, "schema.events.tsdb")) return;
  report.fallbacks.push("events: CREATE TABLE plain + create_hypertable");
  await exec(client, eventsPlain, "schema.events.plain");
  if (
    !(await tryExec(
      client,
      "SELECT create_hypertable('events', by_range('time'), if_not_exists => TRUE);",
      "schema.events.hypertable_by_range",
    ))
  ) {
    await exec(
      client,
      "SELECT create_hypertable('events', 'time', if_not_exists => TRUE);",
      "schema.events.hypertable_legacy",
    );
  }
}

async function applyCaggs(client) {
  const withToolkit = `
CREATE MATERIALIZED VIEW IF NOT EXISTS bounty_minute
WITH (timescaledb.continuous, timescaledb.materialized_only = false) AS
SELECT bounty_id,
       time_bucket('1 minute', time) AS bucket,
       count(*) FILTER (WHERE kind = 'received')  AS received,
       count(*) FILTER (WHERE kind = 'forwarded') AS forwarded,
       count(*) FILTER (WHERE kind = 'opened')    AS opened,
       max(depth)                                 AS max_depth,
       percentile_agg(latency_s) FILTER (WHERE kind = 'forwarded') AS latency
FROM events
GROUP BY bounty_id, bucket;
`;
  const withoutToolkit = `
CREATE MATERIALIZED VIEW IF NOT EXISTS bounty_minute
WITH (timescaledb.continuous, timescaledb.materialized_only = false) AS
SELECT bounty_id,
       time_bucket('1 minute', time) AS bucket,
       count(*) FILTER (WHERE kind = 'received')  AS received,
       count(*) FILTER (WHERE kind = 'forwarded') AS forwarded,
       count(*) FILTER (WHERE kind = 'opened')    AS opened,
       max(depth)                                 AS max_depth
FROM events
GROUP BY bounty_id, bucket;
`;

  if (!(await tryExec(client, withToolkit, "cagg.bounty_minute.toolkit"))) {
    report.fallbacks.push("bounty_minute: dropped percentile_agg (toolkit missing)");
    await exec(client, withoutToolkit, "cagg.bounty_minute.plain");
  }

  await tryExec(
    client,
    `SELECT add_continuous_aggregate_policy('bounty_minute',
      start_offset => INTERVAL '3 hours', end_offset => INTERVAL '1 minute',
      schedule_interval => INTERVAL '1 minute');`,
    "cagg.bounty_minute.policy",
  );

  const hourWithRollup = `
CREATE MATERIALIZED VIEW IF NOT EXISTS bounty_hour
WITH (timescaledb.continuous, timescaledb.materialized_only = false) AS
SELECT bounty_id, time_bucket('1 hour', bucket) AS bucket,
       sum(received) AS received, sum(forwarded) AS forwarded, max(max_depth) AS max_depth,
       rollup(latency) AS latency
FROM bounty_minute GROUP BY 1, 2;
`;
  const hourPlain = `
CREATE MATERIALIZED VIEW IF NOT EXISTS bounty_hour
WITH (timescaledb.continuous, timescaledb.materialized_only = false) AS
SELECT bounty_id, time_bucket('1 hour', bucket) AS bucket,
       sum(received) AS received, sum(forwarded) AS forwarded, max(max_depth) AS max_depth
FROM bounty_minute GROUP BY 1, 2;
`;

  if (!(await tryExec(client, hourWithRollup, "cagg.bounty_hour.rollup"))) {
    report.fallbacks.push("bounty_hour: dropped rollup(latency)");
    await exec(client, hourPlain, "cagg.bounty_hour.plain");
  }

  await tryExec(
    client,
    `SELECT add_continuous_aggregate_policy('bounty_hour',
      start_offset => INTERVAL '3 days', end_offset => INTERVAL '1 hour',
      schedule_interval => INTERVAL '5 minutes');`,
    "cagg.bounty_hour.policy",
  );

  if (!(await tryExec(client, "CALL add_columnstore_policy('events', after => INTERVAL '1 day');", "cagg.columnstore"))) {
    report.fallbacks.push("compression: timescaledb.compress + add_compression_policy");
    await tryExec(client, "ALTER TABLE events SET (timescaledb.compress);", "cagg.compress_flag");
    await tryExec(
      client,
      "SELECT add_compression_policy('events', INTERVAL '1 day');",
      "cagg.compress_policy",
    );
  }
}

async function smoke(client) {
  const { rows } = await client.query(`
    SELECT 'bounties' AS rel WHERE to_regclass('public.bounties') IS NOT NULL
    UNION ALL
    SELECT 'holders' WHERE to_regclass('public.holders') IS NOT NULL
    UNION ALL
    SELECT 'payouts' WHERE to_regclass('public.payouts') IS NOT NULL
    UNION ALL
    SELECT 'events' WHERE to_regclass('public.events') IS NOT NULL
    UNION ALL
    SELECT 'bounty_minute' WHERE to_regclass('public.bounty_minute') IS NOT NULL
  `);
  report.relations = rows.map((row) => row.rel);
  const started = Date.now();
  await client.query(`
    INSERT INTO events (time, bounty_id, holder_id, parent_id, depth, kind, latency_s, source, detail)
    SELECT now() - ((1000 - g) || ' seconds')::interval,
           'b_smoke', NULL, NULL, 1, 'received', NULL, 'replay', '{}'::jsonb
    FROM generate_series(1, 1000) AS g
  `);
  report.applied.push(`smoke.insert_1000_${Date.now() - started}ms`);
}

async function main() {
  if (dryRun) {
    console.log(JSON.stringify(dryRunPlan(), null, 2));
    return;
  }
  const url = requireUrl();
  const client = new pg.Client({
    connectionString: url,
    ssl: pgSslOption(url),
  });
  await client.connect();
  try {
    await applySchema(client);
    await applyCaggs(client);
    await smoke(client);
  } finally {
    await client.end();
  }
  const out = join(root, "apply-report.json");
  writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  if (!report.relations.includes("bounties") || !report.relations.includes("events")) {
    process.exit(2);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
