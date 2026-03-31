-- Add return_period_days column to books table
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS return_period_days INTEGER DEFAULT 14;

-- Add comment to explain the column
COMMENT ON COLUMN books.return_period_days IS 'Default number of days members have to return this book';

-- Update existing books to have a default return period if NULL
UPDATE books 
SET return_period_days = 14 
WHERE return_period_days IS NULL;
