-- Add COMPLETED status to book_requests status check constraint

-- First, drop the existing constraint
ALTER TABLE book_requests 
DROP CONSTRAINT IF EXISTS book_requests_status_check;

-- Add the new constraint with COMPLETED status included
ALTER TABLE book_requests 
ADD CONSTRAINT book_requests_status_check 
CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'));

-- Verify the constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'book_requests'::regclass 
AND conname = 'book_requests_status_check';
