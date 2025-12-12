# TEST MODE SETUP - ALLE E-POSTER OG SMS TIL ADMIN

## ✅ Implementert

Alle e-poster og SMS blir nå redirectet til:
- **E-post**: nikolai@brisner.no
- **Telefon**: +47 99085000

## Endringer gjort:

### 1. `.env` variabler lagt til:
```env
# TEST MODE - OVERRIDE ALL EMAILS AND SMS
TEST_MODE_OVERRIDE=true
TEST_MODE_EMAIL=nikolai@brisner.no
TEST_MODE_PHONE=+4799085000
```

### 2. Filer oppdatert:

#### `lyx-api/services/emailService.mjs`
- ✅ Alle e-poster redirectes til `TEST_MODE_EMAIL`
- ✅ Original mottaker vises i emnet: `[TEST - Til: kunde@example.com]`
- ✅ Gul advarselsboks øverst i e-posten viser original mottaker

#### `lyx-api/services/twilioService.mjs`
- ✅ Alle SMS redirectes til `TEST_MODE_PHONE`
- ✅ Original mottaker vises i meldingen: `[TEST - Til: +4712345678]`
- ✅ Console logger original og faktisk mottaker

#### `lyx-api/services/sendgridService.mjs`
- ✅ Alle e-poster redirectes til `TEST_MODE_EMAIL`
- ✅ Samme varsling som emailService.mjs
- ✅ Støtter både HTML og plain text

## Hvordan det fungerer:

### E-post eksempel:
**Original:**
```
Til: kunde@example.com
Emne: Booking bekreftet
```

**Med TEST_MODE:**
```
Til: nikolai@brisner.no
Emne: [TEST - Til: kunde@example.com] Booking bekreftet

┌─────────────────────────────────────────┐
│ 🧪 TEST MODE                            │
│ Denne e-posten skulle opprinnelig       │
│ sendes til: kunde@example.com           │
└─────────────────────────────────────────┘

[Original e-post innhold...]
```

### SMS eksempel:
**Original:**
```
Til: +4712345678
Melding: Din booking er bekreftet
```

**Med TEST_MODE:**
```
Til: +4799085000
Melding: [TEST - Til: +4712345678]

Din booking er bekreftet
```

## Console logging:
```bash
🧪 TEST MODE: Redirecting email from kunde@example.com to nikolai@brisner.no
E-post sendt til nikolai@brisner.no: [TEST - Til: kunde@example.com] Booking bekreftet
  (Opprinnelig mottaker: kunde@example.com)
```

## For å deaktivere TEST MODE:

Endre i `lyx-api/.env`:
```env
TEST_MODE_OVERRIDE=false
```

Eller fjern linjen helt.

## Testing:

1. Start API: `cd lyx-api && npm run dev`
2. Sjekk at .env er lastet: Console skal vise at TEST_MODE er aktiv
3. Test en booking eller registrering
4. Sjekk at e-post og SMS kommer til nikolai@brisner.no / +4799085000
5. Verifiser at original mottaker vises i emnet/meldingen

## Sikkerhet:

✅ Alle e-poster og SMS går kun til admin  
✅ Ingen kunde-data lekker til eksterne  
✅ Original mottaker logges for debugging  
✅ Tydelig TEST-merking på alle meldinger

## Produksjonsklart:

Når du skal åpne for alle kunder:
1. Sett `TEST_MODE_OVERRIDE=false` i `.env`
2. Restart API
3. Alle meldinger går da til faktiske kunder
