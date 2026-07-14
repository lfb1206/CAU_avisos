import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const addEmailSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }).toLowerCase(),
});

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  return profile?.role === 'admin' ? user : null;
}

// GET /api/admin/people — list all profiles (pre-registered + registered)
export async function GET() {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const profiles = await prisma.profile.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      is_registered: true,
      created_at: true,
    },
    orderBy: [{ is_registered: 'asc' }, { email: 'asc' }],
  });

  return NextResponse.json(profiles);
}

// POST /api/admin/people — add an email to the whitelist (pre-registration)
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const parsed = addEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors.email?.[0] ?? 'Correo inválido' }, { status: 400 });
  }

  const { email } = parsed.data;
  const existing = await prisma.profile.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Este correo ya está en el sistema.' }, { status: 409 });
  }

  const profile = await prisma.profile.create({
    data: { email, name: '', is_registered: false },
    select: { id: true, email: true, name: true, role: true, is_registered: true, created_at: true },
  });

  return NextResponse.json(profile, { status: 201 });
}
