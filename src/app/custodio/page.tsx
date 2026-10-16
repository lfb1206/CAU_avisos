import React from 'react';
import { requireCustodio } from '@/lib/auth';
import CustodioDashboard from '@/resources/form/components/CustodioDashboard';

export default async function CustodioPage() {
  await requireCustodio();

  return (
    <div className="min-h-screen bg-gray-50">
      <CustodioDashboard />
    </div>
  );
}
