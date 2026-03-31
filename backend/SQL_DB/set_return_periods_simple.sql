-- Simple query to set return periods for your books
-- Copy and paste this into Supabase SQL Editor

-- Set all books to 14 days by default
UPDATE books SET return_period_days = 14;

-- Or set specific books to different periods:
-- UPDATE books SET return_period_days = 7 WHERE title = '1984';
-- UPDATE books SET return_period_days = 21 WHERE title = 'The Alchemist';
-- UPDATE books SET return_period_days = 14 WHERE title = 'Clean Code';
-- UPDATE books SET return_period_days = 10 WHERE title = 'Sapiens';

-- Verify the changes
SELECT title, author, return_period_days 
FROM books 
ORDER BY title;
