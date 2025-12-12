-- ============================================================================
-- SEED DATA: NORSKE BILMERKER OG MODELLER
-- ============================================================================
-- Dato: 10. desember 2024
-- Formål: Populere vehicle_makes og vehicle_models med norske favoritter
-- ============================================================================

BEGIN;

-- ============================================================================
-- POPULÆRE BILMERKER I NORGE
-- ============================================================================

INSERT INTO public.vehicle_makes (name, country, logo_url) VALUES
  ('Toyota', 'JP', 'https://www.carlogos.org/car-logos/toyota-logo.png'),
  ('Volkswagen', 'DE', 'https://www.carlogos.org/car-logos/volkswagen-logo.png'),
  ('Tesla', 'US', 'https://www.carlogos.org/car-logos/tesla-logo.png'),
  ('Volvo', 'SE', 'https://www.carlogos.org/car-logos/volvo-logo.png'),
  ('BMW', 'DE', 'https://www.carlogos.org/car-logos/bmw-logo.png'),
  ('Audi', 'DE', 'https://www.carlogos.org/car-logos/audi-logo.png'),
  ('Mercedes-Benz', 'DE', 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png'),
  ('Skoda', 'CZ', 'https://www.carlogos.org/car-logos/skoda-logo.png'),
  ('Peugeot', 'FR', 'https://www.carlogos.org/car-logos/peugeot-logo.png'),
  ('Nissan', 'JP', 'https://www.carlogos.org/car-logos/nissan-logo.png'),
  ('Hyundai', 'KR', 'https://www.carlogos.org/car-logos/hyundai-logo.png'),
  ('Kia', 'KR', 'https://www.carlogos.org/car-logos/kia-logo.png'),
  ('Mazda', 'JP', 'https://www.carlogos.org/car-logos/mazda-logo.png'),
  ('Ford', 'US', 'https://www.carlogos.org/car-logos/ford-logo.png'),
  ('Renault', 'FR', 'https://www.carlogos.org/car-logos/renault-logo.png'),
  ('Opel', 'DE', 'https://www.carlogos.org/car-logos/opel-logo.png'),
  ('Citroën', 'FR', 'https://www.carlogos.org/car-logos/citroen-logo.png'),
  ('Honda', 'JP', 'https://www.carlogos.org/car-logos/honda-logo.png'),
  ('Subaru', 'JP', 'https://www.carlogos.org/car-logos/subaru-logo.png'),
  ('Suzuki', 'JP', 'https://www.carlogos.org/car-logos/suzuki-logo.png'),
  ('Mitsubishi', 'JP', 'https://www.carlogos.org/car-logos/mitsubishi-logo.png'),
  ('Seat', 'ES', 'https://www.carlogos.org/car-logos/seat-logo.png'),
  ('Dacia', 'RO', 'https://www.carlogos.org/car-logos/dacia-logo.png'),
  ('Lexus', 'JP', 'https://www.carlogos.org/car-logos/lexus-logo.png'),
  ('Porsche', 'DE', 'https://www.carlogos.org/car-logos/porsche-logo.png'),
  ('Land Rover', 'GB', 'https://www.carlogos.org/car-logos/land-rover-logo.png'),
  ('Jaguar', 'GB', 'https://www.carlogos.org/car-logos/jaguar-logo.png'),
  ('Mini', 'GB', 'https://www.carlogos.org/car-logos/mini-logo.png'),
  ('Fiat', 'IT', 'https://www.carlogos.org/car-logos/fiat-logo.png'),
  ('Alfa Romeo', 'IT', 'https://www.carlogos.org/car-logos/alfa-romeo-logo.png'),
  ('Jeep', 'US', 'https://www.carlogos.org/car-logos/jeep-logo.png'),
  ('Chevrolet', 'US', 'https://www.carlogos.org/car-logos/chevrolet-logo.png'),
  ('Dodge', 'US', 'https://www.carlogos.org/car-logos/dodge-logo.png'),
  ('Chrysler', 'US', 'https://www.carlogos.org/car-logos/chrysler-logo.png'),
  ('Cadillac', 'US', 'https://www.carlogos.org/car-logos/cadillac-logo.png')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- POPULÆRE MODELLER (Per merke)
-- ============================================================================

-- Toyota modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type) 
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('Corolla', 1966, 'Sedan', 'Petrol'),
  ('RAV4', 1994, 'SUV', 'Hybrid'),
  ('Yaris', 1999, 'Hatchback', 'Hybrid'),
  ('Camry', 1982, 'Sedan', 'Hybrid'),
  ('Aygo', 2005, 'Hatchback', 'Petrol'),
  ('C-HR', 2016, 'SUV', 'Hybrid'),
  ('Prius', 1997, 'Hatchback', 'Hybrid'),
  ('Highlander', 2000, 'SUV', 'Hybrid'),
  ('Land Cruiser', 1951, 'SUV', 'Diesel'),
  ('Avensis', 1997, 'Wagon', 'Diesel')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Toyota'
ON CONFLICT DO NOTHING;

-- Volkswagen modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('Golf', 1974, 'Hatchback', 'Petrol'),
  ('Passat', 1973, 'Sedan', 'Diesel'),
  ('Tiguan', 2007, 'SUV', 'Diesel'),
  ('Polo', 1975, 'Hatchback', 'Petrol'),
  ('Touran', 2003, 'MPV', 'Diesel'),
  ('Touareg', 2002, 'SUV', 'Diesel'),
  ('Arteon', 2017, 'Sedan', 'Diesel'),
  ('ID.3', 2020, 'Hatchback', 'Electric'),
  ('ID.4', 2021, 'SUV', 'Electric'),
  ('e-Golf', 2014, 'Hatchback', 'Electric')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Volkswagen'
ON CONFLICT DO NOTHING;

-- Tesla modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('Model 3', 2017, 'Sedan', 'Electric'),
  ('Model Y', 2020, 'SUV', 'Electric'),
  ('Model S', 2012, 'Sedan', 'Electric'),
  ('Model X', 2015, 'SUV', 'Electric')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Tesla'
ON CONFLICT DO NOTHING;

-- Volvo modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('XC90', 2002, 'SUV', 'Hybrid'),
  ('XC60', 2008, 'SUV', 'Hybrid'),
  ('XC40', 2017, 'SUV', 'Electric'),
  ('V90', 2016, 'Wagon', 'Diesel'),
  ('V60', 2010, 'Wagon', 'Hybrid'),
  ('S90', 2016, 'Sedan', 'Diesel'),
  ('S60', 2010, 'Sedan', 'Hybrid')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Volvo'
ON CONFLICT DO NOTHING;

-- BMW modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('3-Series', 1975, 'Sedan', 'Petrol'),
  ('5-Series', 1972, 'Sedan', 'Diesel'),
  ('X3', 2003, 'SUV', 'Diesel'),
  ('X5', 1999, 'SUV', 'Diesel'),
  ('X1', 2009, 'SUV', 'Diesel'),
  ('i3', 2013, 'Hatchback', 'Electric'),
  ('i4', 2021, 'Sedan', 'Electric'),
  ('iX', 2021, 'SUV', 'Electric'),
  ('7-Series', 1977, 'Sedan', 'Hybrid')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'BMW'
ON CONFLICT DO NOTHING;

-- Audi modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('A4', 1994, 'Sedan', 'Diesel'),
  ('A6', 1994, 'Sedan', 'Diesel'),
  ('Q5', 2008, 'SUV', 'Diesel'),
  ('Q7', 2005, 'SUV', 'Diesel'),
  ('Q3', 2011, 'SUV', 'Petrol'),
  ('e-tron', 2018, 'SUV', 'Electric'),
  ('A3', 1996, 'Hatchback', 'Diesel')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Audi'
ON CONFLICT DO NOTHING;

-- Mercedes-Benz modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('C-Class', 1993, 'Sedan', 'Diesel'),
  ('E-Class', 1993, 'Sedan', 'Diesel'),
  ('GLC', 2015, 'SUV', 'Diesel'),
  ('GLE', 1997, 'SUV', 'Diesel'),
  ('A-Class', 1997, 'Hatchback', 'Petrol'),
  ('EQC', 2019, 'SUV', 'Electric'),
  ('EQA', 2021, 'SUV', 'Electric'),
  ('S-Class', 1972, 'Sedan', 'Hybrid')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Mercedes-Benz'
ON CONFLICT DO NOTHING;

-- Skoda modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('Octavia', 1996, 'Wagon', 'Diesel'),
  ('Superb', 2001, 'Sedan', 'Diesel'),
  ('Kodiaq', 2016, 'SUV', 'Diesel'),
  ('Karoq', 2017, 'SUV', 'Petrol'),
  ('Fabia', 1999, 'Hatchback', 'Petrol'),
  ('Enyaq', 2020, 'SUV', 'Electric')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Skoda'
ON CONFLICT DO NOTHING;

-- Hyundai modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('i30', 2007, 'Hatchback', 'Petrol'),
  ('Tucson', 2004, 'SUV', 'Hybrid'),
  ('Kona', 2017, 'SUV', 'Electric'),
  ('Ioniq', 2016, 'Hatchback', 'Electric'),
  ('Santa Fe', 2000, 'SUV', 'Diesel'),
  ('i20', 2008, 'Hatchback', 'Petrol')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Hyundai'
ON CONFLICT DO NOTHING;

-- Kia modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('Sportage', 1993, 'SUV', 'Diesel'),
  ('Niro', 2016, 'SUV', 'Hybrid'),
  ('e-Niro', 2018, 'SUV', 'Electric'),
  ('EV6', 2021, 'SUV', 'Electric'),
  ('Ceed', 2006, 'Hatchback', 'Petrol'),
  ('Sorento', 2002, 'SUV', 'Diesel')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Kia'
ON CONFLICT DO NOTHING;

-- Nissan modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('Leaf', 2010, 'Hatchback', 'Electric'),
  ('Qashqai', 2006, 'SUV', 'Petrol'),
  ('X-Trail', 2000, 'SUV', 'Diesel'),
  ('Juke', 2010, 'SUV', 'Petrol'),
  ('Micra', 1982, 'Hatchback', 'Petrol')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Nissan'
ON CONFLICT DO NOTHING;

-- Peugeot modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('208', 2012, 'Hatchback', 'Electric'),
  ('2008', 2013, 'SUV', 'Petrol'),
  ('3008', 2008, 'SUV', 'Diesel'),
  ('5008', 2009, 'SUV', 'Diesel'),
  ('308', 2007, 'Hatchback', 'Diesel')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Peugeot'
ON CONFLICT DO NOTHING;

-- Ford modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('Focus', 1998, 'Hatchback', 'Petrol'),
  ('Fiesta', 1976, 'Hatchback', 'Petrol'),
  ('Mustang', 1964, 'Coupe', 'Petrol'),
  ('Mustang Mach-E', 2020, 'SUV', 'Electric'),
  ('Kuga', 2008, 'SUV', 'Hybrid'),
  ('Puma', 2019, 'SUV', 'Petrol')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Ford'
ON CONFLICT DO NOTHING;

-- Mazda modeller
INSERT INTO public.vehicle_models (make_id, name, year_from, body_type, fuel_type)
SELECT id, model, year_from, body_type, fuel_type FROM public.vehicle_makes, (VALUES
  ('CX-5', 2012, 'SUV', 'Diesel'),
  ('CX-30', 2019, 'SUV', 'Petrol'),
  ('Mazda3', 2003, 'Hatchback', 'Petrol'),
  ('Mazda6', 2002, 'Sedan', 'Diesel'),
  ('MX-30', 2020, 'SUV', 'Electric')
) AS t(model, year_from, body_type, fuel_type)
WHERE vehicle_makes.name = 'Mazda'
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
DECLARE
  makes_count INTEGER;
  models_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO makes_count FROM public.vehicle_makes;
  SELECT COUNT(*) INTO models_count FROM public.vehicle_models;
  
  RAISE NOTICE '============================================';
  RAISE NOTICE '✅ BILMERKER OG MODELLER SEEDED!';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE '  📊 % bilmerker lastet inn', makes_count;
  RAISE NOTICE '  📊 % modeller lastet inn', models_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Brukere kan nå velge fra populære norske biler!';
  RAISE NOTICE '============================================';
END $$;
