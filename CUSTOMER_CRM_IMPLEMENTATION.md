# Intern CRM - Implementeringsoppsummering

## ✅ Fullført implementering

Dette dokumentet oppsummerer den komplette CRM-implementeringen for `/kunder`-siden i LYXso API.

---

## 📋 Implementerte funksjoner

### 1. Kundeliste (`/kunder`)

**Endepunkt:** `GET /api/orgs/:orgId/customers`

✅ **Implementert:**
- Hent alle kunder for innlogget org
- Søk i navn, e-post og telefon (query parameter: `?search=...`)
- Filter på aktive kunder (`?active=true/false`)
- Filter på kunder med dekkhotell (`?hasTireHotel=true`)
- Filter på kunder med coating (`?hasCoating=true`)
- Sortert på opprettelsesdato (nyeste først)

**Eksempel:**
```
GET /api/orgs/123/customers?search=hansen&active=true&hasCoating=true
```

---

### 2. Kundedetaljside

**Ny rute:** `/kunder/[customerId]`

#### 2.1 Basisdata
**Endepunkt:** `GET /api/orgs/:orgId/customers/:customerId`

✅ **Implementert:**
- Hent enkelt kunde med alle detaljer
- Navn, kontakt (e-post, telefon)
- Notater
- Status (aktiv/inaktiv)
- Dekkhotell- og coating-status

#### 2.2 Historikk - Bookinger
**Endepunkt:** `GET /api/orgs/:orgId/customers/:customerId/bookings`

✅ **Implementert:**
- Liste over alle bookinger for kunden
- Sortert på dato (nyeste først)
- Inneholder booking-detaljer, status, tidsrom

#### 2.3 Coating-jobber
**Endepunkt:** `GET /api/orgs/:orgId/customers/:customerId/coating-jobs`

✅ **Implementert:**
- Liste over coating-jobber for kunden
- Bildetaljer (VIN, reg.nr, merke, modell, farge)
- Produktinfo (coating-produkt, lag, garantiår)
- Installasjons- og registreringsdato

#### 2.4 Dekksett (Dekkhotell)
**Endepunkt:** `GET /api/orgs/:orgId/customers/:customerId/tire-storage`

✅ **Implementert:**
- Liste over dekksett i dekkhotell for kunden
- Dekktype (sommer/vinter)
- Dekkmerke og størrelse
- Lagringsplassering
- Tilstand

#### 2.5 Economy-view
**Endepunkt:** `GET /api/orgs/:orgId/customers/:customerId/statistics`

✅ **Implementert:**
- Total omsetning (sum av alle betalinger)
- Antall bookinger (totalt og fullførte)
- Åpne beløp (ubetalte fakturaer)
- Sist besøk (siste booking-dato)
- Neste anbefalte steg (basert på historikk)
- Coating-status og antall coating-jobber

**Responskonsept:**
```json
{
  "statistics": {
    "totalBookings": 15,
    "completedBookings": 12,
    "totalRevenue": 45000,
    "openAmount": 2500,
    "lastVisit": "2024-01-20T14:00:00Z",
    "nextRecommendedAction": "Årskontroll coating",
    "hasCoating": true,
    "coatingJobsCount": 2
  }
}
```

---

### 3. Kobling til bookingmodulen

#### 3.1 Ny booking for kunde
**Endepunkt:** `POST /api/orgs/:orgId/bookings`

✅ **Implementert:**
- Opprett booking med preutfylt `customerId`
- Spesifiser tjeneste, tid, ansatt
- Status (pending, confirmed, completed, cancelled)

**Fra kundekort:**
```javascript
// Åpne booking-modal med preutfylt kunde
const newBooking = await fetch('/api/orgs/123/bookings', {
  method: 'POST',
  body: JSON.stringify({
    customerId: '456',
    customerName: 'Ola Hansen',
    serviceName: 'Dekkskift',
    startTime: '2024-02-01T10:00:00Z',
    endTime: '2024-02-01T11:00:00Z'
  })
});
```

#### 3.2 Flytt/endre booking
**Endepunkt:** `PATCH /api/orgs/:orgId/bookings/:bookingId`

✅ **Implementert:**
- Endre tid (`startTime`, `endTime`)
- Endre ansatt (`employeeId`)
- Endre status
- Oppdater notater

**Fra kundekort:**
```javascript
// Åpne booking-UI og endre tid/ansatt
const updatedBooking = await fetch('/api/orgs/123/bookings/789', {
  method: 'PATCH',
  body: JSON.stringify({
    startTime: '2024-02-01T11:00:00Z',
    endTime: '2024-02-01T12:00:00Z',
    employeeId: 'new-employee-id'
  })
});
```

---

### 4. Notater & interne hendelser

#### 4.1 Hent notater
**Endepunkt:** `GET /api/orgs/:orgId/customers/:customerId/notes`

✅ **Implementert:**
- Hent alle notater for kunde
- Støtter både `customer_notes` og `booking_notes` tabeller
- Sortert på dato (nyeste først)

#### 4.2 Opprett notat
**Endepunkt:** `POST /api/orgs/:orgId/customers/:customerId/notes`

✅ **Implementert:**
- Legg til nytt notat for kunde
- Merk som internt (`isInternal: true`) eller synlig for kunde
- Automatisk timestamp

**Eksempel:**
```javascript
// Legg til internt notat
const newNote = await fetch('/api/orgs/123/customers/456/notes', {
  method: 'POST',
  body: JSON.stringify({
    note: 'Kunden ønsker å bli kontaktet i mars for coating-kontroll',
    isInternal: true
  })
});
```

---

### 5. Payments-krok

#### 5.1 Hent betalinger
**Endepunkt:** `GET /api/orgs/:orgId/customers/:customerId/payments`

✅ **Implementert:**
- Liste over alle betalinger for kunde
- Betalingsstatus (paid, pending, etc.)
- Betalingsmetode
- Beløp og datoer

**Responskonsept:**
```json
{
  "payments": [...],
  "summary": {
    "totalPaid": 42500,
    "totalPending": 2500,
    "totalAmount": 45000
  }
}
```

#### 5.2 Forberedelse for Fiken/PowerOffice
✅ **Implementert:**
- Felt for accounting-provider i `org_settings`
- Betalingsdata strukturert for fremtidig integrasjon
- Summary-beregninger (totalPaid, totalPending)

**Neste steg for integrasjon:**
- Webhook fra Fiken/PowerOffice
- Sync-jobb for å oppdatere betalinger
- Mapping mellom LYXso-kunder og regnskapskunder

---

## 📊 Databasetabeller brukt

Implementeringen bruker følgende Supabase-tabeller:

| Tabell | Beskrivelse | Brukt i endepunkt |
|--------|-------------|-------------------|
| `customers` | Kundeinformasjon | `/customers`, `/customers/:id` |
| `bookings` | Bookinger | `/customers/:id/bookings` |
| `customer_notes` | Kundenotater (primær) | `/customers/:id/notes` |
| `booking_notes` | Booking-notater (fallback) | `/customers/:id/notes` |
| `payments` | Betalinger | `/customers/:id/payments`, `/statistics` |
| `coating_jobs` | Coating-jobber | `/customers/:id/coating-jobs`, `/statistics` |
| `tire_storage` | Dekkhotell | `/customers/:id/tire-storage` |

**Fallback-håndtering:**
- Hvis en tabell ikke eksisterer (f.eks. `payments`, `coating_jobs`), returneres tom liste
- Ingen feil kastes, men logger feil internt

---

## 🔧 Tekniske detaljer

### Mappers
Oppdatert `mapCustomerRow` til å inkludere:
- `isActive` - Om kunden er aktiv
- `hasTireHotel` - Om kunden har dekksett i dekkhotell
- `hasCoating` - Om kunden har coating

### Feilhåndtering
- 400 Bad Request for ugyldige parametere
- 404 Not Found hvis kunde ikke finnes
- 500 Internal Server Error for serverfeil
- Fallback til tom liste hvis tabell ikke eksisterer (42P01 error code)

### Søk og filter
- Case-insensitive søk med `ilike`
- OR-søk i navn, e-post og telefon
- AND-filter for aktiv, dekkhotell, coating

---

## 📁 Filer endret/opprettet

### Endret:
- `routes/bookingsAndCustomers.mjs` - Utvidet med alle nye endepunkter

### Opprettet:
- `CUSTOMER_CRM_API.md` - Komplett API-dokumentasjon
- `CUSTOMER_CRM_IMPLEMENTATION.md` - Dette dokumentet (implementeringsoppsummering)

---

## 🎯 Frontend-integrasjon

### Kundeliste-side (`/kunder`)

```typescript
// CustomersPageClient.tsx
const [customers, setCustomers] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [filters, setFilters] = useState({
  active: true,
  hasTireHotel: false,
  hasCoating: false
});

useEffect(() => {
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.set('search', searchTerm);
  if (filters.active) queryParams.set('active', 'true');
  if (filters.hasTireHotel) queryParams.set('hasTireHotel', 'true');
  if (filters.hasCoating) queryParams.set('hasCoating', 'true');
  
  fetch(`/api/orgs/${orgId}/customers?${queryParams}`)
    .then(r => r.json())
    .then(data => setCustomers(data.customers));
}, [searchTerm, filters]);
```

### Kundedetaljside (`/kunder/[customerId]`)

```typescript
// CustomerDetailPage.tsx
const [customer, setCustomer] = useState(null);
const [statistics, setStatistics] = useState(null);
const [bookings, setBookings] = useState([]);
const [notes, setNotes] = useState([]);
const [payments, setPayments] = useState([]);
const [coatingJobs, setCoatingJobs] = useState([]);
const [tireSets, setTireSets] = useState([]);

useEffect(() => {
  // Parallelle requests for rask lasting
  Promise.all([
    fetch(`/api/orgs/${orgId}/customers/${customerId}`),
    fetch(`/api/orgs/${orgId}/customers/${customerId}/statistics`),
    fetch(`/api/orgs/${orgId}/customers/${customerId}/bookings`),
    fetch(`/api/orgs/${orgId}/customers/${customerId}/notes`),
    fetch(`/api/orgs/${orgId}/customers/${customerId}/payments`),
    fetch(`/api/orgs/${orgId}/customers/${customerId}/coating-jobs`),
    fetch(`/api/orgs/${orgId}/customers/${customerId}/tire-storage`)
  ])
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then([
    { customer },
    { statistics },
    { bookings },
    { notes },
    { payments },
    { coatingJobs },
    { tireSets }
  ] => {
    setCustomer(customer);
    setStatistics(statistics);
    setBookings(bookings);
    setNotes(notes);
    setPayments(payments.payments);
    setCoatingJobs(coatingJobs);
    setTireSets(tireSets);
  });
}, [customerId]);
```

---

## ✨ Neste steg (fremtidig utvidelse)

### Planlagt funksjonalitet:
1. **Automatiske påminnelser**
   - Årskontroller for coating
   - Dekkskift (sesongbasert)
   - Serviceintervaller

2. **Fiken/PowerOffice-integrasjon**
   - Webhook for faktura-sync
   - Automatisk oppdatering av betalingsstatus
   - Export av kunder til regnskapssystem

3. **Kundesegmentering**
   - Tagger/kategorier
   - Automatiske segmenter (VIP, inaktiv, etc.)
   - Markedsføringslister

4. **Kommunikasjon**
   - Send SMS/e-post fra kundekort
   - Automatiske bekreftelser og påminnelser
   - Kundeportal (kunde kan se egen historikk)

5. **Lojalitetsprogram**
   - Poeng/rabatt-system
   - Medlemskort
   - Kampanjer

---

## 📞 Support og kontakt

For spørsmål eller feilmeldinger relatert til CRM-implementeringen, kontakt utviklingsteamet.

---

**Status:** ✅ Fullført og klar for frontend-integrasjon  
**Versjon:** 1.0  
**Dato:** 26. november 2024
