-- Migration: Update attendance table constraints and indexes
-- This enforces unique attendance per user per day and optimizes queries

-- Ensure unique constraint exists (may already be present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'attendances_user_date_unique'
  ) THEN
    ALTER TABLE attendance 
    ADD CONSTRAINT attendances_user_date_unique UNIQUE (user_id, date);
  END IF;
END $$;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);
CREATE INDEX IF NOT EXISTS idx_attendance_user_date_status ON attendance(user_id, date, status);

-- Update status enum to only allow required values
-- Note: This requires dropping and recreating the column if enum values need to be restricted
-- For now, we'll rely on application-level validation

-- Add check constraint for status values
ALTER TABLE attendance 
ADD CONSTRAINT check_status_values 
CHECK (status IN ('present', 'absent', 'conge'));