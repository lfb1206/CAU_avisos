import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

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

// DELETE /api/admin/people/[id] — remove a whitelist entry (only pre-registered)
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const profile = await prisma.profile.findUnique({ where: { id }, select: { id: true, is_registered: true } });
  if (!profile) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  if (profile.is_registered) {
    return NextResponse.json(
      { error: 'No se puede eliminar un socio que ya se ha registrado.' },
      { status: 409 }
    );
  }

  await prisma.profile.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
