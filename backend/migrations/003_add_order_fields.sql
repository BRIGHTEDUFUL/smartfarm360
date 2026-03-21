-- Add delivery_address and notes columns to orders table
-- Migration: 003_add_order_fields.sql

-- Check if columns exist before adding them
-- SQLite doesn't have IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- So we'll use a workaround with a temporary table approach

-- This migration is idempotent - it won't fail if columns already exist
-- The columns are already in the base schema, so this is a no-op
