-- Update service descriptions
UPDATE services 
SET description = 'Professional washing and folding service for your everyday laundry'
WHERE name LIKE '%Wash & Fold%';

UPDATE services 
SET description = 'Special care for your delicate and formal garments'
WHERE name LIKE '%Dry Cleaning%';

UPDATE services 
SET description = 'Full-service washing and professional ironing for a crisp finish'
WHERE name LIKE '%Wash & Iron%';

UPDATE services 
SET description = 'Quick turnaround service when you need your laundry in a hurry'
WHERE name LIKE '%Express%' OR name LIKE '%Same Day%'; 