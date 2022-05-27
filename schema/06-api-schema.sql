DROP SCHEMA stratiform_api CASCADE;

CREATE SCHEMA stratiform_api;

CREATE VIEW stratiform_api.objects AS
SELECT
  *
FROM
  storage.objects;

CREATE VIEW stratiform_api.buckets AS
SELECT
  *
FROM
  storage.buckets;