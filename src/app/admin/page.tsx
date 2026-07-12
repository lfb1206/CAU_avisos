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

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Información del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Diccionarios Disponibles</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Personas:</strong> Contactos CAU y participantes frecuentes</li>
                <li>• <strong>Actividades:</strong> Actividades generales y específicas con equipamiento</li>
                <li>• <strong>Equipamiento:</strong> Categorías e items de equipamiento</li>
                <li>• <strong>Autocompletado:</strong> Sugerencias básicas, riesgos, transporte, médico y supuestos</li>
                <li>• <strong>Checklists:</strong> Checklists de Wikiexplora</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Funcionalidades</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Edición:</strong> Modificar datos existentes</li>
                <li>• <strong>Agregar:</strong> Crear nuevos registros</li>
                <li>• <strong>Exportar:</strong> Descargar datos en JSON</li>
                <li>• <strong>Backup:</strong> Crear copias de seguridad</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Nota Importante
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Los cambios realizados en este panel se guardan en memoria durante la sesión. 
                  Para persistir los cambios, utiliza las funciones de exportación y luego 
                  actualiza los archivos correspondientes en el sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 