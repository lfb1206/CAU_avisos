import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import CoordinadorClient from './CoordinadorClient';

export default async function CoordinadorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile || (profile.role !== 'coordinador' && profile.role !== 'admin')) {
    redirect('/');
  }

  const now = new Date();

  const [talleres, members] = await Promise.all([
    prisma.taller.findMany({
      orderBy: [{ branch: 'asc' }, { order_index: 'asc' }],
      include: {
        ediciones: {
          orderBy: [{ start_date: 'asc' }],
          include: {
            _count: {
              select: {
                inscripciones: true,
                ayudantias: true,
              },
            },
            inscripciones: {
              select: { status: true },
            },
          },
        },
      },
    }),
    prisma.profile.findMany({
      where: { role: 'member' },
      orderBy: { name: 'asc' },
      include: {
        received_points: {
          where: { expires_at: { gt: now } },
          select: { points: true },
        },
      },
    }),
  ]);

  const membersWithPoints = members.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    activePoints: m.received_points.reduce((sum, p) => sum + p.points, 0),
  }));

  // Flatten ediciones for easy access
  const ediciones = talleres.flatMap((t) =>
    t.ediciones.map((e) => ({
      id: e.id,
      taller_id: t.id,
      taller_name: t.name,
      branch: t.branch,
      name: e.name,
      max_ayudantes: e.max_ayudantes,
      status: e.status,
      enrollment_open: e.enrollment_open,
      enrollment_opens_at: (e as { enrollment_opens_at?: Date | null }).enrollment_opens_at?.toISOString() ?? null,
      capacity: e.capacity,
      totalInscripciones: e._count.inscripciones,
      postulaciones: e.inscripciones.filter((i) => i.status === 'postulando').length,
      aceptados: e.inscripciones.filter((i) => i.status === 'aceptado').length,
      ayudantes: e._count.ayudantias,
      start_date: (e as { start_date?: Date | null }).start_date?.toISOString() ?? null,
    }))
  );

  return (
    <CoordinadorClient
      coordinadorId={user.id}
      talleres={talleres.map((t) => ({
        id: t.id,
        name: t.name,
        branch: t.branch,
      }))}
      ediciones={ediciones}
      members={membersWithPoints}
    />
  );
}
