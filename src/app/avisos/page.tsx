import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface SearchParams {
  q?: string;
  activity?: string;
  from?: string;
  to?: string;
}

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const sp = await searchParams;
  const { q, activity, from, to } = sp;

  const where: Prisma.AvisoWhereInput = {
    status: 'submitted',
  };

  if (q) {
    where.OR = [
      { location: { contains: q, mode: 'insensitive' } },
      { participant_names_text: { contains: q, mode: 'insensitive' } },
      { title: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (activity) where.activity_type = { contains: activity, mode: 'insensitive' };
  if (from)     where.activity_date = { ...((where.activity_date as object) ?? {}), gte: new Date(from) };
  if (to)       where.activity_date = { ...((where.activity_date as object) ?? {}), lte: new Date(to) };

  const avisos = await prisma.aviso.findMany({
    where,
    orderBy: { submitted_at: 'desc' },
    take: 50,
    include: { profile: { select: { name: true } } },
  });

  const activityTypes = await prisma.aviso.findMany({
    where: { status: 'submitted', activity_type: { not: null } },
    select: { activity_type: true },
    distinct: ['activity_type'],
    orderBy: { activity_type: 'asc' },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Avisos</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Revisa los avisos enviados por otros socios. Puedes usarlos como base para tu propio aviso.
        </p>
      </div>

      {/* Search + filters */}
      <form method="GET" className="flex flex-wrap gap-3 mb-8 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Cerro / participante / título</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Ej: Tupungato, Juan Pérez…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Actividad</label>
          <select
            name="activity"
            defaultValue={activity}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            {activityTypes.map((a) => (
              <option key={a.activity_type} value={a.activity_type ?? ''}>
                {a.activity_type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Buscar
        </button>

        {(q || activity || from || to) && (
          <Link href="/avisos" className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Limpiar
          </Link>
        )}
      </form>

      {/* Results */}
      {avisos.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="font-medium">No se encontraron avisos</p>
          <p className="text-sm mt-1">Intenta con otros filtros.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {avisos.map((aviso) => (
            <Link
              key={aviso.id}
              href={`/avisos/${aviso.id}`}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm hover:border-blue-300 transition-all group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    aviso.tipo === 'rapido'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {aviso.tipo === 'rapido' ? 'Rápido' : 'Largo'}
                  </span>
                  {aviso.activity_type && (
                    <span className="text-xs text-gray-500">{aviso.activity_type}</span>
                  )}
                </div>

                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700">
                  {aviso.location
                    ? `${aviso.title || 'Aviso'} — ${aviso.location}`
                    : (aviso.title || 'Aviso sin título')}
                </p>

                <p className="text-xs text-gray-400 mt-0.5">
                  Por {aviso.profile.name}
                  {aviso.activity_date && (
                    <> · {new Date(aviso.activity_date).toLocaleDateString('es-CL')}</>
                  )}
                  {aviso.participant_names_text && (
                    <> · {aviso.participant_names_text.trim().split(/\s{2,}/).length} participante{aviso.participant_names_text.trim().split(/\s{2,}/).length !== 1 ? 's' : ''}</>
                  )}
                </p>
              </div>

              <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
