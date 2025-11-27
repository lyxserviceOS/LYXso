// app/(protected)/admin/orgs/AdminOrgsPageClient.tsx
"use client";

import React from "react";

export default function AdminOrgsPageClient() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            ADMIN • ORGANISASJONER
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Organisasjoner & partnere
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Her kommer oversikt over alle orgs, planer, status og nøkkeltall.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            STATUS
          </p>
          <p className="mt-1 text-sm text-slate-900">
            Admin-modul under utvikling
          </p>
          <p className="text-[11px]">
            Vi starter med enkel org-liste og kobling mot planer.
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        <p className="mb-2 font-medium text-slate-700">
          Admin-oversikt kommer
        </p>
        <p className="text-xs">
          Foreløpig er dette en placeholder. Her vil du senere se alle
          organisasjoner med plan, omsetning, bookingvolum og status.
        </p>
      </section>

      {/*
        NEDENFOR: original datamodell/SQL lagt som kommentar for referanse.
        (Den kompilerer ikke som TS/JS, derfor flyttet hit.)

Forslag: kjerne- og relasjonstabeller
orgs (finnes allerede)
customers: kundeinfo per org
resources: hva som bookes (rom, tjeneste, personell)
bookings: selve bookingen
booking_items: linjer knyttet til booking (f.eks. flere ressurser/prislister)
booking_status_history: audit trail
booking_notes: interne notater
payments: betalinger knyttet til en booking
Optional: availability/blackouts for resources

SQL-migrasjon (org-basert med RLS)

-- Customers
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  external_id text,
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, email)
);

create index if not exists customers_org_idx on public.customers(org_id);
alter table public.customers enable row level security;

create policy customers_select_org
  on public.customers for select to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy customers_insert_org
  on public.customers for insert to authenticated
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy customers_update_org
  on public.customers for update to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid)
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy customers_delete_org
  on public.customers for delete to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);


-- Resources (rom, tjenester, personell, etc.)
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  type text not null default 'generic',
  name text not null,
  description text,
  is_active boolean not null default true,
  capacity integer,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resources_org_idx on public.resources(org_id);
create index if not exists resources_org_active_idx on public.resources(org_id, is_active);
alter table public.resources enable row level security;

create policy resources_select_org
  on public.resources for select to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy resources_insert_org
  on public.resources for insert to authenticated
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy resources_update_org
  on public.resources for update to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid)
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy resources_delete_org
  on public.resources for delete to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);


-- Bookings (hovedtabell)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'pending',
  title text,
  notes text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text,
  total_amount numeric(12,2) default 0,
  currency text default 'NOK',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_time_chk check (ends_at > starts_at),
  constraint bookings_status_chk check (status in ('pending','confirmed','in_progress','completed','cancelled','no_show'))
);

create index if not exists bookings_org_times_idx on public.bookings(org_id, starts_at, ends_at);
create index if not exists bookings_org_status_idx on public.bookings(org_id, status);
create index if not exists bookings_customer_idx on public.bookings(customer_id);
alter table public.bookings enable row level security;

create policy bookings_select_org
  on public.bookings for select to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy bookings_insert_org
  on public.bookings for insert to authenticated
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy bookings_update_org
  on public.bookings for update to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid)
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy bookings_delete_org
  on public.bookings for delete to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);


-- Booking items
create table if not exists public.booking_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete set null,
  name text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  tax_rate numeric(5,2) default 0,
  amount numeric(12,2) generated always as (round(quantity * unit_price, 2)) stored,
  created_at timestamptz not null default now()
);

create index if not exists booking_items_org_booking_idx on public.booking_items(org_id, booking_id);
create index if not exists booking_items_resource_idx on public.booking_items(resource_id);
alter table public.booking_items enable row level security;

create policy booking_items_select_org
  on public.booking_items for select to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy booking_items_insert_org
  on public.booking_items for insert to authenticated
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy booking_items_update_org
  on public.booking_items for update to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid)
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy booking_items_delete_org
  on public.booking_items for delete to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);


-- Statushistorikk
create table if not exists public.booking_status_history (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid,
  changed_at timestamptz not null default now()
);

create index if not exists booking_status_history_org_booking_idx on public.booking_status_history(org_id, booking_id);
alter table public.booking_status_history enable row level security;

create policy booking_status_history_select_org
  on public.booking_status_history for select to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy booking_status_history_insert_org
  on public.booking_status_history for insert to authenticated
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);


-- Notater
create table if not exists public.booking_notes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  author_id uuid,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists booking_notes_org_booking_idx on public.booking_notes(org_id, booking_id);
alter table public.booking_notes enable row level security;

create policy booking_notes_select_org
  on public.booking_notes for select to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy booking_notes_insert_org
  on public.booking_notes for insert to authenticated
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy booking_notes_delete_org
  on public.booking_notes for delete to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);


-- Betalinger
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text default 'NOK',
  method text,
  external_id text,
  status text not null default 'unpaid',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  constraint payments_status_chk check (status in ('unpaid','paid','refunded','failed','partially_refunded'))
);

create index if not exists payments_org_booking_idx on public.payments(org_id, booking_id);
alter table public.payments enable row level security;

create policy payments_select_org
  on public.payments for select to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy payments_insert_org
  on public.payments for insert to authenticated
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy payments_update_org
  on public.payments for update to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid)
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);


-- Blackouts
create table if not exists public.resource_blackouts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint resource_blackouts_time_chk check (ends_at > starts_at)
);

create index if not exists resource_blackouts_org_res_idx on public.resource_blackouts(org_id, resource_id, starts_at, ends_at);
alter table public.resource_blackouts enable row level security;

create policy resource_blackouts_select_org
  on public.resource_blackouts for select to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid);

create policy resource_blackouts_cud_org
  on public.resource_blackouts for all to authenticated
  using (org_id = (auth.jwt() ->> 'org_id')::uuid)
  with check (org_id = (auth.jwt() ->> 'org_id')::uuid);

Kolonnelister (kort)
customers: id, org_id, external_id, name, email, phone, notes, created_at, updated_at
resources: id, org_id, type, name, description, is_active, capacity, metadata, created_at, updated_at
bookings: id, org_id, customer_id, status, title, notes, starts_at, ends_at, timezone, total_amount, currency, created_at, updated_at
booking_items: id, org_id, booking_id, resource_id, name, quantity, unit_price, tax_rate, amount, created_at
booking_status_history: id, org_id, booking_id, from_status, to_status, changed_by, changed_at
booking_notes: id, org_id, booking_id, author_id, note, created_at
payments: id, org_id, booking_id, amount, currency, method, external_id, status, paid_at, created_at
resource_blackouts: id, org_id, resource_id, starts_at, ends_at, reason, created_at
      */}
    </div>
  );
}
