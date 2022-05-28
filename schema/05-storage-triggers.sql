CREATE OR REPLACE FUNCTION stratiform.section_insert_trigger()
RETURNS trigger AS $$
DECLARE bucket_name text;
BEGIN
  bucket_name := 'section-' || NEW.id || '-images';
  -- Insert a new bucket for section images
  INSERT INTO storage.buckets (id, name, section_id)
  SELECT
    bucket_name,
    bucket_name,
    NEW.id
  WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = bucket_name);
  RETURN NEW;
END $$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER stratiform_section_insert_trigger
AFTER INSERT ON stratiform.section
FOR EACH ROW EXECUTE PROCEDURE stratiform.section_insert_trigger();
