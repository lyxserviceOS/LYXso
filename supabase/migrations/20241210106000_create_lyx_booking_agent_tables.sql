-- Migration: Leads & Lead Events for LYX Booking Agent
-- Creates tables for lead management and SMS tracking

-- ============================================================
-- LEADS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  
  -- Contact info
  name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Lead details
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT,
  source_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Interest info
  interested_services TEXT[],
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  
  -- Metadata
  metadata JSONB,
  
  -- Assignment
  assigned_to UUID REFERENCES public.org_members(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  
  -- Conversion tracking
  converted_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT leads_status_check CHECK (
    status IN ('new', 'contacted', 'interested', 'qualified', 'unqualified', 'converted', 'lost')
  )
);

-- ============================================================
-- LEAD_EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  
  -- Event details
  event_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT lead_events_type_check CHECK (
    event_type IN (
      'created',
      'status_changed',
      'assigned',
      'contacted',
      'sms_sent',
      'sms_received',
      'email_sent',
      'email_received',
      'call_made',
      'call_received',
      'meeting_scheduled',
      'meeting_completed',
      'note_added',
      'converted',
      'lost'
    )
  )
);

-- ============================================================
-- AI_MESSAGES TABLE (hvis ikke eksisterer)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  
  -- Message details
  sender_type TEXT NOT NULL,
  sender_phone TEXT,
  message_text TEXT NOT NULL,
  
  -- AI metadata
  ai_confidence NUMERIC(3,2),
  ai_intent TEXT,
  ai_extracted_data JSONB,
  
  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT ai_messages_sender_type_check CHECK (
    sender_type IN ('customer', 'assistant', 'agent', 'system')
  )
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS leads_org_status_idx ON public.leads(org_id, status);
CREATE INDEX IF NOT EXISTS leads_customer_id_idx ON public.leads(customer_id);
CREATE INDEX IF NOT EXISTS leads_phone_idx ON public.leads(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON public.leads(assigned_to) WHERE assigned_to IS NOT NULL;

CREATE INDEX IF NOT EXISTS lead_events_lead_id_idx ON public.lead_events(lead_id);
CREATE INDEX IF NOT EXISTS lead_events_type_created_idx ON public.lead_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS ai_messages_conversation_id_idx ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS ai_messages_created_at_idx ON public.ai_messages(created_at);

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- Leads policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='leads' AND policyname='leads_select_org'
  ) THEN
    CREATE POLICY leads_select_org ON public.leads
      FOR SELECT TO authenticated
      USING (org_id IN (
        SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
      ));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='leads' AND policyname='leads_insert_org'
  ) THEN
    CREATE POLICY leads_insert_org ON public.leads
      FOR INSERT TO authenticated
      WITH CHECK (org_id IN (
        SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
      ));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='leads' AND policyname='leads_update_org'
  ) THEN
    CREATE POLICY leads_update_org ON public.leads
      FOR UPDATE TO authenticated
      USING (org_id IN (
        SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
      ))
      WITH CHECK (org_id IN (
        SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
      ));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='leads' AND policyname='leads_delete_org'
  ) THEN
    CREATE POLICY leads_delete_org ON public.leads
      FOR DELETE TO authenticated
      USING (org_id IN (
        SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
      ));
  END IF;
END $$;

-- Lead Events policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='lead_events' AND policyname='lead_events_select_org'
  ) THEN
    CREATE POLICY lead_events_select_org ON public.lead_events
      FOR SELECT TO authenticated
      USING (lead_id IN (
        SELECT id FROM public.leads WHERE org_id IN (
          SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
        )
      ));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='lead_events' AND policyname='lead_events_insert_org'
  ) THEN
    CREATE POLICY lead_events_insert_org ON public.lead_events
      FOR INSERT TO authenticated
      WITH CHECK (lead_id IN (
        SELECT id FROM public.leads WHERE org_id IN (
          SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
        )
      ));
  END IF;
END $$;

-- AI Messages policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='ai_messages' AND policyname='ai_messages_select_org'
  ) THEN
    CREATE POLICY ai_messages_select_org ON public.ai_messages
      FOR SELECT TO authenticated
      USING (conversation_id IN (
        SELECT id FROM public.ai_conversations WHERE org_id IN (
          SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
        )
      ));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='ai_messages' AND policyname='ai_messages_insert_org'
  ) THEN
    CREATE POLICY ai_messages_insert_org ON public.ai_messages
      FOR INSERT TO authenticated
      WITH CHECK (conversation_id IN (
        SELECT id FROM public.ai_conversations WHERE org_id IN (
          SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
        )
      ));
  END IF;
END $$;

-- ============================================================
-- SERVICE ROLE POLICIES (for Twilio webhook)
-- ============================================================
DO $$
BEGIN
  -- Allow service role to insert leads, events, and messages
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='leads' AND policyname='leads_service_all'
  ) THEN
    CREATE POLICY leads_service_all ON public.leads
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='lead_events' AND policyname='lead_events_service_all'
  ) THEN
    CREATE POLICY lead_events_service_all ON public.lead_events
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='ai_conversations' AND policyname='ai_conversations_service_all'
  ) THEN
    CREATE POLICY ai_conversations_service_all ON public.ai_conversations
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='ai_messages' AND policyname='ai_messages_service_all'
  ) THEN
    CREATE POLICY ai_messages_service_all ON public.ai_messages
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE public.leads IS 'Leads/prospekter som kan konverteres til kunder via LYX Booking Agent';
COMMENT ON TABLE public.lead_events IS 'Hendelseslogg for leads (SMS, anrop, status-endringer, etc)';
COMMENT ON TABLE public.ai_messages IS 'Meldinger i AI-konversasjoner (SMS, chat, etc)';

COMMENT ON COLUMN public.leads.status IS 'Lead status: new, contacted, interested, qualified, unqualified, converted, lost';
COMMENT ON COLUMN public.leads.source IS 'Hvor lead kom fra (sms, web, facebook, google, etc)';
COMMENT ON COLUMN public.leads.assigned_to IS 'Hvem som er ansvarlig for oppfølging';

COMMENT ON COLUMN public.lead_events.event_type IS 'Type hendelse: created, status_changed, sms_sent, sms_received, etc';

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '✅ LYX Booking Agent tables created successfully!';
  RAISE NOTICE 'Tables: leads, lead_events, ai_messages';
  RAISE NOTICE 'RLS: Enabled with org-based policies';
  RAISE NOTICE 'Service role: Has full access for Twilio webhook';
END $$;
