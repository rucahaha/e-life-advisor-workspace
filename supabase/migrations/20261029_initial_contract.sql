-- Planning skeleton only. Apply only in an authorised Supabase project after a privacy review.
-- Never place service_role credentials in the browser or GitHub Pages bundle.
create type public.case_status as enum ('requested','confirmed','preparing','prepared','served','closed','cancelled','reschedule_requested','unreachable');

create table public.consultation_cases (
  id uuid primary key default gen_random_uuid(),
  case_code text unique not null,
  persona_type text not null,
  needs jsonb not null,
  status public.case_status not null default 'requested',
  source text not null,
  assigned_staff_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.consultation_cases(id) on delete cascade,
  store_id text not null,
  preferred_date date not null,
  preferred_period text not null,
  confirmed_datetime timestamptz,
  status public.case_status not null default 'requested',
  contact_reference text,
  consent_recorded_at timestamptz
);

alter table public.consultation_cases enable row level security;
alter table public.appointments enable row level security;
-- Add staff/store-scoped select/update policies after the project's auth claims are designed.
-- Do NOT add a public SELECT policy. Customer status lookup needs a dedicated opaque token endpoint.
