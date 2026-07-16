import React from 'react';
import { requireAdmin } from '@/lib/auth';
import ActivitiesAdminPanel from '@/resources/form/components/ActivitiesAdminPanel';

export default async function ActivitiesAdminPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <ActivitiesAdminPanel />
    </div>
  );
}
