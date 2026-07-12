import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/avisos/[id]/submit — mark aviso as submitted and send emails
export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const aviso = await prisma.aviso.findFirst({ where: { id: Number(id), created_by: user.id } });
  if (!aviso) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  if (aviso.status === 'submitted') return NextResponse.json({ error: 'Ya enviado' }, { status: 409 });

  const updated = await prisma.aviso.update({
    where: { id: Number(id) },
    data: { status: 'submitted', submitted_at: new Date() },
  });

  // Send confirmation email (fire-and-forget — don't fail the response if email fails)
  sendAvisoEmail(aviso.id, aviso.form_data as Record<string, unknown>).catch(console.error);

  return NextResponse.json(updated);
}

async function sendAvisoEmail(avisoId: number, formData: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 'YOUR_RESEND_API_KEY_HERE') return;

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  const basicInfo = formData.basicInfo as {
    contactoCAU?: string;
    emailContacto?: string;
    actividad?: string;
    cerroOSector?: string;
    fechaHoraReporteRegreso?: string;
  } | undefined;

  if (!basicInfo?.emailContacto) return;

  await resend.emails.send({
    from: 'CAU Avisos <avisos@cau.cl>',
    to: [basicInfo.emailContacto],
    subject: `Aviso de Salida CAU confirmado — ${basicInfo.cerroOSector ?? 'Sin sector'}`,
    html: `
      <h2>Aviso de Salida CAU #${avisoId}</h2>
      <p>Tu aviso de salida ha sido registrado correctamente.</p>
      <ul>
        <li><strong>Contacto CAU:</strong> ${basicInfo.contactoCAU ?? '—'}</li>
        <li><strong>Actividad:</strong> ${basicInfo.actividad ?? '—'}</li>
        <li><strong>Sector:</strong> ${basicInfo.cerroOSector ?? '—'}</li>
        <li><strong>Fecha de reporte de regreso:</strong> ${basicInfo.fechaHoraReporteRegreso ?? '—'}</li>
      </ul>
      <p>Si no regresas antes de la fecha indicada, el CAU iniciará el protocolo de emergencia.</p>
      <p>— Club Andino Universitario</p>
    `,
  });
}
