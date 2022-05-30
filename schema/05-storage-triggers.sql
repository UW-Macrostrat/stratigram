CREATE OR REPLACE FUNCTION stratiform.column_insert_trigger()
RETURNS trigger AS $$
DECLARE bucket_name text;
BEGIN
  bucket_name := 'column-' || NEW.id || '-images';
  -- Insert a new bucket for section images
  INSERT INTO storage.buckets (id, name, column_id)
  SELECT
    bucket_name,
    bucket_name,
    NEW.id
  WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = bucket_name);
  RETURN NEW;
END $$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER stratiform_column_insert_trigger
AFTER INSERT ON stratiform.column
FOR EACH ROW EXECUTE PROCEDURE stratiform.column_insert_trigger();

-- Insert buckets for each column that doesn't currently have one.
INSERT INTO storage.buckets (id, name, column_id)
SELECT
  'column-' || id || '-images',
  'column-' || id || '-images',
  id
FROM stratiform.column
WHERE id NOT IN (SELECT column_id FROM storage.buckets);
