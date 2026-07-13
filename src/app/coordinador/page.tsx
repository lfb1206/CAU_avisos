import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import CoordinadorClient from './CoordinadorClient';

export default async function CoordinadorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile || (profile.role !== 'coordinador' && profile.role !== 'admin')) {
    redirect('/');
  }

  const now = new Date();

  const [courses, members] = await Promise.all([
    prisma.course.findMany({
      orderBy: [{ branch: 'asc' }, { order_index: 'asc' }],
      include: {
        _count: { select: { enrollments: { where: { status: { in: ['enrolled', 'waitlisted', 'ayudante'] } } } } },
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

  return (
    <CoordinadorClient
      coordinadorId={user.id}
      courses={courses.map((c) => ({
        id: c.id,
        name: c.name,
        branch: c.branch,
        enrollment_open: c.enrollment_open,
        enrollment_opens_at: c.enrollment_opens_at?.toISOString() ?? null,
        enrollmentCount: c._count.enrollments,
      }))}
      members={membersWithPoints}
    />
  );
}
