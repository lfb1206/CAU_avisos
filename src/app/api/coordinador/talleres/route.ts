import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCoordinador } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/coordinador/talleres — lightweight taller catalog for selectors
// (e.g. the historical-completion backfill modal). Deliberately not /api/cursos,
// which returns the full nested taller→ediciones→inscripciones tree.
export async function GET(request: NextRequest) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const talleres = await prisma.taller.findMany({
      orderBy: [{ branch: 'asc' }, { order_index: 'asc' }],
      select: { id: true, name: true, branch: true },
    });
    return NextResponse.json(talleres);
  } catch (error) {
    console.error('[coordinador talleres GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
