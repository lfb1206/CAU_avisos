import React from 'react';
import { requireAdmin } from '@/lib/auth';
import PeopleAdminPanel from '@/resources/form/components/PeopleAdminPanel';

export default async function PeopleAdminPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <PeopleAdminPanel />
    </div>
  );
}
