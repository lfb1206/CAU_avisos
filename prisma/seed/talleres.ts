import { PrismaClient } from '@prisma/client';

export async function seedTalleres(prisma: PrismaClient) {
  console.log('Seeding talleres...');

  const tallerData = [
    // Base
    {
      name: 'Montañismo Básico M1',
      description:
        'Curso introductorio al montañismo. Requisito para todas las líneas avanzadas. Incluye técnicas de marcha, campamento, orientación, primeros auxilios y nieve básica.',
      branch: 'base' as const,
      level: 'introductorio' as const,
      order_index: 1,
    },
    // Roca
    {
      name: 'Introducción a la Escalada Deportiva',
      description:
        'Primeros pasos en la escalada en roca. Técnica de movimiento, equipamiento básico y seguridad en la vía.',
      branch: 'roca' as const,
      level: 'introductorio' as const,
      order_index: 1,
    },
    {
      name: 'Manejo de Cuerdas',
      description:
        'Rappel, ascenso por cuerda, anclajes naturales y resolución de problemas con cuerda en distintos terrenos.',
      branch: 'roca' as const,
      level: 'intermedio' as const,
      order_index: 2,
    },
    {
      name: 'Aseguramiento y Polipastos',
      description:
        'Aseguramiento alpino, sistemas de polipastos para rescate e izado de cargas.',
      branch: 'roca' as const,
      level: 'intermedio' as const,
      order_index: 3,
    },
    {
      name: 'Evaluación Básica Cuerdas',
      description:
        'Hito evaluativo que valida las competencias adquiridas en los tres talleres iniciales de la línea de roca: ascenso/descenso por cuerda, anclajes naturales, polipastos y aseguramientos alpinos.',
      branch: 'roca' as const,
      level: 'intermedio' as const,
      order_index: 4,
    },
    {
      name: 'Escalada en Multilargos',
      description:
        'Gestión de reuniones, comunicación en ruta y técnicas para rutas de varios largos.',
      branch: 'roca' as const,
      level: 'intermedio_avanzado' as const,
      order_index: 5,
    },
    {
      name: 'Escalada Tradicional',
      description:
        'Colocación de protecciones en fisuras, evaluación de roca y construcción de reuniones tradicionales.',
      branch: 'roca' as const,
      level: 'avanzado' as const,
      order_index: 6,
    },
    // Nieve y Hielo
    {
      name: 'Iniciación a la Alta Montaña',
      description:
        'Introducción a la alta montaña: aclimatación, equipamiento, fisiología y planificación de expediciones.',
      branch: 'nieve_hielo' as const,
      level: 'introductorio' as const,
      order_index: 1,
    },
    {
      name: 'Avalanchas',
      description:
        'Evaluación del terreno nevado, factores de riesgo, uso de transceptores y búsqueda y rescate de víctimas.',
      branch: 'nieve_hielo' as const,
      level: 'intermedio' as const,
      order_index: 2,
    },
    {
      name: 'Progresión en Nieve y Hielo',
      description:
        'Técnicas de progresión en glaciares y pendientes de nieve/hielo. Uso de piolet, crampones y construcción de seguros.',
      branch: 'nieve_hielo' as const,
      level: 'intermedio' as const,
      order_index: 3,
    },
    {
      name: 'Escalada en Hielo',
      description:
        'Técnicas de escalada en cascadas y paredes de hielo. Equipamiento específico, colocación de tornillos y gestión de la cuerda.',
      branch: 'nieve_hielo' as const,
      level: 'intermedio_avanzado' as const,
      order_index: 4,
    },
    {
      name: 'Travesía y Autorescate en Glaciar',
      description:
        'Técnicas de travesía glaciar, autorescate de grietas, orientación en zona blanca y gestión de riesgos glaciares.',
      branch: 'nieve_hielo' as const,
      level: 'avanzado' as const,
      order_index: 5,
    },
    {
      name: 'Técnicas Invernales Avanzadas',
      description:
        'Campamentos de nieve, construcción de refugios de nieve y supervivencia en condiciones invernales extremas.',
      branch: 'nieve_hielo' as const,
      level: 'avanzado' as const,
      order_index: 6,
    },
  ];

  const created: { id: number; name: string }[] = [];
  for (const t of tallerData) {
    const taller = await prisma.taller.upsert({
      where: { name_branch: { name: t.name, branch: t.branch } },
      update: { description: t.description, level: t.level, order_index: t.order_index },
      create: { ...t, prerequisite_taller_ids: [] },
      select: { id: true, name: true },
    });
    created.push(taller);
  }

  const byName = Object.fromEntries(created.map((t) => [t.name, t.id]));
  const id = (name: string) => byName[name]!;

  const prereqs: Record<string, string[]> = {
    // Roca
    'Introducción a la Escalada Deportiva': ['Montañismo Básico M1'],
    'Manejo de Cuerdas': ['Introducción a la Escalada Deportiva'],
    'Aseguramiento y Polipastos': ['Manejo de Cuerdas'],
    'Evaluación Básica Cuerdas': [
      'Introducción a la Escalada Deportiva',
      'Manejo de Cuerdas',
      'Aseguramiento y Polipastos',
    ],
    'Escalada en Multilargos': ['Evaluación Básica Cuerdas'],
    'Escalada Tradicional': ['Escalada en Multilargos'],
    // Nieve y Hielo
    'Iniciación a la Alta Montaña': ['Montañismo Básico M1'],
    Avalanchas: ['Iniciación a la Alta Montaña'],
    'Progresión en Nieve y Hielo': ['Iniciación a la Alta Montaña', 'Evaluación Básica Cuerdas'],
    'Escalada en Hielo': ['Progresión en Nieve y Hielo'],
    'Travesía y Autorescate en Glaciar': ['Progresión en Nieve y Hielo'],
    'Técnicas Invernales Avanzadas': ['Travesía y Autorescate en Glaciar'],
  };

  for (const [name, prereqNames] of Object.entries(prereqs)) {
    await prisma.taller.update({
      where: { id: id(name) },
      data: { prerequisite_taller_ids: prereqNames.map(id) },
    });
  }

  // Sample ediciones for 2026
  const edicionData = [
    {
      taller: 'Montañismo Básico M1',
      name: 'M1 2026-1',
      capacity: 25,
      price: 0,
      start_date: new Date('2026-03-14'),
      end_date: new Date('2026-04-30'),
      enrollment_open: false,
      required_points: 0,
    },
    {
      taller: 'Introducción a la Escalada Deportiva',
      name: 'Intro 1 2026',
      capacity: 12,
      price: 40000,
      start_date: new Date('2026-04-11'),
      end_date: new Date('2026-04-12'),
      enrollment_open: true,
      required_points: 0,
    },
    {
      taller: 'Introducción a la Escalada Deportiva',
      name: 'Intro 2 2026',
      capacity: 12,
      price: 40000,
      start_date: new Date('2026-05-09'),
      end_date: new Date('2026-05-10'),
      enrollment_open: false,
      required_points: 0,
    },
    {
      taller: 'Manejo de Cuerdas',
      name: 'Manejo 1 2026',
      capacity: 10,
      price: 40000,
      start_date: new Date('2026-05-30'),
      end_date: new Date('2026-05-31'),
      enrollment_open: false,
      required_points: 0,
    },
    {
      taller: 'Aseguramiento y Polipastos',
      name: 'Poli 1 2026',
      capacity: 10,
      price: 40000,
      start_date: new Date('2026-06-27'),
      end_date: new Date('2026-06-28'),
      enrollment_open: false,
      required_points: 0,
    },
    {
      taller: 'Escalada en Multilargos',
      name: 'Multi 1 2026',
      capacity: 8,
      price: 55000,
      start_date: new Date('2026-04-04'),
      end_date: new Date('2026-04-05'),
      enrollment_open: false,
      required_points: 0,
    },
    {
      taller: 'Iniciación a la Alta Montaña',
      name: 'IAM 1 2026',
      capacity: 15,
      price: 40000,
      start_date: new Date('2026-05-03'),
      end_date: new Date('2026-05-04'),
      enrollment_open: true,
      required_points: 0,
    },
    {
      taller: 'Progresión en Nieve y Hielo',
      name: 'PNH 1 2026',
      capacity: 10,
      price: 55000,
      start_date: new Date('2026-08-01'),
      end_date: new Date('2026-08-02'),
      enrollment_open: false,
      required_points: 0,
    },
    {
      taller: 'Escalada en Hielo',
      name: 'Hielo 1 2026',
      capacity: 8,
      price: 55000,
      start_date: new Date('2026-08-01'),
      end_date: new Date('2026-08-02'),
      enrollment_open: true,
      required_points: 2,
    },
  ];

  for (const e of edicionData) {
    const tallerId = id(e.taller);
    await prisma.edicionTaller.upsert({
      where: { taller_id_name: { taller_id: tallerId, name: e.name } },
      update: { capacity: e.capacity, enrollment_open: e.enrollment_open },
      create: {
        taller_id: tallerId,
        name: e.name,
        start_date: e.start_date,
        end_date: e.end_date,
        capacity: e.capacity,
        price: e.price,
        enrollment_open: e.enrollment_open,
        required_points: e.required_points,
        status: e.enrollment_open ? 'inscripciones_abiertas' : 'planificada',
      },
    });
  }

  console.log(`  Seeded ${created.length} talleres + ${edicionData.length} ediciones`);
}
