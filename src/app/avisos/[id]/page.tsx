import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import UseAsDraftButton from './UseAsDraftButton';

type RouteContext = { params: Promise<{ id: string }> };

export default async function AvisoDetailPage({ params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const aviso = await prisma.aviso.findFirst({
    where: { id: Number(id), status: 'submitted' },
    include: { profile: { select: { name: true } } },
  });

  if (!aviso) notFound();

  const fd = aviso.form_data as Record<string, unknown>;
  const isRapido = aviso.tipo === 'rapido';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/avisos" className="text-sm text-gray-500 hover:text-blue-600">← Biblioteca</Link>
            <span className="text-gray-300">/</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isRapido ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {isRapido ? 'Aviso Rápido' : 'Aviso Largo'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {aviso.location ? `${aviso.title || 'Aviso'} — ${aviso.location}` : (aviso.title || 'Aviso sin título')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Por {aviso.profile.name}
            {aviso.submitted_at && (
              <> · Enviado el {new Date(aviso.submitted_at).toLocaleDateString('es-CL')}</>
            )}
          </p>
        </div>
        <UseAsDraftButton avisoId={aviso.id} tipo={aviso.tipo} />
      </div>

      {/* Content */}
      {isRapido ? (
        <RapidoDetail fd={fd} />
      ) : (
        <LargoDetail fd={fd} />
      )}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">{title}</h2>
      {children}
    </div>
  );
}

function RapidoDetail({ fd }: { fd: Record<string, unknown> }) {
  const d = fd as {
    categoria?: string;
    cerro?: string;
    ruta?: string;
    fechaInicio?: string;
    fechaMaxRegreso?: string;
    contactoCau?: string;
    comentarios?: string;
    participantes?: { nombre?: string; rut?: string; telefono?: string }[];
    vehiculos?: { marca?: string; modelo?: string; patente?: string; color?: string }[];
    lugarEstacionamiento?: string;
    otroTransporte?: string;
  };

  return (
    <>
      <Section title="Actividad">
        <dl className="grid grid-cols-2 gap-4">
          <InfoBlock label="Categoría" value={d.categoria} />
          <InfoBlock label="Cerro / Sector" value={d.cerro} />
          <InfoBlock label="Ruta" value={d.ruta} />
          <InfoBlock label="Contacto CAU" value={d.contactoCau} />
          <InfoBlock
            label="Fecha de inicio"
            value={d.fechaInicio ? new Date(d.fechaInicio).toLocaleString('es-CL') : undefined}
          />
          <InfoBlock
            label="Plazo máximo de regreso"
            value={d.fechaMaxRegreso ? new Date(d.fechaMaxRegreso).toLocaleString('es-CL') : undefined}
          />
        </dl>
        {d.comentarios && (
          <div className="mt-4">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Comentarios</dt>
            <dd className="mt-0.5 text-sm text-gray-900 whitespace-pre-line">{d.comentarios}</dd>
          </div>
        )}
      </Section>

      {(d.participantes ?? []).length > 0 && (
        <Section title={`Participantes (${d.participantes!.length})`}>
          <div className="space-y-2">
            {d.participantes!.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="font-medium text-gray-900 flex-1">{p.nombre}</span>
                {p.rut && <span className="text-gray-400 text-xs">{p.rut}</span>}
                {p.telefono && <span className="text-gray-400 text-xs">{p.telefono}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {((d.vehiculos ?? []).length > 0 || d.lugarEstacionamiento || d.otroTransporte) && (
        <Section title="Transporte">
          {(d.vehiculos ?? []).length > 0 && (
            <div className="space-y-2 mb-3">
              {d.vehiculos!.map((v, i) => (
                <div key={i} className="text-sm text-gray-700">
                  {[v.marca, v.modelo, v.color, v.patente].filter(Boolean).join(' · ')}
                </div>
              ))}
            </div>
          )}
          <dl className="grid grid-cols-1 gap-2">
            <InfoBlock label="Lugar de estacionamiento" value={d.lugarEstacionamiento} />
            <InfoBlock label="Otro transporte" value={d.otroTransporte} />
          </dl>
        </Section>
      )}
    </>
  );
}

function LargoDetail({ fd }: { fd: Record<string, unknown> }) {
  const d = fd as {
    basicInfo?: {
      contactoCAU?: string;
      telefonoContacto?: string;
      emailContacto?: string;
      actividad?: string;
      cerroOSector?: string;
      ruta?: string;
      fechaHoraReporteRegreso?: string;
      linkPronostico?: string;
      linkRuta?: string;
    };
    participantes?: {
      nombre?: string;
      rut?: string;
      telefono?: string;
      grupoSanguineo?: string;
    }[];
    itinerario?: {
      fecha?: string;
      tramo?: string;
      actividades?: string[];
      horaInicio?: string;
      horaFin?: string;
    }[];
  };

  const bi = d.basicInfo ?? {};

  return (
    <>
      <Section title="Información básica">
        <dl className="grid grid-cols-2 gap-4">
          <InfoBlock label="Actividad" value={bi.actividad} />
          <InfoBlock label="Cerro / Sector" value={bi.cerroOSector} />
          <InfoBlock label="Ruta" value={bi.ruta} />
          <InfoBlock label="Contacto CAU" value={bi.contactoCAU} />
          <InfoBlock label="Teléfono contacto" value={bi.telefonoContacto} />
          <InfoBlock
            label="Fecha máx. de regreso"
            value={bi.fechaHoraReporteRegreso ? new Date(bi.fechaHoraReporteRegreso).toLocaleString('es-CL') : undefined}
          />
        </dl>
        {bi.linkPronostico && (
          <div className="mt-3">
            <a href={bi.linkPronostico} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
              Ver pronóstico meteorológico ↗
            </a>
          </div>
        )}
      </Section>

      {(d.participantes ?? []).length > 0 && (
        <Section title={`Participantes (${d.participantes!.length})`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-1 pr-4 font-medium text-gray-500">Nombre</th>
                  <th className="text-left py-1 pr-4 font-medium text-gray-500">RUT</th>
                  <th className="text-left py-1 pr-4 font-medium text-gray-500">Teléfono</th>
                  <th className="text-left py-1 font-medium text-gray-500">Grupo sanguíneo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {d.participantes!.map((p, i) => (
                  <tr key={i}>
                    <td className="py-1.5 pr-4 font-medium text-gray-900">{p.nombre}</td>
                    <td className="py-1.5 pr-4 text-gray-500">{p.rut ?? '—'}</td>
                    <td className="py-1.5 pr-4 text-gray-500">{p.telefono ?? '—'}</td>
                    <td className="py-1.5 text-gray-500">{p.grupoSanguineo ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {(d.itinerario ?? []).length > 0 && (
        <Section title="Itinerario">
          <div className="space-y-3">
            {d.itinerario!.map((day, i) => (
              <div key={i} className="border-l-2 border-blue-200 pl-3">
                <p className="text-xs font-bold text-gray-700">
                  {day.fecha ? new Date(day.fecha).toLocaleDateString('es-CL') : `Día ${i + 1}`}
                  {day.horaInicio && ` · ${day.horaInicio}–${day.horaFin ?? ''}`}
                </p>
                {day.tramo && <p className="text-xs text-gray-500 mt-0.5">Tramo: {day.tramo}</p>}
                {(day.actividades ?? []).length > 0 && (
                  <p className="text-xs text-gray-600 mt-0.5">{day.actividades!.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
