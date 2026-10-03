# MLH: Best Use of Tiger Data (sponsor, via MLH)

## Challenge
Show how Tiger Data powers the project. Tiger Data is a PostgreSQL extension/platform for fast real-time data, time-series metrics and complex analytics without complex config. Examples: real-time IoT monitoring, AI-driven analytics dashboards, financial prediction engines. Free-tier cloud instances available.

## Requirements
Build using Tiger Data (PostgreSQL extension).

## Judging
"Most innovative, impactful, and performance-driven use of Tiger Data."

## Build resources
- Partner page: https://mlh.com/partners/tigerdata (https://mlh.link/tigerdata).
- **Free perk:** $1,000 credits for new Tiger Cloud accounts, valid 30 days (automatic on signup, no code listed).
- Quickstart (5 min): https://www.tigerdata.com/docs/get-started/quickstart/quickstart-5-minutes. New service in Tiger Console, download config for connection string, connect with Console SQL Editor or `psql "<service-url>"`.
- Hypertable example:
  `CREATE TABLE conditions (time TIMESTAMPTZ NOT NULL, location TEXT NOT NULL, device TEXT NOT NULL, temperature DOUBLE PRECISION NULL, humidity DOUBLE PRECISION NULL) WITH (tsdb.hypertable, tsdb.segmentby = 'device', tsdb.orderby = 'time DESC');` then plain `INSERT`/`SELECT`.
- Docs: tutorials/examples https://www.tigerdata.com/docs/build/examples | CLI + MCP https://www.tigerdata.com/docs/learn/tiger-cli-mcp | hypertables https://www.tigerdata.com/docs/learn/hypertables/understand-hypertables | Hypercore https://www.tigerdata.com/docs/learn/columnar-storage/understand-hypercore | glossary https://www.tigerdata.com/docs/learn/glossary | migration https://www.tigerdata.com/docs/migrate

## Verified 2026-10-03 (proposal research)

**Gotchas:** Judged on 'most innovative, impactful, and performance-driven use', so show query latency numbers (e.g., a cagg vs raw scan, compression ratio) on screen; a plain Postgres CRUD backend will not win. pgai in-database LLM calls are gone, so embed outside the DB. Extensions must be enabled per service; pg_cron needs support (not feasible this weekend, use refresh policies instead). The 30-day trial easily covers the weekend. Setup is about 5 minutes (Console, then the connection string). Assume Tiger Cloud only, not self-hosted, for the 'Tiger Data' claim.

**What judges rewarded at other 2025-2026 events:** Data that is actually time-series, especially space plus time: location pings, sensor streams, conditions changing over time. Visible hypertables, continuous aggregates, compression, and time_bucket queries, ideally with a performance number such as 'query over 700k rows in X ms'. The Tiger Data criteria say 'innovative, impactful, performance-driven'. It pairs naturally with Kleinberg's freshness or temporal-correctness problem.

Examples: DivHacks 2026 winner: Scoop, real-time NYC snowfall plus sidewalk-clearing reports in TimescaleDB+PostGIS, with Open-Meteo weather, MapLibre, and a points leaderboard. ShellHacks 2026 (294 submissions) winner: transPEAKtation, event-aware traffic forecasting on Tiger Data + AWS (also won AWS). Non-winners that used it heavily: Key-o (TimescaleDB compression over 711k+ Manhattan 311/HPD complaints for instant iMessage report cards) and Nook (location pings in Timescale+PostGIS). Several other winners listed Tiger Data as secondary storage.

Sources: https://www.tigerdata.com/pricing | https://www.mlh.com/partners/tigerdata | https://www.tigerdata.com/docs/deploy/tiger-cloud/tiger-cloud-aws/tiger-cloud-extensions | https://www.tigerdata.com/docs/deploy/tiger-cloud/vectorizer-deprecation | https://www.tigerdata.com/docs/learn/tiger-cli-mcp
