import React from 'react';
import Link from 'next/link';

export default function ManualLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/ayuda" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Volver a Ayuda
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      {subtitle && <p className="text-gray-500 mb-8">{subtitle}</p>}
      <div className="space-y-8">{children}</div>
    </div>
  );
}

export function ManualSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-sm text-gray-700 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_strong]:text-gray-900 [&_strong]:font-semibold">
        {children}
      </div>
    </section>
  );
}

export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-900">
      💡 {children}
    </div>
  );
}

export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-900">
      ⚠️ {children}
    </div>
  );
}
