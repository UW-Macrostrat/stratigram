CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE SCHEMA IF NOT EXISTS stratiform;

SET SCHEMA
  'stratiform';

CREATE TABLE IF NOT EXISTS project (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text
);

CREATE TABLE IF NOT EXISTS section (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text,
  project_id integer NOT NULL REFERENCES project(id)
);