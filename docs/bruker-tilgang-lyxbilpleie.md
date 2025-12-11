# Brukertilgang for post@lyxbilpleie.no

## 🎯 Rolle: Premium Test-bruker (ikke admin)

Denne kontoen skal ha full tilgang til alle funksjoner for testing, men skal **IKKE** være administrator.

## ✅ Tilganger som skal være aktivert:

### Moduler
Følgende moduler skal være aktivert for org som `post@lyxbilpleie.no` tilhører:

```sql
-- I Supabase, kjør denne SQL-en for å aktivere alle moduler for LYX Bilpleie AS org:

UPDATE organizations 
SET enabled_modules = ARRAY[
  'booking',
  'crm',
  'products',
  'dekkhotell',
  'coating',
  'employees',
  'markedsforing',
  'ai_agent',
  'landing_page',
  'webshop',
  'leads',
  'regnskap',
  'kortterminal',
  'automatisering'
]::module_code[]
WHERE id = 'ae407558-7f44-40cb-8fe9-1d023212b926';  -- LYX Bilpleie AS org ID

-- Aktiver også webshop og landing page spesifikt:
UPDATE organizations 
SET 
  webshop_enabled = true,
  landing_page_enabled = true
WHERE id = 'ae407558-7f44-40cb-8fe9-1d023212b926';
```

### Rettigheter i brukertabellen
Kontoen skal ha:
- ✅ `role`: `'user'` (IKKE 'admin')
- ✅ Tilhører org: `ae407558-7f44-40cb-8fe9-1d023212b926` (LYX Bilpleie AS)
- ✅ Kan se alt innenfor org
- ❌ Kan IKKE se andre orgs
- ❌ Kan IKKE administrere system-nivå

## 🧪 Verifisering
Etter innlogging skal brukeren se:

### I menyen:
✅ Dashboard  
✅ Bookinger  
✅ Kunder & CRM  
✅ Tjenester  
✅ Produkter  
✅ Dekkhotell  
✅ Coating PRO  
✅ Ansatte  
✅ Markedsføring  
✅ **AI Marketing** (NY)  
✅ **AI Innhold** (NY)  
✅ **AI CRM** (NY)  
✅ **AI Booking** (NY)  
✅ **AI Kapasitet** (NY)  
✅ **AI Regnskap** (NY)  
✅ LYXba – Booking Agent  
✅ Landingsside  
✅ Nettbutikk  
✅ Leads  
❌ Partnere (kun admin)  
❌ CEO Dashboard (kun admin)  
✅ Regnskap & betaling  
✅ Betaling  
✅ Abonnement & plan  
✅ Addons  
✅ Integrasjoner  
✅ Automatisering  
✅ Dataimport  
✅ Innstillinger  
✅ Hjelp & support  

## 📝 Notat
Denne brukeren er LYXso sin testbruker nr. 1 og skal ha tilgang til alle betalte funksjoner, inkludert alle AI-moduler, for demo- og testformål.
