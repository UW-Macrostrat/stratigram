/*
 A simplified version of Supabase's storage schema.
 https://github.com/supabase/storage-api/blob/c8b1053dacec0989c8e8189b6145eb1780e217a4/src/test/db/02-storage-schema.sql
 
Migrations here were applied by hand
https://github.com/supabase/storage-api/blob/0728cd0ff3ab9d527dc15abe5dd535f7aff47d76/migrations/tenant/0002-pathtoken-column.sql
up to migration 0009

 */
CREATE SCHEMA IF NOT EXISTS storage;

CREATE TABLE IF NOT EXISTS storage.buckets (
  id text NOT NULL PRIMARY KEY,
  name text NOT NULL,
  owner uuid REFERENCES auth.users(id),
  public boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  -- Manage associations needed for authentication
  column_id integer NOT NULL REFERENCES stratiform.column(id) ON DELETE CASCADE
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
  -- added in migration 0002
  path_tokens text[] generated always as (string_to_array("name", '/')) stored,
  metadata jsonb
);

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING BTREE (bucket_id, name);

CREATE INDEX name_prefix_search ON storage.objects(name text_pattern_ops);

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

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


-- Added in migration 0009
create or replace function storage.search (
  prefix text,
  bucketname text,
  limits int default 100,
  levels int default 1,
  offsets int default 0,
  search text default '',
  sortcolumn text default 'name',
  sortorder text default 'asc'
) returns table (
    name text,
    id uuid,
    updated_at timestamptz,
    created_at timestamptz,
    last_accessed_at timestamptz,
    metadata jsonb
  )
as $$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(regexp_split_to_array(objects.name, ''/''), 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(regexp_split_to_array(objects.name, ''/''), 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$$ language plpgsql stable;


-- added in change-column-name-in-get-size migration
CREATE OR REPLACE FUNCTION storage.get_size_by_bucket()
 RETURNS TABLE (
    size BIGINT,
    bucket_id text
  )
 LANGUAGE plpgsql
AS $function$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$function$;
