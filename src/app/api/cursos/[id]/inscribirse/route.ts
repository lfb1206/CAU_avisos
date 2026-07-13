import { NextResponse } from 'next/server';

/**
 * This endpoint has been superseded by the new edicion-based postular flow.
 * Use POST /api/ediciones/[id]/postular instead.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'Este endpoint fue reemplazado. Usa POST /api/ediciones/[edicion_id]/postular para postular a una edición de taller.',
    },
    { status: 410 }
  );
}
