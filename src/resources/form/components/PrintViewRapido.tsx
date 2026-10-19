'use client';
import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import type { RapidoFormData } from '@/app/aviso/rapido/page';

interface PrintViewRapidoProps {
  formData: RapidoFormData;
  onClose: () => void;
}

/**
 * Lean counterpart to PrintView.tsx for the 'rapido' flow — same mechanism
 * (clone the preview DOM, open a blank window, inject print CSS, trigger the
 * browser's print dialog), but with content scoped to rapido's flat, much
 * smaller data shape. Deliberately not merged into PrintView.tsx: that
 * component is tightly coupled to the full largo FormState (itinerario,
 * equipo, transporte, cuerpos de rescate, weather images — none of which
 * rapido collects), and forcing one component to branch on both shapes would
 * make an already-1200+ line file harder to follow, not easier.
 */
export default function PrintViewRapido({ formData, onClose }: PrintViewRapidoProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const participantes = formData.participantes.length > 0
    ? formData.participantes
    : [{ nombre: '', rut: '', telefono: '', email: '', vestimenta: '' }];
  const vehiculos = formData.vehiculos;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const formatDateTime = (value: string) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const finalPrintContent = printRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Aviso Rápido - ${formData.cerro || 'Montaña'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #000; background: white; }
            .print-content { padding: 15mm; max-width: none; width: 100%; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
            .logo img { height: 64px; width: auto; }
            .title { flex-grow: 1; text-align: center; padding: 0 20px; }
            .title h1 { font-size: 18px; font-weight: bold; margin: 0; }
            .contact-box { width: 55mm; border: 1px solid #000; padding: 4px; font-size: 6px; }
            .contact-item { margin-bottom: 4px; font-size: 13px; }
            .section { margin-bottom: 15px; }
            .section h2 { font-size: 14px; font-weight: bold; margin: 0 0 8px 0; }
            .activity-details { font-size: 14px; }
            .detail-row { display: flex; margin-bottom: 3px; }
            .label { width: 55mm; font-weight: normal; }
            .value { flex-grow: 1; }
            .data-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 10px; }
            .data-table th, .data-table td { border: 1px solid #000; padding: 2px; text-align: left; vertical-align: top; }
            .data-table th { background-color: #f0f0f0; font-weight: bold; }
            .empty-section { padding: 10px; background-color: #f9f9f9; border: 1px dashed #ccc; text-align: center; margin-bottom: 10px; }
            .footer { margin-top: 20px; font-size: 12px; }
            @page { margin: 15mm; size: A4; }
            @media print {
              .print-content { padding: 0; }
              .empty-section { background-color: transparent; border: 1px dashed #999; }
            }
          </style>
        </head>
        <body>
          <div class="print-content">${finalPrintContent}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-auto">
      <div className="no-print fixed top-6 right-6 z-10">
        <div className="flex flex-col gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-all duration-200 font-medium text-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Descargar documento
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-lg transition-all duration-200 font-medium text-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cerrar Vista
          </button>
        </div>
      </div>

      <div className="print-container">
        <div ref={printRef} className="print-content">
          <div className="header">
            <div className="logo">
              <Image src="/Logo.png" alt="CAU Logo" width={1151} height={520} className="h-16 w-auto" />
            </div>
            <div className="title">
              <h1>AVISO RÁPIDO DE SALIDA</h1>
            </div>
            <div className="contact-box">
              <div className="contact-item">
                <strong>Contacto CAU:</strong><br />
                {formData.contactoCau || ''}
              </div>
              <div className="contact-item">
                <strong>Plazo máximo de regreso:</strong><br />
                {formatDateTime(formData.fechaMaxRegreso)}
              </div>
              <div className="contact-item">
                <strong>Generación:</strong><br />
                {formatDateTime(new Date().toISOString())}
              </div>
            </div>
          </div>

          <div className="section">
            <h2>DETALLES DE LA ACTIVIDAD</h2>
            <div className="activity-details">
              <div className="detail-row">
                <span className="label">Tipo de actividad:</span>
                <span className="value">{formData.categoria || ''}</span>
              </div>
              <div className="detail-row">
                <span className="label">Cerro / Sector:</span>
                <span className="value">{formData.cerro || ''}</span>
              </div>
              <div className="detail-row">
                <span className="label">Ruta:</span>
                <span className="value">{formData.ruta || ''}</span>
              </div>
              <div className="detail-row">
                <span className="label">Fecha y hora de inicio:</span>
                <span className="value">{formatDateTime(formData.fechaInicio)}</span>
              </div>
              {formData.comentarios && (
                <div className="detail-row">
                  <span className="label">Comentarios:</span>
                  <span className="value">{formData.comentarios}</span>
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <h2>PARTICIPANTES</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>RUT</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Vestimenta</th>
                </tr>
              </thead>
              <tbody>
                {participantes.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.nombre || ''}</td>
                    <td>{p.rut || ''}</td>
                    <td>{p.telefono || ''}</td>
                    <td>{p.email || ''}</td>
                    <td>{p.vestimenta || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section">
            <h2>TRANSPORTE</h2>
            {vehiculos.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Patente</th>
                    <th>Color</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculos.map((v, idx) => (
                    <tr key={idx}>
                      <td>{v.marca || ''}</td>
                      <td>{v.modelo || ''}</td>
                      <td>{v.patente || ''}</td>
                      <td>{v.color || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-section">Sin vehículos registrados</div>
            )}
            <div className="activity-details" style={{ marginTop: 8 }}>
              {formData.lugarEstacionamiento && (
                <div className="detail-row">
                  <span className="label">Lugar de estacionamiento:</span>
                  <span className="value">{formData.lugarEstacionamiento}</span>
                </div>
              )}
              {formData.otroTransporte && (
                <div className="detail-row">
                  <span className="label">Otro transporte:</span>
                  <span className="value">{formData.otroTransporte}</span>
                </div>
              )}
            </div>
          </div>

          <div className="footer">
            <p>Club Andino Universitario — Aviso de Salida Rápido</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .print-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          min-height: 100vh;
        }
        .print-content { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #000; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .title { flex-grow: 1; text-align: center; padding: 0 20px; }
        .title h1 { font-size: 18px; font-weight: bold; margin: 0; }
        .contact-box { width: 220px; border: 1px solid #000; padding: 8px; }
        .contact-item { margin-bottom: 8px; font-size: 13px; }
        .section { margin-bottom: 20px; }
        .section h2 { font-size: 14px; font-weight: bold; margin: 0 0 10px 0; }
        .activity-details { font-size: 14px; }
        .detail-row { display: flex; margin-bottom: 5px; }
        .label { width: 220px; font-weight: normal; flex-shrink: 0; }
        .value { flex-grow: 1; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 10px; }
        .data-table th, .data-table td { border: 1px solid #000; padding: 6px; text-align: left; vertical-align: top; }
        .data-table th { background-color: #f0f0f0; font-weight: bold; }
        .empty-section { padding: 10px; background-color: #f9f9f9; border: 1px dashed #ccc; text-align: center; margin-bottom: 10px; }
        .footer { margin-top: 30px; font-size: 12px; }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
