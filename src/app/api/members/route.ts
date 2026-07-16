import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/members — authenticated: list of registered members for autocomplete
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const profiles = await prisma.profile.findMany({
      where: { is_registered: true },
      select: { name: true, email: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ members: profiles });
  } catch (error) {
    console.error('[members GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
