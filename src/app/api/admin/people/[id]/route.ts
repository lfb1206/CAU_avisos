import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const updateProfileSchema = z.object({
  role: z.enum(['admin', 'coordinador', 'custodio', 'member']).optional(),
  // ISO date string, or null to clear (not an active member)
  membership_expires_at: z.string().nullable().optional(),
});

// PATCH /api/admin/people/[id] — grant a role (e.g. custodio) and/or set membership expiry
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { role, membership_expires_at } = parsed.data;

  try {
    const profile = await prisma.profile.update({
      where: { id },
      data: {
        ...(role !== undefined ? { role } : {}),
        ...(membership_expires_at !== undefined
          ? { membership_expires_at: membership_expires_at ? new Date(membership_expires_at) : null }
          : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_registered: true,
        created_at: true,
        membership_expires_at: true,
      },
    });
    return NextResponse.json(profile);
  } catch (error) {
    console.error('[admin people PATCH]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE /api/admin/people/[id] — remove a whitelist entry (only pre-registered)
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id },
      select: { id: true, is_registered: true },
    });
    if (!profile) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    if (profile.is_registered) {
      return NextResponse.json(
        { error: 'No se puede eliminar un socio que ya se ha registrado.' },
        { status: 409 }
      );
    }

    await prisma.profile.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[admin people DELETE]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
