import React from 'react';
import { requireAuth } from '@/lib/auth';
import PrestamosCatalog from '@/resources/form/components/PrestamosCatalog';

export default async function PrestamosPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <PrestamosCatalog />
    </div>
  );
}
