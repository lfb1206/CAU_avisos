'use client';
import React, { useState } from 'react';
import { useFormContext } from '../../contexts/FormContext';
import PrintView from '../components/PrintView';

export default function Step7FinalReview() {
  const { formData, checkFormCompletion } = useFormContext();
  const [showPrintView, setShowPrintView] = useState(false);

  // Ensure all arrays are properly initialized
  const participantes = Array.isArray(formData.participantes) ? formData.participantes : [];
  const itinerario = Array.isArray(formData.itinerario) ? formData.itinerario : [];
  const riesgos = Array.isArray(formData.riesgos) ? formData.riesgos : [];
  const equipo = Array.isArray(formData.equipo) ? formData.equipo : [];
  const transporte = Array.isArray(formData.transporte) ? formData.transporte : [];

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'No especificada';
    return new Date(dateTimeString).toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEquipmentSummary = () => {
    const categories = {};
    equipo.forEach(item => {
      if (item.categoria && item.item) {
        if (!categories[item.categoria]) {
          categories[item.categoria] = [];
        }
        categories[item.categoria].push(`${item.item} (${item.cantidad || 1})`);
      }
    });
    return categories;
  };

  const getTransportSummary = () => {
    return transporte.map(t => ({
      tipo: t.tipo,
      conductor: t.conductor,
      vehiculo: `${t.marca} ${t.modelo} ${t.color}`.trim(),
      patente: t.patente,
      distancia: t.distancia
    }));
  };

  const getMedicalSummary = () => {
    return participantes.filter(p => 
      p.grupoSanguineo || p.alergias || p.enfermedades || p.medicamentos || p.condicionesEspeciales
    );
  };

  if (showPrintView) {
    return (
      <PrintView 
        formData={formData} 
        onClose={() => setShowPrintView(false)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Revisión Final y Generación del Aviso
        </h2>
        <p className="text-gray-600">
          Revise toda la información antes de generar el aviso de salida para imprimir
        </p>
      </div>

      {/* Data Summary */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Resumen de la Información
        </h3>

        {/* Basic Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-md font-semibold text-blue-900 mb-3">
            Información Básica
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Contacto CAU:</strong> {formData.basicInfo.contactoCAU || 'No especificado'}</div>
            <div><strong>Actividad:</strong> {formData.basicInfo.actividad || 'No especificada'}</div>
            <div><strong>Cerro/Sector:</strong> {formData.basicInfo.cerroOSector || 'No especificado'}</div>
            <div><strong>Fecha de regreso:</strong> {formatDateTime(formData.basicInfo.fechaHoraReporteRegreso)}</div>
            <div><strong>Ruta:</strong> {formData.basicInfo.ruta || 'No especificada'}</div>
            <div><strong>Teléfono:</strong> {formData.basicInfo.telefonoContacto || 'No especificado'}</div>
            <div><strong>Email:</strong> {formData.basicInfo.emailContacto || 'No especificado'}</div>
            <div><strong>Imágenes del clima:</strong> {formData.basicInfo.weatherImages?.length || 0} imágenes</div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-md font-semibold text-green-900 mb-3">
            Participantes ({participantes.length})
          </h4>
          <div className="space-y-2">
            {participantes.map((participant, index) => (
              <div key={index} className="text-sm">
                <strong>{participant.nombre}</strong> - {participant.rut}
                <div className="text-xs text-gray-600 ml-2">
                  Tel: {participant.telefono} | Emergencia: {participant.contactoEmergencia} ({participant.telefonoEmergencia})
                </div>
                {(participant.grupoSanguineo || participant.alergias || participant.enfermedades || participant.medicamentos || participant.condicionesEspeciales) && (
                  <div className="text-xs text-blue-600 ml-2">
                    {participant.grupoSanguineo && `Grupo: ${participant.grupoSanguineo} | `}
                    {participant.alergias && `Alergias: ${participant.alergias} | `}
                    {participant.enfermedades && `Condiciones: ${participant.enfermedades}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        {itinerario.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-yellow-900 mb-3">
              Itinerario ({itinerario.length} tramos)
            </h4>
            <div className="space-y-2">
              {itinerario.map((day, index) => (
                <div key={index} className="text-sm">
                  <strong>{day.tramo}</strong> - {day.actividad}
                  {day.horaInicio && day.horaFin && ` (${day.horaInicio} - ${day.horaFin})`}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Management */}
        {riesgos.length > 0 && (
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-red-900 mb-3">
              Gestión de Riesgos ({riesgos.length} riesgos)
            </h4>
            <div className="space-y-2">
              {riesgos.map((risk, index) => (
                <div key={index} className="text-sm">
                  <strong>{risk.supuesto}</strong> - {risk.riesgo} ({risk.peligro})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment */}
        {equipo.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-purple-900 mb-3">
              Equipo ({equipo.length} items)
            </h4>
            <div className="space-y-2">
              {Object.entries(getEquipmentSummary()).map(([category, items]) => (
                <div key={category} className="text-sm">
                  <strong>{category}:</strong> {items.join(', ')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transport */}
        {transporte.length > 0 && (
          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-indigo-900 mb-3">
              Transporte ({transporte.length} vehículos)
            </h4>
            <div className="space-y-2">
              {getTransportSummary().map((transport, index) => (
                <div key={index} className="text-sm">
                  <strong>{transport.tipo}</strong> - {transport.conductor} - {transport.vehiculo}
                  {transport.patente && ` (${transport.patente})`}
                  {transport.distancia && ` - ${transport.distancia} km`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Validation Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-md font-semibold text-gray-900 mb-3">
          Estado de Validación
        </h4>
        <div className="space-y-2">
          {checkFormCompletion() ? (
            <div className="text-green-600 font-medium">
              ✅ Todos los campos requeridos están completos
            </div>
          ) : (
            <div className="text-red-600 font-medium">
              ⚠️ Algunos campos requeridos están incompletos
            </div>
          )}
        </div>
      </div>

      {/* Generate Print View Button */}
      <div className="text-center">
        <button
          onClick={() => setShowPrintView(true)}
          disabled={!checkFormCompletion()}
          className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          🖨️ Ver Aviso para Imprimir
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Instrucciones para este paso:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Revise toda la información antes de generar el aviso</li>
          <li>• Verifique que todos los campos requeridos estén completos</li>
          <li>• Los datos médicos se muestran integrados con cada participante</li>
          <li>• Al hacer clic en "Ver Aviso para Imprimir", se abrirá una vista optimizada para impresión</li>
          <li>• Desde la vista de impresión podrá imprimir directamente usando Ctrl+P</li>
          <li>• El formato de impresión coincide exactamente con el formato oficial</li>
        </ul>
      </div>
    </div>
  );
} 