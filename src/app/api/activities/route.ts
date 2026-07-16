import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/activities — authenticated: returns all activities with equipment_recommendations
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const activities = await prisma.activity.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, equipment_recommendations: true },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('[activities GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
