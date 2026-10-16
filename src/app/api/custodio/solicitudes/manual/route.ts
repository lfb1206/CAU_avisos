import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCustodio } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { EQUIPO_CLUB_POOL_KEY, RESERVED_LOAN_STATUSES } from '@/lib/inventory';

const manualLoanSchema = z
  .object({
    member_email: z.string().email(),
    pickup_due_date: z.string().min(1),
    return_due_date: z.string().min(1),
    notas_custodio: z.string().optional(),
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
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'No puedes repetir el mismo ítem', path: ['items'] });
    }
  });

/**
 * POST /api/custodio/solicitudes/manual — custodio directly registers gear that's
 * already out (e.g. migrated from the old system, or an in-person/phone request),
 * skipping the member self-service flow. Creates the loan straight in `entregado`
 * status with no aviso_id — this is the supported way to correct availability for
 * gear that's physically out but has no LoanRequest yet, rather than editing a raw
 * "available" number (which doesn't exist on InventoryItem by design: availability
 * is always computed from real loan records, never hand-edited).
 */
export async function POST(request: NextRequest) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const parsed = manualLoanSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { member_email, items, notas_custodio } = parsed.data;
  const pickupDueDate = new Date(parsed.data.pickup_due_date);
  const returnDueDate = new Date(parsed.data.return_due_date);
  if (Number.isNaN(pickupDueDate.getTime()) || Number.isNaN(returnDueDate.getTime())) {
    return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 });
  }

  try {
    const [pool, member] = await Promise.all([
      prisma.inventoryPool.findUnique({ where: { key: EQUIPO_CLUB_POOL_KEY } }),
      prisma.profile.findUnique({ where: { email: member_email.toLowerCase() } }),
    ]);

    if (!pool) {
      return NextResponse.json({ error: 'El catálogo de Equipo Club no está configurado todavía.' }, { status: 404 });
    }
    if (!member) {
      return NextResponse.json({ error: 'Ese correo no corresponde a un socio registrado en el sistema.' }, { status: 404 });
    }

    const loan = await prisma.$transaction(async (tx) => {
      const itemIds = items.map((item) => item.inventory_item_id);

      const inventoryItems = await tx.inventoryItem.findMany({
        where: { id: { in: itemIds }, pool_id: pool.id },
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
          user_id: member.id,
          aviso_id: null,
          status: 'entregado',
          pickup_due_date: pickupDueDate,
          return_due_date: returnDueDate,
          delivered_at: pickupDueDate,
          notas_custodio: notas_custodio || 'Registrado manualmente por el custodio.',
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

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'ITEM_NOT_FOUND') {
      return NextResponse.json({ error: 'Uno de los ítems seleccionados ya no existe en el catálogo.' }, { status: 404 });
    }
    if (error instanceof Error && error.message.startsWith('NOT_ENOUGH_STOCK:')) {
      return NextResponse.json(
        { error: `No hay suficiente disponibilidad de "${error.message.split(':')[1]}".` },
        { status: 409 }
      );
    }
    console.error('[custodio solicitudes manual POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
