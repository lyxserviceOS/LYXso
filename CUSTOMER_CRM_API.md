# Customer CRM API Documentation

Dette dokumentet beskriver alle API-endepunkter for kundeadministrasjon (CRM) i LYXso-systemet.

## Base URL
Alle endepunkter starter med: `/api/orgs/:orgId`

---

## Kundeliste (GET /customers)

### Endepunkt
```
GET /api/orgs/:orgId/customers
```

### Query Parameters
- `search` (string, optional) - Søk i navn, e-post eller telefon
- `active` (boolean string, optional) - Filter aktive kunder (`"true"` eller `"false"`)
- `hasTireHotel` (boolean string, optional) - Filter kunder med dekkhotell (`"true"`)
- `hasCoating` (boolean string, optional) - Filter kunder med coating (`"true"`)

### Eksempel
```
GET /api/orgs/123/customers?search=hansen&active=true&hasCoating=true
```

### Respons
```json
{
  "customers": [
    {
      "id": "uuid",
      "orgId": "uuid",
      "name": "Ola Hansen",
      "email": "ola@example.com",
      "phone": "+4712345678",
      "notes": "Stamkunde",
      "isActive": true,
      "hasTireHotel": false,
      "hasCoating": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:20:00Z"
    }
  ]
}
```

---

## Hent enkelt kunde (GET /customers/:customerId)

### Endepunkt
```
GET /api/orgs/:orgId/customers/:customerId
```

### Respons
```json
{
  "customer": {
    "id": "uuid",
    "orgId": "uuid",
    "name": "Ola Hansen",
    "email": "ola@example.com",
    "phone": "+4712345678",
    "notes": "Stamkunde",
    "isActive": true,
    "hasTireHotel": false,
    "hasCoating": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:20:00Z"
  }
}
```

---

## Opprett kunde (POST /customers)

### Endepunkt
```
POST /api/orgs/:orgId/customers
```

### Request Body
```json
{
  "name": "Ola Hansen",
  "email": "ola@example.com",
  "phone": "+4712345678",
  "notes": "Stamkunde"
}
```

### Respons
```json
{
  "customer": {
    "id": "uuid",
    "orgId": "uuid",
    "name": "Ola Hansen",
    "email": "ola@example.com",
    "phone": "+4712345678",
    "notes": "Stamkunde",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Oppdater kunde (PATCH /customers/:customerId)

### Endepunkt
```
PATCH /api/orgs/:orgId/customers/:customerId
```

### Request Body
```json
{
  "name": "Ola Nordmann Hansen",
  "email": "ola.nordmann@example.com",
  "phone": "+4787654321",
  "notes": "VIP-kunde"
}
```

---

## Kundestatistikk (GET /customers/:customerId/statistics)

### Endepunkt
```
GET /api/orgs/:orgId/customers/:customerId/statistics
```

### Respons
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

### Forklaring
- `totalBookings` - Totalt antall bookinger
- `completedBookings` - Antall fullførte bookinger
- `totalRevenue` - Total omsetning (sum av alle betalinger)
- `openAmount` - Åpent beløp (ubetalte fakturaer)
- `lastVisit` - Siste besøk (siste booking)
- `nextRecommendedAction` - Anbefalt neste steg
- `hasCoating` - Om kunden har coating
- `coatingJobsCount` - Antall coating-jobber

---

## Kundebookinger (GET /customers/:customerId/bookings)

### Endepunkt
```
GET /api/orgs/:orgId/customers/:customerId/bookings
```

### Respons
```json
{
  "bookings": [
    {
      "id": "uuid",
      "orgId": "uuid",
      "customerId": "uuid",
      "employeeId": "uuid",
      "customerName": "Ola Hansen",
      "serviceName": "Dekkskift",
      "vehicleReg": "AB12345",
      "vehicleDescription": "Tesla Model 3",
      "status": "completed",
      "startTime": "2024-01-20T10:00:00Z",
      "endTime": "2024-01-20T11:00:00Z",
      "notes": "Sommerdekk montert",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T11:00:00Z"
    }
  ]
}
```

---

## Kundenotater (GET /customers/:customerId/notes)

### Endepunkt
```
GET /api/orgs/:orgId/customers/:customerId/notes
```

### Respons
```json
{
  "notes": [
    {
      "id": "uuid",
      "orgId": "uuid",
      "customerId": "uuid",
      "note": "Kunden ønsker å bli kontaktet i mars for coating-kontroll",
      "isInternal": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Merk
- Endepunktet prøver først `customer_notes`-tabellen
- Hvis den ikke eksisterer, brukes `booking_notes`-tabellen

---

## Opprett kundenotat (POST /customers/:customerId/notes)

### Endepunkt
```
POST /api/orgs/:orgId/customers/:customerId/notes
```

### Request Body
```json
{
  "note": "Kunden ønsker å bli kontaktet i mars for coating-kontroll",
  "isInternal": true
}
```

### Respons
```json
{
  "note": {
    "id": "uuid",
    "orgId": "uuid",
    "customerId": "uuid",
    "note": "Kunden ønsker å bli kontaktet i mars for coating-kontroll",
    "isInternal": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Kundebetalinger (GET /customers/:customerId/payments)

### Endepunkt
```
GET /api/orgs/:orgId/customers/:customerId/payments
```

### Respons
```json
{
  "payments": [
    {
      "id": "uuid",
      "orgId": "uuid",
      "customerId": "uuid",
      "bookingId": "uuid",
      "amount": 5000,
      "status": "paid",
      "paymentMethod": "card",
      "createdAt": "2024-01-20T11:00:00Z",
      "paidAt": "2024-01-20T11:05:00Z"
    }
  ],
  "summary": {
    "totalPaid": 42500,
    "totalPending": 2500,
    "totalAmount": 45000
  }
}
```

### Forklaring
- `totalPaid` - Sum av alle betalte beløp
- `totalPending` - Sum av alle ubetalte beløp
- `totalAmount` - Total sum av alle beløp

---

## Coating-jobber for kunde (GET /customers/:customerId/coating-jobs)

### Endepunkt
```
GET /api/orgs/:orgId/customers/:customerId/coating-jobs
```

### Respons
```json
{
  "coatingJobs": [
    {
      "id": "uuid",
      "orgId": "uuid",
      "bookingId": "uuid",
      "customerId": "uuid",
      "vehicleVin": "1HGBH41JXMN109186",
      "vehicleReg": "AB12345",
      "vehicleMake": "Tesla",
      "vehicleModel": "Model 3",
      "vehicleColor": "Midnight Silver",
      "coatingProduct": "Ceramic Pro 9H",
      "layers": 3,
      "warrantyYears": 5,
      "installedAt": "2024-01-15T14:00:00Z",
      "registeredAt": "2024-01-15T10:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T14:00:00Z"
    }
  ]
}
```

---

## Dekksett for kunde (GET /customers/:customerId/tire-storage)

### Endepunkt
```
GET /api/orgs/:orgId/customers/:customerId/tire-storage
```

### Respons
```json
{
  "tireSets": [
    {
      "id": "uuid",
      "orgId": "uuid",
      "customerId": "uuid",
      "vehicleReg": "AB12345",
      "tireType": "summer",
      "tireBrand": "Michelin",
      "tireSize": "225/45 R17",
      "location": "Hylle A3",
      "condition": "good",
      "storedAt": "2024-10-15T10:00:00Z",
      "createdAt": "2024-10-15T10:30:00Z",
      "updatedAt": "2024-10-15T10:30:00Z"
    }
  ]
}
```

---

## Booking-relaterte endepunkter

### Opprett booking (POST /bookings)
```
POST /api/orgs/:orgId/bookings
```

#### Request Body
```json
{
  "customerId": "uuid",
  "employeeId": "uuid",
  "customerName": "Ola Hansen",
  "serviceName": "Dekkskift",
  "startTime": "2024-02-01T10:00:00Z",
  "endTime": "2024-02-01T11:00:00Z",
  "status": "confirmed",
  "notes": "Kunden tar med egne dekk"
}
```

### Oppdater booking (PATCH /bookings/:bookingId)
```
PATCH /api/orgs/:orgId/bookings/:bookingId
```

#### Request Body
```json
{
  "status": "completed",
  "startTime": "2024-02-01T10:30:00Z",
  "endTime": "2024-02-01T11:30:00Z",
  "notes": "Fullført uten problemer",
  "employeeId": "uuid"
}
```

---

## Feilhåndtering

Alle endepunkter returnerer standard HTTP-statuskoder:

- `200 OK` - Vellykket forespørsel
- `201 Created` - Ressurs opprettet
- `400 Bad Request` - Ugyldig forespørsel
- `404 Not Found` - Ressurs ikke funnet
- `500 Internal Server Error` - Serverfeil

### Feilrespons-format
```json
{
  "error": "Feilmelding",
  "details": "Detaljert feilbeskrivelse"
}
```

---

## Bruksscenarier

### 1. Kundeliste med søk og filter
```javascript
// Søk etter kunder med "hansen" i navn/epost/telefon
// + filter på aktive kunder med coating
const response = await fetch(
  '/api/orgs/123/customers?search=hansen&active=true&hasCoating=true'
);
const { customers } = await response.json();
```

### 2. Kundedetaljside
```javascript
// Hent kundeinfo
const customer = await fetch('/api/orgs/123/customers/456').then(r => r.json());

// Hent statistikk
const stats = await fetch('/api/orgs/123/customers/456/statistics').then(r => r.json());

// Hent bookinger
const bookings = await fetch('/api/orgs/123/customers/456/bookings').then(r => r.json());

// Hent notater
const notes = await fetch('/api/orgs/123/customers/456/notes').then(r => r.json());

// Hent betalinger
const payments = await fetch('/api/orgs/123/customers/456/payments').then(r => r.json());

// Hent coating-jobber
const coating = await fetch('/api/orgs/123/customers/456/coating-jobs').then(r => r.json());

// Hent dekksett
const tires = await fetch('/api/orgs/123/customers/456/tire-storage').then(r => r.json());
```

### 3. Opprett booking fra kundekort
```javascript
// Opprett ny booking med preutfylt kunde
const newBooking = await fetch('/api/orgs/123/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: '456',
    customerName: 'Ola Hansen',
    serviceName: 'Dekkskift',
    startTime: '2024-02-01T10:00:00Z',
    endTime: '2024-02-01T11:00:00Z',
    status: 'confirmed'
  })
}).then(r => r.json());
```

### 4. Legg til internt notat
```javascript
// Legg til internt notat (ikke synlig for kunde)
const newNote = await fetch('/api/orgs/123/customers/456/notes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    note: 'Kunden ønsker å bli kontaktet i mars',
    isInternal: true
  })
}).then(r => r.json());
```

---

## Fremtidig utvidelse

### Planlagte funksjoner
- Integrasjon mot Fiken/PowerOffice for regnskapssync
- Automatiske påminnelser for årskontroller
- SMS/e-post-varsling til kunder
- Kundesegmentering og markedsføring
- Lojalitetsprogram og rabattkoder

### Foreslåtte nye endepunkter
```
POST /api/orgs/:orgId/customers/:customerId/send-reminder
GET /api/orgs/:orgId/customers/segments
POST /api/orgs/:orgId/customers/:customerId/loyalty-points
```

---

## Sikkerhet og autorisasjon

- Alle endepunkter krever at `orgId` er spesifisert
- Kun kunder tilhørende den innloggede organisasjonen kan hentes
- Interne notater (`isInternal: true`) skal kun vises til ansatte, ikke kunder

---

## Database-tabeller

Endepunktene bruker følgende Supabase-tabeller:

- `customers` - Kundeinformasjon
- `bookings` - Bookinger
- `customer_notes` eller `booking_notes` - Notater
- `payments` - Betalinger
- `coating_jobs` - Coating-jobber
- `tire_storage` - Dekkhotell/dekksett

---

## Kontakt og support

For spørsmål eller feilmeldinger, kontakt utviklingsteamet.
