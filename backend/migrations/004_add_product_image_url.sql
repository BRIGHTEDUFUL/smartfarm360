-- Add image_url column to products table for primary product image
-- This provides backward compatibility while we also support multiple images via product_images table

-- Check if column exists before adding (SQLite doesn't have IF NOT EXISTS for ALTER TABLE)
-- We'll use a safer approach: try to select from the column, if it fails, add it
-- Since SQLite doesn't support conditional column addition, we'll handle this in the migration runner

-- For now, we'll just ensure the index exists (which is idempotent)
CREATE INDEX IF NOT EXISTS idx_products_image_url ON products(image_url);
