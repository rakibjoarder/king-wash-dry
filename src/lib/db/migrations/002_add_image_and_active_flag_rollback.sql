-- Drop the index first
DROP INDEX IF EXISTS "public"."locations_is_active_idx";

-- Remove the added columns
ALTER TABLE "public"."locations" 
  DROP COLUMN IF EXISTS "image_url",
  DROP COLUMN IF EXISTS "is_active"; 