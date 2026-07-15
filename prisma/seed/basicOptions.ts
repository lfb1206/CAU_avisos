import { PrismaClient } from '@prisma/client';

// Values aligned with supuestos banco so the form can correctly filter supuestos by actividad/tramo/dificultad
const options: Record<string, string[]> = {
  // Activity types — exactly the 27 actividades used in banco_supuestos_cau.json
  actividad: [
    'acarreo',
    'alpinismo clásico',
    'avalancha',
    'caminata por sendero',
    'campamento de altura',
    'campo traviesa',
    'canaleta nieve-hielo',
    'cruce de río',
    'descenso sin equipar',
    'escalada hielo/mixto',
    'expedición de altura',
    'glaciar',
    'hielo moderado',
    'hielo sostenido',
    'invernal comprometida',
    'marcha nocturna',
    'montañismo básico',
    'nevero',
    'rapel',
    'roca moderada',
    'roca sostenida',
    'ruta técnica sostenida',
    'senderismo',
    'travesía',
    'trekking de altura',
    'trekking de un día',
    'trepada sin cuerda',
  ],

  // Route sections — the 3 tramos used in banco_supuestos_cau.json
  tramo: [
    'Aproximación',
    'Ascenso / Cumbre',
    'Descenso / Retorno',
  ],

  // Risk/difficulty categories — the 24 dificultades used in banco_supuestos_cau.json
  dificultad: [
    'acarreo',
    'agua/hidratación',
    'altura (>3.500 m)',
    'altura extrema (>5.500 m)',
    'caída de rocas',
    'comunicación',
    'cruce de río',
    'fatiga',
    'fisiológico',
    'fisiológico/aclimatación',
    'frío/congelación',
    'glaciar agrietado',
    'grupo/dinámica',
    'hielo',
    'horario/luz',
    'logística/autonomía',
    'maniobras de cuerda',
    'meteorología',
    'navegación/extravío',
    'nevero',
    'nieve inestable',
    'sendero/huella',
    'terreno técnico',
    'viento',
  ],

  // Mountains and sectors relevant to CAU expeditions
  cerroSector: [
    'Cerro El Plomo',
    'Cerro Provincia',
    'Cerro San Ramón',
    'Cerro Manquehue',
    'Cerro La Parva',
    'Cerro El Colorado',
    'Cerro San Cristóbal',
    'Cerro Pintor',
    'Cerro Leonera',
    'Cerro Altar',
    'Cerro Castillo',
    'Volcán Villarrica',
    'Volcán Osorno',
    'La Parva',
    'El Colorado',
    'Valle Nevado',
    'Embalse El Yeso',
    'Cajón del Maipo',
    'Cajón del Colorado',
    'Cajón del Yeso',
    'Sector Farellones',
    'Sector Lagunillas',
    'Sector Portillo',
    'Portillo',
    'Aconcagua',
    'Torres del Paine',
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
