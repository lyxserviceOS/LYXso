-- Add missing columns to services table for public booking
-- Run this in Supabase SQL Editor

-- Add is_public column (default true for existing services)
ALTER TABLE services
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Add price column (nullable, for display on public pages)
ALTER TABLE services
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

-- Add currency column
ALTER TABLE services
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'NOK';

-- Add display_order column for sorting
ALTER TABLE services
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add index for public services lookup
CREATE INDEX IF NOT EXISTS idx_services_public 
ON services(org_id, is_active, is_public) 
WHERE is_active = true AND is_public = true;

-- Update existing services to be public by default
UPDATE services 
SET is_public = true 
WHERE is_public IS NULL;

COMMENT ON COLUMN services.is_public IS 'Whether service is visible on public booking page';
COMMENT ON COLUMN services.price IS 'Display price for public booking (optional)';
COMMENT ON COLUMN services.currency IS 'Currency code (NOK, SEK, DKK, etc)';
COMMENT ON COLUMN services.display_order IS 'Sort order on public pages (lower = first)';
