-- Webmention storage — pending moderation queue.
-- Run once in Supabase SQL editor.

create table if not exists public.webmentions (
  id          bigserial primary key,
  source      text not null,
  target      text not null,
  ip_hash     text,
  status      text not null default 'pending'
              check (status in ('pending','verified','published','rejected','spam')),
  received_at timestamptz not null default now(),
  verified_at timestamptz,
  published_at timestamptz,
  -- Verification result cache (filled when an admin runs the verifier).
  source_html_excerpt text,
  source_title        text,
  source_author       text,
  -- Admin who moderated.
  moderated_by uuid references auth.users(id),
  moderated_at timestamptz,
  -- Per-domain de-dupe within 24h handled by a partial unique index.
  source_host text generated always as ((regexp_match(source, '^https?://([^/]+)'))[1]) stored
);

-- De-dupe: same source-host + target within 24 hours = same row (last wins).
create unique index if not exists webmentions_source_target_dedup_idx
  on public.webmentions (source_host, target, (date_trunc('day', received_at)))
  where status in ('pending','verified');

create index if not exists webmentions_status_idx on public.webmentions (status);
create index if not exists webmentions_received_at_idx on public.webmentions (received_at desc);

-- RLS — service-role only. Public reads happen via the future
-- /mentions page which selects only status='published' rows.
alter table public.webmentions enable row level security;

-- Service role can do everything (no policy needed; service role
-- bypasses RLS by default in Supabase).

-- Anonymous SELECT of published mentions only.
drop policy if exists "webmentions_public_published_read" on public.webmentions;
create policy "webmentions_public_published_read"
  on public.webmentions
  for select
  to anon
  using (status = 'published');
