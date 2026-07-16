import { PrismaClient } from '@prisma/client';

interface RiskOptionInput {
  key: string;
  label: string;
  type: string;
}

const RISK_OPTIONS: RiskOptionInput[] = [
  // ── Tipo de supuesto ─────────────────────────────────────────────────────────
  { key: 'tecnico',    label: 'Técnico',    type: 'tipoSupuesto' },
  { key: 'clima',      label: 'Clima',      type: 'tipoSupuesto' },
  { key: 'humano',     label: 'Humano',     type: 'tipoSupuesto' },
  { key: 'fauna',      label: 'Fauna',      type: 'tipoSupuesto' },
  { key: 'logistico',  label: 'Logístico',  type: 'tipoSupuesto' },

  // ── Probabilidad ─────────────────────────────────────────────────────────────
  { key: 'muy_improbable', label: 'Muy improbable', type: 'probabilidad' },
  { key: 'poco_probable',  label: 'Poco probable',  type: 'probabilidad' },
  { key: 'algo_probable',  label: 'Algo probable',  type: 'probabilidad' },
  { key: 'muy_probable',   label: 'Muy probable',   type: 'probabilidad' },

  // ── Impacto ──────────────────────────────────────────────────────────────────
  { key: 'minimo',       label: 'Mínimo',       type: 'impacto' },
  { key: 'manejable',    label: 'Manejable',    type: 'impacto' },
  { key: 'significativo', label: 'Significativo', type: 'impacto' },
  { key: 'critico',      label: 'Crítico',      type: 'impacto' },

  // ── Peligro ──────────────────────────────────────────────────────────────────
  { key: 'alud_avalancha',     label: 'Alud/Avalancha',              type: 'peligro' },
  { key: 'caida_piedras',      label: 'Caída de piedras',            type: 'peligro' },
  { key: 'hipotermia_p',       label: 'Hipotermia',                  type: 'peligro' },
  { key: 'deshidratacion',     label: 'Deshidratación',              type: 'peligro' },
  { key: 'mal_altura',         label: 'Mal de altura',               type: 'peligro' },
  { key: 'tormenta_electrica', label: 'Tormenta eléctrica',          type: 'peligro' },
  { key: 'niebla_visibilidad', label: 'Niebla/visibilidad reducida', type: 'peligro' },
  { key: 'grietas_glaciar',    label: 'Grietas en glaciar',          type: 'peligro' },
  { key: 'seracs',             label: 'Desprendimiento de seracs',   type: 'peligro' },
  { key: 'fatiga_extrema',     label: 'Fatiga extrema',              type: 'peligro' },
  { key: 'exposicion_solar',   label: 'Exposición solar',            type: 'peligro' },
  { key: 'caida_canaleta',     label: 'Caída en canaleta',           type: 'peligro' },

  // ── Riesgo ───────────────────────────────────────────────────────────────────
  { key: 'lesion_leve',    label: 'Lesión leve',              type: 'riesgo' },
  { key: 'lesion_grave',   label: 'Lesión grave',             type: 'riesgo' },
  { key: 'fallecimiento',  label: 'Fallecimiento',            type: 'riesgo' },
  { key: 'extravio',       label: 'Extravío',                 type: 'riesgo' },
  { key: 'hipotermia_r',   label: 'Hipotermia',               type: 'riesgo' },
  { key: 'edema_pulmonar', label: 'Edema pulmonar de altura', type: 'riesgo' },
  { key: 'congelamiento',  label: 'Congelamiento',            type: 'riesgo' },

  // ── Dificultad ───────────────────────────────────────────────────────────────
  { key: 'f',   label: 'F — Fácil',                    type: 'dificultad' },
  { key: 'pd',  label: 'PD — Poco Difícil',            type: 'dificultad' },
  { key: 'ad',  label: 'AD — Algo Difícil',            type: 'dificultad' },
  { key: 'd',   label: 'D — Difícil',                  type: 'dificultad' },
  { key: 'td',  label: 'TD — Muy Difícil',             type: 'dificultad' },
  { key: 'ed',  label: 'ED — Extremadamente Difícil',  type: 'dificultad' },
];

export async function seedRiskOptions(prisma: PrismaClient) {
  console.log('Seeding risk options...');

  // Delete and recreate each type to ensure idempotency
  const types = [...new Set(RISK_OPTIONS.map((o) => o.type))];
  for (const type of types) {
    await prisma.riskOption.deleteMany({ where: { type } });
  }

  await prisma.riskOption.createMany({ data: RISK_OPTIONS });

  console.log(`  Seeded ${RISK_OPTIONS.length} risk options (${types.length} types)`);
}
