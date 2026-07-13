-- Run this in the Supabase SQL editor after applying the Prisma migration
-- (prisma migrate dev / prisma db push)

-- ── Trigger: auto-create profile when a user signs up ────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── RLS policies ─────────────────────────────────────────────────────────────

-- profiles
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- avisos
alter table public.avisos enable row level security;

drop policy if exists "Users can manage own avisos" on public.avisos;
create policy "Users can manage own avisos"
  on public.avisos for all
  using (auth.uid() = created_by);

drop policy if exists "Admins can read all avisos" on public.avisos;
create policy "Admins can read all avisos"
  on public.avisos for select
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- people
alter table public.people enable row level security;

drop policy if exists "Anyone authenticated can read people" on public.people;
create policy "Anyone authenticated can read people"
  on public.people for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can manage people" on public.people;
create policy "Admins can manage people"
  on public.people for all
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- courses
alter table public.courses enable row level security;

drop policy if exists "Anyone can read courses" on public.courses;
create policy "Anyone can read courses"
  on public.courses for select
  using (true);

drop policy if exists "Admins can manage courses" on public.courses;
create policy "Admins can manage courses"
  on public.courses for all
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- course_enrollments
alter table public.course_enrollments enable row level security;

drop policy if exists "Users can manage own enrollments" on public.course_enrollments;
create policy "Users can manage own enrollments"
  on public.course_enrollments for all
  using (auth.uid() = user_id);

drop policy if exists "Admins can manage all enrollments" on public.course_enrollments;
create policy "Admins can manage all enrollments"
  on public.course_enrollments for all
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- equipment_items: authenticated read, admin write
alter table public.equipment_items enable row level security;

drop policy if exists "Anyone authenticated can read equipment" on public.equipment_items;
create policy "Anyone authenticated can read equipment"
  on public.equipment_items for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can manage equipment" on public.equipment_items;
create policy "Admins can manage equipment"
  on public.equipment_items for all
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- activities: authenticated read, admin write
alter table public.activities enable row level security;

drop policy if exists "Anyone authenticated can read activities" on public.activities;
create policy "Anyone authenticated can read activities"
  on public.activities for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can manage activities" on public.activities;
create policy "Admins can manage activities"
  on public.activities for all
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- basic_form_options: authenticated read, admin write
alter table public.basic_form_options enable row level security;

drop policy if exists "Anyone authenticated can read form options" on public.basic_form_options;
create policy "Anyone authenticated can read form options"
  on public.basic_form_options for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can manage form options" on public.basic_form_options;
create policy "Admins can manage form options"
  on public.basic_form_options for all
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- supuestos: authenticated read, admin write
alter table public.supuestos enable row level security;

drop policy if exists "Anyone authenticated can read supuestos" on public.supuestos;
create policy "Anyone authenticated can read supuestos"
  on public.supuestos for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can manage supuestos" on public.supuestos;
create policy "Admins can manage supuestos"
  on public.supuestos for all
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));
