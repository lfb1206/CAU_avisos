import React from 'react';
import Link from 'next/link';

const SECTIONS = [
  { href: '/admin/people', label: 'Personas' },
  { href: '/admin/activities', label: 'Actividades' },
  { href: '/admin/equipment', label: 'Equipamiento' },
  { href: '/admin/forms', label: 'Autocompletado' },
  { href: '/admin/checklists', label: 'Checklists' },
  { href: '/admin/cursos', label: 'Cursos' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <Link href="/dashboard" className="hover:text-blue-600">Panel</Link>
            <span>/</span>
            <span className="font-medium text-gray-700">Administración</span>
          </div>
          <nav className="flex gap-1 flex-wrap">
            {SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
