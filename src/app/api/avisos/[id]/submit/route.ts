import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

function extractSearchFields(tipo: string, formData: Record<string, unknown>) {
  if (tipo === 'rapido') {
    const d = formData as {
      categoria?: string;
      cerro?: string;
      fechaInicio?: string;
      participantes?: { nombre?: string }[];
    };
    return {
      location:              d.cerro ?? null,
      activity_type:         d.categoria ?? null,
      activity_date:         d.fechaInicio ? new Date(d.fechaInicio) : null,
      participant_names_text: (d.participantes ?? []).map((p) => p.nombre ?? '').join(' '),
    };
  }
  // largo
  const d = formData as {
    basicInfo?: {
      cerroOSector?: string;
      actividad?: string;
      fechaHoraReporteRegreso?: string;
    };
    participantes?: { nombre?: string }[];
  };
  return {
    location:              d.basicInfo?.cerroOSector ?? null,
    activity_type:         d.basicInfo?.actividad ?? null,
    activity_date:         d.basicInfo?.fechaHoraReporteRegreso
      ? new Date(d.basicInfo.fechaHoraReporteRegreso)
      : null,
    participant_names_text: (d.participantes ?? []).map((p) => p.nombre ?? '').join(' '),
  };
}

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const aviso = await prisma.aviso.findFirst({ where: { id: Number(id), created_by: user.id } });
  if (!aviso) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  if (aviso.status === 'submitted') return NextResponse.json({ error: 'Ya enviado' }, { status: 409 });

  const searchFields = extractSearchFields(aviso.tipo, aviso.form_data as Record<string, unknown>);

  const updated = await prisma.aviso.update({
    where: { id: Number(id) },
    data: {
      status: 'submitted',
      submitted_at: new Date(),
      ...searchFields,
    },
  });

  sendAvisoEmail(aviso.id, aviso.tipo, aviso.form_data as Record<string, unknown>).catch(console.error);

  return NextResponse.json(updated);
}

async function sendAvisoEmail(avisoId: number, tipo: string, formData: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  let emailTo: string | undefined;
  let cerro: string | undefined;
  let contacto: string | undefined;
  let fechaRegreso: string | undefined;
  let actividad: string | undefined;

  if (tipo === 'rapido') {
    const d = formData as { cerro?: string; contactoCau?: string; fechaMaxRegreso?: string; categoria?: string };
    cerro = d.cerro;
    contacto = d.contactoCau;
    fechaRegreso = d.fechaMaxRegreso;
    actividad = d.categoria;
  } else {
    const d = formData as {
      basicInfo?: {
        emailContacto?: string;
        contactoCAU?: string;
        cerroOSector?: string;
        fechaHoraReporteRegreso?: string;
        actividad?: string;
      };
    };
    emailTo = d.basicInfo?.emailContacto;
    contacto = d.basicInfo?.contactoCAU;
    cerro = d.basicInfo?.cerroOSector;
    fechaRegreso = d.basicInfo?.fechaHoraReporteRegreso;
    actividad = d.basicInfo?.actividad;
  }

  if (!emailTo) return;

  await resend.emails.send({
    from: 'CAU Avisos <avisos@cau.cl>',
    to: [emailTo],
    subject: `Aviso de Salida CAU #${avisoId} — ${cerro ?? 'Sin sector'}`,
    html: `
      <h2>Aviso de Salida CAU #${avisoId}</h2>
      <p>Tu aviso de salida ha sido registrado correctamente.</p>
      <ul>
        <li><strong>Tipo:</strong> ${tipo === 'rapido' ? 'Aviso Rápido' : 'Aviso Largo'}</li>
        <li><strong>Contacto CAU:</strong> ${contacto ?? '—'}</li>
        <li><strong>Actividad:</strong> ${actividad ?? '—'}</li>
        <li><strong>Sector:</strong> ${cerro ?? '—'}</li>
        <li><strong>Fecha de regreso:</strong> ${fechaRegreso ?? '—'}</li>
      </ul>
      <p>Si no regresas antes de la fecha indicada, el CAU iniciará el protocolo de emergencia.</p>
      <p>— Club Andino Universitario</p>
    `,
  });
}
