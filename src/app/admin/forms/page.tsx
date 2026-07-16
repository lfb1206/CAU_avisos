import React from 'react';
import { requireAdmin } from '@/lib/auth';
import FormsAdminPanel from '@/resources/form/components/FormsAdminPanel';

export default async function FormsAdminPage() {
  await requireAdmin();
  return <FormsAdminPanel />;
}
