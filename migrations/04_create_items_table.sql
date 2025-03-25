-- Create items table for laundry items
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  avg_weight DECIMAL(10, 2) NOT NULL,
  icon VARCHAR(50),
  service_id INTEGER REFERENCES services(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default items
-- Wash & Fold items (service_id = 1)
INSERT INTO items (name, description, avg_weight, icon, service_id) VALUES
('Shirts', 'T-shirts, button-ups, blouses, etc.', 0.3, 'shirt', 1),
('Pants/Jeans', 'All types of pants and jeans', 0.6, 'pants', 1),
('Dresses', 'All types of dresses', 0.5, 'dress', 1),
('Sweaters', 'Sweaters and sweatshirts', 0.7, 'sweater', 1),
('Jackets', 'Light jackets and coats', 1.0, 'jacket', 1),
('Bedding', 'Sheets, pillowcases, duvet covers', 2.0, 'bedding', 1),
('Towels', 'Bath towels, hand towels, washcloths', 0.5, 'towel', 1),
('Undergarments', 'Underwear, socks, etc.', 0.1, 'underwear', 1),
('Children''s Clothing', 'All types of children''s clothing', 0.2, 'child', 1),
('Other Items', 'Miscellaneous laundry items', 0.5, 'other', 1);

-- Dry Cleaning items (service_id = 2)
INSERT INTO items (name, description, avg_weight, icon, service_id) VALUES
('Suits', 'Full suits or suit jackets', 1.2, 'suit', 2),
('Dress Shirts', 'Formal dress shirts', 0.3, 'shirt', 2),
('Formal Dresses', 'Evening gowns and formal dresses', 1.0, 'dress', 2),
('Coats', 'Winter coats and heavy jackets', 1.5, 'jacket', 2),
('Silk Items', 'Silk blouses, ties, scarves', 0.2, 'silk', 2);

-- Wash & Iron items (service_id = 3)
INSERT INTO items (name, description, avg_weight, icon, service_id) VALUES
('Dress Shirts', 'Business and formal shirts', 0.3, 'shirt', 3),
('Pants', 'Dress pants and slacks', 0.6, 'pants', 3),
('Blouses', 'Women''s blouses and tops', 0.3, 'blouse', 3),
('Tablecloths', 'Table linens', 1.0, 'linen', 3),
('Napkins', 'Cloth napkins', 0.1, 'linen', 3); 