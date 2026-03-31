-- Update return_period_days column to support more decimal places
-- Change from DECIMAL(10,4) to DECIMAL(10,7) to support values like 0.0006944

ALTER TABLE books 
ALTER COLUMN return_period_days TYPE DECIMAL(10,7);

-- Verify the change
SELECT column_name, data_type, numeric_precision, numeric_scale 
FROM information_schema.columns 
WHERE table_name = 'books' AND column_name = 'return_period_days';
