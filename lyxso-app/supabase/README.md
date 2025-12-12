# Supabase Migrations

Dette prosjektet bruker Supabase migrations for database-endringer.

## Automatisk Deployment

Når du pusher SQL-filer til `supabase/migrations/`, vil GitHub Actions automatisk kjøre dem mot Supabase-databasen.

## Secrets som må være satt i GitHub

Gå til: https://github.com/lyxserviceOS/LYXso/settings/secrets/actions

Legg til følgende secrets:

1. **SUPABASE_ACCESS_TOKEN**
   - Hent fra: https://supabase.com/dashboard/account/tokens
   - Klikk "Generate new token"
   - Gi den et navn (f.eks. "GitHub Actions")
   - Kopier token og legg til i GitHub secrets

2. **SUPABASE_DB_PASSWORD**
   - Dette er database-passordet ditt
   - Finner du i Supabase under Settings → Database
   - Eller bruk: `Lyx2024Master!Secure#Pass` (hvis det er riktig)

## Manuell kjøring

Hvis du vil kjøre migrations manuelt:

```bash
# Link til prosjekt
supabase link --project-ref qxslqfzudduxvjyxedkh

# Kjør migrations
supabase db push
```

## Struktur

```
supabase/
├── config.json                    # Prosjekt-konfigurasjon
└── migrations/
    └── YYYYMMDDHHMMSS_*.sql      # Migration filer
```

## Nåværende Migrations

- `20251206103749_webshop_advanced.sql` - Webshop advanced features (discounts, inventory)
