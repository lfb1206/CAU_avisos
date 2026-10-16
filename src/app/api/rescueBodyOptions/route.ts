import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/rescueBodyOptions — authenticated: default rescue-contact list for the aviso form
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const records = await prisma.rescueBody.findMany({
      orderBy: { order_index: 'asc' },
      select: { nombre: true, telefono: true, default_incluir: true },
    });

    return NextResponse.json(
      records.map((r) => ({ nombre: r.nombre, telefono: r.telefono, incluir: r.default_incluir }))
    );
  } catch (error) {
    console.error('[rescueBodyOptions GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
