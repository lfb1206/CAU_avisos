import React from 'react';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AyudaPage() {
  const user = await requireAuth();
  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } });
  const role = profile?.role ?? 'member';

  const manuals = [
    {
      title: 'Manual del Socio',
      description: 'Avisos de salida, cursos y talleres, préstamos de equipo, y tu perfil.',
      href: '/ayuda/socio',
      icon: '🧭',
      color: 'bg-blue-500 hover:bg-blue-600',
      visible: true,
    },
    {
      title: 'Manual del Custodio',
      description: 'Catálogo de equipo, revisión de solicitudes, entrega y devolución.',
      href: '/ayuda/custodio',
      icon: '🪢',
      color: 'bg-teal-600 hover:bg-teal-700',
      visible: role === 'custodio' || role === 'admin',
    },
    {
      title: 'Manual del Coordinador',
      description: 'Ediciones de talleres, postulaciones, ayudantes y puntos.',
      href: '/ayuda/coordinador',
      icon: '🧗',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      visible: role === 'coordinador' || role === 'admin',
    },
    {
      title: 'Manual del Admin',
      description: 'Gestión de personas, membresías, catálogos y diccionarios del sistema.',
      href: '/ayuda/admin',
      icon: '⚙️',
      color: 'bg-gray-700 hover:bg-gray-800',
      visible: role === 'admin',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayuda</h1>
          <p className="text-gray-600">
            Manuales paso a paso para usar el Portal CAU, según tu rol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {manuals
            .filter((m) => m.visible)
            .map((manual) => (
              <Link key={manual.href} href={manual.href} className="block group">
                <div
                  className={`${manual.color} text-white rounded-lg p-6 shadow-lg transition-all duration-200 transform group-hover:scale-105`}
                >
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{manual.icon}</span>
                    <h3 className="text-xl font-semibold">{manual.title}</h3>
                  </div>
                  <p className="text-white/90 text-sm">{manual.description}</p>
                  <div className="mt-4 flex items-center text-white/80 text-sm">
                    <span>Ver manual</span>
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
