import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

// GET /api/dashboard — current user's profile, recent avisos, active inscripciones
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const userId = user.id;

  const [profile, avisos, inscripciones] = await Promise.all([
    prisma.profile.findUnique({
      where: { id: userId },
      select: { name: true, role: true },
    }),
    prisma.aviso.findMany({
      where: { created_by: userId },
      orderBy: { updated_at: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        status: true,
        tipo: true,
        location: true,
        updated_at: true,
      },
    }),
    prisma.inscripcion.findMany({
      where: {
        user_id: userId,
        status: { in: ['postulando', 'aceptado', 'en_lista', 'completado'] },
      },
      include: {
        edicion: {
          include: { taller: { select: { name: true, branch: true } } },
        },
      },
      orderBy: { inscrito_at: 'desc' },
      take: 5,
    }),
  ]);

  return NextResponse.json({ profile, avisos, inscripciones });
}
