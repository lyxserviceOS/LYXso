-- Fix CRM schema issues
-- Date: 2024-11-26

-- 1) Add customer_id to payments table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'payments' 
    AND column_name = 'customer_id'
  ) THEN
    ALTER TABLE public.payments 
      ADD COLUMN customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS payments_customer_id_idx ON public.payments(customer_id);
    
    RAISE NOTICE 'Added customer_id column to payments table';
  ELSE
    RAISE NOTICE 'customer_id column already exists in payments table';
  END IF;
END $$;

-- 2) Add installed_at to coating_jobs table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'coating_jobs' 
    AND column_name = 'installed_at'
  ) THEN
    ALTER TABLE public.coating_jobs 
      ADD COLUMN installed_at TIMESTAMPTZ;
    
    -- Backfill with completed_at if it exists
    UPDATE public.coating_jobs 
    SET installed_at = completed_at 
    WHERE completed_at IS NOT NULL AND installed_at IS NULL;
    
    CREATE INDEX IF NOT EXISTS coating_jobs_installed_at_idx ON public.coating_jobs(installed_at DESC);
    
    RAISE NOTICE 'Added installed_at column to coating_jobs table';
  ELSE
    RAISE NOTICE 'installed_at column already exists in coating_jobs table';
  END IF;
END $$;

-- 3) Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS payments_org_customer_idx ON public.payments(org_id, customer_id);
CREATE INDEX IF NOT EXISTS coating_jobs_org_customer_idx ON public.coating_jobs(org_id, customer_id);

RAISE NOTICE 'Schema fixes completed successfully';
