import React from 'react';
import { requireAuth } from '@/lib/auth';
import LoanRequestDetail from '@/resources/form/components/LoanRequestDetail';

type PageProps = { params: Promise<{ id: string }> };

export default async function PrestamoDetailPage({ params }: PageProps) {
  await requireAuth();
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <LoanRequestDetail id={Number(id)} />
    </div>
  );
}
