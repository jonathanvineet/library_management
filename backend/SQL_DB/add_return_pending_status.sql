-- Add RETURN_PENDING to the transactions status check constraint

-- Drop the existing constraint
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;

-- Add the new constraint with RETURN_PENDING included
ALTER TABLE transactions ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('BORROWED', 'RETURNED', 'OVERDUE', 'LOST', 'RETURN_PENDING'));
