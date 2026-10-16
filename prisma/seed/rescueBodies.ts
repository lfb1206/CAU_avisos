import { PrismaClient } from '@prisma/client';

// Default rescue-contact list shown on every new aviso largo. Previously hardcoded
// directly in FormContext.tsx's initialFormState — moved here so it's DB-backed
// and editable without a code change, consistent with how other reference data
// (basic/transport/medical options) is sourced.
const rescueBodies = [
  { nombre: 'Socorro Andino Santiago', telefono: '226994764 - 226989094', default_incluir: true },
  { nombre: 'Carabineros', telefono: '133', default_incluir: true },
  { nombre: 'Bomberos', telefono: '132', default_incluir: true },
  { nombre: 'FACH (Fuerza Aérea - Rescate Aéreo)', telefono: '+56 2 2690 1000', default_incluir: true },
  { nombre: 'Socorro Andino Magallanes', telefono: '+56 9 6594 4314', default_incluir: false },
  { nombre: 'SAMU (Servicio de Atención Médica de Urgencia)', telefono: '131', default_incluir: false },
  { nombre: 'PDI (Policía de Investigaciones)', telefono: '134', default_incluir: false },
  { nombre: 'Socorro Andino Los Andes', telefono: '+56 9 9442 4294', default_incluir: false },
  { nombre: 'Socorro Andino Valparaíso', telefono: '+56 9 8225 7085', default_incluir: false },
  { nombre: 'Cuerpo de Socorro Andino Aconcagua', telefono: '+56 9 9164 5890', default_incluir: false },
  { nombre: 'CONAF (Emergencias en Parques Nacionales)', telefono: '+56 2 2663 0000', default_incluir: false },
  { nombre: 'Armada de Chile (Rescate Marítimo)', telefono: '+56 32 220 8888', default_incluir: false },
];

export async function seedRescueBodies(prisma: PrismaClient) {
  console.log('Seeding rescue body contacts...');

  const existing = await prisma.rescueBody.count();
  if (existing > 0) {
    console.log('  Rescue bodies already seeded, skipping');
    return;
  }

  await prisma.rescueBody.createMany({
    data: rescueBodies.map((r, index) => ({ ...r, order_index: index })),
  });

  console.log(`  Seeded ${rescueBodies.length} rescue body contacts`);
}
