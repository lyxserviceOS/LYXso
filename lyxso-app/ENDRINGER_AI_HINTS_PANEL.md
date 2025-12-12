# AI Hints Panel - Implementasjonsoppsummering

**Dato:** 2025-11-29  
**Status:** ✅ IMPLEMENTERT

---

## Oversikt

Implementert et "påtrengende" AI-hjelpepanel som gir sanntidsforslag til brukeren mens de fyller ut bedriftsinformasjon i steg 2 av register-wizarden. Panelet kan deaktiveres og bruker debouncing for å unngå unødvendige API-kall.

---

## Nye filer (2 stk)

### 1. `lib/hooks/useAiOnboardingHints.ts`
**Formål:** Custom React hook for å hente AI-hints basert på onboarding-data

**Funksjonalitet:**
- **Debouncing:** Venter 2 sekunder etter siste endring før API-kall
- **Caching:** Lagrer siste request for å unngå duplikate kall
- **AbortController:** Kansellerer pågående requests ved nye endringer
- **Client-side hints:** Genererer hints lokalt (midlertidig løsning)

**TODO-merknad:**
```typescript
// TODO: Create dedicated /api/orgs/:orgId/ai/onboarding/hints endpoint in lyx-api
// This should be a lightweight endpoint that returns quick suggestions
// without the full AI onboarding flow complexity
```

**Hint-typer:**
- `service`: Tjeneste-forslag basert på bransje
- `pricing`: Prissettingsråd basert på prisnivå
- `capacity`: Kapasitetsanbefalinger
- `hours`: Åpningstids-tips
- `general`: Generelle råd

**Generering av hints (client-side):**
- Bilpleie → Foreslår interiørvask, eksteriørpolering, keramisk belegg
- Frisør → Foreslår klipp, farge, styling, behandlinger
- Budsjett-nivå → Råd om høyt volum og pakketilbud
- Premium-nivå → Råd om ekstra service
- Høy kapasitet → Råd om booking-system
- Mobil → Råd om reisekostnader
- Helgeåpent → Råd om helgetillegg

### 2. `components/register/Step2_AiHintsPanel.tsx`
**Formål:** Visuell komponent for AI-hjelpepanelet

**Design:**
- **Slide-in animasjon:** Fra høyre side (desktop) eller fullskjerm (mobil)
- **Gradient bakgrunn:** Blå-lilla gradient med frosted glass-effekt
- **Sticky header:** Med tittel og lukk-knapp
- **Scrollbar innhold:** Viser hints som kort med ikoner
- **Sticky footer:** "Skru av AI-hjelp"-knapp

**Responsivitet:**
- **Desktop (lg+):** Sticky sidepanel (320-384px bredde)
- **Mobil:** Fullskjerm overlay med backdrop

**Animasjon:**
- Vises med 300ms forsinkelse når hints er klare
- Slide-out ved deaktivering

**Ikoner per hint-type:**
- Service: Lightbulb 💡
- Pricing: DollarSign 💵
- Capacity: TrendingUp 📈
- Hours: Clock 🕐
- General: Sparkles ✨

---

## Oppdaterte filer (4 stk)

### 3. `app/(public)/register/page.tsx`
**Endringer:**
- Linje 76: Lagt til state `aiHintsEnabledStep2` (default: `true`)
- Linje 472-478: Sender props til Step2_1_BasicInfo
- Linje 488-495: Sender props til Step2_2_ServicesAndPricing
- Linje 509-516: Sender props til Step2_3_OpeningHoursAndCapacity

**Nye props til steg-komponenter:**
```typescript
orgId={orgId}
aiHintsEnabled={aiHintsEnabledStep2}
onDisableAiHints={() => setAiHintsEnabledStep2(false)}
```

### 4. `components/register/Step2_1_BasicInfo.tsx`
**Endringer:**
- Import av `Step2_AiHintsPanel`
- Nye props: `orgId`, `aiHintsEnabled`, `onDisableAiHints`
- Wrapper: `flex flex-col lg:flex-row gap-6` (for side-by-side layout)
- AI-panel plassert til høyre på desktop, nederst på mobil

### 5. `components/register/Step2_2_ServicesAndPricing.tsx`
**Endringer:**
- Import av `Step2_AiHintsPanel`
- Nye props: `orgId`, `aiHintsEnabled`, `onDisableAiHints`
- Samme wrapper-struktur som Step2_1
- AI-panel vises når tjenester/prisnivå er valgt

### 6. `components/register/Step2_3_OpeningHoursAndCapacity.tsx`
**Endringer:**
- Import av `Step2_AiHintsPanel`
- Nye props: `orgId`, `aiHintsEnabled`, `onDisableAiHints`
- Samme wrapper-struktur
- AI-panel vises når åpningstider/kapasitet er satt

---

## Hvordan `aiHintsEnabledStep2` fungerer

### Initial tilstand
```typescript
const [aiHintsEnabledStep2, setAiHintsEnabledStep2] = useState(true);
```
- **Default:** `true` - panelet er aktivt fra start av steg 2

### Flyt gjennom steg 2

**Steg 2.1 (Basic Info):**
```
1. Bruker velger bransje (f.eks. "car_detailing")
2. useAiOnboardingHints hook:
   - Venter 2 sekunder (debounce)
   - Genererer hints: "Populære tjenester for bilpleie"
3. Step2_AiHintsPanel:
   - Slides inn fra høyre etter 300ms
   - Viser hint-kort med ikon og tekst
4. Bruker kan:
   a) Klikke "Skru av AI-hjelp" → aiHintsEnabledStep2 = false
   b) Fortsette å fylle ut → flere hints genereres
```

**Steg 2.2 (Services and Pricing):**
```
1. Bruker velger prisnivå (f.eks. "premium")
2. Hook genererer nye hints:
   - "Premium-posisjonering"
   - "Premium-kunder forventer høy kvalitet..."
3. Panelet oppdateres automatisk
4. Hvis AI-hjelp ble skrudd av i 2.1:
   - Panelet forblir skjult
```

**Steg 2.3 (Opening Hours):**
```
1. Bruker setter helgeåpent
2. Hook genererer hint: "Helgeåpent"
3. Panelet viser råd om helgetillegg
4. State persisteres gjennom alle under-steg
```

### Deaktivering
```typescript
onDisableAiHints={() => setAiHintsEnabledStep2(false)}
```

**Effekt:**
1. `aiHintsEnabledStep2` settes til `false`
2. Panelet slides ut (300ms animasjon)
3. `useAiOnboardingHints` hook stopper med `enabled: false`
4. State persisteres - panelet forblir skjult i alle 3 under-steg
5. Hvis bruker går tilbake til steg 1 og frem igjen, aktiveres panelet på nytt (state resettes ikke)

---

## Hvordan panelet ser ut og oppfører seg

### Visuelt design

**Header:**
```
┌─────────────────────────────────────────┐
│ ✨ AI-hjelp for å sette opp bedriften din  [X] │
│ Vi foreslår tjenester og oppsett...     │
└─────────────────────────────────────────┘
```

**Hint-kort:**
```
┌─────────────────────────────────────────┐
│ 💡 Populære tjenester for bilpleie      │
│ Basert på bransjen din anbefaler vi:    │
│ Interiørvask, Eksteriørpolering...      │
└─────────────────────────────────────────┘
```

**Footer:**
```
┌─────────────────────────────────────────┐
│ [Skru av AI-hjelp for dette steget]     │
│ Du kan alltid skru det på igjen senere  │
└─────────────────────────────────────────┘
```

### Oppførsel

**Desktop (lg og større):**
- Sticky panel på høyre side (320-384px bredde)
- Maksimal høyde: 600px
- Scroll inne i panelet hvis innholdet er for høyt
- Tar ikke fokus fra hovedinnholdet
- Ingen backdrop

**Mobil:**
- Fullskjerm overlay (z-50)
- Semi-transparent backdrop (kan klikkes for å lukke)
- Slides inn fra høyre
- Scroll fungerer normalt

**Animasjoner:**
- **Inn:** `translate-x-full → translate-x-0` (300ms ease-out)
- **Ut:** `translate-x-0 → translate-x-full` (300ms ease-out)
- **Delay:** 300ms før panelet vises første gang

**Loading-state:**
```
⏳ Genererer forslag...
```

**Error-state:**
```
⚠️ Kunne ikke hente AI-forslag
(Rød bakgrunn med border)
```

**Empty-state:**
```
ℹ️ Fyll ut mer informasjon for å få AI-forslag
(Sentrert tekst, grå)
```

---

## Tekniske detaljer

### Debouncing-implementasjon
```typescript
useEffect(() => {
  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current);
  }
  
  debounceTimerRef.current = setTimeout(() => {
    fetchHints();
  }, 2000); // 2 sekunder
  
  return () => clearTimeout(debounceTimerRef.current);
}, [fetchHints]);
```

### Caching-mekanisme
```typescript
const cacheKey = JSON.stringify({
  industries: onboardingData.industries,
  locationType: onboardingData.locationType,
  priceLevel: onboardingData.priceLevel,
  selectedServicesLength: onboardingData.selectedServices?.length || 0,
});

if (cacheKey === lastRequestRef.current) {
  return; // Skip duplicate request
}

lastRequestRef.current = cacheKey;
```

### AbortController-håndtering
```typescript
if (abortControllerRef.current) {
  abortControllerRef.current.abort();
}

abortControllerRef.current = new AbortController();

// Later in cleanup:
useEffect(() => {
  return () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, []);
```

---

## Fremtidig backend-integrasjon

### Forventet endepunkt
```
POST /api/orgs/:orgId/ai/onboarding/hints
```

**Request body:**
```json
{
  "industries": ["car_detailing"],
  "locationType": "fixed",
  "selectedServices": ["Interior cleaning", "Exterior polish"],
  "priceLevel": "premium",
  "capacityHeavyJobsPerDay": 5
}
```

**Response:**
```json
{
  "hints": [
    {
      "type": "service",
      "title": "Populære tjenester for bilpleie",
      "message": "Basert på bransjen din anbefaler vi...",
      "relevance": 0.9
    }
  ],
  "confidence": 0.85
}
```

**Implementasjonssteg:**
1. Lag lightweight endpoint i lyx-api
2. Bruk OpenAI for å generere kontekstualiserte hints
3. Cache hints per org for å redusere API-kostnader
4. Oppdater `useAiOnboardingHints.ts` med ekte API-kall
5. Fjern client-side hint-generering

---

## Testing

### Test 1: Panel vises automatisk
```bash
# 1. Gå til /register, fyll ut steg 1
# 2. Velg en bransje i steg 2.1
# 3. Vent 2 sekunder
# 4. Verifiser at panelet slides inn fra høyre
# 5. Sjekk at hints vises for valgt bransje
```

### Test 2: Deaktivering fungerer
```bash
# 1. I steg 2.1 med panel synlig
# 2. Klikk "Skru av AI-hjelp for dette steget"
# 3. Verifiser at panelet slides ut
# 4. Gå til steg 2.2
# 5. Verifiser at panelet ikke vises
# 6. Gå til steg 2.3
# 7. Verifiser at panelet fortsatt er skjult
```

### Test 3: Debouncing fungerer
```bash
# 1. I steg 2.1, velg bransje
# 2. Vent 1 sekund
# 3. Velg ny bransje
# 4. Verifiser at hints ikke genereres før etter 2 sek total
# 5. Sjekk console logs - skal bare være 1 API-kall
```

### Test 4: Responsivitet
```bash
# Desktop:
# 1. Åpne i full bredde
# 2. Verifiser at panel er på høyre side
# 3. Verifiser ingen backdrop

# Mobil:
# 1. Åpne i mobilvisning
# 2. Verifiser at panel er fullskjerm
# 3. Verifiser at backdrop vises
# 4. Klikk backdrop → panel lukkes
```

### Test 5: Hint-generering
```bash
# Test alle bransjer:
# - car_detailing → Bilpleie-forslag
# - hair_salon → Frisør-forslag
# - andre → Generelle forslag

# Test prisnivåer:
# - budget → Volum-fokusert råd
# - premium → Kvalitet-fokusert råd

# Test lokasjon:
# - mobile → Reisekostnad-tips
# - both → Hybrid-modell råd
```

---

## Oppsummering

### Hva ble implementert

1. ✅ Custom hook (`useAiOnboardingHints`) med debouncing og caching
2. ✅ AI hints panel-komponent med slide-in animasjon
3. ✅ Integrasjon i alle 3 under-steg av steg 2
4. ✅ State-styring for aktivering/deaktivering
5. ✅ Responsivt design (desktop sidepanel / mobil fullskjerm)
6. ✅ Client-side hint-generering (midlertidig)

### Brukeropplevelse

- **Påtrengende:** Panelet dukker automatisk opp og er tydelig synlig
- **Kontrollerbart:** Kan enkelt deaktiveres for hele steg 2
- **Hjelpsomt:** Gir kontekstuelle råd basert på valg
- **Ikke-forstyrrende:** Blokkerer ikke hovedinnholdet
- **Responsivt:** Tilpasser seg skjermstørrelse

### Performance

- **Debouncing:** Unngår unødvendige kall ved hver endring
- **Caching:** Lagrer siste hints for samme input
- **AbortController:** Kansellerer utgåtte requests
- **Lazy loading:** Panelet lastes bare når aktivert

**Status: ✅ Klar for testing og videre utvikling**

---

## Neste steg (valgfritt)

1. Implementer backend-endepunkt `/api/orgs/:orgId/ai/onboarding/hints`
2. Bruk OpenAI for smartere hint-generering
3. Legg til A/B-testing for å måle effekt
4. Implementer analytics for å tracke hint-bruk
5. Legg til "thumbs up/down" feedback på hints
6. Cache hints i backend for raskere respons
7. Legg til personalisering basert på org-type
