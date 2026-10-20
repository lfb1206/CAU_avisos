import React from 'react';
import Link from 'next/link';
import { requireCustodio } from '@/lib/auth';
import ManualLayout, { ManualSection, Tip, Warning } from '@/resources/ayuda/ManualLayout';
import StepFlowDiagram from '@/resources/ayuda/StepFlowDiagram';

export default async function ManualCustodioPage() {
  await requireCustodio();

  return (
    <ManualLayout
      title="Manual del Custodio"
      subtitle="Catálogo de equipo, revisión de solicitudes, entrega y devolución."
    >
      <ManualSection title="¿Qué es ser custodio?">
        <p>
          Cada pool de equipo (hoy solo existe Equipo Club) tiene un custodio asignado, responsable de
          mantener el catálogo al día y de aprobar, entregar y recibir los préstamos de ese pool. Un
          administrador asigna el custodio de cada pool desde <strong>Admin → Gestión de Personas</strong>.
        </p>
      </ManualSection>

      <ManualSection title="El catálogo de equipo">
        <p>
          En <Link href="/custodio/catalogo" className="text-blue-600 hover:underline">Catálogo</Link> ves
          todos los ítems del pool, agrupados por categoría (puedes colapsar categorías para navegar más
          rápido). Cada ítem muestra cuánto hay disponible — esto se calcula automáticamente
          (cantidad total menos lo que está en inspección menos lo que está prestado), nunca lo editas
          directamente.
        </p>
        <p>Al editar un ítem puedes configurar:</p>
        <ul>
          <li><strong>Cantidad, estado y en inspección</strong> — unidades totales, su condición, y cuántas están temporalmente fuera de servicio (reparación, etc.).</li>
          <li><strong>Observaciones</strong> — notas internas, solo para ti.</li>
          <li><strong>Instrucciones de uso</strong> — una restricción que verá el socio al elegir el ítem, por ejemplo: cuerdas gemelas solo para uso en escalada en hielo.</li>
          <li><strong>Foto</strong> — una foto representativa del ítem, que tú tomas o subes. Los socios la ven al tocar Ver foto en el catálogo.</li>
        </ul>
      </ManualSection>

      <ManualSection title="Revisar una solicitud de préstamo">
        <StepFlowDiagram
          steps={[
            {
              label: 'Solicitud pendiente',
              sublabel: 'Revisa el detalle',
              detail: 'Incluye el aviso de salida vinculado, si el socio indicó uno.',
            },
            {
              label: 'Apruebas o rechazas',
              detail: 'Si rechazas, debes indicar un motivo — el socio lo verá.',
            },
            {
              label: 'Marcas como entregado',
              sublabel: 'Sin foto en este paso',
              detail: 'Es un solo clic — no necesitas tomar ninguna foto al momento de la entrega.',
            },
            {
              label: 'Confirmas devolución',
              sublabel: 'Cuando el socio suba su foto',
              detail: 'Antes de confirmar, revisa que el socio ya haya subido su foto de devolución desde su propia solicitud — el botón de confirmar no se habilita hasta entonces.',
            },
          ]}
        />
        <p>
          Cuando un socio solicita equipo, aparece como <strong>pendiente</strong> en tu panel. Revisa el
          detalle (incluye el aviso de salida vinculado, si lo tiene) y:
        </p>
        <ul>
          <li><strong>Aprobar</strong> — la solicitud pasa a aprobado, lista para coordinar el retiro.</li>
          <li><strong>Rechazar</strong> — debes indicar un motivo, que el socio verá.</li>
        </ul>
      </ManualSection>

      <ManualSection title="Entrega y devolución">
        <p>
          Cuando el socio retira el equipo en persona, entra a la solicitud (ya aprobada) y presiona
          el botón <strong>Marcar como entregado</strong> — no necesitas tomar ninguna foto en este paso.
        </p>
        <Warning>
          La foto que sí importa es la de <strong>devolución</strong>, y la sube el propio socio desde su
          solicitud, antes de devolver el equipo. No puedes confirmar la devolución hasta que esa foto
          exista — el botón de confirmar te lo indicará.
        </Warning>
        <p>
          Una vez que el socio subió su foto, entra a la solicitud y presiona el botón <strong>Confirmar
          devolución</strong> — el préstamo pasa a devuelto y el equipo vuelve a estar disponible.
        </p>
      </ManualSection>

      <ManualSection title="Registrar un préstamo manualmente">
        <p>
          Si hay equipo que ya está prestado pero no tiene una solicitud en el sistema (por ejemplo,
          préstamos migrados del sistema anterior, o pedidos por teléfono/en persona), usa el botón
          <strong> Registrar préstamo existente</strong> desde el catálogo. Busca al socio, selecciona los
          ítems y cantidades, indica fechas de retiro/devolución, y queda registrado directamente como
          entregado — sin pasar por la solicitud y aprobación normal.
        </p>
      </ManualSection>

      <ManualSection title="Historial de un ítem">
        <p>
          Desde el catálogo, el botón <strong>Historial</strong> de cada ítem muestra todos sus préstamos
          pasados — quién lo tuvo, cuándo, y su estado — independiente de su foto o instrucciones actuales.
        </p>
      </ManualSection>

      <Tip>
        También eres socio: todo lo del <Link href="/ayuda/socio" className="underline">Manual del Socio</Link> aplica para tus propios avisos, cursos y préstamos.
      </Tip>
    </ManualLayout>
  );
}
