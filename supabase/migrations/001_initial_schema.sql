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

-- profiles: users can read their own profile; admins can read all
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- avisos: users can CRUD their own
alter table public.avisos enable row level security;

create policy "Users can manage own avisos"
  on public.avisos for all
  using (auth.uid() = created_by);

create policy "Admins can read all avisos"
  on public.avisos for select
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- people: admins write, members read
alter table public.people enable row level security;

create policy "Anyone authenticated can read people"
  on public.people for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage people"
  on public.people for all
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- courses: public read, admin write
alter table public.courses enable row level security;

create policy "Anyone can read courses"
  on public.courses for select
  using (true);

create policy "Admins can manage courses"
  on public.courses for all
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- course_enrollments: users see own; admins see all
alter table public.course_enrollments enable row level security;

create policy "Users can manage own enrollments"
  on public.course_enrollments for all
  using (auth.uid() = user_id);

create policy "Admins can manage all enrollments"
  on public.course_enrollments for all
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));
