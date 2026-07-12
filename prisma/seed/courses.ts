import { PrismaClient } from '@prisma/client';

// Course structure based on CAU progression path
// IDs are assigned sequentially: M1=1, then Nieve/Hielo 2-6, Roca 7-11
const courses = [
  // ── Base ──────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Montañismo Básico M1',
    description: 'Curso base de montañismo. Fundamentos de progresión en montaña, uso de equipamiento básico, orientación y seguridad. Prerequisito para todas las ramas del club.',
    branch: 'base' as const,
    level: 'introductorio' as const,
    order_index: 1,
    prerequisite_course_ids: [],
    capacity: 20,
    status: 'upcoming' as const,
  },

  // ── Nieve / Hielo ─────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Introducción a la Alta Montaña',
    description: 'Primeros pasos en alta montaña. Técnicas de progresión en nieve, uso de piolet y crampones básicos.',
    branch: 'nieve_hielo' as const,
    level: 'introductorio' as const,
    order_index: 1,
    prerequisite_course_ids: [1],
    capacity: 16,
    status: 'upcoming' as const,
  },
  {
    id: 3,
    name: 'Progresión Nieve y Hielo',
    description: 'Técnicas de progresión en terreno nevado e icefields. Auto-detención, rampas y pendientes.',
    branch: 'nieve_hielo' as const,
    level: 'intermedio' as const,
    order_index: 2,
    prerequisite_course_ids: [2],
    capacity: 14,
    status: 'upcoming' as const,
  },
  {
    id: 4,
    name: 'Escalada en Hielo',
    description: 'Técnicas de escalada en cascadas de hielo y paredes verticales. Requiere experiencia en nieve/hielo y multilargos en roca.',
    branch: 'nieve_hielo' as const,
    level: 'intermedio_avanzado' as const,
    order_index: 3,
    // Cross-branch: requires Progresión Nieve (3) + Escalada en Multilargos (10)
    prerequisite_course_ids: [3, 10],
    capacity: 10,
    status: 'upcoming' as const,
  },
  {
    id: 5,
    name: 'Travesía y Autorrescate',
    description: 'Técnicas de travesía de alta montaña y procedimientos de autorrescate en terreno nevado.',
    branch: 'nieve_hielo' as const,
    level: 'avanzado' as const,
    order_index: 4,
    prerequisite_course_ids: [3],
    capacity: 12,
    status: 'upcoming' as const,
  },
  {
    id: 6,
    name: 'Técnicas Invernales Avanzadas',
    description: 'Curso de alto nivel: rescate en avalanchas, construcción de vivacs en nieve y progresión en condiciones extremas.',
    branch: 'nieve_hielo' as const,
    level: 'avanzado' as const,
    order_index: 5,
    prerequisite_course_ids: [4, 5],
    capacity: 10,
    status: 'upcoming' as const,
  },

  // ── Roca ─────────────────────────────────────────────────────────────────
  {
    id: 7,
    name: 'Introducción a la Escalada Deportiva',
    description: 'Fundamentos de escalada en roca. Técnica de pies, manos, movimiento en pared y cultura del escalador.',
    branch: 'roca' as const,
    level: 'introductorio' as const,
    order_index: 1,
    prerequisite_course_ids: [1],
    capacity: 16,
    status: 'upcoming' as const,
  },
  {
    id: 8,
    name: 'Manejo de Cuerdas',
    description: 'Nudos fundamentales, manejo de cuerda, comunicación entre escaladores y sistemas de seguridad.',
    branch: 'roca' as const,
    level: 'intermedio' as const,
    order_index: 2,
    prerequisite_course_ids: [7],
    capacity: 14,
    status: 'upcoming' as const,
  },
  {
    id: 9,
    name: 'Aseguramiento y Polipastos',
    description: 'Sistemas de aseguramiento avanzados, montaje de reuniones y polipastos para rescate.',
    branch: 'roca' as const,
    level: 'intermedio' as const,
    order_index: 3,
    prerequisite_course_ids: [8],
    capacity: 14,
    status: 'upcoming' as const,
  },
  {
    id: 10,
    name: 'Escalada en Multilargos',
    description: 'Técnicas de escalada en vías de varios largos, gestión de la cuerda y paradas intermedias.',
    branch: 'roca' as const,
    level: 'intermedio_avanzado' as const,
    order_index: 4,
    prerequisite_course_ids: [9],
    capacity: 12,
    status: 'upcoming' as const,
  },
  {
    id: 11,
    name: 'Escalada Tradicional',
    description: 'Colocación de protecciones naturales, trad climbing y evaluación de calidad de roca.',
    branch: 'roca' as const,
    level: 'avanzado' as const,
    order_index: 5,
    prerequisite_course_ids: [10],
    capacity: 10,
    status: 'upcoming' as const,
  },
];

export async function seedCourses(prisma: PrismaClient) {
  console.log('Seeding courses...');

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: course,
      create: course,
    });
  }

  console.log(`  Seeded ${courses.length} courses`);
}
