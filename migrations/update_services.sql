-- Update service descriptions
UPDATE services 
SET description = 'Professional washing and folding service for your everyday laundry'
WHERE name LIKE '%Wash & Fold%';

UPDATE services 
SET description = 'Full-service washing and professional ironing for a crisp finish'
WHERE name LIKE '%Wash & Iron%';

-- Rename Express/Same Day service and update its description
UPDATE services 
SET name = 'Express Wash & Fold',
    description = 'Same day wash & fold service when you need your laundry in a hurry'
WHERE id=3;

-- Remove dry cleaning service
DELETE FROM services 
WHERE name LIKE '%Dry Cleaning%'; 