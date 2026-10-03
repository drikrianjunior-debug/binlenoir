-- À exécuter dans Supabase > SQL Editor
create table profiles (id uuid primary key references auth.users on delete cascade, email text, full_name text, phone text, role text not null default 'client', created_at timestamptz default now());
create table orders (id uuid primary key default gen_random_uuid(), num bigint generated always as identity (start with 1001), user_id uuid not null references profiles(id), items jsonb not null, total int not null, address text, note text, status text not null default 'En attente', created_at timestamptz default now());
alter table profiles enable row level security; alter table orders enable row level security;
create function is_admin() returns boolean language sql security definer stable as $$ select exists(select 1 from profiles where id = auth.uid() and role = 'admin') $$;
create function my_role() returns text language sql security definer stable as $$ select role from profiles where id = auth.uid() $$;
create function handle_new_user() returns trigger language plpgsql security definer as $$ begin insert into profiles (id, email, full_name, phone) values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone'); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
create policy "profil lecture" on profiles for select using (id = auth.uid() or is_admin());
create policy "profil modif" on profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = my_role());
create policy "cmd lecture" on orders for select using (user_id = auth.uid() or is_admin());
create policy "cmd creation" on orders for insert with check (user_id = auth.uid() and status = 'En attente');
create policy "cmd statut" on orders for update using (is_admin());
-- Après avoir créé votre compte sur le site, passez-le en admin :
-- update profiles set role = 'admin' where email = 'votre@email.com';
