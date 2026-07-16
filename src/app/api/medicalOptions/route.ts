import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/medicalOptions — authenticated: returns medical autocomplete option lists
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const records = await prisma.basicFormOption.findMany({
      where: { type: { startsWith: 'medical_' } },
      orderBy: [{ type: 'asc' }, { value: 'asc' }],
      select: { type: true, value: true },
    });

    const bloodTypes: string[] = [];
    const allergies: string[] = [];
    const medicalConditions: string[] = [];
    const medications: string[] = [];

    for (const r of records) {
      switch (r.type) {
        case 'medical_blood_type':
          bloodTypes.push(r.value);
          break;
        case 'medical_allergy':
          allergies.push(r.value);
          break;
        case 'medical_condition':
          medicalConditions.push(r.value);
          break;
        case 'medical_medication':
          medications.push(r.value);
          break;
      }
    }

    return NextResponse.json({ bloodTypes, allergies, medicalConditions, medications });
  } catch (error) {
    console.error('[medicalOptions GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
