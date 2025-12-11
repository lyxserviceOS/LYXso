# AI-funksjoner i LYXso - Testguide

## 🎯 Oversikt
Alle AI-funksjoner er nå tilgjengelige gjennom menyen under **"AI & markedsføring"**.

## 📍 AI-menyalternativer

### 1. AI Marketing (`/ai/marketing`)
**Funksjon:** Generer kampanjeidéer  
**Testendepunkt:** `POST /api/orgs/:orgId/ai/marketing/campaign-ideas`

**Test med:**
- Kampanjemål: "Fylle kapasitet i januar"
- Tjenester: "detailing, dekkhotell, coating"
- Målgruppe: "bilentusiaster"
- Tone: "profesjonell"

---

### 2. AI Innhold (`/ai/content`)
**Funksjoner:**
- Landingsside: `POST /api/orgs/:orgId/ai/content/landing-page`
- Blogginnlegg: `POST /api/orgs/:orgId/ai/content/blog-post`
- SMS-melding: `POST /api/orgs/:orgId/ai/content/sms`

**Test med:**
- Tjeneste: "coating"
- Målgruppe: "bilentusiaster"
- Tone: "entusiastisk"

---

### 3. AI CRM (`/ai/crm`)
**Funksjon:** Kundeinnsikt  
**Testendepunkt:** `POST /api/orgs/:orgId/ai/crm/customer-insight`

**Test med:**
- Kundeprofil: "Ola Nordmann, 42 år, kjøper premium detailing 2 ganger i året"
- Historikk: "Siste besøk: Mars 2024 - coating pakke"

---

### 4. AI Booking (`/ai/booking`)
**Funksjon:** Foreslå tidsluke  
**Testendepunkt:** `POST /api/orgs/:orgId/ai/booking/suggest-slot`

**Test med:**
- Kunde: "Kari Nordmann"
- Kjøretøy: "Tesla Model 3, 2022"
- Tjenester: "Detailing Premium + coating"
- Begrensninger: "Kun formiddag, ukedager"

---

### 5. AI Kapasitet (`/ai/capacity`)
**Funksjon:** Analyser kapasitet  
**Testendepunkt:** `POST /api/orgs/:orgId/ai/capacity/analyze`

**Test med:**
- Periode: "Januar 2024"
- Bookinger: "45 bookinger, 60% detailing, 30% coating"
- Ressurser: "3 ansatte, 2 haller"

---

### 6. AI Regnskap (`/ai/accounting`)
**Funksjon:** Forklar rapport  
**Testendepunkt:** `POST /api/orgs/:orgId/ai/accounting/explain-report`

**Test med:**
- Periode: "Q1 2024"
- Metrics: "Omsetning: 450.000 kr, Lønnskostnader: 180.000 kr"

---

## ✅ Status
- ✅ Meny oppdatert med 6 AI-alternativer
- ✅ Alle sider opprettet
- ✅ Klar til testing med ekte OpenAI API

## 🧪 Slik tester du:
1. Logg inn som `post@lyxbilpleie.no`
2. Se menyen under "AI & markedsføring"
3. Klikk på f.eks. "AI Marketing"
4. Fyll ut skjemaet
5. Klikk "Generer kampanjeidéer"
6. Se resultatet!

## 📝 Merk:
- Alle sider har **debug-info** nederst (klikk "Teknisk info")
- Feilmeldinger vises på norsk
- Alle AI-kall går via backend (`lyx-api`)
