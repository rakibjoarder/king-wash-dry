CREATE TABLE IF NOT EXISTS promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2) DEFAULT NULL,
  start_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE DEFAULT NULL,
  usage_limit INTEGER DEFAULT NULL,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample promo codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, expiry_date)
VALUES 
  ('WELCOME10', 'Welcome discount for new customers', 'percentage', 10.00, 0, 50.00, CURRENT_DATE + INTERVAL '30 days'),
  ('SUMMER2023', 'Summer special discount', 'percentage', 15.00, 25.00, 75.00, '2023-09-30'),
  ('FREESHIP', 'Free delivery on your order', 'fixed', 5.00, 20.00, NULL, '2023-12-31'),
  ('SAVE20', 'Save $20 on orders over $100', 'fixed', 20.00, 100.00, NULL, '2023-12-31'); 