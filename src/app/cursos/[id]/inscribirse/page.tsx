'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

/**
 * This route is no longer used.
 * Inscription is now done per EdicionTaller at /cursos/edicion/[id]/postular.
 * Redirect back to the taller detail page.
 */
export default function InscribirseRedirectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/cursos/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
