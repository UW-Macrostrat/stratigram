DO $$
DECLARE
  _project_id integer;
  _column_id integer;
  _facies_model_id integer;
BEGIN


-- Get project id
INSERT INTO stratiform.project (name, description)
VALUES ('Zebra Nappe', 'Stratigraphy of the Zebra Nappe, Southern Namibia')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
RETURNING id INTO _project_id;

INSERT INTO stratiform.column (project_id, name, description)
VALUES (_project_id, 'Section J', 'Section J (290-350 m)')
ON CONFLICT (project_id, name) DO UPDATE SET description = EXCLUDED.description
RETURNING id INTO _column_id;

INSERT INTO stratiform.facies_model (project_id, name, description)
VALUES (_project_id, 'Zebra Nappe facies model', 'Facies model for a mixed carbonate–siliciclastic stratigraphy')
ON CONFLICT (project_id, name) DO UPDATE SET description = EXCLUDED.description
RETURNING id INTO _facies_model_id;

INSERT INTO stratiform.facies (model_id, name, description, color)
SELECT _facies_model_id, id, description, color
FROM stratiform_import.facies
ON CONFLICT (model_id, name)
DO UPDATE SET description = EXCLUDED.description, color = EXCLUDED.color;

INSERT INTO stratiform.lithology (project_id, name, pattern)
SELECT _project_id, id, pattern
FROM stratiform_import.lithology
ON CONFLICT (project_id, name) DO UPDATE
SET pattern = EXCLUDED.pattern;

DELETE FROM stratiform.column_surface WHERE column_id = _column_id;

INSERT INTO stratiform.column_surface (
  column_id, height, lithology_id, facies_id, grainsize, covered, surface_type)
SELECT
  _column_id,
	s.height,
	l.id lithology_id,
	f.id facies_id,
	grainsize,
  CASE WHEN covered
    THEN true
  ELSE NULL
  END covered,
  CASE WHEN definite_boundary
    THEN 'sharp'
  WHEN (NOT definite_boundary)
    THEN 'gradational'
  ELSE NULL
  END surface_type
FROM stratiform_import.surface s
JOIN stratiform.lithology l
  ON l.name = s.lithology
JOIN stratiform.facies f
  ON f.name = s.facies;

DELETE FROM stratiform.column_obs WHERE column_id = _column_id;

INSERT INTO stratiform.column_obs (
  column_id, height, top_height, note, symbol)
SELECT _column_id, height, top_height, note, symbol
FROM stratiform_import.note;

END
$$;

DROP SCHEMA IF EXISTS stratiform_import CASCADE;