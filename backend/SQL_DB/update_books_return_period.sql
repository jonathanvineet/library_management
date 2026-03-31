-- Update existing books with return period values
-- You can customize these values based on book categories or titles

-- Set default 14 days for all books first
UPDATE books 
SET return_period_days = 14 
WHERE return_period_days IS NULL;

-- Optional: Set different return periods based on category
-- Uncomment and modify as needed:

-- Fiction books: 21 days
-- UPDATE books 
-- SET return_period_days = 21 
-- WHERE category ILIKE '%fiction%' OR category ILIKE '%novel%';

-- Reference/Technical books: 7 days (shorter period)
-- UPDATE books 
-- SET return_period_days = 7 
-- WHERE category ILIKE '%reference%' OR category ILIKE '%technical%';

-- Popular books: 10 days
-- UPDATE books 
-- SET return_period_days = 10 
-- WHERE title IN ('1984', 'The Alchemist', 'Sapiens');

-- Verify the updates
SELECT id, title, category, return_period_days 
FROM books 
ORDER BY title;
