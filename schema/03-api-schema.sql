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