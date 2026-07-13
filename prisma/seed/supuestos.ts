import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

interface SupuestoRaw {
  id: string;
  tramos: string[];
  actividades: string[];
  dificultades: string[];
  categoria: string;
  supuesto: string;
  estab_prob?: string;
  estab_expo?: string;
  mitigacion?: string;
  senal?: string;
  regla?: string;
}

export async function seedSupuestos(prisma: PrismaClient) {
  console.log('Seeding supuestos...');

  const filePath = path.join(__dirname, 'data', 'supuestos.json');
  const raw: SupuestoRaw[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  await prisma.supuesto.createMany({
    data: raw.map((s) => ({
      code:        s.id,
      categoria:   s.categoria,
      supuesto:    s.supuesto,
      tramos:      s.tramos ?? [],
      actividades: s.actividades ?? [],
      dificultades: s.dificultades ?? [],
      estab_prob:  s.estab_prob ?? null,
      estab_expo:  s.estab_expo ?? null,
      mitigacion:  s.mitigacion ?? null,
      senal:       s.senal ?? null,
      regla:       s.regla ?? null,
    })),
    skipDuplicates: true,
  });

  console.log(`  Seeded ${raw.length} supuestos`);
}
