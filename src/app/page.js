'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DynamicForm from '@/resources/form/DynamicForm';
import { generateAvisoSalidaPDF } from '@/resources/lib/pdfUtils';
import docFields from '@/resources/constants/docFields';

export default function Home() {
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      // Format the datetime for the PDF
      const formattedValues = {
        ...values,
        fechaHoraReporteRegreso: values.fechaHoraReporteRegreso 
          ? new Date(values.fechaHoraReporteRegreso).toLocaleString('es-CL', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          : ''
      };
      
      await generateAvisoSalidaPDF(formattedValues);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Aviso de Actividad de Montaña
          </h1>
          <p className="text-gray-600">
            Complete el formulario para generar el aviso de salida oficial del CAU
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <DynamicForm
            fields={docFields}
            onSubmit={handleSubmit}
            submitLabel="Generar PDF"
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Instrucciones
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Complete todos los campos requeridos marcados con *</li>
            <li>• Para agregar participantes, haga clic en "Agregar participantes"</li>
            <li>• Para agregar días al itinerario, haga clic en "Agregar itinerario"</li>
            <li>• Para agregar riesgos, haga clic en "Agregar gestión de riesgos"</li>
            <li>• Para agregar datos médicos, haga clic en "Agregar datos médicos"</li>
            <li>• El PDF se descargará automáticamente al completar el formulario</li>
          </ul>
        </div>
      </div>
    </div>
  );
}