import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/basicOptions — authenticated: autocomplete option lists grouped by type
// Types in DB: actividades, actividadesEspecificas, cerrosSectores, tramos
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const records = await prisma.basicFormOption.findMany({
      orderBy: [{ type: 'asc' }, { value: 'asc' }],
      select: { type: true, value: true },
    });

    const options = records.reduce<Record<string, string[]>>((acc, r) => {
      (acc[r.type] ??= []).push(r.value);
      return acc;
    }, {});

    return NextResponse.json({ options });
  } catch (error) {
    console.error('[basicOptions GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
