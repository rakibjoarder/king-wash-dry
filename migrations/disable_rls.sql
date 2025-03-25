-- Temporarily disable RLS for customers table
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

-- Create a trigger to automatically set user_id for new customers
CREATE OR REPLACE FUNCTION set_user_id_for_customer()
RETURNS TRIGGER AS $$
BEGIN
  -- If the user is authenticated and user_id is not set, set it
  IF auth.uid() IS NOT NULL AND NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_id_trigger
BEFORE INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION set_user_id_for_customer(); 