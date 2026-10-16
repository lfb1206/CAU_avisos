import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth, isMembershipActive } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { EQUIPO_CLUB_POOL_KEY, MAX_LOAN_DURATION_DAYS, RESERVED_LOAN_STATUSES, isReturnDueDateWithinCap } from '@/lib/inventory';
import { sendEmail, PRESTAMOS_FROM } from '@/lib/email';

const createSchema = z
  .object({
    aviso_id: z.number().int().positive(),
    return_due_date: z.string().min(1),
    items: z
      .array(
        z.object({
          inventory_item_id: z.number().int().positive(),
          quantity: z.number().int().positive(),
        })
      )
      .min(1, 'Debes seleccionar al menos un ítem'),
  })
  .superRefine((data, ctx) => {
    const ids = data.items.map((item) => item.inventory_item_id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No puedes repetir el mismo ítem en una solicitud',
        path: ['items'],
      });
    }
  });

// GET /api/prestamos/solicitudes — current user's own loan requests
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const loans = await prisma.loanRequest.findMany({
      where: { user_id: auth.user.id },
      include: {
        items: { include: { inventory_item: { select: { id: true, descripcion: true, uso: true } } } },
      },
      orderBy: { requested_at: 'desc' },
    });
    return NextResponse.json(loans);
  } catch (error) {
    console.error('[prestamos solicitudes GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST /api/prestamos/solicitudes — member creates a new loan request
export async function POST(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  if (!isMembershipActive(auth.profile)) {
    return NextResponse.json({ error: 'Tu membresía no está vigente.' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { aviso_id, items } = parsed.data;
  const returnDueDate = new Date(parsed.data.return_due_date);
  if (Number.isNaN(returnDueDate.getTime())) {
    return NextResponse.json({ error: 'Fecha de devolución inválida' }, { status: 400 });
  }
  if (!isReturnDueDateWithinCap(returnDueDate)) {
    return NextResponse.json(
      { error: `El préstamo no puede ser por más de ${MAX_LOAN_DURATION_DAYS} días.` },
      { status: 422 }
    );
  }

  try {
    const [pool, aviso] = await Promise.all([
      prisma.inventoryPool.findUnique({ where: { key: EQUIPO_CLUB_POOL_KEY }, include: { custodian: true } }),
      prisma.aviso.findFirst({ where: { id: aviso_id, created_by: auth.user.id } }),
    ]);

    if (!pool) {
      return NextResponse.json({ error: 'El catálogo de Equipo Club no está configurado todavía.' }, { status: 404 });
    }
    if (!aviso) return NextResponse.json({ error: 'Aviso no encontrado' }, { status: 404 });
    if (aviso.status === 'draft') {
      return NextResponse.json({ error: 'Debes seleccionar un aviso ya enviado, no un borrador.' }, { status: 422 });
    }

    const loan = await prisma.$transaction(async (tx) => {
      const itemIds = items.map((item) => item.inventory_item_id);

      const inventoryItems = await tx.inventoryItem.findMany({
        where: { id: { in: itemIds }, pool_id: pool.id, active: true },
      });
      if (inventoryItems.length !== items.length) {
        throw new Error('ITEM_NOT_FOUND');
      }

      const reserved = await tx.loanItem.groupBy({
        by: ['inventory_item_id'],
        where: {
          inventory_item_id: { in: itemIds },
          loan_request: { status: { in: RESERVED_LOAN_STATUSES } },
        },
        _sum: { quantity: true },
      });
      const reservedByItem = new Map(reserved.map((row) => [row.inventory_item_id, row._sum.quantity ?? 0]));

      for (const requested of items) {
        const inv = inventoryItems.find((item) => item.id === requested.inventory_item_id)!;
        const available = inv.cantidad - inv.en_inspeccion - (reservedByItem.get(inv.id) ?? 0);
        if (requested.quantity > available) {
          throw new Error(`NOT_ENOUGH_STOCK:${inv.descripcion}`);
        }
      }

      return tx.loanRequest.create({
        data: {
          pool_id: pool.id,
          user_id: auth.user.id,
          aviso_id,
          return_due_date: returnDueDate,
          items: {
            create: items.map((item) => ({
              inventory_item_id: item.inventory_item_id,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });
    });

    if (pool.custodian?.email) {
      sendEmail({
        from: PRESTAMOS_FROM,
        to: pool.custodian.email,
        subject: 'Nueva solicitud de préstamo — Equipo Club',
        html: `<p>${auth.profile.name || auth.profile.email} solicitó equipo del Equipo Club. Revisa la solicitud en el panel de Custodio.</p>`,
      }).catch(console.error);
    }

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'ITEM_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Uno de los ítems seleccionados ya no está disponible en el catálogo.' },
        { status: 404 }
      );
    }
    if (error instanceof Error && error.message.startsWith('NOT_ENOUGH_STOCK:')) {
      return NextResponse.json(
        { error: `No hay suficiente disponibilidad de "${error.message.split(':')[1]}".` },
        { status: 409 }
      );
    }
    console.error('[prestamos solicitudes POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
