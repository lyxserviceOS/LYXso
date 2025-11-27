-- Migration: Module 14 – Full Accounting & Payment System
-- Creates payments, invoices, and accounting_entries tables with RLS

-- ============================================================
-- PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  
  -- Payment details
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'NOK',
  payment_method TEXT, -- card, vipps, invoice, cash, bank_transfer
  payment_provider TEXT, -- stripe, vipps, nets, manual
  provider_transaction_id TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', 
  -- pending, processing, completed, failed, refunded, cancelled
  paid_at TIMESTAMPTZ,
  
  -- Fees & breakdown
  fee_amount NUMERIC(10,2) DEFAULT 0 CHECK (fee_amount >= 0),
  net_amount NUMERIC(10,2) GENERATED ALWAYS AS (amount - COALESCE(fee_amount, 0)) STORED,
  
  -- Receipt
  receipt_url TEXT,
  receipt_number TEXT,
  
  -- Related line items
  line_items JSONB DEFAULT '[]'::jsonb,
  -- [{ service_id, product_id, description, quantity, unit_price, amount }]
  
  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT payments_status_check CHECK (
    status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')
  )
);

CREATE INDEX IF NOT EXISTS payments_org_id_idx ON public.payments(org_id);
CREATE INDEX IF NOT EXISTS payments_booking_id_idx ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS payments_customer_id_idx ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON public.payments(status);
CREATE INDEX IF NOT EXISTS payments_paid_at_idx ON public.payments(paid_at);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON public.payments(created_at DESC);

-- Updated_at trigger for payments
CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS payments_updated_at ON public.payments;
CREATE TRIGGER payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_payments_updated_at();

-- ============================================================
-- INVOICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  
  -- Invoice details
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  
  -- Amounts
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  tax_rate NUMERIC(5,2) DEFAULT 25.00, -- 25% MVA in Norway
  tax_amount NUMERIC(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  paid_amount NUMERIC(10,2) DEFAULT 0 CHECK (paid_amount >= 0),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft',
  -- draft, sent, partially_paid, paid, overdue, cancelled, credited
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- Integration with accounting systems
  accounting_system TEXT, -- fiken, poweroffice, tripletex, manual
  accounting_id TEXT,
  exported_at TIMESTAMPTZ,
  
  -- Line items
  line_items JSONB DEFAULT '[]'::jsonb,
  -- [{ description, quantity, unit_price, tax_rate, amount }]
  
  -- Customer info snapshot (for PDF generation)
  customer_snapshot JSONB DEFAULT '{}'::jsonb,
  -- { name, email, phone, address, org_number }
  
  -- PDF
  pdf_url TEXT,
  
  -- Payment terms
  payment_terms TEXT DEFAULT 'Forfall: 14 dager',
  
  notes TEXT,
  internal_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(org_id, invoice_number),
  CONSTRAINT invoices_status_check CHECK (
    status IN ('draft', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled', 'credited')
  )
);

CREATE INDEX IF NOT EXISTS invoices_org_id_idx ON public.invoices(org_id);
CREATE INDEX IF NOT EXISTS invoices_customer_id_idx ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS invoices_booking_id_idx ON public.invoices(booking_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON public.invoices(status);
CREATE INDEX IF NOT EXISTS invoices_invoice_date_idx ON public.invoices(invoice_date DESC);
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS invoices_accounting_system_idx ON public.invoices(accounting_system, accounting_id);

-- Updated_at trigger for invoices
CREATE OR REPLACE FUNCTION public.update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS invoices_updated_at ON public.invoices;
CREATE TRIGGER invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_invoices_updated_at();

-- ============================================================
-- ACCOUNTING ENTRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.accounting_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  
  -- Entry details
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  entry_number TEXT,
  account_number TEXT NOT NULL,
  account_name TEXT,
  
  -- Amounts (double-entry bookkeeping)
  debit_amount NUMERIC(10,2) DEFAULT 0 CHECK (debit_amount >= 0),
  credit_amount NUMERIC(10,2) DEFAULT 0 CHECK (credit_amount >= 0),
  
  -- References
  reference_type TEXT, -- booking, payment, invoice, adjustment
  reference_id UUID,
  
  -- Integration
  accounting_system TEXT,
  accounting_id TEXT,
  exported_at TIMESTAMPTZ,
  
  -- Department/cost center
  department TEXT,
  cost_center TEXT,
  project_code TEXT,
  
  description TEXT NOT NULL,
  notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT accounting_entries_reference_type_check CHECK (
    reference_type IN ('booking', 'payment', 'invoice', 'adjustment', 'expense')
  ),
  CONSTRAINT accounting_entries_debit_or_credit_check CHECK (
    (debit_amount > 0 AND credit_amount = 0) OR (credit_amount > 0 AND debit_amount = 0)
  )
);

CREATE INDEX IF NOT EXISTS accounting_entries_org_id_idx ON public.accounting_entries(org_id);
CREATE INDEX IF NOT EXISTS accounting_entries_entry_date_idx ON public.accounting_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS accounting_entries_account_number_idx ON public.accounting_entries(account_number);
CREATE INDEX IF NOT EXISTS accounting_entries_reference_idx ON public.accounting_entries(reference_type, reference_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- PAYMENTS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='payments' AND policyname='payments_select_org'
  ) THEN
    CREATE POLICY payments_select_org ON public.payments
      FOR SELECT TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='payments' AND policyname='payments_insert_org'
  ) THEN
    CREATE POLICY payments_insert_org ON public.payments
      FOR INSERT TO authenticated
      WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='payments' AND policyname='payments_update_org'
  ) THEN
    CREATE POLICY payments_update_org ON public.payments
      FOR UPDATE TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid)
      WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='payments' AND policyname='payments_delete_org'
  ) THEN
    CREATE POLICY payments_delete_org ON public.payments
      FOR DELETE TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
END $$;

-- INVOICES
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='invoices' AND policyname='invoices_select_org'
  ) THEN
    CREATE POLICY invoices_select_org ON public.invoices
      FOR SELECT TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='invoices' AND policyname='invoices_insert_org'
  ) THEN
    CREATE POLICY invoices_insert_org ON public.invoices
      FOR INSERT TO authenticated
      WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='invoices' AND policyname='invoices_update_org'
  ) THEN
    CREATE POLICY invoices_update_org ON public.invoices
      FOR UPDATE TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid)
      WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='invoices' AND policyname='invoices_delete_org'
  ) THEN
    CREATE POLICY invoices_delete_org ON public.invoices
      FOR DELETE TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
END $$;

-- ACCOUNTING ENTRIES
ALTER TABLE public.accounting_entries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='accounting_entries' AND policyname='accounting_entries_select_org'
  ) THEN
    CREATE POLICY accounting_entries_select_org ON public.accounting_entries
      FOR SELECT TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='accounting_entries' AND policyname='accounting_entries_insert_org'
  ) THEN
    CREATE POLICY accounting_entries_insert_org ON public.accounting_entries
      FOR INSERT TO authenticated
      WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='accounting_entries' AND policyname='accounting_entries_update_org'
  ) THEN
    CREATE POLICY accounting_entries_update_org ON public.accounting_entries
      FOR UPDATE TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid)
      WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='accounting_entries' AND policyname='accounting_entries_delete_org'
  ) THEN
    CREATE POLICY accounting_entries_delete_org ON public.accounting_entries
      FOR DELETE TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
END $$;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to auto-generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number(p_org_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_count INT;
  v_invoice_number TEXT;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COUNT(*) + 1 INTO v_count
  FROM public.invoices
  WHERE org_id = p_org_id
    AND EXTRACT(YEAR FROM invoice_date) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  v_invoice_number := v_year || '-' || LPAD(v_count::TEXT, 4, '0');
  
  RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate invoice amounts from line items
CREATE OR REPLACE FUNCTION public.calculate_invoice_amounts(p_line_items JSONB, p_tax_rate NUMERIC DEFAULT 25.00)
RETURNS JSONB AS $$
DECLARE
  v_subtotal NUMERIC := 0;
  v_tax_amount NUMERIC := 0;
  v_total_amount NUMERIC := 0;
  v_item JSONB;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_line_items)
  LOOP
    v_subtotal := v_subtotal + (v_item->>'amount')::NUMERIC;
  END LOOP;
  
  v_tax_amount := ROUND(v_subtotal * (p_tax_rate / 100), 2);
  v_total_amount := v_subtotal + v_tax_amount;
  
  RETURN jsonb_build_object(
    'subtotal', v_subtotal,
    'tax_amount', v_tax_amount,
    'total_amount', v_total_amount
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Accounting module created successfully!';
  RAISE NOTICE 'Tables: payments, invoices, accounting_entries';
  RAISE NOTICE 'Helper functions: generate_invoice_number, calculate_invoice_amounts';
END $$;
