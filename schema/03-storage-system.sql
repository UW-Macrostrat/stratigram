/*
 A simplified version of Supabase's storage schema.
 https://github.com/supabase/storage-api/blob/c8b1053dacec0989c8e8189b6145eb1780e217a4/src/test/db/02-storage-schema.sql
 
 */
CREATE SCHEMA IF NOT EXISTS storage;

CREATE TABLE storage.migrations (
  id integer NOT NULL,
  name character varying(100) NOT NULL,
  hash character varying(40) NOT NULL,
  executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "storage"."buckets" (
  "id" text not NULL,
  "name" text NOT NULL,
  "owner" uuid,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  CONSTRAINT "buckets_owner_fkey" FOREIGN KEY ("owner") REFERENCES "auth"."users"("id"),
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING BTREE ("name");

CREATE TABLE IF NOT EXISTS "storage"."objects" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "bucket_id" text,
  "name" text,
  "owner" uuid,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  "last_accessed_at" timestamptz DEFAULT now(),
  "metadata" jsonb,
  CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id"),
  CONSTRAINT "objects_owner_fkey" FOREIGN KEY ("owner") REFERENCES "auth"."users"("id"),
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING BTREE ("bucket_id", "name");

CREATE INDEX name_prefix_search ON storage.objects(name text_pattern_ops);