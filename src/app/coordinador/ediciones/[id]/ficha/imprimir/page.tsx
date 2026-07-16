'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Taller = {
  name: string; branch: string; description: string;
  objetivo: string | null; contenidos: string | null; habilidades: string | null;
  equipo_personal: string | null; equipo_recomendado: string | null; equipo_cau: string | null;
  evaluacion_metodo: string | null; lugar_tipico: string | null; condiciones_lugar: string | null;
  requisitos_personales: string | null; observaciones: string | null;
  rutas_posibles: string | null; bibliografia: string | null; prueba_convalidacion: string | null;
  horas_clases: number | null; horas_practica: number | null; horas_evaluacion: number | null;
  dias_terreno: number | null; dias_traslado: number | null;
};

type Edicion = {
  name: string; start_date: string | null; end_date: string | null;
  capacity: number; max_ayudantes: number;
  price: string | null; price_student: string | null;
  required_points: number; profesor: string | null;
  fecha_clases: string | null; fecha_salida: string | null;
  taller: Taller;
  inscripciones: { profile: { name: string; email: string; phone: string | null } }[];
  ayudantias: { profile: { name: string; email: string } }[];
};

function fmtDate(s: string | null) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtCLP(v: string | null) {
  if (!v) return '—';
  return `$${Number(v).toLocaleString('es-CL')}`;
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="mb-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">{value}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 break-inside-avoid">
      <div className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 border-b-2 border-blue-200 dark:border-blue-700 pb-1 mb-3">{title}</div>
      {children}
    </div>
  );
}

export default function FichaImprimirPage() {
  const { id } = useParams<{ id: string }>();
  const [edicion, setEdicion] = useState<Edicion | null>(null);

  useEffect(() => {
    fetch(`/api/coordinador/ediciones/${id}/ficha`)
      .then((r) => r.json())
      .then((data: Edicion) => {
        setEdicion(data);
        // Auto-print once content is loaded
        setTimeout(() => window.print(), 600);
      });
  }, [id]);

  if (!edicion) {
    return <div className="p-8 text-gray-400 dark:text-gray-500">Cargando ficha...</div>;
  }

  const taller = edicion.taller;
  const horasTotal = (taller.horas_clases ?? 0) + (taller.horas_practica ?? 0) + (taller.horas_evaluacion ?? 0);
  const diasTotal = (taller.dias_terreno ?? 0) + (taller.dias_traslado ?? 0);

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 15mm 15mm 15mm 15mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: white; }
      `}</style>

      {/* Print button — hidden in print */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-700"
        >
          Imprimir / Guardar PDF
        </button>
      </div>

      <div className="max-w-[210mm] mx-auto p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-gray-800 dark:border-gray-600">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">Club Andino Universitario — Ficha de Edición</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{taller.name}</h1>
            <div className="text-base text-gray-600 dark:text-gray-400 mt-0.5">{edicion.name}</div>
          </div>
          <div className="text-right text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
            <div><strong>Inicio:</strong> {fmtDate(edicion.start_date)}</div>
            <div><strong>Término:</strong> {fmtDate(edicion.end_date)}</div>
            <div><strong>Profesor:</strong> {edicion.profesor || '—'}</div>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-5 gap-3 mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          {[
            { label: 'Hrs. clases', val: taller.horas_clases ?? '—' },
            { label: 'Hrs. práctica', val: taller.horas_practica ?? '—' },
            { label: 'Hrs. total', val: horasTotal || '—' },
            { label: 'Días terreno', val: taller.dias_terreno ?? '—' },
            { label: 'Días total', val: diasTotal || '—' },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{item.val}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left column */}
          <div>
            <Block title="Objetivo">
              <Row label="" value={taller.objetivo} />
            </Block>

            <Block title="Contenidos">
              <Row label="" value={taller.contenidos} />
            </Block>

            <Block title="Habilidades">
              <Row label="" value={taller.habilidades} />
            </Block>

            <Block title="Equipamiento">
              <Row label="Personal (obligatorio)" value={taller.equipo_personal} />
              <Row label="Recomendado" value={taller.equipo_recomendado} />
              <Row label="Equipamiento CAU" value={taller.equipo_cau} />
            </Block>
          </div>

          {/* Right column */}
          <div>
            <Block title="Esta edición">
              <Row label="Clases teóricas" value={edicion.fecha_clases} />
              <Row label="Salida práctica" value={edicion.fecha_salida} />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Row label="Precio socio" value={fmtCLP(edicion.price)} />
                <Row label="Precio estudiante" value={fmtCLP(edicion.price_student)} />
                <Row label="Cupos" value={String(edicion.capacity)} />
                <Row label="Puntos requeridos" value={edicion.required_points ? String(edicion.required_points) : '—'} />
              </div>
            </Block>

            <Block title="Logística">
              <Row label="Lugar típico" value={taller.lugar_tipico} />
              <Row label="Condiciones del lugar" value={taller.condiciones_lugar} />
              <Row label="Requisitos personales" value={taller.requisitos_personales} />
            </Block>

            <Block title="Evaluación">
              <Row label="Método" value={taller.evaluacion_metodo} />
              <Row label="Prueba de convalidación" value={taller.prueba_convalidacion} />
            </Block>

            <Block title="Rutas posibles">
              <Row label="" value={taller.rutas_posibles} />
            </Block>

            <Block title="Bibliografía">
              <Row label="" value={taller.bibliografia} />
            </Block>

            {taller.observaciones && (
              <Block title="Observaciones">
                <Row label="" value={taller.observaciones} />
              </Block>
            )}
          </div>
        </div>

        {/* Participants table */}
        {edicion.inscripciones.length > 0 && (
          <div className="mt-6 break-before-page">
            <Block title={`Participantes (${edicion.inscripciones.length})`}>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="text-left p-2 border border-gray-200 dark:border-gray-600 font-semibold">#</th>
                    <th className="text-left p-2 border border-gray-200 dark:border-gray-600 font-semibold">Nombre</th>
                    <th className="text-left p-2 border border-gray-200 dark:border-gray-600 font-semibold">Correo</th>
                    <th className="text-left p-2 border border-gray-200 dark:border-gray-600 font-semibold">Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {edicion.inscripciones.map((i, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="p-2 border border-gray-200 dark:border-gray-600">{idx + 1}</td>
                      <td className="p-2 border border-gray-200 dark:border-gray-600 font-medium">{i.profile.name}</td>
                      <td className="p-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400">{i.profile.email}</td>
                      <td className="p-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400">{i.profile.phone || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Block>
          </div>
        )}
      </div>
    </>
  );
}
