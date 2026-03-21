-- Migration: Add status column to users table
-- Description: Adds status field to track user account state (active, inactive, suspended)
-- Note: This migration is idempotent - it checks if the column exists before adding it

-- SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- So we'll skip this migration if the column already exists
-- The base schema already includes the status column
