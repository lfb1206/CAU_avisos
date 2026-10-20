import React from 'react';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import ManualLayout, { ManualSection, Tip, Warning } from '@/resources/ayuda/ManualLayout';
import StepFlowDiagram from '@/resources/ayuda/StepFlowDiagram';

export default async function ManualSocioPage() {
  await requireAuth();

  return (
    <ManualLayout
      title="Manual del Socio"
      subtitle="Avisos de salida, cursos, préstamos de equipo y tu perfil."
    >
      <ManualSection title="Tu cuenta y membresía">
        <p>
          Para registrarte, tu correo debe haber sido autorizado previamente por un administrador.
          Si tu correo no aparece como válido al registrarte, pide a un administrador que lo agregue
          en <strong>Admin → Gestión de Personas</strong>.
        </p>
        <p>
          Tu <strong>membresía</strong> tiene una fecha de vencimiento. Mientras esté vigente, puedes
          postular a cursos y solicitar equipo del Equipo Club. Si está vencida, un administrador debe
          renovarla — se renueva hasta el 31 de marzo del año siguiente.
        </p>
      </ManualSection>

      <ManualSection title="Avisos de Salida: ¿Largo o Rápido?">
        <p>
          Un aviso de salida avisa al club quién va, a dónde, y hasta cuándo debería estar de vuelta —
          así, si no reportas tu regreso, el club puede iniciar un protocolo de rescate.
        </p>
        <StepFlowDiagram
          steps={[
            {
              label: 'Completa el aviso',
              sublabel: 'Largo o Rápido',
              detail: 'Usa Aviso Largo para salidas de varios días (itinerario, equipo, riesgos) y Aviso Rápido para salidas de un día.',
            },
            {
              label: 'Envíalo',
              sublabel: 'Queda registrado',
              detail: 'Una vez enviado, el aviso no se puede editar — la única acción posible después es notificar el regreso.',
            },
            { label: 'Sal a tu actividad' },
            {
              label: 'Notifica tu regreso',
              sublabel: 'Evita la alerta automática',
              detail: 'Si no lo haces antes de la hora de regreso declarada, se envía automáticamente un correo de alerta al contacto CAU y a los destinatarios adicionales.',
            },
          ]}
        />
        <ul>
          <li>
            <strong>Aviso Largo</strong> (<Link href="/aviso/largo" className="text-blue-600 hover:underline">/aviso/largo</Link>):
            para salidas de varios días o expediciones. Incluye itinerario día por día, equipo y transporte,
            supuestos de riesgo, cuerpos de rescate, y seguimiento InReach si lo llevas.
          </li>
          <li>
            <strong>Aviso Rápido</strong> (<Link href="/aviso/rapido" className="text-blue-600 hover:underline">/aviso/rapido</Link>):
            para salidas de un día, sin pernocte. Solo pide lo esencial: actividad, participantes y transporte.
          </li>
        </ul>
        <Tip>
          En Aviso Largo puedes avanzar y retroceder libremente entre los pasos sin completarlos todos de
          inmediato — un aviso pequeño en el círculo del paso te recuerda qué falta. Solo al enviar (paso final)
          se exige que todo esté completo.
        </Tip>
      </ManualSection>

      <ManualSection title="Llenar y enviar tu aviso">
        <ul>
          <li>Tu aviso se guarda automáticamente mientras lo completas (borrador local), y puedes guardarlo también en el servidor con el botón Guardar borrador.</li>
          <li>
            Puedes agregar <strong>destinatarios adicionales</strong> — correos extra que reciben una copia
            de la confirmación cuando envías el aviso, además del contacto CAU.
          </li>
          <li>
            Antes de salir, usa el botón <strong>Previsualizar aviso para descargar</strong> para ver el documento
            final y descargarlo (se abre el diálogo de impresión de tu navegador — ahí puedes elegir
            Guardar como PDF).
          </li>
        </ul>
      </ManualSection>

      <ManualSection title="Notificar tu regreso — muy importante">
        <Warning>
          Cuando vuelvas de tu salida, entra a tu aviso y presiona el botón <strong>Notificar Regreso</strong>.
          Si no lo haces antes de la hora de regreso declarada, el sistema envía automáticamente un correo
          de alerta a los mismos destinatarios del aviso (el contacto CAU y los destinatarios adicionales),
          avisando que no se notificó el regreso a tiempo.
        </Warning>
        <p>
          Un aviso ya enviado no se puede editar — la única acción posible es notificar el regreso.
        </p>
      </ManualSection>

      <ManualSection title="Biblioteca de Avisos">
        <p>
          En <Link href="/avisos" className="text-blue-600 hover:underline">Biblioteca</Link> puedes ver
          los avisos enviados por otros socios (incluyendo los ya regresados) y usarlos como plantilla para
          crear el tuyo, en vez de partir desde cero.
        </p>
      </ManualSection>

      <ManualSection title="Cursos y Talleres">
        <StepFlowDiagram
          steps={[
            {
              label: 'Revisa el catálogo',
              sublabel: 'Por rama y nivel',
              detail: 'Organizado por rama (base, nieve/hielo, roca) y nivel de dificultad.',
            },
            {
              label: 'Postula a una edición',
              sublabel: 'Si cumples requisitos',
              detail: 'Necesitas membresía vigente, cumplir los prerequisitos del taller, y los puntos mínimos si la edición los pide.',
            },
            {
              label: 'El coordinador revisa',
              sublabel: 'Acepta, rechaza o lista de espera',
              detail: 'Los postulantes se ordenan por puntos activos. Un rechazo no es definitivo — puedes volver a postular más adelante.',
            },
            {
              label: 'Curso confirmado',
              sublabel: 'Asiste y complétalo',
              detail: 'Al completarlo queda en tu historial, y puedes postular como ayudante en una futura edición.',
            },
          ]}
        />
        <ul>
          <li>
            Revisa el catálogo en <Link href="/cursos" className="text-blue-600 hover:underline">Cursos</Link>,
            organizado por rama (base, nieve/hielo, roca) y nivel.
          </li>
          <li>
            Algunos talleres tienen <strong>prerequisitos</strong> — necesitas haber completado otro taller
            antes de poder postular. Los talleres de la rama base cuentan como completados automáticamente
            para todos, así que nunca bloquean un prerequisito.
          </li>
          <li>
            Algunas ediciones piden un mínimo de <strong>puntos activos</strong> para postular. Ganas puntos
            siendo ayudante en un taller (otorgados por el coordinador) o si un coordinador te los otorga
            directamente. Cada punto vence al año de otorgado.
          </li>
          <li>
            Si ya completaste un taller, puedes postular como <strong>ayudante</strong> en una futura edición
            de ese mismo taller (o de cualquier taller base) para ayudar a enseñarlo.
          </li>
        </ul>
      </ManualSection>

      <ManualSection title="Préstamos de Equipo — Equipo Club">
        <StepFlowDiagram
          steps={[
            {
              label: 'Agrega ítems',
              sublabel: 'Al carro, por categoría',
              detail: 'Revisa las instrucciones de uso de cada ítem antes de agregarlo — algunos tienen restricciones (ej. solo para escalada en hielo).',
            },
            {
              label: 'Completa el Resumen',
              sublabel: 'Fechas y aviso vinculado',
              detail: 'Indica fecha de retiro y devolución (máximo 14 días entre ambas) y, si quieres, el aviso de salida al que se vincula.',
            },
            {
              label: 'Envía la solicitud',
              sublabel: 'El custodio la revisa',
              detail: 'Necesitas membresía vigente para poder enviarla. El custodio la aprueba o rechaza.',
            },
            {
              label: 'Retira el equipo',
              detail: 'Coordina el retiro con el custodio una vez que la solicitud está aprobada.',
            },
            {
              label: 'Devuelve con foto',
              sublabel: 'Antes de entregarlo de vuelta',
              detail: 'Sube una foto del estado del equipo desde tu propia solicitud antes de devolverlo — el custodio no puede confirmar la devolución sin ella.',
            },
          ]}
        />
        <ol>
          <li>Entra a <Link href="/prestamos" className="text-blue-600 hover:underline">Préstamos</Link> y navega el catálogo por categoría.</li>
          <li>Agrega los ítems que necesitas al carro con los botones + / −. Si un ítem tiene instrucciones de uso (por ejemplo, solo para escalada en hielo), las verás ahí mismo.</li>
          <li>Presiona el botón <strong>Resumen</strong> (arriba, junto al título) para indicar fecha de retiro, fecha de devolución, y opcionalmente el aviso de salida al que se vincula este préstamo.</li>
          <li>Envía la solicitud — el custodio la revisará y la aprobará o rechazará.</li>
        </ol>
        <Tip>
          El préstamo máximo son 14 días entre retiro y devolución, y necesitas membresía vigente para
          solicitar equipo.
        </Tip>
        <p>
          Una vez que el custodio marca tu préstamo como <strong>entregado</strong>, antes de devolver el
          equipo debes subir una foto de su estado desde tu propia solicitud — el custodio no puede confirmar
          la devolución hasta que la subas.
        </p>
      </ManualSection>

      <ManualSection title="Tu perfil">
        <p>
          En <Link href="/perfil" className="text-blue-600 hover:underline">Mi perfil</Link> mantén
          actualizados tus datos de contacto, información médica (grupo sanguíneo, alergias, medicamentos,
          condiciones) y contacto de emergencia — esta información se usa en tus avisos y postulaciones a
          cursos. Nadie más puede editarla por ti.
        </p>
      </ManualSection>
    </ManualLayout>
  );
}
