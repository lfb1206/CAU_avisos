import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const addEmailSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }).toLowerCase(),
});

// GET /api/admin/people — list all profiles (pre-registered + registered)
export async function GET(request: NextRequest) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
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
  } catch (error) {
    console.error('[admin people GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST /api/admin/people — add an email to the whitelist (pre-registration)
export async function POST(request: NextRequest) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const parsed = addEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors.email?.[0] ?? 'Correo inválido' },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  try {
    const existing = await prisma.profile.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Este correo ya está en el sistema.' }, { status: 409 });
    }

    const profile = await prisma.profile.create({
      data: { email, name: '', is_registered: false },
      select: { id: true, email: true, name: true, role: true, is_registered: true, created_at: true },
    });
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('[admin people POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
