import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const createAvisoSchema = z.object({
  title:     z.string().default('Aviso sin título'),
  tipo:      z.enum(['rapido', 'largo']).default('largo'),
  form_data: z.record(z.unknown()).default({}),
  source_id: z.number().optional(), // clone from existing aviso
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const avisos = await prisma.aviso.findMany({
    where: { created_by: user.id },
    orderBy: { updated_at: 'desc' },
    select: { id: true, title: true, status: true, tipo: true, created_at: true, updated_at: true, submitted_at: true },
  });

  return NextResponse.json(avisos);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const parsed = createAvisoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  let formData = parsed.data.form_data;
  let title = parsed.data.title;
  let tipo = parsed.data.tipo;

  // Clone from existing aviso if source_id provided
  if (parsed.data.source_id) {
    const source = await prisma.aviso.findUnique({
      where: { id: parsed.data.source_id, status: 'submitted' },
      select: { form_data: true, title: true, tipo: true },
    });
    if (source) {
      formData = source.form_data as Record<string, unknown>;
      title = `Borrador: ${source.title}`;
      tipo = source.tipo as 'rapido' | 'largo';
    }
  }

  const aviso = await prisma.aviso.create({
    data: {
      created_by: user.id,
      title,
      tipo,
      form_data: formData as Prisma.InputJsonValue,
      status: 'draft',
    },
  });

  return NextResponse.json(aviso, { status: 201 });
}
