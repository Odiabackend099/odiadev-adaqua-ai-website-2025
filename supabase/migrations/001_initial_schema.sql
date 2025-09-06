-- ODIADEV MVP Database Schema
-- Create tables, RLS policies, and triggers for the thin-slice MVP

-- 1) profiles: 1–1 with auth.users; extendable later
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  created_at timestamptz default now()
);

-- 2) assistants: one per user (MVP allows 1; enforce in app)
create table if not exists public.assistants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 40),
  persona text not null check (persona in ('Ezinne','Lexi','ODIA','Atlas')),
  voice_enabled boolean not null default true,
  lang text not null default 'en',
  created_at timestamptz default now()
);

-- 3) channels: prepare for future (web, whatsapp, telegram) – only 'web' used now
create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  assistant_id uuid not null references public.assistants(id) on delete cascade,
  type text not null check (type in ('web','whatsapp','telegram')),
  status text not null default 'active',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 4) messages: store minimal transcript for the web chat session (optional retention)
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  assistant_id uuid not null references public.assistants(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  text text not null check (char_length(text) > 0 and char_length(text) <= 5000),
  created_at timestamptz default now()
);

-- 5) audit_logs: basic "who did what" without PII payloads
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,                 -- e.g. 'assistant_create','tts_ok','tts_fail'
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.assistants enable row level security;
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.audit_logs enable row level security;

-- RLS Policies: Only the owner sees their data
create policy "profiles_self" on public.profiles
  for all using (id = auth.uid())
  with check (id = auth.uid());

create policy "assistants_owner_rw" on public.assistants
  for all using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "channels_owner_rw" on public.channels
  for all using (
    exists (select 1 from public.assistants a where a.id = channels.assistant_id and a.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.assistants a where a.id = channels.assistant_id and a.owner_id = auth.uid())
  );

create policy "messages_owner_rw" on public.messages
  for all using (
    exists (select 1 from public.assistants a where a.id = messages.assistant_id and a.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.assistants a where a.id = messages.assistant_id and a.owner_id = auth.uid())
  );

create policy "audit_read_own" on public.audit_logs
  for select using (user_id = auth.uid());

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to log audit events
create or replace function public.log_audit_event(
  action_name text,
  metadata jsonb default '{}'::jsonb
)
returns void as $$
begin
  insert into public.audit_logs (user_id, action, meta)
  values (auth.uid(), action_name, metadata);
end;
$$ language plpgsql security definer;

-- Indexes for performance
create index if not exists idx_assistants_owner_id on public.assistants(owner_id);
create index if not exists idx_channels_assistant_id on public.channels(assistant_id);
create index if not exists idx_messages_assistant_id on public.messages(assistant_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at);
