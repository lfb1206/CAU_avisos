import React from 'react';
import { requireAdmin } from '@/lib/auth';
import EquipmentAdminPanel from '@/resources/form/components/EquipmentAdminPanel';

export default async function EquipmentAdminPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <EquipmentAdminPanel />
    </div>
  );
}
