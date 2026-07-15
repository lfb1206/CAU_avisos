import { PrismaClient } from '@prisma/client';

// Enable RLS on tables that prisma db push creates without it,
// and ensure read policies exist for authenticated users.
export async function setupRLS(prisma: PrismaClient) {
  console.log('Setting up RLS policies...');

  // risk_options: authenticated users can read; only service role can write
  await prisma.$executeRawUnsafe(`ALTER TABLE risk_options ENABLE ROW LEVEL SECURITY`);
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename  = 'risk_options'
          AND policyname = 'risk_options: read for authenticated'
      ) THEN
        CREATE POLICY "risk_options: read for authenticated"
        ON risk_options FOR SELECT
        USING (auth.role() = 'authenticated');
      END IF;
    END $$
  `);

  // basic_form_options: authenticated users can read
  await prisma.$executeRawUnsafe(`ALTER TABLE basic_form_options ENABLE ROW LEVEL SECURITY`);
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename  = 'basic_form_options'
          AND policyname = 'basic_form_options: read for authenticated'
      ) THEN
        CREATE POLICY "basic_form_options: read for authenticated"
        ON basic_form_options FOR SELECT
        USING (auth.role() = 'authenticated');
      END IF;
    END $$
  `);

  // supuestos: authenticated users can read
  await prisma.$executeRawUnsafe(`ALTER TABLE supuestos ENABLE ROW LEVEL SECURITY`);
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename  = 'supuestos'
          AND policyname = 'supuestos: read for authenticated'
      ) THEN
        CREATE POLICY "supuestos: read for authenticated"
        ON supuestos FOR SELECT
        USING (auth.role() = 'authenticated');
      END IF;
    END $$
  `);

  console.log('  RLS policies configured');
}
