import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RiskOptionItem = { key: string; label: string };

// GET /api/riskOptions — authenticated: risk management option lists grouped by type
// Types in DB: peligro, riesgo, dificultad, supuesto, tipoSupuesto, probabilidad, impacto
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const records = await prisma.riskOption.findMany({
      orderBy: [{ type: 'asc' }, { id: 'asc' }],
      select: { key: true, label: true, type: true },
    });

    const options = records.reduce<Record<string, RiskOptionItem[]>>((acc, r) => {
      (acc[r.type] ??= []).push({ key: r.key, label: r.label });
      return acc;
    }, {});

    return NextResponse.json({ options });
  } catch (error) {
    console.error('[riskOptions GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
