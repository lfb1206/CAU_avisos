import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { seedPeople } from './people';
import { seedEquipment } from './equipment';
import { seedBasicOptions } from './basicOptions';
import { seedCourses } from './courses';
import { seedSupuestos } from './supuestos';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...\n');

  await seedPeople(prisma);
  await seedEquipment(prisma);
  await seedBasicOptions(prisma);
  await seedCourses(prisma);
  await seedSupuestos(prisma);

  console.log('\nSeed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
