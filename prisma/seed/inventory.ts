import { PrismaClient } from '@prisma/client';
import type { ItemCondition, LoanStatus } from '@prisma/client';

// The real CAU "Equipo Club" inventory and currently-outstanding loans are
// intentionally NOT committed to this public repo — real club assets and member
// data. To seed them locally: create an untracked `prisma/seed/data/inventory.local.json`
// (gitignored) matching the shape below, transcribed from the live spreadsheet.
//
// Run this after seedPeople (index.ts already orders it that way) — custodian and
// borrower lookups below resolve by email against already-seeded profiles.
type SeedItem = {
  uso: string;
  descripcion: string;
  cantidad: number;
  estado?: ItemCondition;
  en_inspeccion?: number;
  fecha_compra?: string | null;
  observaciones?: string | null;
};

type SeedOutstandingLoan = {
  borrower_email: string;
  return_due_date: string;
  pickup_date?: string;
  items: { descripcion: string; quantity: number }[];
};

type InventorySeed = {
  pool: { key: string; name: string; custodian_email?: string | null; requisitos?: string | null };
  items: SeedItem[];
  outstanding_loans?: SeedOutstandingLoan[];
};

const exampleSeed: InventorySeed = {
  pool: { key: 'equipo_club', name: 'Equipo Club', custodian_email: null, requisitos: 'Adjuntar aviso de salida' },
  items: [
    { uso: 'Nieve', descripcion: 'Piolet de Marcha Simond', cantidad: 9, estado: 'bueno' },
    { uso: 'Cuerdas', descripcion: 'Cuerda Dinámica Edelrid Doble Verde 60m (D6) DRY', cantidad: 1, estado: 'nuevo' },
  ],
  outstanding_loans: [],
};

function loadInventorySeed(): InventorySeed {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const local = require('./data/inventory.local.json');
    if (local && Array.isArray(local.items) && local.items.length > 0) return local;
  } catch {
    // no local file present — fall back to the example data below
  }
  return exampleSeed;
}

const seed = loadInventorySeed();

export async function seedInventory(prisma: PrismaClient) {
  console.log('Seeding Equipo Club inventory...');

  let custodianId: string | null = null;
  if (seed.pool.custodian_email) {
    const custodian = await prisma.profile.findUnique({ where: { email: seed.pool.custodian_email.toLowerCase() } });
    if (custodian) custodianId = custodian.id;
    else console.warn(`  Custodian email ${seed.pool.custodian_email} not found — pool left unassigned`);
  }

  const pool = await prisma.inventoryPool.upsert({
    where: { key: seed.pool.key },
    update: {
      name: seed.pool.name,
      requisitos: seed.pool.requisitos ?? undefined,
      ...(custodianId ? { custodian_id: custodianId } : {}),
    },
    create: {
      key: seed.pool.key,
      name: seed.pool.name,
      requisitos: seed.pool.requisitos ?? null,
      custodian_id: custodianId,
    },
  });

  const itemIdByDescripcion = new Map<string, number>();
  for (const item of seed.items) {
    const existing = await prisma.inventoryItem.findFirst({ where: { pool_id: pool.id, descripcion: item.descripcion } });
    const saved = existing
      ? await prisma.inventoryItem.update({
          where: { id: existing.id },
          data: {
            uso: item.uso,
            cantidad: item.cantidad,
            estado: item.estado ?? 'bueno',
            en_inspeccion: item.en_inspeccion ?? 0,
            fecha_compra: item.fecha_compra ? new Date(item.fecha_compra) : null,
            observaciones: item.observaciones ?? null,
          },
        })
      : await prisma.inventoryItem.create({
          data: {
            pool_id: pool.id,
            uso: item.uso,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            estado: item.estado ?? 'bueno',
            en_inspeccion: item.en_inspeccion ?? 0,
            fecha_compra: item.fecha_compra ? new Date(item.fecha_compra) : null,
            observaciones: item.observaciones ?? null,
          },
        });
    itemIdByDescripcion.set(item.descripcion, saved.id);
  }
  console.log(`  Seeded ${seed.items.length} inventory items`);

  // Currently-outstanding loans (the old sheet's "Prestados" column) MUST be seeded
  // as active `entregado` loan requests — otherwise computed availability treats
  // fully-booked stock as free, double-booking on day one.
  let loanCount = 0;
  for (const loan of seed.outstanding_loans ?? []) {
    const borrower = await prisma.profile.findUnique({ where: { email: loan.borrower_email.toLowerCase() } });
    if (!borrower) {
      console.warn(`  Borrower email ${loan.borrower_email} not found — skipping outstanding loan`);
      continue;
    }

    const lineItems = loan.items
      .map((li) => ({ id: itemIdByDescripcion.get(li.descripcion), quantity: li.quantity }))
      .filter((li): li is { id: number; quantity: number } => li.id !== undefined);
    if (lineItems.length === 0) continue;

    await prisma.loanRequest.create({
      data: {
        pool_id: pool.id,
        user_id: borrower.id,
        aviso_id: null, // historical loan, predates the aviso-linkage requirement
        status: 'entregado' satisfies LoanStatus,
        return_due_date: new Date(loan.return_due_date),
        delivered_at: loan.pickup_date ? new Date(loan.pickup_date) : new Date(),
        items: { create: lineItems.map((li) => ({ inventory_item_id: li.id, quantity: li.quantity })) },
      },
    });
    loanCount++;
  }
  console.log(`  Seeded ${loanCount} outstanding loans`);
}
