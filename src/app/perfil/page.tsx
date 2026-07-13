import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const now = new Date();

  const [profile, pointsHistory] = await Promise.all([
    prisma.profile.findUnique({
      where: { id: user.id },
      include: {
        course_enrollments: {
          include: { course: { select: { id: true, name: true, branch: true } } },
          orderBy: { enrolled_at: 'desc' },
        },
      },
    }),
    prisma.coursePoints.findMany({
      where: { user_id: user.id },
      include: { course: { select: { name: true } } },
      orderBy: { earned_at: 'desc' },
    }),
  ]);

  if (!profile) redirect('/auth/login');

  const activePoints = pointsHistory
    .filter((p) => new Date(p.expires_at) > now)
    .reduce((sum, p) => sum + p.points, 0);

  const statusLabel: Record<string, string> = {
    enrolled:   'Inscrito',
    waitlisted: 'Lista de espera',
    ayudante:   'Ayudante',
    completed:  'Completado',
    cancelled:  'Cancelado',
  };
  const statusColor: Record<string, string> = {
    enrolled:   'bg-blue-100 text-blue-700',
    waitlisted: 'bg-yellow-100 text-yellow-700',
    ayudante:   'bg-purple-100 text-purple-700',
    completed:  'bg-green-100 text-green-700',
    cancelled:  'bg-gray-100 text-gray-500',
  };

  const roleLabel: Record<string, string> = {
    admin:       'Administrador',
    coordinador: 'Coordinador',
    member:      'Socio',
  };

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
        <p className="text-xs text-purple-600 mb-4">Los puntos se obtienen siendo Ayudante en cursos y vencen al año de ser otorgados.</p>

        {pointsHistory.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no tienes puntos registrados.</p>
        ) : (
          <div className="space-y-2">
            {pointsHistory.map((entry) => {
              const expired = new Date(entry.expires_at) <= now;
              return (
                <div key={entry.id} className={`flex items-center justify-between text-sm rounded-lg px-3 py-2 ${expired ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700'}`}>
                  <div>
                    <span className="font-medium">{entry.course?.name ?? 'Puntos manuales'}</span>
                    {entry.description && <span className="text-xs ml-2 text-gray-400">— {entry.description}</span>}
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

      {/* Course enrollments */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Mis Cursos</h2>
        {profile.course_enrollments.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no estás inscrito en ningún curso.</p>
        ) : (
          <div className="space-y-2">
            {profile.course_enrollments.map((enroll) => (
              <div key={enroll.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-800">{enroll.course.name}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[enroll.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {statusLabel[enroll.status] ?? enroll.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
