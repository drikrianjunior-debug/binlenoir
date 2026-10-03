-- À exécuter dans Supabase > SQL Editor (si schema.sql a déjà été exécuté, lancez uniquement ce fichier)
create table categories (id text primary key, name text not null, position int default 0, i18n jsonb not null default '{}');
create table products (id uuid primary key default gen_random_uuid(), name text not null, category text references categories(id) on delete set null, price int not null default 0, sizes text[] not null default '{}', description text default '', images text[] not null default '{}', video text, active boolean not null default true, created_at timestamptz default now(), i18n jsonb not null default '{}');
alter table categories enable row level security; alter table products enable row level security;
create policy "cat lecture" on categories for select using (true);
create policy "cat ecriture" on categories for all using (is_admin()) with check (is_admin());
create policy "prod lecture" on products for select using (active or is_admin());
create policy "prod ecriture" on products for all using (is_admin()) with check (is_admin());
-- Stockage des photos et vidéos
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
create policy "media lecture" on storage.objects for select using (bucket_id = 'media');
create policy "media ajout" on storage.objects for insert with check (bucket_id = 'media' and is_admin());
create policy "media suppression" on storage.objects for delete using (bucket_id = 'media' and is_admin());
