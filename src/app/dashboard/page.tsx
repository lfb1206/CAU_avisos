import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft:     'bg-yellow-100 text-yellow-800',
    submitted: 'bg-green-100  text-green-800',
    archived:  'bg-gray-100   text-gray-600',
  };
  const labels: Record<string, string> = {
    draft:     'Borrador',
    submitted: 'Enviado',
    archived:  'Archivado',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const [avisos, enrollments, profile] = await Promise.all([
    prisma.aviso.findMany({
      where: { created_by: user.id },
      orderBy: { updated_at: 'desc' },
      take: 10,
      select: { id: true, title: true, status: true, updated_at: true },
    }),
    prisma.courseEnrollment.findMany({
      where: { user_id: user.id, status: { in: ['enrolled', 'completed'] } },
      include: { course: { select: { name: true, branch: true } } },
      take: 5,
    }),
    prisma.profile.findUnique({ where: { id: user.id }, select: { name: true, role: true } }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hola, {profile?.name ?? user.email} 👋
        </h1>
        <p className="text-gray-500 mt-1">Panel de control</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Avisos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mis Avisos</h2>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              + Nuevo aviso
            </Link>
          </div>

          {avisos.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-500">
              <p className="text-sm">No tienes avisos aún.</p>
              <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm font-medium mt-2 block">
                Crear primer aviso
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {avisos.map((aviso) => (
                <div key={aviso.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{aviso.title || 'Sin título'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(aviso.updated_at).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <StatusBadge status={aviso.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cursos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mis Cursos</h2>
            <Link
              href="/cursos"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Ver todos
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-500">
              <p className="text-sm">No tienes cursos inscritos.</p>
              <Link href="/cursos" className="text-blue-600 hover:text-blue-500 text-sm font-medium mt-2 block">
                Ver ruta de cursos
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((e) => (
                <div key={e.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.course.name}</p>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">
                      {e.course.branch.replace('_', '/')}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    e.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {e.status === 'completed' ? 'Completado' : 'Inscrito'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {profile?.role === 'admin' && (
        <section className="mt-10 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-sm font-semibold text-amber-900 mb-3">Panel de administrador</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/admin', label: 'Panel Admin' },
              { href: '/admin/people', label: 'Socios' },
              { href: '/admin/courses', label: 'Cursos' },
              { href: '/admin/forms', label: 'Formularios' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs px-3 py-1.5 bg-white border border-amber-200 rounded-md text-amber-800 hover:bg-amber-100 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
