-- Animen - Supabase şeması
-- Bu SQL'i Supabase SQL Editor'de çalıştırın (Authentication zaten Supabase ile gelir).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.favorites (
  user_id uuid references auth.users (id) on delete cascade,
  kind text not null check (kind in ('anime', 'manga')),
  ref_id text not null,
  title text,
  image text,
  created_at timestamptz default now(),
  primary key (user_id, kind, ref_id)
);

create table if not exists public.history (
  user_id uuid references auth.users (id) on delete cascade,
  kind text not null check (kind in ('anime', 'manga')),
  ref_id text not null,
  episode_or_chapter text,
  created_at timestamptz default now(),
  primary key (user_id, kind, ref_id)
);

create table if not exists public.watchlist (
  user_id uuid references auth.users (id) on delete cascade,
  kind text not null check (kind in ('anime', 'manga')),
  ref_id text not null,
  title text,
  image text,
  created_at timestamptz default now(),
  primary key (user_id, kind, ref_id)
);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.history enable row level security;
alter table public.watchlist enable row level security;

create policy "kendi profili" on public.profiles for all using (auth.uid () = id);
create policy "kendi favorileri" on public.favorites for all using (auth.uid () = user_id);
create policy "kendi geçmişi" on public.history for all using (auth.uid () = user_id);
create policy "kendi listesi" on public.watchlist for all using (auth.uid () = user_id);
