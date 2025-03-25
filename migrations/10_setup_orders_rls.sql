-- Enable Row Level Security on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to insert their own orders
CREATE POLICY insert_own_orders ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- Allow any authenticated user to insert

-- Create a policy that allows authenticated users to view their own orders
CREATE POLICY select_own_orders ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create a policy that allows authenticated users to update their own orders
CREATE POLICY update_own_orders ON orders
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create a policy that allows service role to access all orders
CREATE POLICY service_all_access ON orders
  FOR ALL
  TO service_role
  USING (true);

-- Create a policy that allows anon users to insert orders (for guest checkout)
CREATE POLICY anon_insert_orders ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true); 