CREATE SCHEMA IF NOT EXISTS stratiform;

CREATE TABLE IF NOT EXISTS stratiform.project (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text
);

-- Facies
CREATE TABLE IF NOT EXISTS stratiform.facies_model (
  id serial PRIMARY KEY,
  project_id integer NOT NULL REFERENCES stratiform.project(id),
  name text NOT NULL,
  description text
);

CREATE TABLE IF NOT EXISTS stratiform.facies (
  id serial PRIMARY KEY,
  model_id integer NOT NULL REFERENCES stratiform.facies_model(id),
  name text NOT NULL,
  description text,
  color text
);

CREATE TABLE IF NOT EXISTS stratiform.lithology (
  id serial PRIMARY KEY,
  name text NOT NULL,
  project_id integer REFERENCES stratiform.project(id),
  description text,
  pattern text
);

CREATE TABLE IF NOT EXISTS stratiform.grainsize (
  key text PRIMARY KEY,
  name text NOT NULL,
  description text
);

-- Columns
CREATE TABLE IF NOT EXISTS stratiform.column (
  id serial PRIMARY KEY,
  project_id integer NOT NULL REFERENCES stratiform.project(id),
  name text NOT NULL,
  description text,
  geometry geometry(Geometry, 4326)
);

CREATE TABLE IF NOT EXISTS stratiform.column_surface (
  id serial PRIMARY KEY,
  height numeric NOT NULL,
  column_id integer NOT NULL REFERENCES stratiform.column(id) ON DELETE CASCADE,
  lithology_id integer REFERENCES stratiform.lithology(id),
  facies_id integer REFERENCES stratiform.facies(id),
  grainsize text REFERENCES stratiform.grainsize(key),
  covered boolean,
  schematic boolean,
  surface_type text,
  CHECK (surface_type IN ('sharp', 'gradational'))
);

CREATE TABLE IF NOT EXISTS stratiform.column_observation (
  id serial PRIMARY KEY,
  height numeric NOT NULL,
  column_id integer NOT NULL REFERENCES stratiform.column(id) ON DELETE CASCADE,
  top_height numeric,
  note text,
  symbol text
);

INSERT INTO stratiform.grainsize (key, name)
VALUES
  ('ms', 'Mudstone'),
  ('ss', 'Siltstone'),
  ('vf', 'Very fine sand'),
  ('f', 'Fine sand'),
  ('m', 'Medium sand'),
  ('c', 'Coarse sand'),
  ('p', 'Pebble'),
  ('c', 'Cobble'),
  ('b', 'Boulder'),
  ('ws', 'Wackestone'),
  ('ps', 'Packstone'),
  ('gs', 'Grainstone');