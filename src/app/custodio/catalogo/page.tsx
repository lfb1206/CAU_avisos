import React from 'react';
import { requireCustodio } from '@/lib/auth';
import InventoryCatalogPanel from '@/resources/form/components/InventoryCatalogPanel';

export default async function CustodioCatalogoPage() {
  await requireCustodio();

  return (
    <div className="min-h-screen bg-gray-50">
      <InventoryCatalogPanel />
    </div>
  );
}
