# MLH: Best Use of Tiger Data (sponsor, via MLH)

- **Winners:** 1
- **Prize:** Stream Deck Mini.
- **Listed on:** Devpost + MLH prizes page (https://www.mlh.com/events/bigred-hacks-2026/prizes). Not in the organizer doc.

## Challenge
Show how Tiger Data powers the project. Tiger Data is a PostgreSQL extension/platform for fast real-time data, time-series metrics and complex analytics without complex config. Examples: real-time IoT monitoring, AI-driven analytics dashboards, financial prediction engines. Free-tier cloud instances available.

## Requirements
Build using Tiger Data (PostgreSQL extension).

## Judging
"Most innovative, impactful, and performance-driven use of Tiger Data."

## Theme tie-in
Time-series fits tracking movement/location/telemetry for navigation.

## Resources / claiming
- Partner page: https://mlh.com/partners/tigerdata (https://mlh.link/tigerdata). Prize claim: no login.
- **Free perk:** $1,000 credits for new Tiger Cloud accounts, valid 30 days (automatic on signup, no code listed).
- Quickstart (5 min): https://www.tigerdata.com/docs/get-started/quickstart/quickstart-5-minutes. New service in Tiger Console, download config for connection string, connect with Console SQL Editor or `psql "<service-url>"`.
- Hypertable example:
  `CREATE TABLE conditions (time TIMESTAMPTZ NOT NULL, location TEXT NOT NULL, device TEXT NOT NULL, temperature DOUBLE PRECISION NULL, humidity DOUBLE PRECISION NULL) WITH (tsdb.hypertable, tsdb.segmentby = 'device', tsdb.orderby = 'time DESC');` then plain `INSERT`/`SELECT`.
- Docs: tutorials/examples https://www.tigerdata.com/docs/build/examples | CLI + MCP https://www.tigerdata.com/docs/learn/tiger-cli-mcp | hypertables https://www.tigerdata.com/docs/learn/hypertables/understand-hypertables | Hypercore https://www.tigerdata.com/docs/learn/columnar-storage/understand-hypercore | glossary https://www.tigerdata.com/docs/learn/glossary | migration https://www.tigerdata.com/docs/migrate

## Spoken
Prize: Elgato Stream Deck. Pitched as supercharged Postgres, with MCP servers so AI agents/LLMs can connect to and help build your database.
