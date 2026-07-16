'use client';
import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

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
  completado: 'bg-green-100 text-green-800',
  reprobado: 'bg-red-100 text-red-700',
  retirado: 'bg-gray-100 text-gray-500',
  rezagado: 'bg-purple-100 text-purple-700',
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-600',
  };
  const labels: Record<string, string> = {
    draft: 'Borrador',
    submitted: 'Enviado',
    archived: 'Archivado',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function DashboardPage() {
  const { data, isLoading } = useSWR('/api/dashboard', fetcher);

  const profile = data?.profile;
  const avisos = data?.avisos ?? [];
  const inscripciones = data?.inscripciones ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">
              Hola, {profile?.name ?? '—'}
            </h1>
            <p className="text-gray-500 mt-1">Panel de control</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Avisos */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Mis Avisos</h2>
            <Link href="/avisos" className="text-sm text-gray-500 hover:text-blue-600 font-medium">
              Biblioteca →
            </Link>
          </div>

          <div className="flex gap-2 mb-4">
            <Link
              href="/aviso/largo"
              className="flex-1 text-center text-xs font-semibold py-2 px-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              + Aviso Largo
            </Link>
            <Link
              href="/aviso/rapido"
              className="flex-1 text-center text-xs font-semibold py-2 px-3 text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors"
            >
              + Aviso Rápido
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : avisos.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-500">
              <p className="text-sm">No tienes avisos aún.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {avisos.map((aviso: { id: number; title: string; status: string; tipo: string; location: string | null; updated_at: string }) => {
                const href =
                  aviso.status === 'draft'
                    ? aviso.tipo === 'largo'
                      ? `/aviso/largo?id=${aviso.id}`
                      : '/aviso/rapido'
                    : aviso.status === 'submitted'
                    ? `/avisos/${aviso.id}`
                    : null;

                const cardClasses = 'flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors';
                const inner = (
                  <>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`text-xs font-medium px-1.5 py-px rounded ${
                            aviso.tipo === 'rapido'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {aviso.tipo === 'rapido' ? 'Rápido' : 'Largo'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {aviso.location
                          ? `${aviso.title || 'Aviso'} — ${aviso.location}`
                          : aviso.title || 'Sin título'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(aviso.updated_at).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <StatusBadge status={aviso.status} />
                  </>
                );

                if (href) {
                  return (
                    <Link key={aviso.id} href={href} className={cardClasses}>
                      {inner}
                    </Link>
                  );
                }
                return (
                  <div key={aviso.id} className={cardClasses}>
                    {inner}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Talleres */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mis Talleres</h2>
            <Link href="/cursos" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              Ver todos
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : inscripciones.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-500">
              <p className="text-sm">No tienes postulaciones activas.</p>
              <Link href="/cursos" className="text-blue-600 hover:text-blue-500 text-sm font-medium mt-2 block">
                Ver ruta de talleres
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {inscripciones.map((insc: {
                id: number;
                status: string;
                edicion: { name: string; taller: { name: string; branch: string } };
              }) => (
                <div
                  key={insc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{insc.edicion.taller.name}</p>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">
                      {insc.edicion.name} · {insc.edicion.taller.branch.replace('_', '/')}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${inscripcionStatusColor[insc.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {inscripcionStatusLabel[insc.status] ?? insc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {!isLoading && (profile?.role === 'admin' || profile?.role === 'coordinador') && (
        <section className="mt-10 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-sm font-semibold text-amber-900 mb-3">
            {profile.role === 'admin' ? 'Panel de administrador' : 'Panel del coordinador'}
          </h3>
          <div className="flex flex-wrap gap-3">
            {profile.role === 'coordinador' && (
              <Link href="/coordinador" className="text-xs px-3 py-1.5 bg-white border border-amber-200 rounded-md text-amber-800 hover:bg-amber-100 transition-colors font-medium">
                Coordinador
              </Link>
            )}
            {profile.role === 'admin' &&
              [
                { href: '/admin', label: 'Panel Admin' },
                { href: '/admin/people', label: 'Socios' },
                { href: '/admin/cursos', label: 'Talleres' },
                { href: '/admin/forms', label: 'Formularios' },
                { href: '/coordinador', label: 'Coordinador' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-xs px-3 py-1.5 bg-white border border-amber-200 rounded-md text-amber-800 hover:bg-amber-100 transition-colors font-medium">
                  {link.label}
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
