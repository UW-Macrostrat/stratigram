DO $$
DECLARE
_project_id integer;
_column_id integer;
_facies_model_id integer;
BEGIN

-- Get project id
INSERT INTO
  stratiform.project (name, description)
VALUES
('Windermere Supergroup', 'Stratigraphy of the Windermere Supergroup')
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description
RETURNING id INTO _project_id;

INSERT INTO
  stratiform.column (project_id, name, description)
VALUES
  (
    _project_id,
    'Section G3',
    'Moynihan et al. 2019, Section G3'
  ) ON CONFLICT (project_id, name) DO
UPDATE
SET
  description = EXCLUDED.description RETURNING id INTO _column_id;

INSERT INTO
  stratiform.facies_model (project_id, name, description)
VALUES
  (
    _project_id,
    'Moynihan et al., 2019',
    'Facies model for the Windermere Supergroup'
  ) ON CONFLICT (project_id, name) DO
UPDATE
SET
  description = EXCLUDED.description RETURNING id INTO _facies_model_id;

INSERT INTO stratiform.facies (model_id, name)
SELECT
  _facies_model_id,
  unnest(array [
  'limestone',
  'dolomite',
  'shale/siltstone',
  'cover',
  'sandy siltstone',
  'slump mass/chaotic interval',
  'finely-laminated turbidites',
  'silty/sandy limestone',
  'rudstone',
  'sandstone',
  'conglomerate',
  'matrix-supported conglomerate'
  ])
ON CONFLICT (model_id, name) DO NOTHING;

END $$;
