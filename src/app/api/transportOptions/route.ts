import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/transportOptions — authenticated: returns transport autocomplete option lists
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const records = await prisma.basicFormOption.findMany({
      where: { type: { startsWith: 'transport_' } },
      orderBy: [{ type: 'asc' }, { value: 'asc' }],
      select: { type: true, value: true },
    });

    const transportTypes: string[] = [];
    const vehicleBrands: string[] = [];

    for (const r of records) {
      switch (r.type) {
        case 'transport_type':
          transportTypes.push(r.value);
          break;
        case 'transport_vehicle_brand':
          vehicleBrands.push(r.value);
          break;
      }
    }

    return NextResponse.json({ transportTypes, vehicleBrands });
  } catch (error) {
    console.error('[transportOptions GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
