import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createAvisoSchema = z.object({
  title: z.string().default('Aviso sin título'),
  form_data: z.record(z.unknown()).default({}),
});

// GET /api/avisos — list the current user's avisos
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const avisos = await prisma.aviso.findMany({
    where: { created_by: user.id },
    orderBy: { updated_at: 'desc' },
    select: { id: true, title: true, status: true, created_at: true, updated_at: true, submitted_at: true },
  });

  return NextResponse.json(avisos);
}

// POST /api/avisos — create a new draft aviso
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = createAvisoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const aviso = await prisma.aviso.create({
    data: {
      created_by: user.id,
      title: parsed.data.title,
      form_data: parsed.data.form_data,
      status: 'draft',
    },
  });

  return NextResponse.json(aviso, { status: 201 });
}
