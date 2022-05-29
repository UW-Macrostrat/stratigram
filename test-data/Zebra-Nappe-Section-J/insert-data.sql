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

INSERT INTO stratiform.lithology (name, pattern)
SELECT id, pattern
FROM stratiform_import.lithology
ON CONFLICT (project_id, name) DO UPDATE
SET pattern = EXCLUDED.pattern;

END
$$;