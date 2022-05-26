CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS stratiform;

CREATE SCHEMA IF NOT EXISTS storage;

CREATE TABLE IF NOT EXISTS stratiform.project (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text
);

CREATE TABLE IF NOT EXISTS stratiform.section (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text,
  project_id integer NOT NULL REFERENCES stratiform.project(id)
);