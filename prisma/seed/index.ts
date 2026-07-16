import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { seedPeople } from './people';
import { seedEquipment } from './equipment';
import { seedBasicOptions } from './basicOptions';
import { seedTalleres } from './talleres';
import { seedFichas } from './fichas';
import { seedSupuestos } from './supuestos';
import { seedRiskOptions } from './riskOptions';
import { setupRLS } from './rls';
import { seedChecklistsAndOptions } from './checklistsAndOptions';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...\n');

  await seedPeople(prisma);
  await seedEquipment(prisma);
  await seedBasicOptions(prisma);
  await seedTalleres(prisma);
  await seedFichas(prisma);
  await seedSupuestos(prisma);
  await seedRiskOptions(prisma);
  await setupRLS(prisma);
  await seedChecklistsAndOptions(prisma);

  console.log('\nSeed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
