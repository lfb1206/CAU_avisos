-- Run in Supabase SQL Editor after applying prisma db push

-- ── course_points RLS ─────────────────────────────────────────────────────────
alter table public.course_points enable row level security;

drop policy if exists "Users can read own points" on public.course_points;
create policy "Users can read own points"
  on public.course_points for select
  using (auth.uid() = user_id);

drop policy if exists "Coordinadores can manage points" on public.course_points;
create policy "Coordinadores can manage points"
  on public.course_points for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('coordinador', 'admin')
  ));

-- ── Allow coordinadores to update courses (enrollment_open field) ─────────────
drop policy if exists "Coordinadores can update course enrollment" on public.courses;
create policy "Coordinadores can update course enrollment"
  on public.courses for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('coordinador', 'admin')
  ));
