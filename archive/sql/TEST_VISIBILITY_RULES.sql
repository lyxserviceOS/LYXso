/**
 * Test script for Visibility Rules Evaluation
 * 
 * Run this after creating rules in the admin UI to verify they work correctly
 */

-- =============================================================================
-- SETUP: Create test data
-- =============================================================================

-- 1. Set a user as VIP customer
UPDATE user_profiles
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{customer_type}',
  '"vip"'
)
WHERE id = 'YOUR_USER_ID_HERE';

-- 2. Set another user as Business customer
UPDATE user_profiles
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{customer_type}',
  '"business"'
)
WHERE id = 'ANOTHER_USER_ID_HERE';

-- 3. Create test products (if not exists)
INSERT INTO webshop_products (
  org_id,
  name,
  slug,
  description,
  price,
  category,
  tags,
  is_active
) VALUES
  ('YOUR_ORG_ID', 'Premium Dekk Michelin', 'premium-dekk-michelin', 'Premium vinterdekk', 2500, 'dekk', ARRAY['premium', 'vinter'], true),
  ('YOUR_ORG_ID', 'Budget Dekk Continental', 'budget-dekk-continental', 'Budget sommerdekk', 800, 'dekk', ARRAY['budget', 'sommer'], true),
  ('YOUR_ORG_ID', 'Premium Felger BBS', 'premium-felger-bbs', 'Premium aluminiumsfelger', 3500, 'felger', ARRAY['premium'], true),
  ('YOUR_ORG_ID', 'Motorolje 5W-30', 'motorolje-5w30', 'Syntetisk motorolje', 450, 'vedlikehold', ARRAY['olje'], true),
  ('YOUR_ORG_ID', 'Bremseklosser', 'bremseklosser', 'Høykvalitets bremseklosser', 1200, 'verksted', ARRAY['bremser'], true);

-- =============================================================================
-- TEST 1: Create VIP Rule
-- =============================================================================

INSERT INTO webshop_visibility_rules (
  org_id,
  name,
  rule_type,
  conditions,
  product_filters,
  priority,
  is_active
) VALUES (
  'YOUR_ORG_ID',
  'VIP Premium Products',
  'customer_type',
  '{"customer_types": ["vip"]}',
  '{
    "categories": ["dekk", "felger"],
    "tags": ["premium"],
    "price_range": {"min": 2000},
    "partner_products": true,
    "own_products": true
  }',
  10,
  true
);

-- Expected result for VIP users:
-- Should see: Premium Dekk Michelin (2500 kr), Premium Felger BBS (3500 kr)
-- Should NOT see: Budget dekk, Motorolje, Bremseklosser

-- =============================================================================
-- TEST 2: Create Business Rule
-- =============================================================================

INSERT INTO webshop_visibility_rules (
  org_id,
  name,
  rule_type,
  conditions,
  product_filters,
  priority,
  is_active
) VALUES (
  'YOUR_ORG_ID',
  'Business Workshop Products',
  'customer_type',
  '{"customer_types": ["business"]}',
  '{
    "categories": ["verksted", "vedlikehold"],
    "partner_products": true,
    "own_products": true
  }',
  5,
  true
);

-- Expected result for Business users:
-- Should see: Motorolje, Bremseklosser
-- Should NOT see: Dekk, Felger

-- =============================================================================
-- TEST 3: Verify rules in database
-- =============================================================================

-- Check all rules for your org
SELECT
  name,
  rule_type,
  priority,
  is_active,
  conditions,
  product_filters,
  created_at
FROM webshop_visibility_rules
WHERE org_id = 'YOUR_ORG_ID'
ORDER BY priority DESC;

-- =============================================================================
-- TEST 4: Test with curl (local)
-- =============================================================================

/*
# Test as VIP user (after setting metadata)
curl http://localhost:3000/api/webshop/catalog

# Expected response:
{
  "products": [
    {
      "name": "Premium Dekk Michelin",
      "price": 2500,
      "category": "dekk",
      "tags": ["premium", "vinter"]
    },
    {
      "name": "Premium Felger BBS",
      "price": 3500,
      "category": "felger",
      "tags": ["premium"]
    }
  ],
  "pagination": {...}
}

# Test as admin (bypass rules)
curl http://localhost:3000/api/webshop/products?skip_visibility=true

# Expected: ALL products
*/

-- =============================================================================
-- TEST 5: Test rule priority
-- =============================================================================

-- Create a catch-all rule with lower priority
INSERT INTO webshop_visibility_rules (
  org_id,
  name,
  rule_type,
  conditions,
  product_filters,
  priority,
  is_active
) VALUES (
  'YOUR_ORG_ID',
  'Default All Products',
  'custom',
  '{}',
  '{
    "partner_products": true,
    "own_products": true
  }',
  1,
  true
);

-- Expected behavior:
-- - VIP users: Match VIP rule (priority 10) → See only premium products
-- - Business users: Match Business rule (priority 5) → See only workshop products
-- - Other users: Match Default rule (priority 1) → See all products

-- =============================================================================
-- CLEANUP: Remove test data
-- =============================================================================

-- Delete test rules
DELETE FROM webshop_visibility_rules
WHERE org_id = 'YOUR_ORG_ID'
AND name IN ('VIP Premium Products', 'Business Workshop Products', 'Default All Products');

-- Delete test products
DELETE FROM webshop_products
WHERE org_id = 'YOUR_ORG_ID'
AND slug IN (
  'premium-dekk-michelin',
  'budget-dekk-continental',
  'premium-felger-bbs',
  'motorolje-5w30',
  'bremseklosser'
);

-- Reset user metadata
UPDATE user_profiles
SET metadata = metadata - 'customer_type'
WHERE id IN ('YOUR_USER_ID_HERE', 'ANOTHER_USER_ID_HERE');

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check user context
SELECT
  up.id,
  up.org_id,
  up.metadata->>'customer_type' as customer_type,
  o.plan_id
FROM user_profiles up
LEFT JOIN organizations o ON o.id = up.org_id
WHERE up.id = 'YOUR_USER_ID_HERE';

-- Check which products match VIP filter
SELECT
  name,
  price,
  category,
  tags
FROM webshop_products
WHERE org_id = 'YOUR_ORG_ID'
  AND category IN ('dekk', 'felger')
  AND tags && ARRAY['premium']
  AND price >= 2000;

-- Check active rules count
SELECT
  COUNT(*) as active_rules,
  MAX(priority) as highest_priority
FROM webshop_visibility_rules
WHERE org_id = 'YOUR_ORG_ID'
  AND is_active = true;
