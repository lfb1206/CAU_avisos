import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

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
