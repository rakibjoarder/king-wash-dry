-- Add missing fields to orders table

-- Basic customer information
ALTER TABLE orders ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone TEXT;

-- Address information
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS zip TEXT;

-- Additional order details
ALTER TABLE orders ADD COLUMN IF NOT EXISTS preferences JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB;

-- Scheduling information
ALTER TABLE orders ADD COLUMN IF NOT EXISTS drop_off_time TIME;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_requested BOOLEAN DEFAULT TRUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_time TIME;

-- User association
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id); 