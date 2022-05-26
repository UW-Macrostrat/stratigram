CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE auth.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL
);