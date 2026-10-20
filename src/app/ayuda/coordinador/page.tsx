import React from 'react';
import Link from 'next/link';
import { requireCoordinador } from '@/lib/auth';
import ManualLayout, { ManualSection, Tip } from '@/resources/ayuda/ManualLayout';
import StepFlowDiagram from '@/resources/ayuda/StepFlowDiagram';

export default async function ManualCoordinadorPage() {
  await requireCoordinador();

  return (
    <ManualLayout
      title="Manual del Coordinador"
      subtitle="Ediciones de talleres, postulaciones, ayudantes y puntos."
    >
      <ManualSection title="El panel de coordinador">
        <p>
          En <Link href="/coordinador" className="text-blue-600 hover:underline">Coordinador</Link> tienes
          cinco pestañas: <strong>Ediciones</strong>, <strong>Postulaciones</strong>,
          <strong> Resultados</strong>, <strong>Ayudantes</strong> y <strong>Puntos</strong>.
        </p>
      </ManualSection>

      <ManualSection title="Ediciones de talleres">
        <p>
          Una edición es una instancia concreta de un taller — con sus propias fechas, cupos, precio y
          ventana de inscripción. Desde esta pestaña puedes crear una nueva edición de un taller del
          catálogo, y abrir o cerrar sus inscripciones cuando corresponda. Si una edición pide un mínimo de
          puntos activos para postular, también se configura aquí.
        </p>
      </ManualSection>

      <ManualSection title="Revisar postulaciones">
        <StepFlowDiagram
          steps={[
            {
              label: 'Socio postula',
              sublabel: 'A una edición abierta',
              detail: 'Solo puede postular si tiene membresía vigente y cumple los prerequisitos del taller.',
            },
            {
              label: 'Revisas en Postulaciones',
              sublabel: 'Ordenados por puntos activos',
              detail: 'Ves su información médica, contacto de emergencia, e historial de talleres completados.',
            },
            {
              label: 'Aceptas, rechazas o lista de espera',
              detail: 'Un rechazo no es definitivo — el socio puede volver a postular más adelante a la misma edición.',
            },
            {
              label: 'Registras el resultado',
              sublabel: 'Completado, reprobado, etc.',
              detail: 'Al finalizar la edición, actualiza el estado de cada inscrito desde Resultados.',
            },
          ]}
        />
        <p>
          Cada postulante aparece ordenado por sus <strong>puntos activos</strong> (los que no han vencido),
          con su información médica y de contacto de emergencia a la vista, y su historial de talleres
          completados — toda la información que necesitas para decidir. Puedes aceptar, rechazar, o poner en
          lista de espera.
        </p>
        <Tip>
          Un postulante rechazado o retirado puede volver a postular más adelante a la misma edición —
          no queda bloqueado para siempre.
        </Tip>
      </ManualSection>

      <ManualSection title="Ayudantes">
        <p>
          Los socios que ya completaron un taller pueden ofrecerse como ayudantes en una futura edición del
          mismo taller (o de cualquier taller de la rama base, que cuenta como completado para todos). En
          esta pestaña marcas si fueron <strong>seleccionados</strong> y si <strong>asistieron</strong>, y
          puedes otorgarles un punto por su participación.
        </p>
      </ManualSection>

      <ManualSection title="Puntos">
        <p>
          Además de los puntos automáticos por ser ayudante, puedes otorgar puntos manualmente a cualquier
          socio por cualquier motivo, desde esta pestaña. Todo punto vence al año de otorgado — los puntos
          activos son la suma de los que aún no han vencido.
        </p>
        <p>
          Al entrar al detalle de un socio (desde la lista de postulantes o desde esta pestaña) ves su
          ficha completa: puntos activos, información médica, historial de talleres y de ayudantías, y sus
          avisos recientes.
        </p>
      </ManualSection>

      <ManualSection title="Agregar un curso histórico (socios que ya lo completaron antes)">
        <p>
          Si un socio completó un taller <strong>antes de que existiera esta plataforma</strong>, puedes
          dejarlo registrado sin que tenga que postular de nuevo: desde el detalle del socio, en la sección
          Historial de talleres, usa el botón <strong>+ Agregar histórico</strong>. Elige el taller y,
          opcionalmente, la fecha en que lo completó (si no la indicas, se usa la fecha de hoy). Esto cuenta
          igual que una inscripción real para prerequisitos y elegibilidad de ayudante.
        </p>
      </ManualSection>

      <Tip>
        También eres socio: todo lo del <Link href="/ayuda/socio" className="underline">Manual del Socio</Link> aplica para tus propios avisos, cursos y préstamos.
      </Tip>
    </ManualLayout>
  );
}
