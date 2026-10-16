import React from 'react';
import { requireCustodio } from '@/lib/auth';
import LoanReviewPanel from '@/resources/form/components/LoanReviewPanel';

type PageProps = { params: Promise<{ id: string }> };

export default async function CustodioSolicitudPage({ params }: PageProps) {
  await requireCustodio();
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <LoanReviewPanel id={Number(id)} />
    </div>
  );
}
