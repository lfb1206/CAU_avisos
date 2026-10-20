import React from 'react';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import ManualLayout, { ManualSection, Tip } from '@/resources/ayuda/ManualLayout';
import StepFlowDiagram from '@/resources/ayuda/StepFlowDiagram';

export default async function ManualAdminPage() {
  await requireAdmin();

  return (
    <ManualLayout
      title="Manual del Admin"
      subtitle="Gestión de personas, membresías, catálogos y diccionarios del sistema."
    >
      <ManualSection title="Gestión de Personas">
        <StepFlowDiagram
          steps={[
            {
              label: 'Autorizas su correo',
              sublabel: 'Admin → Gestión de Personas',
              detail: 'Sin este paso, el socio no puede registrarse — su correo debe estar en la lista antes de que intente crear su cuenta.',
            },
            {
              label: 'El socio se registra',
              detail: 'Completa sus propios datos personales, médicos y de contacto de emergencia.',
            },
            {
              label: 'Asignas rol si corresponde',
              sublabel: 'Custodio, coordinador, admin',
              detail: 'Si no le asignas ningún rol especial, queda como socio regular — el valor por defecto.',
            },
            {
              label: 'Renuevas su membresía',
              sublabel: 'Cuando corresponda',
              detail: 'Se renueva hasta el 31 de marzo del año siguiente, no por un año exacto desde hoy.',
            },
          ]}
        />
        <p>
          Desde <Link href="/admin/people" className="text-blue-600 hover:underline">Admin → Gestión de Personas</Link> puedes:
        </p>
        <ul>
          <li><strong>Autorizar un nuevo correo</strong> — antes de que alguien se registre, su correo debe estar en esta lista.</li>
          <li><strong>Cambiar el rol</strong> de un socio (member, custodio, coordinador, admin).</li>
          <li><strong>Renovar la membresía</strong> — el botón Renovar hasta marzo extiende la vigencia hasta el 31 de marzo del año siguiente (no es +1 año).</li>
          <li><strong>Asignar el custodio</strong> de cada pool de equipo.</li>
        </ul>
      </ManualSection>

      <ManualSection title="Catálogos y diccionarios">
        <p>
          El resto del panel de Admin administra los listados que alimentan los formularios y catálogos de
          toda la app — nada de esto está escrito a mano en el código, todo vive en la base de datos:
        </p>
        <ul>
          <li><strong>Actividades</strong> — tipos de actividad disponibles en los avisos.</li>
          <li><strong>Equipamiento</strong> — categorías e ítems de equipo personal recomendado.</li>
          <li><strong>Checklists</strong> — listas de equipo sugeridas por tipo de ruta (estilo Wikiexplora).</li>
          <li><strong>Autocompletado</strong> — sugerencias que aparecen al escribir en distintos campos de los formularios.</li>
          <li><strong>Cursos</strong> — el catálogo de talleres (nombre, rama, nivel, prerequisitos, ficha curricular).</li>
        </ul>
      </ManualSection>

      <ManualSection title="Préstamos de equipo">
        <p>
          No existe un panel de administración separado para el Equipo Club — como admin, usas las mismas
          herramientas que un custodio (catálogo, solicitudes, etc.) desde el panel de
          <Link href="/custodio" className="text-blue-600 hover:underline"> Custodio</Link>. Revisa el
          <Link href="/ayuda/custodio" className="text-blue-600 hover:underline"> Manual del Custodio</Link> para el detalle de ese flujo.
        </p>
      </ManualSection>

      <Tip>
        Como admin, también tienes acceso a los paneles de <Link href="/ayuda/coordinador" className="underline">Coordinador</Link> y <Link href="/ayuda/custodio" className="underline">Custodio</Link> aunque no tengas esos roles asignados — admin siempre pasa cualquier verificación de rol más específica.
      </Tip>
    </ManualLayout>
  );
}
