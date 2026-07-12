import { PrismaClient } from '@prisma/client';

const options: Record<string, string[]> = {
  actividad: [
    'Trekking', 'Montañismo', 'Escalada en Roca', 'Escalada en Hielo',
    'Esquí de Travesía', 'Senderismo', 'Camping', 'Cascading',
    'Alpinismo', 'Rappel', 'Travesía', 'Excursión', 'Via Ferrata',
  ],
  actividadEspecifica: [
    'Ascenso al campamento', 'Descenso al campamento', 'Cruce de río',
    'Progresión en nieve', 'Escalada en roca', 'Rapel', 'Traslado en vehículo',
    'Caminata de aproximación', 'Ascenso a cumbre', 'Descenso por ruta normal',
    'Instalación de campamento', 'Descanso en campamento', 'Retorno al punto de partida',
  ],
  cerroSector: [
    'Cerro El Plomo', 'Cerro Provincia', 'Cerro San Ramón', 'Cerro Manquehue',
    'La Parva', 'El Colorado', 'Valle Nevado', 'Cerro Altar', 'Cerro Leonera',
    'Embalse El Yeso', 'Cajón del Maipo', 'Sector Farellones', 'Cerro Pintor',
    'Portillo', 'Cajon de los Penitentes', 'Aconcagua', 'Volcán Villarrica',
    'Torres del Paine', 'Cerro Castillo', 'Volcán Osorno',
  ],
  tramo: [
    'Aproximación al cerro', 'Subida al campamento base', 'Campamento a cumbre',
    'Descenso de cumbre a campamento', 'Descenso de campamento a inicio',
    'Travesía día 1', 'Travesía día 2', 'Travesía día 3', 'Retorno al punto de inicio',
    'Sector de escalada', 'Zona de gláciar', 'Cresta final', 'Paso de montaña',
    'Portezuelo', 'Refugio a cima', 'Cima a refugio', 'Traversée', 'Arista',
    'Canal de hielo', 'Cara norte',
  ],
};

export async function seedBasicOptions(prisma: PrismaClient) {
  console.log('Seeding basic form options...');

  const rows = Object.entries(options).flatMap(([type, values]) =>
    values.map((value) => ({ type, value }))
  );

  await prisma.basicFormOption.createMany({ data: rows, skipDuplicates: true });

  console.log(`  Seeded ${rows.length} basic form options`);
}
