import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

const inscripcionStatusLabel: Record<string, string> = {
  postulando: 'Postulando',
  aceptado: 'Aceptado',
  en_lista: 'En lista',
  rechazado: 'Rechazado',
  no_asiste: 'No asiste',
  completado: 'Completado',
  reprobado: 'Reprobado',
  retirado: 'Retirado',
  rezagado: 'Rezagado',
};

const inscripcionStatusColor: Record<string, string> = {
  postulando: 'bg-yellow-100 text-yellow-700',
  aceptado: 'bg-blue-100 text-blue-700',
  en_lista: 'bg-orange-100 text-orange-700',
  rechazado: 'bg-red-100 text-red-700',
  no_asiste: 'bg-gray-100 text-gray-500',
  completado: 'bg-green-100 text-green-700',
  reprobado: 'bg-red-100 text-red-700',
  retirado: 'bg-gray-100 text-gray-500',
  rezagado: 'bg-purple-100 text-purple-700',
};

const roleLabel: Record<string, string> = {
  admin: 'Administrador',
  coordinador: 'Coordinador',
  member: 'Socio',
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const now = new Date();

  const [profile, inscripciones, pointsHistory] = await Promise.all([
    prisma.profile.findUnique({
      where: { id: user.id },
    }),
    prisma.inscripcion.findMany({
      where: { user_id: user.id },
      include: {
        edicion: {
          include: { taller: { select: { id: true, name: true, branch: true } } },
        },
      },
      orderBy: { inscrito_at: 'desc' },
    }),
    prisma.coursePoints.findMany({
      where: { user_id: user.id },
      include: {
        edicion: {
          include: { taller: { select: { name: true } } },
        },
      },
      orderBy: { earned_at: 'desc' },
    }),
  ]);

  if (!profile) redirect('/auth/login');

  const activePoints = pointsHistory
    .filter((p) => new Date(p.expires_at) > now)
    .reduce((sum, p) => sum + p.points, 0);

  // Group inscripciones by taller for the bulletin
  const tallerMap = new Map<number, { name: string; branch: string; status: string }>();
  for (const insc of inscripciones) {
    const t = insc.edicion.taller;
    const existing = tallerMap.get(t.id);
    // Prefer "completado" status if any edicion was completed
    if (!existing || insc.status === 'completado') {
      tallerMap.set(t.id, { name: t.name, branch: t.branch, status: insc.status });
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {roleLabel[profile.role] ?? profile.role}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {profile.rut && (
            <div>
              <span className="text-gray-500">RUT</span>
              <p className="font-medium text-gray-900">{profile.rut}</p>
            </div>
          )}
          {profile.phone && (
            <div>
              <span className="text-gray-500">Teléfono</span>
              <p className="font-medium text-gray-900">{profile.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Points summary */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-purple-900">Puntos de Formación</h2>
          <span className="text-3xl font-bold text-purple-700">{activePoints}</span>
        </div>
        <p className="text-xs text-purple-600 mb-4">
          Los puntos se obtienen siendo Ayudante en talleres y vencen al año de ser otorgados.
        </p>

        {pointsHistory.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no tienes puntos registrados.</p>
        ) : (
          <div className="space-y-2">
            {pointsHistory.map((entry) => {
              const expired = new Date(entry.expires_at) <= now;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between text-sm rounded-lg px-3 py-2 ${expired ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700'}`}
                >
                  <div>
                    <span className="font-medium">
                      {entry.edicion?.taller?.name ?? 'Puntos manuales'}
                    </span>
                    {entry.description && (
                      <span className="text-xs ml-2 text-gray-400">— {entry.description}</span>
                    )}
                    <div className="text-xs text-gray-400">
                      Vence: {new Date(entry.expires_at).toLocaleDateString('es-CL')}
                      {expired && ' (vencido)'}
                    </div>
                  </div>
                  <span className={`font-bold ${expired ? 'text-gray-400' : 'text-purple-700'}`}>
                    +{entry.points}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Boletín de talleres */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Boletín de Talleres</h2>
        {tallerMap.size === 0 ? (
          <p className="text-sm text-gray-500">Aún no te has postulado a ningún taller.</p>
        ) : (
          <div className="space-y-2">
            {Array.from(tallerMap.entries()).map(([tallerId, info]) => (
              <div key={tallerId} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-800 font-medium">{info.name}</span>
                  <span className="ml-2 text-xs text-gray-400 capitalize">
                    {info.branch.replace('_', '/')}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${inscripcionStatusColor[info.status] ?? 'bg-gray-100 text-gray-500'}`}
                >
                  {inscripcionStatusLabel[info.status] ?? info.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All inscripciones */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Historial de postulaciones</h2>
        {inscripciones.length === 0 ? (
          <p className="text-sm text-gray-500">Sin postulaciones registradas.</p>
        ) : (
          <div className="space-y-2">
            {inscripciones.map((insc) => (
              <div key={insc.id} className="flex items-center justify-between text-sm py-1">
                <div>
                  <span className="text-gray-800">{insc.edicion.taller.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{insc.edicion.name}</span>
                  <div className="text-xs text-gray-400">
                    {new Date(insc.inscrito_at).toLocaleDateString('es-CL')}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${inscripcionStatusColor[insc.status] ?? 'bg-gray-100 text-gray-500'}`}
                >
                  {inscripcionStatusLabel[insc.status] ?? insc.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
