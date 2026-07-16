import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { seedPeople } from './people';
import { seedEquipment } from './equipment';
import { seedBasicOptions } from './basicOptions';
import { seedTalleres } from './talleres';
import { seedFichas } from './fichas';
import { seedSupuestos } from './supuestos';
import { setupRLS } from './rls';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...\n');

  await seedPeople(prisma);
  await seedEquipment(prisma);
  await seedBasicOptions(prisma);
  await seedTalleres(prisma);
  await seedFichas(prisma);
  await seedSupuestos(prisma);
  await setupRLS(prisma);

  console.log('\nSeed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
