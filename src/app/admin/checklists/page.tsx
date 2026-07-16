import React from 'react';
import { requireAdmin } from '@/lib/auth';
import ChecklistsAdminPanel from '@/resources/form/components/ChecklistsAdminPanel';

export default async function ChecklistsAdminPage() {
  await requireAdmin();
  return <ChecklistsAdminPanel />;
}
