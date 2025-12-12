# Vercel / GitHub Actions – AI Self-Heal (V1)

Dette er et førsteutkast til et system som prøver å rydde opp i bygg-feil automatisk ved å:

1. Kjøre `npm run build` i GitHub Actions.
2. Hvis build feiler:
   - Henter ut error-logg.
   - Les­er `package.json`, `next.config.*` og første fil som dukker opp i error-meldingen.
   - Sender alt til OpenAI (GPT-4o-mini) og ber om en **git patch**.
   - Kjører `git apply` på patchen.
   - Committer med `[ai-fix]` i meldingen og pusher til samme branch.
3. Det nye commitet trigget en ny Vercel- / CI-runde, som (forhåpentligvis) går grønt.

> Dette er en "smart assistent", ikke magi. Den kommer ikke til å treffe 100 % hver gang, men den kan ta vekk de dumme feilene.

---

## Mappestruktur

Kopier alt inn i rot-mappen til prosjektet ditt:

```text
.
├─ .github/
│  └─ workflows/
│     └─ vercel-ai-self-heal.yml
└─ ai-self-heal/
   ├─ package.json
   └─ index.mjs
```

---

## Oppsett – steg for steg

### 1. Legg inn filer i repoet ditt

1. Åpne prosjektet ditt i VS Code.
2. Kopier:
   - `.github/workflows/vercel-ai-self-heal.yml`
   - `ai-self-heal/` mappen
3. Commit og push **uten** å skru på OpenAI-key enda, hvis du vil teste at workflowen kjører.

> Workflowen er satt opp til å kjøre på `main` og `master`. Endre i YAML hvis du bruker en annen branch.

---

### 2. Legg inn OpenAI API-nøkkel i GitHub

1. Gå til repoet på GitHub.
2. `Settings` → `Secrets and variables` → `Actions`.
3. Klikk **"New repository secret"**.
4. Lag et secret med:
   - Name: `OPENAI_API_KEY`
   - Value: API-nøkkelen din fra OpenAI.
5. Lagre.

GitHub setter automatisk `GITHUB_TOKEN`, så du trenger ikke gjøre noe mer for push-delen.

---

### 3. Sjekk at `npm run build` fungerer lokalt

Workflowen kjører:

```bash
npm install      # eller npm ci
npm run build
```

Hvis du bruker `pnpm` eller `yarn`, endre disse linjene i:

- `.github/workflows/vercel-ai-self-heal.yml`
- `index.mjs` (kommandoen i `runCommand("npm", ["run", "build"])`)

---

### 4. Hvordan det oppfører seg

- **Hvis build er grønn** → Workflow bare sier "Build succeeded" og gjør ingenting mer.
- **Hvis build feiler og `OPENAI_API_KEY` mangler** → Den kjører en vanlig build og feiler helt normalt.
- **Hvis build feiler og nøkkel er satt**:
  1. Scriptet leser error-logg.
  2. Henter filnavn fra første error-linje som matcher `./path/file.tsx:line:col`.
  3. Leser innholdet i filen (hvis mulig).
  4. Sender alt til OpenAI og ber om en patch.
  5. Bruker `git apply` for å legge inn endringene.
  6. Committer og pusher med meldingen:

     ```text
     [ai-fix] automatic fix for build error
     ```

  7. Workflowen avslutter med **samme exit code** som første build (altså rød), slik at du ser at det *var* en feil – men et nytt run er allerede startet på den nye commiten.

Workflowen kjører **ikke** på commits som allerede har `[ai-fix]` i meldingen, for å unngå evige looper.

---

## Viktige begrensninger (ærlige versjonen)

- AI får ikke hele repoet, bare:
  - Error-logg (trunkert til ca. 8k tegn)
  - `package.json` (trunkert)
  - `next.config.*` hvis den finnes (trunkert)
  - Første fil som dukker opp i feilmeldingen
- Hvis feilen krever bredere refaktorering eller endringer på flere filer, vil den ofte bomme.
- Patchen kan av og til ikke matche helt (for eksempel hvis linjenumre ikke stemmer), i så fall vil `git apply` feile og alt stoppes.

Dette er ment som en **V1-robot-assistent**, ikke en kirurg.

---

## Hvor dette hjelper mest

- Klassiske TypeScript-feil (manglende props, feil typer, små skrivefeil).
- Eksport/import-feil som: "X is not exported from Y".
- Enkle Next.js-konfig-feil (tror `next.config`-endringer, manglende `experimental`-felt, osv.).
- Små logikkfeil rundt `async/await`, `return` og lignende.

---

## Skru det av / juster

- Vil du bare kjøre dette manuelt? Endre:

```yaml
on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:
```

til for eksempel:

```yaml
on:
  workflow_dispatch:
```

Da kjører du det kun fra "Actions"-fanen i GitHub når *du* trykker på knappen.

---

## Neste steg (hvis du vil ta den helt ut senere)

- Lag egen mappe for logger per run (`/ai-logs/`) som samler:
  - Error-logg
  - AI-svar
  - Diff som ble brukt
- Slack/Discord-varsling når AI har prøvd å fikse noe.
- Egen "AI review mode" som bare lager PR i stedet for å pushe direkte.
- Flagg i commit-melding for antall forsøk: `[ai-fix#1]`, `[ai-fix#2]` osv.

Denne pakken er laget for å være et **sinnssykt enkel "drop-in" V1** som du kan kaste rett inn i repoet ditt og så bygger vi den smartere derfra.
