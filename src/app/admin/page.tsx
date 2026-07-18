import React from 'react';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export default async function AdminPage() {
  await requireAdmin();

  const adminSections = [
    {
      title: 'Gestión de Personas',
      description: 'Administra contactos y participantes del CAU',
      href: '/admin/people',
      icon: '👥',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Gestión de Actividades',
      description: 'Administra actividades y su equipamiento recomendado',
      href: '/admin/activities',
      icon: '🏔️',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Gestión de Equipamiento',
      description: 'Administra categorías e items de equipamiento',
      href: '/admin/equipment',
      icon: '🎒',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Gestión de Autocompletado',
      description: 'Administra sugerencias y datos de autocompletado',
      href: '/admin/forms',
      icon: '📋',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Gestión de Checklists',
      description: 'Administra checklists de Wikiexplora',
      href: '/admin/checklists',
      icon: '✅',
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      title: 'Gestión de Cursos',
      description: 'Administra cursos y trayectoria de formación del club',
      href: '/admin/cursos',
      icon: '🧗',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona los diccionarios de datos del sistema CAU Avisos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="block group"
            >
              <div className={`${section.color} text-white rounded-lg p-6 shadow-lg transition-all duration-200 transform group-hover:scale-105`}>
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{section.icon}</span>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>
                <p className="text-white/90 text-sm">
                  {section.description}
                </p>
                <div className="mt-4 flex items-center text-white/80 text-sm">
                  <span>Acceder</span>
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
