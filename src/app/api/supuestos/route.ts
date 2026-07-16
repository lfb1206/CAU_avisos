import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/supuestos — authenticated: full supuesto bank for suggestion engine
// Each record has a `dificultades` array; clients filter client-side by difficulty.
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const supuestos = await prisma.supuesto.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        supuesto: true,
        categoria: true,
        dificultades: true,
      },
    });

    return NextResponse.json({ supuestos });
  } catch (error) {
    console.error('[supuestos GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
