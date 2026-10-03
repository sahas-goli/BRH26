#!/usr/bin/env node
/** Offline harness for db/apply.mjs (no DATABASE_URL). */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = dirname(fileURLToPath(import.meta.url));
const apply = join(root, "apply.mjs");

test("apply --dry-run extracts relations without DATABASE_URL", () => {
  const result = spawnSync(process.execPath, [apply, "--dry-run"], {
    encoding: "utf8",
    env: { ...process.env, DATABASE_URL: "" },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const plan = JSON.parse(result.stdout);
  assert.equal(plan.mode, "dry-run");
  assert.equal(plan.hasBounties, true);
  assert.equal(plan.hasHolders, true);
  assert.equal(plan.hasPayouts, true);
  assert.deepEqual(plan.sslRemote, { rejectUnauthorized: false });
  assert.match(plan.nextHumanStep, /DATABASE_URL/);
});

test("apply without URL fails closed (not dry-run)", () => {
  const result = spawnSync(process.execPath, [apply], {
    encoding: "utf8",
    env: { ...process.env, DATABASE_URL: "" },
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /DATABASE_URL is not set/);
});
