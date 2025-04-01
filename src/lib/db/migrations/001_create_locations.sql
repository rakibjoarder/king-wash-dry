-- Create locations table
CREATE TABLE IF NOT EXISTS "public"."locations" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "zip" VARCHAR(10) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "hours" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert all locations
INSERT INTO "public"."locations" ( "name", "address", "city", "state", "zip", "phone", "hours") VALUES 
('1', 'King Wash & Dry - Dallas Bruton', '10100 Bruton Rd', 'Dallas', 'TX', '75217', '(214) 555-1001', 'Mon-Sun: 6AM-9PM'),
('2', 'King Wash & Dry - Dallas Forest', '9782 Forest Ln', 'Dallas', 'TX', '75243', '(214) 555-1002', 'Mon-Sun: 6AM-9PM'),
('3', 'King Wash & Dry - Dallas Plano', '12309 N Plano Rd', 'Dallas', 'TX', '75243', '(214) 555-1003', 'Mon-Sun: 6AM-9PM'),
('4', 'King Wash & Dry - Dallas Skillman', '6556 Skillman St', 'Dallas', 'TX', '75231', '(214) 555-1004', 'Mon-Sun: 6AM-9PM'),

-- Garland locations
('King Wash & Dry - Garland Saturn', '3160 Saturn Rd', 'Garland', 'TX', '75041', '(214) 555-1005', 'Mon-Sun: 6AM-10PM'),
('King Wash & Dry - Garland Walnut', '2425 W Walnut St', 'Garland', 'TX', '75042', '(214) 555-1006', 'Mon-Sun: 6AM-9PM'),
('King Wash & Dry - Garland Belt Line', '1456 Belt Line Rd', 'Garland', 'TX', '75044', '(214) 555-1007', 'Mon-Sun: 6AM-9PM'),

-- Mesquite locations
('King Wash & Dry - Mesquite Hillcrest', '1820 Hillcrest St', 'Mesquite', 'TX', '75149', '(214) 555-1008', 'Mon-Sun: 6AM-9PM'),
('King Wash & Dry - Mesquite Galloway', '1336 N Galloway Ave #150', 'Mesquite', 'TX', '75149', '(214) 555-1009', 'Mon-Sun: 6AM-9PM'),
('King Wash & Dry - Mesquite Town East', '3310 N Town E Blvd', 'Mesquite', 'TX', '75150', '(214) 555-1010', 'Mon-Sun: 6AM-10PM'),

-- Richardson location
('King Wash & Dry - Richardson', '1332 S Plano Rd', 'Richardson', 'TX', '75081', '(214) 555-1011', 'Mon-Sun: 6AM-9PM');

-- Create index for faster city searches
CREATE INDEX IF NOT EXISTS locations_city_idx ON "public"."locations" ("city");

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON "public"."locations"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 