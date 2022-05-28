/*
 A simplified version of Supabase's storage schema.
 https://github.com/supabase/storage-api/blob/c8b1053dacec0989c8e8189b6145eb1780e217a4/src/test/db/02-storage-schema.sql
 
 */
CREATE SCHEMA IF NOT EXISTS storage;

CREATE TABLE migrations (
  id integer NOT NULL,
  name character varying(100) NOT NULL,
  hash character varying(40) NOT NULL,
  executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS storage.buckets (
  id text NOT NULL PRIMARY KEY,
  name text NOT NULL,
  owner uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  -- Manage associations needed for authentication
  section_id integer NOT NULL REFERENCES stratiform.section(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX bname ON storage.buckets USING BTREE (name);


CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  bucket_id text REFERENCES storage.buckets(id),
  name text,
  owner uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  last_accessed_at timestamptz DEFAULT NOW(),
  metadata jsonb
);

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING BTREE (bucket_id, name);

CREATE INDEX name_prefix_search ON storage.objects(name text_pattern_ops);

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;


CREATE OR REPLACE FUNCTION storage.foldername(name text)
RETURNS text [] LANGUAGE plpgsql AS $$
DECLARE _parts text [];
BEGIN
SELECT string_to_array(name, '/') INTO _parts;
RETURN _parts [1:array_length(_parts,1)-1];
END $$;


CREATE OR REPLACE FUNCTION storage.filename(name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE _parts text [];
BEGIN
SELECT string_to_array(name, '/') INTO _parts;
RETURN _parts [array_length(_parts,1)];
END $$;


CREATE OR REPLACE FUNCTION storage.extension(name text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  _parts text [];
  _filename text;
BEGIN
SELECT string_to_array(name, '/') INTO _parts;
SELECT _parts [array_length(_parts,1)] INTO _filename;
-- @todo return the last part instead of 2
RETURN reverse(split_part(reverse(_filename), '.', 1));
END $$;


-- @todo can this query be optimised further?
CREATE OR REPLACE FUNCTION storage.search(
  prefix text,
  bucketname text,
  limits int DEFAULT 100,
  levels int DEFAULT 1,
  offsets int DEFAULT 0
) RETURNS TABLE (
  name text,
  id uuid,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  metadata jsonb
) LANGUAGE plpgsql AS $$
BEGIN RETURN query
WITH files_folders AS (
  SELECT
    ((string_to_array(objects.name, '/')) [levels]) AS folder
  FROM objects
  WHERE
    objects.name ilike prefix || '%'
    AND bucket_id = bucketname
  GROUP BY
    folder
  LIMIT
    limits OFFSET offsets
)
SELECT
  files_folders.folder AS name,
  objects.id,
  objects.updated_at,
  objects.created_at,
  objects.last_accessed_at,
  objects.metadata
FROM files_folders
  LEFT JOIN objects ON prefix || files_folders.folder = objects.name
  AND objects.bucket_id = bucketname;
END $$;