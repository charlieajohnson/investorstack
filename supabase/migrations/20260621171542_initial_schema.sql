create table public.categories (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  workflow_stages text[] not null default '{}',
  priority text not null check (priority in ('P0', 'P1', 'P2')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tools (
  id text primary key,
  slug text not null unique,
  name text not null,
  website text not null,
  category_id text not null references public.categories(id) on update cascade on delete restrict,
  scoring_status text not null check (scoring_status in ('scored', 'provisional', 'unscored')),
  scores jsonb,
  ai_readiness_signal jsonb not null,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  last_reviewed_at date not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scores_match_status check (
    (scores is null and scoring_status = 'unscored') or
    (scores is not null and scoring_status in ('scored', 'provisional'))
  )
);

create index tools_category_id_idx on public.tools(category_id);
create index tools_last_reviewed_at_idx on public.tools(last_reviewed_at desc);
create index tools_ai_readiness_signal_idx on public.tools using gin(ai_readiness_signal);

create table public.workflows (
  id text primary key,
  label text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table public.guides (
  slug text primary key,
  title text not null,
  audience text not null,
  last_reviewed_at date not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'stack_builder_completed',
    'compare_tools',
    'request_vendor_intro',
    'request_stack_audit',
    'download_stack_recommendation',
    'submit_current_stack',
    'submit_update'
  )),
  email text not null,
  firm_type text not null,
  role text not null,
  tool_slug text references public.tools(slug) on update cascade on delete set null,
  notes text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index lead_events_created_at_idx on public.lead_events(created_at desc);
create index lead_events_event_type_idx on public.lead_events(event_type);

alter table public.categories enable row level security;
alter table public.tools enable row level security;
alter table public.workflows enable row level security;
alter table public.guides enable row level security;
alter table public.lead_events enable row level security;

revoke all on table public.categories from anon, authenticated;
revoke all on table public.tools from anon, authenticated;
revoke all on table public.workflows from anon, authenticated;
revoke all on table public.guides from anon, authenticated;
revoke all on table public.lead_events from anon, authenticated;

grant select on table public.categories to anon, authenticated;
grant select on table public.tools to anon, authenticated;
grant select on table public.workflows to anon, authenticated;
grant select on table public.guides to anon, authenticated;
grant select, insert, update, delete on table public.categories to service_role;
grant select, insert, update, delete on table public.tools to service_role;
grant select, insert, update, delete on table public.workflows to service_role;
grant select, insert, update, delete on table public.guides to service_role;
grant select, insert, update, delete on table public.lead_events to service_role;

create policy "Public categories are readable"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Public tools are readable"
  on public.tools for select
  to anon, authenticated
  using (true);

create policy "Public workflows are readable"
  on public.workflows for select
  to anon, authenticated
  using (true);

create policy "Public guides are readable"
  on public.guides for select
  to anon, authenticated
  using (true);

comment on table public.lead_events is 'Server-only lead event store. No anonymous or authenticated Data API policy exists.';
