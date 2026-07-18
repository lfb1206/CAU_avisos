import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const updateAvisoSchema = z.object({
  title: z.string().optional(),
  form_data: z.record(z.unknown()).optional(),
  status: z.enum(['draft', 'archived']).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

async function getAvisoForUser(id: number, userId: string) {
  return prisma.aviso.findFirst({ where: { id, created_by: userId } });
}

// GET /api/avisos/[id]
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const aviso = await getAvisoForUser(Number(id), user.id);
    if (!aviso) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(aviso);
  } catch (error) {
    console.error('[avisos GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH /api/avisos/[id] — auto-save / manual save
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const existing = await getAvisoForUser(Number(id), user.id);
    if (!existing) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const parsed = updateAvisoSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    if (existing.status === 'submitted') {
      // Allow status-only transition from submitted → archived (notificar regreso)
      const isArchiveTransition =
        parsed.data.status === 'archived' &&
        !parsed.data.form_data &&
        !parsed.data.title;
      if (!isArchiveTransition) {
        return NextResponse.json({ error: 'El aviso ya fue enviado' }, { status: 409 });
      }
    }

    // Build title from form_data if not supplied
    const formData = parsed.data.form_data ?? existing.form_data as Record<string, unknown>;
    const basicInfo = (formData as { basicInfo?: { cerroOSector?: string; actividad?: string } }).basicInfo;
    const autoTitle = basicInfo?.actividad && basicInfo?.cerroOSector
      ? `${basicInfo.actividad} — ${basicInfo.cerroOSector}`
      : basicInfo?.actividad || basicInfo?.cerroOSector || existing.title;

    const updated = await prisma.aviso.update({
      where: { id: Number(id) },
      data: {
        title: parsed.data.title ?? autoTitle,
        ...(parsed.data.form_data && { form_data: parsed.data.form_data as Prisma.InputJsonValue }),
        ...(parsed.data.status && { status: parsed.data.status }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[avisos PATCH]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE /api/avisos/[id]
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const existing = await getAvisoForUser(Number(id), user.id);
    if (!existing) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    await prisma.aviso.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[avisos DELETE]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
