import { NextResponse } from 'next/server';

/**
 * This endpoint has been superseded by the new edicion-based enrollment system.
 * Use PATCH /api/coordinador/ediciones/[id] to toggle enrollment_open on an EdicionTaller.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'Este endpoint fue reemplazado. Usa PATCH /api/coordinador/ediciones/[id] para abrir o cerrar inscripciones en una edición de taller.',
    },
    { status: 410 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      error:
        'Este endpoint fue reemplazado. Usa PATCH /api/coordinador/ediciones/[id] para abrir o cerrar inscripciones en una edición de taller.',
    },
    { status: 410 }
  );
}
