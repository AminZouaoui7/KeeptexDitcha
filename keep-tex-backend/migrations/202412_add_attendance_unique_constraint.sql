-- Migration: Add unique constraint to prevent duplicate attendance entries
-- This prevents duplicate day/employee combinations in the attendance table

-- Check if constraint already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'attendance_unique_user_date'
    ) THEN
        ALTER TABLE attendance
        ADD CONSTRAINT attendance_unique_user_date UNIQUE (user_id, date);
        
        RAISE NOTICE '✅ Constraint attendance_unique_user_date added successfully';
    ELSE
        RAISE NOTICE 'ℹ️ Constraint attendance_unique_user_date already exists';
    END IF;
END $$;

-- Create index for performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);