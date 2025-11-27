# CRM API Quick Reference

Hurtigreferanse for de mest brukte CRM-endepunktene i LYXso API.

## 🔍 Søk og liste kunder

```http
GET /api/orgs/:orgId/customers?search=hansen&active=true&hasCoating=true
```

## 👤 Hent én kunde med alt

```javascript
// Kunde-basisinfo
GET /api/orgs/:orgId/customers/:customerId

// Full kundedata (parallelle requests)
const [customer, stats, bookings, notes, payments] = await Promise.all([
  fetch(`/api/orgs/${orgId}/customers/${customerId}`),
  fetch(`/api/orgs/${orgId}/customers/${customerId}/statistics`),
  fetch(`/api/orgs/${orgId}/customers/${customerId}/bookings`),
  fetch(`/api/orgs/${orgId}/customers/${customerId}/notes`),
  fetch(`/api/orgs/${orgId}/customers/${customerId}/payments`)
]).then(rs => Promise.all(rs.map(r => r.json())));
```

## ➕ Opprett kunde

```http
POST /api/orgs/:orgId/customers
Content-Type: application/json

{
  "name": "Ola Hansen",
  "email": "ola@example.com",
  "phone": "+4712345678",
  "notes": "Stamkunde"
}
```

## 📝 Legg til notat

```http
POST /api/orgs/:orgId/customers/:customerId/notes
Content-Type: application/json

{
  "note": "Kunden ønsker coating-kontroll i mars",
  "isInternal": true
}
```

## 📅 Opprett booking fra kundekort

```http
POST /api/orgs/:orgId/bookings
Content-Type: application/json

{
  "customerId": "uuid",
  "customerName": "Ola Hansen",
  "serviceName": "Dekkskift",
  "startTime": "2024-02-01T10:00:00Z",
  "endTime": "2024-02-01T11:00:00Z",
  "status": "confirmed"
}
```

## 🔄 Flytt/endre booking

```http
PATCH /api/orgs/:orgId/bookings/:bookingId
Content-Type: application/json

{
  "startTime": "2024-02-01T11:00:00Z",
  "endTime": "2024-02-01T12:00:00Z",
  "employeeId": "new-employee-id",
  "status": "confirmed"
}
```

## 📊 Kundestatistikk

```http
GET /api/orgs/:orgId/customers/:customerId/statistics

Response:
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

## 💰 Betalingsoversikt

```http
GET /api/orgs/:orgId/customers/:customerId/payments

Response:
{
  "payments": [...],
  "summary": {
    "totalPaid": 42500,
    "totalPending": 2500,
    "totalAmount": 45000
  }
}
```

## 🎨 Coating-jobber

```http
GET /api/orgs/:orgId/customers/:customerId/coating-jobs
```

## 🛞 Dekksett (dekkhotell)

```http
GET /api/orgs/:orgId/customers/:customerId/tire-storage
```

## 🔑 Alle endepunkter

| Endepunkt | Metode | Beskrivelse |
|-----------|--------|-------------|
| `/customers` | GET | Liste kunder (med søk/filter) |
| `/customers/:id` | GET | Hent én kunde |
| `/customers` | POST | Opprett kunde |
| `/customers/:id` | PATCH | Oppdater kunde |
| `/customers/:id/statistics` | GET | Kundestatistikk |
| `/customers/:id/bookings` | GET | Kundebookinger |
| `/customers/:id/notes` | GET | Kundenotater |
| `/customers/:id/notes` | POST | Opprett notat |
| `/customers/:id/payments` | GET | Kundebetalinger |
| `/customers/:id/coating-jobs` | GET | Coating-jobber |
| `/customers/:id/tire-storage` | GET | Dekksett |
| `/bookings` | POST | Opprett booking |
| `/bookings/:id` | PATCH | Endre booking |

---

**Base URL:** `/api/orgs/:orgId`  
**Autentisering:** Via orgId i URL  
**Content-Type:** `application/json`
