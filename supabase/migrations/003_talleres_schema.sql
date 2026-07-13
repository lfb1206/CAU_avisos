-- Migration 003: Talleres schema
-- Replaces the old courses/course_enrollments tables with the new
-- talleres / ediciones_taller / inscripciones / ayudantias model.
-- Safe to run after prisma db push (IF NOT EXISTS + DO blocks prevent conflicts).

-- ============================================================
-- 1. ENUMS (idempotent — skip if already created by Prisma)
-- ============================================================

DO $$ BEGIN
  CREATE TYPE "TallerBranch" AS ENUM ('base', 'nieve_hielo', 'roca');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "TallerLevel" AS ENUM ('introductorio', 'intermedio', 'intermedio_avanzado', 'avanzado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "EdicionStatus" AS ENUM ('planificada', 'inscripciones_abiertas', 'en_curso', 'finalizada', 'cancelada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Add 'inscripciones_abiertas' if the enum already existed without it
DO $$ BEGIN
  ALTER TYPE "EdicionStatus" ADD VALUE IF NOT EXISTS 'inscripciones_abiertas';
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "InscripcionStatus" AS ENUM (
    'postulando', 'aceptado', 'en_lista', 'rechazado',
    'completado', 'reprobado', 'no_asiste', 'rezagado', 'retirado'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- Talleres (catalog)
CREATE TABLE IF NOT EXISTS talleres (
  id                      SERIAL PRIMARY KEY,
  name                    TEXT        NOT NULL,
  description             TEXT        NOT NULL DEFAULT '',
  branch                  "TallerBranch" NOT NULL,
  level                   "TallerLevel"  NOT NULL,
  order_index             INTEGER     NOT NULL DEFAULT 0,
  prerequisite_taller_ids INTEGER[]   NOT NULL DEFAULT '{}',
  content_outline         JSONB,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT talleres_name_branch_key UNIQUE (name, branch)
);

-- Ediciones de taller (instances of a Taller)
CREATE TABLE IF NOT EXISTS ediciones_taller (
  id                  SERIAL PRIMARY KEY,
  taller_id           INTEGER         NOT NULL REFERENCES talleres (id) ON DELETE CASCADE,
  name                TEXT            NOT NULL,
  year                INTEGER         NOT NULL DEFAULT 2026,
  semester            INTEGER         NOT NULL DEFAULT 1,
  status              "EdicionStatus" NOT NULL DEFAULT 'planificada',
  enrollment_open     BOOLEAN         NOT NULL DEFAULT FALSE,
  enrollment_opens_at TIMESTAMPTZ,
  required_points     INTEGER         NOT NULL DEFAULT 0,
  capacity            INTEGER         NOT NULL DEFAULT 20,
  price               DECIMAL(10,2),
  start_date          TIMESTAMPTZ,
  end_date            TIMESTAMPTZ,
  location            TEXT,
  notas               TEXT,
  coordinador_id      UUID            REFERENCES profiles (id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  CONSTRAINT ediciones_taller_taller_id_name_key UNIQUE (taller_id, name)
);

-- Inscripciones (postulaciones / enrollment)
CREATE TABLE IF NOT EXISTS inscripciones (
  id                      SERIAL PRIMARY KEY,
  edicion_id              INTEGER              NOT NULL REFERENCES ediciones_taller (id) ON DELETE CASCADE,
  user_id                 UUID                 NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  status                  "InscripcionStatus"  NOT NULL DEFAULT 'postulando',
  aprobado                BOOLEAN,
  rezagado                BOOLEAN              NOT NULL DEFAULT FALSE,
  pago_recibido           BOOLEAN              NOT NULL DEFAULT FALSE,
  -- Health / emergency data collected at postulacion time
  grupo_sanguineo         TEXT,
  alergias                TEXT,
  medicamentos            TEXT,
  condiciones_especiales  TEXT,
  tiene_primeros_auxilios BOOLEAN              NOT NULL DEFAULT FALSE,
  notas_coordinador       TEXT,
  -- Timestamps
  inscrito_at             TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  aprobado_at             TIMESTAMPTZ,
  CONSTRAINT inscripciones_edicion_id_user_id_key UNIQUE (edicion_id, user_id)
);

-- Ayudantias
CREATE TABLE IF NOT EXISTS ayudantias (
  id              SERIAL PRIMARY KEY,
  edicion_id      INTEGER     NOT NULL REFERENCES ediciones_taller (id) ON DELETE CASCADE,
  user_id         TEXT        NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  asistio         BOOLEAN,
  puntos_otorgados BOOLEAN    NOT NULL DEFAULT FALSE,
  signed_up_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ayudantias_edicion_id_user_id_key UNIQUE (edicion_id, user_id)
);

-- ============================================================
-- 3. ALTER course_points to reference edicion_id
-- ============================================================

-- Add edicion_id column if it doesn't exist yet
ALTER TABLE course_points
  ADD COLUMN IF NOT EXISTS edicion_id INTEGER REFERENCES ediciones_taller (id) ON DELETE SET NULL;

-- Drop the old course_id FK if it exists (handle gracefully)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_points' AND column_name = 'course_id'
  ) THEN
    ALTER TABLE course_points DROP COLUMN IF EXISTS course_id;
  END IF;
END $$;

-- ============================================================
-- 4. UPDATED_AT triggers (Prisma-managed tables only)
-- ============================================================
-- talleres / ediciones_taller / inscripciones / ayudantias are managed by
-- Prisma which does NOT add an updated_at column to these models.
-- Triggers on those tables would fail with "record new has no field updated_at".
-- Only drop any leftover triggers if they were previously created.

DROP TRIGGER IF EXISTS set_talleres_updated_at         ON talleres;
DROP TRIGGER IF EXISTS set_ediciones_taller_updated_at ON ediciones_taller;
DROP TRIGGER IF EXISTS set_inscripciones_updated_at    ON inscripciones;
DROP TRIGGER IF EXISTS set_ayudantias_updated_at       ON ayudantias;

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE talleres          ENABLE ROW LEVEL SECURITY;
ALTER TABLE ediciones_taller  ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscripciones     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudantias        ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user has a given role
-- profiles.id is uuid (from Prisma @db.Uuid); auth.uid() returns uuid — no cast needed
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS TEXT LANGUAGE sql STABLE AS $$
  SELECT role::TEXT FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- ============================================================
-- 5a. talleres policies
-- ============================================================

-- Anyone authenticated can read talleres
CREATE POLICY "talleres: authenticated read"
  ON talleres FOR SELECT
  TO authenticated
  USING (TRUE);

-- Only admin can insert / update / delete
CREATE POLICY "talleres: admin insert"
  ON talleres FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_role() = 'admin');

CREATE POLICY "talleres: admin update"
  ON talleres FOR UPDATE
  TO authenticated
  USING (auth_user_role() = 'admin')
  WITH CHECK (auth_user_role() = 'admin');

CREATE POLICY "talleres: admin delete"
  ON talleres FOR DELETE
  TO authenticated
  USING (auth_user_role() = 'admin');

-- ============================================================
-- 5b. ediciones_taller policies
-- ============================================================

-- Authenticated users can read non-cancelled ediciones
CREATE POLICY "ediciones_taller: authenticated read"
  ON ediciones_taller FOR SELECT
  TO authenticated
  USING (status <> 'cancelada' OR auth_user_role() IN ('admin', 'coordinador'));

-- Admin and coordinador can insert ediciones
CREATE POLICY "ediciones_taller: staff insert"
  ON ediciones_taller FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_role() IN ('admin', 'coordinador'));

-- Admin and coordinador (or the assigned coordinador_id) can update
CREATE POLICY "ediciones_taller: staff update"
  ON ediciones_taller FOR UPDATE
  TO authenticated
  USING (
    auth_user_role() IN ('admin', 'coordinador')
    OR coordinador_id = auth.uid()
  )
  WITH CHECK (
    auth_user_role() IN ('admin', 'coordinador')
    OR coordinador_id = auth.uid()
  );

-- Only admin can delete ediciones
CREATE POLICY "ediciones_taller: admin delete"
  ON ediciones_taller FOR DELETE
  TO authenticated
  USING (auth_user_role() = 'admin');

-- ============================================================
-- 5c. inscripciones policies
-- ============================================================

-- Users can read their own inscripciones; coordinadores/admin can read all
CREATE POLICY "inscripciones: own or staff read"
  ON inscripciones FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR auth_user_role() IN ('admin', 'coordinador')
  );

-- Users can insert their own inscripcion (when enrollment_open)
CREATE POLICY "inscripciones: self insert"
  ON inscripciones FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM ediciones_taller e
      WHERE e.id = edicion_id AND e.enrollment_open = TRUE
    )
  );

-- Users can update their own inscripcion (e.g. to withdraw); staff can update any
CREATE POLICY "inscripciones: own update or staff"
  ON inscripciones FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR auth_user_role() IN ('admin', 'coordinador')
  )
  WITH CHECK (
    user_id = auth.uid()
    OR auth_user_role() IN ('admin', 'coordinador')
  );

-- Only admin/coordinador can delete inscripciones
CREATE POLICY "inscripciones: staff delete"
  ON inscripciones FOR DELETE
  TO authenticated
  USING (auth_user_role() IN ('admin', 'coordinador'));

-- ============================================================
-- 5d. ayudantias policies
-- ============================================================

-- Users can read their own ayudantias; staff can read all
CREATE POLICY "ayudantias: own or staff read"
  ON ayudantias FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR auth_user_role() IN ('admin', 'coordinador')
  );

-- Users can sign up as ayudante (handled by API which enforces prereqs)
CREATE POLICY "ayudantias: self insert"
  ON ayudantias FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own ayudantia; staff can update any
CREATE POLICY "ayudantias: own delete"
  ON ayudantias FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR auth_user_role() IN ('admin', 'coordinador')
  );

CREATE POLICY "ayudantias: staff update"
  ON ayudantias FOR UPDATE
  TO authenticated
  USING (auth_user_role() IN ('admin', 'coordinador'))
  WITH CHECK (auth_user_role() IN ('admin', 'coordinador'));

-- ============================================================
-- 6. INDEXES for common query patterns
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_ediciones_taller_taller_id  ON ediciones_taller (taller_id);
CREATE INDEX IF NOT EXISTS idx_ediciones_taller_status      ON ediciones_taller (status);
CREATE INDEX IF NOT EXISTS idx_ediciones_taller_enroll_open ON ediciones_taller (enrollment_open) WHERE enrollment_open = TRUE;
CREATE INDEX IF NOT EXISTS idx_inscripciones_edicion_id     ON inscripciones (edicion_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_user_id        ON inscripciones (user_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_status         ON inscripciones (status);
CREATE INDEX IF NOT EXISTS idx_ayudantias_edicion_id        ON ayudantias (edicion_id);
CREATE INDEX IF NOT EXISTS idx_ayudantias_user_id           ON ayudantias (user_id);
CREATE INDEX IF NOT EXISTS idx_course_points_edicion_id     ON course_points (edicion_id);
