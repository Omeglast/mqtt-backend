DROP TABLE IF EXISTS version;
CREATE TABLE IF NOT EXISTS version (version VARCHAR(16));
INSERT INTO version VALUES (0);

-- Create 'ts' table where all time series data will be stored
CREATE TABLE IF NOT EXISTS ts (
  id     SERIAL,
  time   TIMESTAMPTZ,
  sensor VARCHAR(256),
  value  REAL
);

-- Create optimized version of the 'ts' table
CREATE TABLE IF NOT EXISTS ts_periods(
  id       SERIAL PRIMARY KEY NOT NULL,
  start_tz TIMESTAMPTZ        NOT NULL,
  end_tz   TIMESTAMPTZ        NULL,
  sensor   VARCHAR(256)       NOT NULL,
  value    REAL               NOT NULL,
  unit     VARCHAR(16)        NULL,
  CHECK(end_tz IS NULL OR end_tz >= start_tz),
  UNIQUE (sensor, start_tz)
);
