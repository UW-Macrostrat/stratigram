DROP SCHEMA stratiform_api CASCADE;

CREATE SCHEMA stratiform_api;

CREATE VIEW stratiform_api.project AS
SELECT * FROM stratiform.project;

CREATE VIEW stratiform_api.column AS
SELECT * FROM stratiform.column;

CREATE VIEW stratiform_api.lithology AS
SELECT * FROM stratiform.lithology;

CREATE VIEW stratiform_api.facies AS
SELECT * FROM stratiform.facies;

CREATE VIEW stratiform_api.facies_model AS
SELECT * FROM stratiform.facies_model;

CREATE VIEW stratiform_api.column_obs AS
SELECT * FROM stratiform.column_obs;

CREATE VIEW stratiform_api.grainsize AS
SELECT * FROM stratiform.grainsize;

CREATE VIEW stratiform_api.column_surface AS
SELECT
  s.id,
  height bottom,
  lead(height, 1) OVER (
    PARTITION BY column_id
    ORDER BY
      height
  ) top,
  column_id,
  lithology_id,
  facies_id,
  l."name" lithology,
  f."name" facies,
  l.pattern,
  grainsize,
  covered,
  schematic,
  surface_type
FROM
  stratiform.column_surface s
  JOIN stratiform.lithology l
    ON l.id = s.lithology_id
  JOIN stratiform.facies f
    ON f.id = s.facies_id
ORDER BY
  column_id,
  height DESC;