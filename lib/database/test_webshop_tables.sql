-- Test om webshop tabeller eksisterer
SELECT 
  table_name,
  CASE 
    WHEN table_name IN (
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    ) THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM (
  VALUES 
    ('webshop_categories'),
    ('webshop_products'),
    ('webshop_supplier_keys'),
    ('webshop_partner_products'),
    ('webshop_visibility_rules'),
    ('webshop_orders'),
    ('webshop_settings')
) AS expected(table_name)
ORDER BY table_name;

-- Count rows in each table
SELECT 'webshop_categories' as table_name, COUNT(*) as rows FROM webshop_categories
UNION ALL
SELECT 'webshop_products', COUNT(*) FROM webshop_products
UNION ALL
SELECT 'webshop_supplier_keys', COUNT(*) FROM webshop_supplier_keys
UNION ALL
SELECT 'webshop_partner_products', COUNT(*) FROM webshop_partner_products
UNION ALL
SELECT 'webshop_visibility_rules', COUNT(*) FROM webshop_visibility_rules
UNION ALL
SELECT 'webshop_orders', COUNT(*) FROM webshop_orders
UNION ALL
SELECT 'webshop_settings', COUNT(*) FROM webshop_settings;
