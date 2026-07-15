import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

async function guardCoordinador() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } });
  return profile && (profile.role === 'coordinador' || profile.role === 'admin') ? user : null;
}

// GET /api/coordinador/ediciones/[id]/ficha — full ficha data (taller template + edition specifics)
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const user = await guardCoordinador();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;

  const edicion = await prisma.edicionTaller.findUnique({
    where: { id: Number(id) },
    include: {
      taller: true,
      inscripciones: {
        where: { status: { in: ['aceptado', 'completado', 'en_lista'] } },
        select: { id: true, status: true, profile: { select: { name: true, email: true, phone: true } } },
      },
      ayudantias: {
        select: { id: true, profile: { select: { name: true, email: true } } },
      },
    },
  });

  if (!edicion) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  return NextResponse.json(edicion);
}
