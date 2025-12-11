-- =====================================================
-- AI LEARNING SYSTEM - KOMPLETT LÆRINGSSYSTEM
-- =====================================================
-- Dette systemet lar AI-en lære seg:
-- 1. Dine (LYX) mønstre og råd
-- 2. Kundens bedrift (åpningstider, priser, tjenester)
-- 3. Ansattes svar og godkjenninger
-- =====================================================

-- Tabell: ai_knowledge_base
-- Lagrer kunnskapsbase per organisasjon
CREATE TABLE IF NOT EXISTS public.ai_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  
  -- Kategorier av kunnskap
  category VARCHAR(100) NOT NULL, -- 'business_hours', 'pricing', 'services', 'policies', 'faq', 'custom'
  
  -- Spørsmål og svar
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  
  -- Metadata
  keywords TEXT[], -- For søk
  confidence_score DECIMAL(3,2) DEFAULT 0.0, -- 0.0 til 1.0
  times_used INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_corrected INTEGER DEFAULT 0,
  
  -- Læringsstatus
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'active', 'needs_review', 'archived'
  
  -- Hvem la til
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  
  -- Tidsstempler
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_confidence CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0)
);

-- Tabell: ai_training_conversations
-- Lagrer samtaler som brukes for å trene AI-en
CREATE TABLE IF NOT EXISTS public.ai_training_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE SET NULL,
  
  -- Original samtale
  customer_message TEXT NOT NULL,
  employee_response TEXT, -- Ansattes faktiske svar
  ai_suggested_response TEXT, -- AI sitt forslag
  
  -- Læringsdata
  was_ai_correct BOOLEAN,
  correction_needed BOOLEAN DEFAULT FALSE,
  employee_feedback TEXT,
  
  -- Hva AI-en skal lære
  learning_points JSONB, -- Strukturert data om hva som ble lært
  
  -- Kategorisering
  topic VARCHAR(100), -- 'booking', 'pricing', 'hours', 'services', etc.
  complexity VARCHAR(50) DEFAULT 'medium', -- 'simple', 'medium', 'complex'
  
  -- Follow-up spørsmål AI stilte
  ai_followup_questions JSONB,
  employee_followup_answers JSONB,
  
  -- Status
  training_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_review', 'approved', 'trained', 'rejected'
  
  -- Hvem godkjente
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell: ai_pattern_library
-- Lagrer LYX sine mønstre og beste praksis
CREATE TABLE IF NOT EXISTS public.ai_pattern_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Pattern info
  pattern_name VARCHAR(200) NOT NULL,
  pattern_type VARCHAR(100) NOT NULL, -- 'communication', 'sales', 'service', 'support', etc.
  
  -- Pattern innhold
  description TEXT NOT NULL,
  example_scenarios JSONB, -- Array av eksempel-scenarier
  recommended_responses JSONB, -- Array av anbefalte svar
  
  -- Når skal dette brukes
  trigger_keywords TEXT[],
  context_requirements JSONB,
  
  -- Effektivitet
  success_rate DECIMAL(3,2) DEFAULT 0.0,
  times_used INTEGER DEFAULT 0,
  
  -- LYX-spesifikke felter
  is_lyx_pattern BOOLEAN DEFAULT TRUE, -- TRUE for LYX sine mønstre
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0, -- Høyere = viktigere
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell: ai_learning_sessions
-- Når en ansatt trener AI-en aktivt
CREATE TABLE IF NOT EXISTS public.ai_learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  
  -- Session info
  session_type VARCHAR(100) NOT NULL, -- 'initial_setup', 'ongoing_training', 'correction', 'qa_review'
  
  -- Hvem trener
  trainer_id UUID NOT NULL REFERENCES auth.users(id),
  trainer_name VARCHAR(255),
  
  -- Hva ble trent
  topics_covered TEXT[],
  questions_answered INTEGER DEFAULT 0,
  knowledge_items_added INTEGER DEFAULT 0,
  
  -- Session data
  session_data JSONB, -- Detaljert info om hva som skjedde
  
  -- Kvalitet
  quality_score DECIMAL(3,2),
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell: ai_correction_queue
-- Når AI-en svarer feil og trenger korreksjon
CREATE TABLE IF NOT EXISTS public.ai_correction_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  
  -- Original interaksjon
  conversation_id UUID REFERENCES public.ai_conversations(id),
  message_id UUID REFERENCES public.ai_messages(id),
  
  -- Hva gikk galt
  customer_question TEXT NOT NULL,
  ai_wrong_answer TEXT NOT NULL,
  correct_answer TEXT,
  
  -- Hvorfor var det feil
  error_type VARCHAR(100), -- 'outdated_info', 'missing_info', 'wrong_interpretation', 'other'
  error_description TEXT,
  
  -- Prioritet
  priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'corrected', 'dismissed'
  
  -- Hvem fikset
  corrected_by UUID REFERENCES auth.users(id),
  corrected_at TIMESTAMP WITH TIME ZONE,
  
  -- Hva ble lært
  learned_from_correction JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell: ai_followup_questions
-- AI sine oppfølgingsspørsmål for å lære mer
CREATE TABLE IF NOT EXISTS public.ai_followup_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  
  -- Trigger
  triggered_by_conversation UUID REFERENCES public.ai_conversations(id),
  triggered_by_topic VARCHAR(100),
  
  -- Spørsmålet AI stiller
  question_text TEXT NOT NULL,
  question_context TEXT,
  question_purpose TEXT, -- Hvorfor AI spør dette
  
  -- Ansattes svar
  answer_text TEXT,
  answered_by UUID REFERENCES auth.users(id),
  answered_at TIMESTAMP WITH TIME ZONE,
  
  -- Hva AI lærte
  knowledge_extracted JSONB,
  added_to_knowledge_base BOOLEAN DEFAULT FALSE,
  knowledge_base_id UUID REFERENCES public.ai_knowledge_base(id),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'answered', 'skipped', 'not_relevant'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell: ai_performance_metrics
-- Track hvor bra AI-en presterer over tid
CREATE TABLE IF NOT EXISTS public.ai_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  
  -- Tidsperiode
  metric_date DATE NOT NULL,
  hour_of_day INTEGER, -- 0-23, NULL for daglig aggregering
  
  -- Volum
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  
  -- Kvalitet
  correct_responses INTEGER DEFAULT 0,
  incorrect_responses INTEGER DEFAULT 0,
  needed_human_intervention INTEGER DEFAULT 0,
  
  -- Effektivitet
  avg_response_time_seconds DECIMAL(10,2),
  avg_confidence_score DECIMAL(3,2),
  
  -- Læring
  new_knowledge_items_learned INTEGER DEFAULT 0,
  patterns_applied INTEGER DEFAULT 0,
  
  -- Tilfredshet
  positive_feedback INTEGER DEFAULT 0,
  negative_feedback INTEGER DEFAULT 0,
  
  -- Business outcomes
  bookings_completed INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(org_id, metric_date, hour_of_day)
);

-- =====================================================
-- INDEXES FOR YTELSE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_base_org 
  ON public.ai_knowledge_base(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_base_category 
  ON public.ai_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_base_status 
  ON public.ai_knowledge_base(status);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_base_keywords 
  ON public.ai_knowledge_base USING GIN(keywords);

CREATE INDEX IF NOT EXISTS idx_ai_training_conversations_org 
  ON public.ai_training_conversations(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_training_conversations_status 
  ON public.ai_training_conversations(training_status);
CREATE INDEX IF NOT EXISTS idx_ai_training_conversations_topic 
  ON public.ai_training_conversations(topic);

CREATE INDEX IF NOT EXISTS idx_ai_pattern_library_type 
  ON public.ai_pattern_library(pattern_type);
CREATE INDEX IF NOT EXISTS idx_ai_pattern_library_active 
  ON public.ai_pattern_library(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_ai_pattern_library_lyx 
  ON public.ai_pattern_library(is_lyx_pattern) WHERE is_lyx_pattern = TRUE;

CREATE INDEX IF NOT EXISTS idx_ai_learning_sessions_org 
  ON public.ai_learning_sessions(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_learning_sessions_trainer 
  ON public.ai_learning_sessions(trainer_id);

CREATE INDEX IF NOT EXISTS idx_ai_correction_queue_org 
  ON public.ai_correction_queue(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_correction_queue_status 
  ON public.ai_correction_queue(status);
CREATE INDEX IF NOT EXISTS idx_ai_correction_queue_priority 
  ON public.ai_correction_queue(priority);

CREATE INDEX IF NOT EXISTS idx_ai_followup_questions_org 
  ON public.ai_followup_questions(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_followup_questions_status 
  ON public.ai_followup_questions(status);

CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_org_date 
  ON public.ai_performance_metrics(org_id, metric_date);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.ai_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_training_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_pattern_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_correction_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_followup_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for ai_knowledge_base
CREATE POLICY "Users can view org knowledge base"
  ON public.ai_knowledge_base FOR SELECT
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert org knowledge"
  ON public.ai_knowledge_base FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update org knowledge"
  ON public.ai_knowledge_base FOR UPDATE
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

-- Similar policies for other tables
CREATE POLICY "Users can view org training conversations"
  ON public.ai_training_conversations FOR SELECT
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert training conversations"
  ON public.ai_training_conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "All users can view pattern library"
  ON public.ai_pattern_library FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Users can view org learning sessions"
  ON public.ai_learning_sessions FOR SELECT
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create learning sessions"
  ON public.ai_learning_sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view org correction queue"
  ON public.ai_correction_queue FOR SELECT
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage correction queue"
  ON public.ai_correction_queue FOR ALL
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view followup questions"
  ON public.ai_followup_questions FOR SELECT
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can answer followup questions"
  ON public.ai_followup_questions FOR UPDATE
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view org metrics"
  ON public.ai_performance_metrics FOR SELECT
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- FUNKSJONER FOR AI LÆRING
-- =====================================================

-- Funksjon: Søk i kunnskapsbase
CREATE OR REPLACE FUNCTION public.search_ai_knowledge(
  p_org_id UUID,
  p_query TEXT,
  p_category VARCHAR DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  question TEXT,
  answer TEXT,
  category VARCHAR,
  confidence_score DECIMAL,
  relevance_score FLOAT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    kb.id,
    kb.question,
    kb.answer,
    kb.category,
    kb.confidence_score,
    -- Simple relevance score based on keyword matching
    (
      SELECT COUNT(*)::FLOAT 
      FROM unnest(kb.keywords) kw 
      WHERE p_query ILIKE '%' || kw || '%'
    ) / GREATEST(array_length(kb.keywords, 1), 1)::FLOAT as relevance_score
  FROM public.ai_knowledge_base kb
  WHERE kb.org_id = p_org_id
    AND kb.status = 'active'
    AND (p_category IS NULL OR kb.category = p_category)
    AND (
      kb.question ILIKE '%' || p_query || '%'
      OR kb.answer ILIKE '%' || p_query || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(kb.keywords) kw 
        WHERE p_query ILIKE '%' || kw || '%'
      )
    )
  ORDER BY relevance_score DESC, kb.confidence_score DESC, kb.times_used DESC
  LIMIT p_limit;
END;
$$;

-- Funksjon: Oppdater AI performance metrics
CREATE OR REPLACE FUNCTION public.update_ai_metrics(
  p_org_id UUID,
  p_metric_date DATE,
  p_metric_type VARCHAR,
  p_increment INTEGER DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.ai_performance_metrics (
    org_id,
    metric_date,
    total_conversations,
    total_messages,
    correct_responses,
    incorrect_responses,
    needed_human_intervention,
    new_knowledge_items_learned,
    bookings_completed,
    leads_converted,
    positive_feedback,
    negative_feedback
  )
  VALUES (
    p_org_id,
    p_metric_date,
    CASE WHEN p_metric_type = 'conversation' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric_type = 'message' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric_type = 'correct' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric_type = 'incorrect' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric_type = 'human_intervention' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric_type = 'knowledge_learned' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric_type = 'booking' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric_type = 'lead_converted' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric_type = 'positive_feedback' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric_type = 'negative_feedback' THEN p_increment ELSE 0 END
  )
  ON CONFLICT (org_id, metric_date, hour_of_day)
  DO UPDATE SET
    total_conversations = public.ai_performance_metrics.total_conversations + 
      CASE WHEN p_metric_type = 'conversation' THEN p_increment ELSE 0 END,
    total_messages = public.ai_performance_metrics.total_messages + 
      CASE WHEN p_metric_type = 'message' THEN p_increment ELSE 0 END,
    correct_responses = public.ai_performance_metrics.correct_responses + 
      CASE WHEN p_metric_type = 'correct' THEN p_increment ELSE 0 END,
    incorrect_responses = public.ai_performance_metrics.incorrect_responses + 
      CASE WHEN p_metric_type = 'incorrect' THEN p_increment ELSE 0 END,
    needed_human_intervention = public.ai_performance_metrics.needed_human_intervention + 
      CASE WHEN p_metric_type = 'human_intervention' THEN p_increment ELSE 0 END,
    new_knowledge_items_learned = public.ai_performance_metrics.new_knowledge_items_learned + 
      CASE WHEN p_metric_type = 'knowledge_learned' THEN p_increment ELSE 0 END,
    bookings_completed = public.ai_performance_metrics.bookings_completed + 
      CASE WHEN p_metric_type = 'booking' THEN p_increment ELSE 0 END,
    leads_converted = public.ai_performance_metrics.leads_converted + 
      CASE WHEN p_metric_type = 'lead_converted' THEN p_increment ELSE 0 END,
    positive_feedback = public.ai_performance_metrics.positive_feedback + 
      CASE WHEN p_metric_type = 'positive_feedback' THEN p_increment ELSE 0 END,
    negative_feedback = public.ai_performance_metrics.negative_feedback + 
      CASE WHEN p_metric_type = 'negative_feedback' THEN p_increment ELSE 0 END,
    updated_at = NOW();
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.search_ai_knowledge TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_ai_metrics TO authenticated, service_role;

-- =====================================================
-- SEED DATA: LYX PATTERNS (Dine mønstre)
-- =====================================================

INSERT INTO public.ai_pattern_library (
  pattern_name,
  pattern_type,
  description,
  example_scenarios,
  recommended_responses,
  trigger_keywords,
  is_lyx_pattern,
  priority
) VALUES
(
  'Vennlig velkomst',
  'communication',
  'Start alltid samtalen med en vennlig, profesjonell velkomst',
  '[
    {"scenario": "Ny kunde tar kontakt", "example": "Hei! Takk for at du tar kontakt med oss 😊"},
    {"scenario": "Eksisterende kunde", "example": "Velkommen tilbake! Hyggelig å høre fra deg igjen"}
  ]'::jsonb,
  '[
    "Hei! Takk for at du tar kontakt 😊",
    "Velkommen! Hvordan kan jeg hjelpe deg i dag?",
    "Hei og velkommen! Fint at du tok kontakt"
  ]'::jsonb,
  ARRAY['hei', 'hallo', 'god dag', 'første melding'],
  TRUE,
  100
),
(
  'Bekreft forståelse',
  'communication',
  'Bekreft alltid at du har forstått kundens ønske før du går videre',
  '[
    {"scenario": "Kunde vil booke time", "example": "Så hvis jeg har forstått deg riktig, ønsker du å bestille en oljeskift for din Toyota Corolla - stemmer det?"}
  ]'::jsonb,
  '[
    "La meg sjekke at jeg har forstått deg riktig...",
    "For å være sikker: du ønsker...",
    "Stemmer det at..."
  ]'::jsonb,
  ARRAY['booking', 'bestilling', 'time'],
  TRUE,
  95
),
(
  'Proaktiv service',
  'sales',
  'Foreslå relevante tilleggstjenester basert på kundens behov',
  '[
    {"scenario": "Oljeskift booket", "example": "Vi anbefaler også en gratis bremseinspeksjon samtidig - det tar bare noen minutter ekstra"}
  ]'::jsonb,
  '[
    "Siden du er inne uansett, vil du vi skal sjekke...",
    "Mange kunder setter pris på å få...",
    "Vi kan også tilby..."
  ]'::jsonb,
  ARRAY['service', 'vedlikehold', 'booking'],
  TRUE,
  80
),
(
  'Håndter prisforespørsler profesjonelt',
  'sales',
  'Gi priser på en transparent måte og forklar verdien',
  '[
    {"scenario": "Kunde spør om pris", "example": "Prisen for denne tjenesten er X kr. Dette inkluderer både arbeid og deler, og du får 1 år garanti"}
  ]'::jsonb,
  '[
    "Prisen er [PRIS] og inkluderer...",
    "For denne tjenesten tar vi [PRIS], som dekker...",
    "Dette koster [PRIS] totalt, med..."
  ]'::jsonb,
  ARRAY['pris', 'koster', 'betale', 'kr'],
  TRUE,
  90
),
(
  'Avslutning med oppfølging',
  'communication',
  'Avslutt alltid samtalen på en positiv måte med tydelig neste steg',
  '[
    {"scenario": "Time booket", "example": "Perfekt! Du får en bekreftelse på SMS. Vi sees mandag 10:00! 🚗"},
    {"scenario": "Forespørsel mottatt", "example": "Takk for meldingen! Jeg kommer tilbake til deg innen 2 timer med svar"}
  ]'::jsonb,
  '[
    "Takk for at du tok kontakt! Vi...",
    "Perfekt! Du får...",
    "Flott! Vi ses..."
  ]'::jsonb,
  ARRAY['ferdig', 'takk', 'slutt', 'booking bekreftet'],
  TRUE,
  85
);

-- =====================================================
-- OPPRETT TRIGGER FOR AUTOMATISK TIMESTAMP OPPDATERING
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_ai_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_knowledge_base_updated_at
  BEFORE UPDATE ON public.ai_knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.update_ai_updated_at();

CREATE TRIGGER update_ai_training_conversations_updated_at
  BEFORE UPDATE ON public.ai_training_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_ai_updated_at();

CREATE TRIGGER update_ai_correction_queue_updated_at
  BEFORE UPDATE ON public.ai_correction_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_ai_updated_at();

CREATE TRIGGER update_ai_followup_questions_updated_at
  BEFORE UPDATE ON public.ai_followup_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_ai_updated_at();

-- =====================================================
-- SLUTT PÅ MIGRERING
-- =====================================================
