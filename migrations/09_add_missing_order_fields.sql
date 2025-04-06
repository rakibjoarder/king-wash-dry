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
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'preferences') THEN
        ALTER TABLE orders ALTER COLUMN preferences TYPE JSONB USING preferences::JSONB;
    ELSE
        ALTER TABLE orders ADD COLUMN preferences JSONB;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'items') THEN
        ALTER TABLE orders ALTER COLUMN items TYPE JSONB USING items::JSONB;
    ELSE
        ALTER TABLE orders ADD COLUMN items JSONB;
    END IF;
END $$;

-- Scheduling information
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'drop_off_date') THEN
        ALTER TABLE orders ALTER COLUMN drop_off_date TYPE DATE USING drop_off_date::DATE;
    ELSE
        ALTER TABLE orders ADD COLUMN drop_off_date DATE;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'drop_off_time') THEN
        ALTER TABLE orders ALTER COLUMN drop_off_time TYPE TEXT;
    ELSE
        ALTER TABLE orders ADD COLUMN drop_off_time TEXT;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'pickup_date') THEN
        ALTER TABLE orders ALTER COLUMN pickup_date TYPE DATE USING pickup_date::DATE;
    ELSE
        ALTER TABLE orders ADD COLUMN pickup_date DATE;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'pickup_time') THEN
        ALTER TABLE orders ALTER COLUMN pickup_time TYPE TEXT;
    ELSE
        ALTER TABLE orders ADD COLUMN pickup_time TEXT;
    END IF;
END $$;

-- Payment information
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Additional amounts
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tip_amount') THEN
        ALTER TABLE orders ALTER COLUMN tip_amount TYPE DECIMAL(10,2) USING tip_amount::DECIMAL(10,2);
    ELSE
        ALTER TABLE orders ADD COLUMN tip_amount DECIMAL(10,2);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'total_price') THEN
        ALTER TABLE orders ALTER COLUMN total_price TYPE DECIMAL(10,2) USING total_price::DECIMAL(10,2);
    ELSE
        ALTER TABLE orders ADD COLUMN total_price DECIMAL(10,2);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'weight') THEN
        ALTER TABLE orders ALTER COLUMN weight TYPE DECIMAL(10,2) USING weight::DECIMAL(10,2);
    ELSE
        ALTER TABLE orders ADD COLUMN weight DECIMAL(10,2);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'discount_amount') THEN
        ALTER TABLE orders ALTER COLUMN discount_amount TYPE DECIMAL(10,2) USING discount_amount::DECIMAL(10,2);
    ELSE
        ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2);
    END IF;
END $$;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_code TEXT;

-- User association
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id); 