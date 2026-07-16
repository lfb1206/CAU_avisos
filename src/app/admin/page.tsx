'use client';
import React from 'react';
import Link from 'next/link';

export default function AdminPage() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Panel de Administración</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona los diccionarios de datos del sistema CAU Avisos</p>
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

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Información del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Diccionarios Disponibles</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• <strong>Personas:</strong> Contactos CAU y participantes frecuentes</li>
                <li>• <strong>Actividades:</strong> Actividades generales y específicas con equipamiento</li>
                <li>• <strong>Equipamiento:</strong> Categorías e items de equipamiento</li>
                <li>• <strong>Autocompletado:</strong> Sugerencias básicas, riesgos, transporte, médico y supuestos</li>
                <li>• <strong>Checklists:</strong> Checklists de Wikiexplora</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Funcionalidades</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• <strong>Edición:</strong> Modificar datos existentes</li>
                <li>• <strong>Agregar:</strong> Crear nuevos registros</li>
                <li>• <strong>Exportar:</strong> Descargar datos en JSON</li>
                <li>• <strong>Backup:</strong> Crear copias de seguridad</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Base de datos activa</h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  Los cambios en este panel se persisten directamente en Supabase y estarán disponibles de inmediato para todos los usuarios.
                  Usa las funciones de exportación para obtener respaldos locales en JSON.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 