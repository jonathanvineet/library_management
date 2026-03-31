-- Fix available_copies for existing books and add default constraint

-- Step 1: Update existing books where available_copies is NULL
-- Set available_copies = total_copies for books that haven't been borrowed
UPDATE books 
SET available_copies = total_copies 
WHERE available_copies IS NULL;

-- Step 2: Add a default value constraint (optional, for new inserts via SQL)
ALTER TABLE books 
ALTER COLUMN available_copies SET DEFAULT 0;

-- Step 3: Verify the changes
SELECT id, title, total_copies, available_copies, 
       CASE 
           WHEN available_copies > 0 THEN 'AVAILABLE'
           ELSE 'OUT_OF_STOCK'
       END as status
FROM books
ORDER BY id;
