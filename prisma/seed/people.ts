import { PrismaClient } from '@prisma/client';

// The real CAU member whitelist (name, RUT, phone, email) is intentionally NOT
// committed to this public repo — it's real personal data for ~100 club members.
//
// To seed it locally: create an untracked `prisma/seed/data/people.local.json`
// (gitignored) as an array of { name, rut, phone, email } objects, and it will
// be picked up automatically. Only `email` is actually used below, to populate
// the pre-registration profile whitelist.
type Person = { name: string; rut: string | null; phone: string | null; email: string };

const examplePeople: Person[] = [
  { name: 'Jane Doe', rut: '11.111.111-1', phone: '+56911111111', email: 'jane.doe@example.com' },
  { name: 'John Smith', rut: null, phone: null, email: 'john.smith@example.com' },
];

function loadPeople(): Person[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const local = require('./data/people.local.json');
    if (Array.isArray(local) && local.length > 0) return local;
  } catch {
    // no local file present — fall back to the example data below
  }
  return examplePeople;
}

const people = loadPeople();

// Seed pre-registration profile entries (whitelist + known personal data).
// These rows have is_registered=false — the Supabase auth trigger promotes them
// to registered profiles when the user signs up with their email.
export async function seedPeople(prisma: PrismaClient) {
  console.log('Seeding member whitelist into profiles...');

  const entries = people
    .filter((p) => p.email)
    .map((p) => ({
      email: p.email!.toLowerCase().trim(),
      is_registered: false,
    }));

  await prisma.profile.createMany({
    data: entries,
    skipDuplicates: true,
  });

  console.log(`  Seeded ${entries.length} member whitelist entries`);
}
