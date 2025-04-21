-- Add image_url and is_active columns to locations table
ALTER TABLE "public"."locations" 
  ADD COLUMN IF NOT EXISTS "image_url" VARCHAR(500) NULL,
  ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT TRUE;

-- Update existing locations to have default image_url

-- Create index for faster querying of active locations
CREATE INDEX IF NOT EXISTS locations_is_active_idx ON "public"."locations" ("is_active");

-- Add comment to the table columns for documentation
COMMENT ON COLUMN "public"."locations"."image_url" IS 'URL to the location image, can be relative path or external URL';
COMMENT ON COLUMN "public"."locations"."is_active" IS 'Flag to indicate if the location is currently active'; 