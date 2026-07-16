import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).nullable().optional(),
  rut: z.string().max(12).nullable().optional(),
  blood_type: z.string().max(10).nullable().optional(),
  allergies: z.string().max(1000).nullable().optional(),
  medications: z.string().max(1000).nullable().optional(),
  medical_conditions: z.string().max(1000).nullable().optional(),
  has_first_aid: z.boolean().optional(),
  emergency_contact: z.string().max(100).nullable().optional(),
  emergency_phone: z.string().max(20).nullable().optional(),
});

// GET /api/perfil — current user's full profile, inscripciones history, points
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const userId = user.id;

  try {
    const [profile, inscripciones, pointsHistory] = await Promise.all([
      prisma.profile.findUnique({ where: { id: userId } }),
      prisma.inscripcion.findMany({
        where: { user_id: userId },
        include: {
          edicion: {
            include: { taller: { select: { id: true, name: true, branch: true } } },
          },
        },
        orderBy: { inscrito_at: 'desc' },
      }),
      prisma.coursePoints.findMany({
        where: { user_id: userId },
        include: {
          edicion: { include: { taller: { select: { name: true } } } },
        },
        orderBy: { earned_at: 'desc' },
      }),
    ]);

    return NextResponse.json({ profile, inscripciones, pointsHistory });
  } catch (error) {
    console.error('[perfil GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH /api/perfil — update current user's editable fields
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const profile = await prisma.profile.update({
      where: { id: user.id },
      data: parsed.data,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('[perfil PATCH]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
