-- 004_profiles_whitelist.sql
-- Merge the people whitelist into profiles.
-- profiles now serves two roles:
--   1. Email whitelist  (is_registered = false, admin-created, no auth user yet)
--   2. Personal data    (is_registered = true, populated by Supabase auth trigger on signup)

-- ── 1. Add new columns to profiles ───────────────────────────────────────────

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_registered    BOOLEAN  DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS blood_type        TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS allergies         TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medications       TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medical_conditions TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_first_aid     BOOLEAN  DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_phone   TEXT;

-- Allow id and name to be auto-generated when admin pre-creates a whitelist entry
ALTER TABLE profiles ALTER COLUMN id   SET DEFAULT gen_random_uuid();
ALTER TABLE profiles ALTER COLUMN name SET DEFAULT '';

-- ── 2. Mark all existing profiles as registered ───────────────────────────────

UPDATE profiles SET is_registered = TRUE WHERE is_registered IS NULL OR is_registered = FALSE;

-- ── 3. Migrate people emails into the whitelist (before dropping the table) ───

INSERT INTO profiles (id, email, is_registered)
SELECT DISTINCT gen_random_uuid(), lower(trim(email)), FALSE
FROM people
WHERE email IS NOT NULL AND trim(email) != ''
ON CONFLICT (email) DO NOTHING;

-- ── 4. Drop the people table ──────────────────────────────────────────────────

DROP TABLE IF EXISTS people;

-- ── 5. Update the handle_new_user trigger ────────────────────────────────────
-- Old behaviour: always INSERT a new profile row.
-- New behaviour: if a whitelist entry (is_registered=false) exists for that
--   email, UPDATE its id to match the new auth user and mark as registered.
--   Otherwise fall back to INSERT (admin or self-signed-up user not on whitelist).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pre_id UUID;
BEGIN
  -- Check for a pre-registration placeholder
  SELECT id INTO pre_id
  FROM public.profiles
  WHERE email = NEW.email AND is_registered = FALSE
  LIMIT 1;

  IF pre_id IS NOT NULL THEN
    -- Promote the placeholder: swap in the real auth UUID
    UPDATE public.profiles
    SET
      id            = NEW.id,
      is_registered = TRUE,
      name          = CASE
                        WHEN name = '' THEN COALESCE(
                          NEW.raw_user_meta_data->>'name',
                          split_part(NEW.email, '@', 1)
                        )
                        ELSE name
                      END
    WHERE id = pre_id;
  ELSE
    INSERT INTO public.profiles (id, email, name, is_registered)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      TRUE
    )
    ON CONFLICT (email) DO UPDATE
      SET id = EXCLUDED.id, is_registered = TRUE;
  END IF;

  RETURN NEW;
END;
$$;
