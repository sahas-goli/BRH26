-- db/caggs.sql
CREATE MATERIALIZED VIEW IF NOT EXISTS bounty_minute
WITH (timescaledb.continuous, timescaledb.materialized_only = false) AS
SELECT bounty_id,
       time_bucket('1 minute', time) AS bucket,
       count(*) FILTER (WHERE kind = 'received')  AS received,
       count(*) FILTER (WHERE kind = 'forwarded') AS forwarded,
       count(*) FILTER (WHERE kind = 'opened')    AS opened,
       max(depth)                                 AS max_depth,
       percentile_agg(latency_s) FILTER (WHERE kind = 'forwarded') AS latency  -- timescaledb_toolkit
FROM events
GROUP BY bounty_id, bucket;

SELECT add_continuous_aggregate_policy('bounty_minute',
  start_offset => INTERVAL '3 hours', end_offset => INTERVAL '1 minute',
  schedule_interval => INTERVAL '1 minute');

-- Hierarchical rollup for the replay and the charts.
CREATE MATERIALIZED VIEW IF NOT EXISTS bounty_hour
WITH (timescaledb.continuous, timescaledb.materialized_only = false) AS
SELECT bounty_id, time_bucket('1 hour', bucket) AS bucket,
       sum(received) AS received, sum(forwarded) AS forwarded, max(max_depth) AS max_depth,
       rollup(latency) AS latency
FROM bounty_minute GROUP BY 1, 2;

SELECT add_continuous_aggregate_policy('bounty_hour',
  start_offset => INTERVAL '3 days', end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '5 minutes');

-- Columnstore compression for closed cascades (replay data is old, so it compresses right away).
CALL add_columnstore_policy('events', after => INTERVAL '1 day');
-- VERIFY (E): older syntax fallback: ALTER TABLE events SET (timescaledb.compress); SELECT add_compression_policy('events', INTERVAL '1 day');
-- VERIFY (E): if percentile_agg is missing (toolkit not enabled), drop that column and compute p75 with percentile_cont on raw events.
