import { PrismaClient } from '@prisma/client';

const categories = [
  { id: 'calzado', name: 'Calzado' },
  { id: 'ropa', name: 'Ropa' },
  { id: 'proteccion', name: 'Protección' },
  { id: 'equipo', name: 'Equipo' },
  { id: 'seguridad', name: 'Seguridad' },
  { id: 'campamento', name: 'Campamento' },
  { id: 'nieve', name: 'Nieve' },
  { id: 'navegacion', name: 'Navegación' },
];

const items: Record<string, string[]> = {
  calzado: ['Botas de trekking', 'Botas de montaña', 'Zapatos de escalada', 'Zapatillas de aproximación', 'Botas impermeables'],
  ropa: ['Primera capa superior', 'Segunda capa superior', 'Tercera capa superior', 'Pantalones técnicos', 'Calcetines técnicos', 'Guantes', 'Gorro'],
  proteccion: ['Bloqueador solar', 'Anteojos de sol', 'Sombrero para el sol', 'Chaqueta impermeable', 'Pantalones impermeables'],
  equipo: ['Mochila', 'Bastones de trekking', 'Linterna frontal', 'Cantimplora', 'Cámara de fotos', 'Cortaplumas'],
  seguridad: ['Arnés', 'Cuerda', 'Mosquetones', 'Casco', 'Descensor', 'Botiquín'],
  campamento: ['Carpa', 'Saco de dormir', 'Aislante', 'Cocina de gas', 'Ollas y utensilios'],
  nieve: ['Piolet', 'Crampones', 'Raquetas', 'Polainas', 'Guantes impermeables'],
  navegacion: ['GPS', 'Brújula', 'Mapa', 'Radio', 'Dispositivo satelital'],
};

export async function seedEquipment(prisma: PrismaClient) {
  console.log('Seeding equipment...');

  const rows = categories.flatMap((cat) =>
    (items[cat.id] ?? []).map((name) => ({ category: cat.name, name, active: true }))
  );

  await prisma.equipmentItem.createMany({ data: rows, skipDuplicates: true });

  console.log(`  Seeded ${rows.length} equipment items across ${categories.length} categories`);
}
