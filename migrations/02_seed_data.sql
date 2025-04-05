-- Seed locations
INSERT INTO locations (name, address, city, state, zip, phone, hours) VALUES
('King Wash & Dry - Richardson', '332 S Plano Rd', 'Richardson', 'TX', '75081', '(214) 555-1001', 'Mon-Sat: 7AM-9PM, Sun: 8AM-7PM'),
('King Wash & Dry - Garland Belt Line', '1456 Belt Line Rd', 'Garland', 'TX', '75044', '(214) 555-1002', 'Mon-Sat: 7AM-9PM, Sun: 8AM-7PM'),
('King Wash & Dry - Garland Saturn', '3160 Saturn Rd', 'Garland', 'TX', '75041', '(214) 555-1003', 'Mon-Sat: 7AM-9PM, Sun: 8AM-7PM'),
('King Wash & Dry - Mesquite Galloway', '1336 N Galloway Ave #150', 'Mesquite', 'TX', '75149', '(214) 555-1004', 'Mon-Sat: 7AM-9PM, Sun: 8AM-7PM'),
('King Wash & Dry - Mesquite Town East', '3301 N Town E Blvd', 'Mesquite', 'TX', '75150', '(214) 555-1005', 'Mon-Sat: 7AM-9PM, Sun: 8AM-7PM');

-- Seed services
INSERT INTO services (name, description, price, turnaround_time) VALUES
('Wash & Fold', 'Our standard wash and fold service for everyday laundry.', 1.99, '24 hours'),
('Express Service', 'Same-day service for urgent laundry needs.', 2.99, '6 hours'),
('Comforter Cleaning', 'Deep cleaning for comforters, duvets, and blankets.', 14.99, '48 hours'),

-- Seed customers
INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip) VALUES
('John', 'Smith', 'john.smith@example.com', '(214) 555-2001', '123 Main St', 'Richardson', 'TX', '75081'),
('Sarah', 'Johnson', 'sarah.j@example.com', '(214) 555-2002', '456 Oak Ave', 'Garland', 'TX', '75044'),
('Michael', 'Williams', 'mwilliams@example.com', '(214) 555-2003', '789 Pine Rd', 'Mesquite', 'TX', '75149'),
('Emily', 'Brown', 'emily.brown@example.com', '(214) 555-2004', '101 Cedar Ln', 'Richardson', 'TX', '75081'),
('David', 'Jones', 'djones@example.com', '(214) 555-2005', '202 Elm St', 'Garland', 'TX', '75041');

-- Seed orders
INSERT INTO orders (customer_id, location_id, service_id, status, weight, total_price, notes, drop_off_date, pickup_date) VALUES
(1, 1, 1, 'completed', 8.5, 16.92, 'Separate colors from whites', '2023-06-01', '2023-06-02'),
(2, 2, 2, 'picked_up', 3.2, 15.97, 'Handle with care', '2023-06-02', '2023-06-04'),
(3, 4, 3, 'processing', 5.0, 14.95, 'Need by 5 PM', '2023-06-05', NULL),
(4, 1, 4, 'pending', 7.8, 116.92, 'King size comforter', '2023-06-06', NULL),
(5, 3, 5, 'completed', 4.2, 10.46, '5 dress shirts', '2023-06-04', '2023-06-05'),
(1, 1, 1, 'picked_up', 6.3, 12.53, '', '2023-05-15', '2023-05-16'),
(2, 2, 3, 'picked_up', 4.1, 12.26, 'Express service requested', '2023-05-20', '2023-05-20'),
(3, 4, 1, 'picked_up', 9.2, 18.31, '', '2023-05-22', '2023-05-23'),
(4, 1, 2, 'picked_up', 2.8, 13.97, 'Silk items included', '2023-05-25', '2023-05-27'),
(5, 3, 1, 'picked_up', 7.5, 14.93, '', '2023-05-28', '2023-05-29');

-- Seed admin user (password: admin123)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@kingwashdry.com', '$2a$10$rIU6lJqkJfHAWeQdRpcQG.IuQ5Vr1MIfVuZpXY3BZ4PLbYQbLEPHe', now(), 'admin'); 