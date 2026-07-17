import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCoordinador } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/coordinador/ediciones/[id]/ficha — full ficha data (taller template + edition specifics)
export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const edicion = await prisma.edicionTaller.findUnique({
      where: { id: Number(id) },
      include: {
        taller: true,
        inscripciones: {
          where: { status: { in: ['aceptado', 'completado', 'en_lista'] } },
          select: {
            id: true,
            status: true,
            grupo_sanguineo: true,
            alergias: true,
            medicamentos: true,
            condiciones_especiales: true,
            tiene_primeros_auxilios: true,
            profile: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                rut: true,
                blood_type: true,
                allergies: true,
                medications: true,
                medical_conditions: true,
                emergency_contact: true,
                emergency_phone: true,
              },
            },
          },
        },
        ayudantias: {
          select: {
            id: true,
            seleccionado: true,
            asistio: true,
            profile: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                rut: true,
                blood_type: true,
                allergies: true,
                medications: true,
                medical_conditions: true,
                emergency_contact: true,
                emergency_phone: true,
              },
            },
          },
        },
      },
    });

    if (!edicion) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    return NextResponse.json(edicion);
  } catch (error) {
    console.error('[coordinador ficha GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
