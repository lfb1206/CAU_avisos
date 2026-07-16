import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/equipment — any authenticated user: returns active equipment items for autocomplete
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const equipment = await prisma.equipmentItem.findMany({
      where: { active: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      select: { id: true, category: true, name: true, active: true },
    });
    return NextResponse.json({ equipment });
  } catch (error) {
    console.error('[equipment GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
