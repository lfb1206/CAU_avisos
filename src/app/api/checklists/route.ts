import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/checklists — authenticated: returns all wikiexplora checklists
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const checklists = await prisma.checklist.findMany({
      orderBy: { key: 'asc' },
    });

    return NextResponse.json({ checklists });
  } catch (error) {
    console.error('[checklists GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
