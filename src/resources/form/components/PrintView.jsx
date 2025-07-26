'use client';
import React, { useRef, useEffect } from 'react';

export default function PrintView({ formData, onClose }) {
  const printRef = useRef();
  const participantes = Array.isArray(formData.participantes) ? formData.participantes : [];
  const itinerario = Array.isArray(formData.itinerario) ? formData.itinerario : [];
  const riesgos = Array.isArray(formData.riesgos) ? formData.riesgos : [];
  const equipo = Array.isArray(formData.equipo) ? formData.equipo : [];
  const transporte = Array.isArray(formData.transporte) ? formData.transporte : [];
  const weatherImages = formData.basicInfo.weatherImages || [];

  // Función para formatear valores (quitar guiones bajos, capitalizar)
  const formatValue = (value) => {
    if (!value) return '';
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Función para agrupar equipo por categoría con rowspan
  const getGroupedEquipmentWithRowspan = () => {
    const grouped = {};
    const checkedEquipment = equipo.filter(item => item.checked);
    
    checkedEquipment.forEach(item => {
      if (item.categoria && item.item) {
        if (!grouped[item.categoria]) {
          grouped[item.categoria] = [];
        }
        grouped[item.categoria].push({
          item: item.item,
          cantidad: item.cantidad || 1,
          observaciones: item.observaciones || ''
        });
      }
    });
    
    // Convertir a array plano con información de rowspan
    const result = [];
    Object.entries(grouped).forEach(([categoria, items]) => {
      items.forEach((item, index) => {
        result.push({
          categoria: index === 0 ? categoria : null,
          categoriaRowspan: index === 0 ? items.length : 0,
          ...item
        });
      });
    });
    
    return result;
  };

  // Función para agrupar itinerario por tramo con rowspan
  const getGroupedItineraryWithRowspan = () => {
    const grouped = {};
    
    itinerario.forEach(day => {
      if (day.tramo) {
        if (!grouped[day.tramo]) {
          grouped[day.tramo] = [];
        }
        grouped[day.tramo].push({
          fecha: day.fecha,
          actividad: day.actividad,
          dificultades: (day.dificultadesPrincipales || []).filter(d => d && d.trim()).join(', '),
          horaInicio: day.horaInicio,
          horaFin: day.horaFin
        });
      }
    });
    
    // Convertir a array plano con información de rowspan
    const result = [];
    Object.entries(grouped).forEach(([tramo, items]) => {
      items.forEach((item, index) => {
        result.push({
          tramo: index === 0 ? tramo : null,
          tramoRowspan: index === 0 ? items.length : 0,
          ...item
        });
      });
    });
    
    return result;
  };

  // Función para agrupar supuestos por tramo con rowspan
  const getGroupedAssumptionsWithRowspan = () => {
    const grouped = {};
    
    itinerario.forEach(day => {
      if (day.supuestos) {
        day.supuestos.forEach(assumption => {
          if (assumption.incluir) {
            const key = day.tramo;
            if (!grouped[key]) {
              grouped[key] = [];
            }
            grouped[key].push({
              supuesto: assumption.supuesto,
              tipo: assumption.tipoSupuesto,
              probabilidad: assumption.probabilidad,
              impacto: assumption.impacto,
              accion: assumption.accion
            });
          }
        });
      }
    });
    
    // Convertir a array plano con información de rowspan
    const result = [];
    Object.entries(grouped).forEach(([tramo, items]) => {
      items.forEach((item, index) => {
        result.push({
          tramo: index === 0 ? tramo : null,
          tramoRowspan: index === 0 ? items.length : 0,
          ...item
        });
      });
    });
    
    return result;
  };

  // Función para agrupar riesgos por supuesto con rowspan
  const getGroupedRisksWithRowspan = () => {
    const grouped = {};
    
    riesgos.forEach(risk => {
      const key = risk.supuesto;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push({
        riesgo: risk.riesgo,
        peligro: risk.peligro,
        lugar: risk.lugar,
        accionProbabilidad: risk.accionProbabilidad,
        accionExposicion: risk.accionExposicion,
        accionConsecuencias: risk.accionConsecuencias
      });
    });
    
    // Convertir a array plano con información de rowspan
    const result = [];
    Object.entries(grouped).forEach(([supuesto, items]) => {
      items.forEach((item, index) => {
        result.push({
          supuesto: index === 0 ? supuesto : null,
          supuestoRowspan: index === 0 ? items.length : 0,
          ...item
        });
      });
    });
    
    return result;
  };

  // En el componente PrintView, agrega un useEffect para cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handlePrint = () => {
    // Create a new window/iframe for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Aviso de Salida - ${formData.basicInfo.cerroOSector || 'Montaña'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 10px;
              line-height: 1.2;
              color: #000;
              background: white;
            }
            
            .print-content {
              padding: 15mm;
              max-width: none;
              width: 100%;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 20px;
            }
            
            .logo img {
              height: 64px;
              width: auto;
            }
            
            .title {
              flex-grow: 1;
              text-align: center;
              padding: 0 20px;
            }
            
            .title h1 {
              font-size: 14px;
              font-weight: bold;
              margin: 0;
            }
            
            .contact-box {
              width: 55mm;
              border: 1px solid #000;
              padding: 5px;
              font-size: 7px;
            }
            
            .contact-item {
              margin-bottom: 3px;
            }
            
            .section {
              margin-bottom: 15px;
            }
            
            .section h2 {
              font-size: 10px;
              font-weight: bold;
              margin: 0 0 8px 0;
            }
            
            .section h2.centered {
              text-align: center;
              font-size: 12px;
              margin-bottom: 15px;
            }
            
            .activity-details {
              font-size: 8px;
            }
            
            .detail-row {
              display: flex;
              margin-bottom: 3px;
            }
            
            .label {
              width: 45mm;
              font-weight: normal;
            }
            
            .value {
              flex-grow: 1;
            }
            
            .data-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 7px;
              margin-bottom: 10px;
            }
            
            .data-table th,
            .data-table td {
              border: 1px solid #000;
              padding: 2px;
              text-align: left;
              vertical-align: top;
            }
            
            .data-table th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            
            .medical-table {
              font-size: 6px;
            }
            
            .medical-table th,
            .medical-table td {
              padding: 1px;
            }
            
            .weather-images {
              margin-bottom: 10px;
            }
            
            .weather-image {
              margin-bottom: 10px;
              page-break-inside: avoid;
            }
            
            .weather-image img {
              max-width: 100%;
              max-height: 200px;
              object-fit: contain;
              border: 1px solid #ddd;
              display: block;
            }
            
            .empty-weather,
            .empty-section {
              padding: 10px;
              background-color: #f9f9f9;
              border: 1px dashed #ccc;
              text-align: center;
              margin-bottom: 10px;
            }
            
            .emergency-contacts-box {
              border: 1px solid #000;
              padding: 5px;
              font-size: 7px;
            }
            
            .emergency-contacts p {
              margin: 2px 0;
            }
            
            .responsibility-list {
              font-size: 9px;
              padding-left: 20px;
            }
            
            .responsibility-list li {
              margin-bottom: 5px;
            }
            
            .protocol-section h3 {
              font-size: 9px;
              font-weight: bold;
              margin-top: 10px;
              margin-bottom: 5px;
            }
            
            .protocol-list {
              font-size: 8px;
              padding-left: 20px;
            }
            
            .protocol-list li {
              margin-bottom: 3px;
              text-align: justify;
            }
            
            .footer {
              margin-top: 20px;
              font-size: 8px;
            }
            
            @page {
              margin: 15mm;
              size: A4;
            }
            
            @media print {
              .print-content {
                padding: 0;
              }
              
              .empty-weather,
              .empty-section {
                background-color: transparent;
                border: 1px dashed #999;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-content">
            ${printContent}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for images to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const defaultEquipment = [
    { item: 'Radio en frecuencia CAU 145.350', cantidad: '1', descripcion: 'Comunicación de emergencia' },
    { item: 'GPS', cantidad: '1', descripcion: 'Navegación' },
    { item: 'Teléfono', cantidad: '1', descripcion: 'Comunicación' },
    { item: 'Linterna', cantidad: '1', descripcion: 'Iluminación' },
    { item: 'Botiquín', cantidad: '1', descripcion: 'Primeros auxilios' },
    { item: 'Ropa personal', cantidad: '1', descripcion: 'Vestuario técnico' }
  ];

  // Filter only checked equipment, or show default if no equipment is checked
  const checkedEquipment = equipo.filter(item => item.checked);
  const equipmentToShow = checkedEquipment.length > 0 ? checkedEquipment : 
                         (equipo.length === 0 ? defaultEquipment : []);

  // Ensure we always have at least empty rows for transport and participants
  const participantesToShow = participantes.length > 0 ? participantes : [
    { nombre: '', telefono: '', rut: '', contactoEmergencia: '', telefonoEmergencia: '', grupoSanguineo: '', alergias: '', medicamentos: '', enfermedades: '', condicionesEspeciales: '' }
  ];

  const transportToShow = transporte.length > 0 ? transporte : [
    { conductor: '', tipo: '', marca: '', modelo: '', color: '', patente: '' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-auto">
      {/* Print Controls - Hidden when printing */}
      <div className="no-print fixed top-6 right-6 z-10">
        <div className="flex flex-col gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-all duration-200 font-medium text-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir Documento
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

      {/* Print Content - Continuous Layout */}
      <div className="print-container">
        <div ref={printRef} className="print-content">
          {/* Header */}
          <div className="header">
            <div className="logo">
              <img src="/Logo.png" alt="CAU Logo" className="h-16 w-auto" />
            </div>
            <div className="title">
              <h1>AVISO DE ACTIVIDAD DE MONTAÑA</h1>
            </div>
            <div className="contact-box">
              <div className="contact-item">
                <strong>Contacto CAU:</strong><br />
                {formData.basicInfo.contactoCAU || ''}
              </div>
              <div className="contact-item">
                <strong>Teléfono contacto:</strong><br />
                {formData.basicInfo.telefonoContacto || ''}
              </div>
              <div className="contact-item">
                <strong>Email contacto:</strong><br />
                {formData.basicInfo.emailContacto || ''}
              </div>
              <div className="contact-item">
                <strong>Fecha y hora de reporte:</strong><br />
                {formatDate(formData.basicInfo.fechaHoraReporteRegreso)}
              </div>
            </div>
          </div>

          {/* Activity Details */}
          <div className="section">
            <h2>DETALLES DE LA ACTIVIDAD</h2>
            <div className="activity-details">
              <div className="detail-row">
                <span className="label">ACTIVIDAD:</span>
                <span className="value">{formData.basicInfo.actividad || ''}</span>
              </div>
              <div className="detail-row">
                <span className="label">Nombre cerro o sector:</span>
                <span className="value">{formData.basicInfo.cerroOSector || ''}</span>
              </div>
              <div className="detail-row">
                <span className="label">Ruta:</span>
                <span className="value">{formData.basicInfo.ruta || ''}</span>
              </div>
              <div className="detail-row">
                <span className="label">Link Pronóstico del Tiempo:</span>
                <span className="value">{formData.basicInfo.linkPronostico || ''}</span>
              </div>
              <div className="detail-row">
                <span className="label">Link a la ruta:</span>
                <span className="value">{formData.basicInfo.linkRuta || ''}</span>
              </div>
              {formData.basicInfo.llevaInreach && (
                <>
                  <div className="detail-row">
                    <span className="label">Dispositivo InReach:</span>
                    <span className="value">Sí</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Número InReach:</span>
                    <span className="value">{formData.basicInfo.numeroInreach || ''}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Código InReach:</span>
                    <span className="value">{formData.basicInfo.codigoInreach || ''}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Participants */}
          <div className="section">
            <h2>PARTICIPANTES</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>RUT</th>
                  <th>Contacto Emergencia</th>
                  <th>Teléfono Contacto Emergencia</th>
                </tr>
              </thead>
              <tbody>
                {participantesToShow.map((p, index) => (
                  <tr key={index}>
                    <td>{p.nombre || ''}</td>
                    <td>{p.telefono || ''}</td>
                    <td>{p.rut || ''}</td>
                    <td>{p.contactoEmergencia || ''}</td>
                    <td>{p.telefonoEmergencia || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Weather Forecast with Images */}
          <div className="section">
            <h2>PRONÓSTICO DE TIEMPO</h2>
            {weatherImages.length > 0 ? (
              <div className="weather-images">
                {weatherImages.map((image, index) => (
                  <div key={index} className="weather-image">
                    <img 
                      src={image.base64 || image.url || image} 
                      alt={`Pronóstico del tiempo ${index + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        marginBottom: '10px',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.error('Error loading weather image:', e);
                        e.target.style.display = 'none';
                      }}
                      onLoad={(e) => {
                        console.log('Weather image loaded successfully');
                      }}
                    />
                    {(image.name || image.fechaObtencion) && (
                      <div style={{ fontSize: '6px', color: '#666', textAlign: 'center', marginTop: '2px' }}>
                        {image.name && <p style={{ margin: '0 0 2px 0' }}>{image.name}</p>}
                        {image.fechaObtencion && (
                          <p style={{ margin: '0', fontWeight: 'bold' }}>
                            Fecha: {new Date(image.fechaObtencion).toLocaleDateString('es-CL')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-weather">
                <p className="text-gray-500 italic">No se han adjuntado imágenes del pronóstico del tiempo</p>
              </div>
            )}
          </div>

          {/* Equipment */}
          <div className="section">
            <h2>EQUIPO</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Item</th>
                  <th>Cantidad</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {getGroupedEquipmentWithRowspan().map((item, index) => (
                  <tr key={index}>
                    {item.categoria && (
                      <td rowSpan={item.categoriaRowspan}>{item.categoria}</td>
                    )}
                    <td>{item.item}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.observaciones}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transport */}
          <div className="section">
            <h2>TRANSPORTE</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Conductor</th>
                  <th>Tipo</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Color</th>
                  <th>Patente</th>
                  <th>Puesto CAU (N°)</th>
                </tr>
              </thead>
              <tbody>
                {transportToShow.map((t, index) => (
                  <tr key={index}>
                    <td>{t.conductor || ''}</td>
                    <td>{t.tipo || ''}</td>
                    <td>{t.marca || ''}</td>
                    <td>{t.modelo || ''}</td>
                    <td>{t.color || ''}</td>
                    <td>{t.patente || ''}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Medical Data */}
          <div className="section">
            <h2>DATOS MÉDICOS IMPORTANTES</h2>
            <table className="data-table medical-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Enfermedades, alergias a medicamentos, otras alergias</th>
                  <th>Medicamentos habituales</th>
                  <th>Grupo de sangre</th>
                  <th>Enfermedad y lesiones</th>
                  <th>Riesgo / comentarios</th>
                </tr>
              </thead>
              <tbody>
                {participantesToShow.map((p, index) => (
                  <tr key={index}>
                    <td>{p.nombre || ''}</td>
                    <td>{p.alergias || ''}</td>
                    <td>{p.medicamentos || ''}</td>
                    <td>{p.grupoSanguineo || ''}</td>
                    <td>{p.enfermedades || ''}</td>
                    <td>{p.condicionesEspeciales || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Itinerary - Show even if empty */}
          <div className="section">
            <h2>ITINERARIO</h2>
            {itinerario.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tramo</th>
                    <th>Fecha</th>
                    <th>Actividad</th>
                    <th>Principales Dificultades</th>
                    <th>Hora Inicio</th>
                    <th>Hora Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {getGroupedItineraryWithRowspan().map((item, index) => (
                    <tr key={index}>
                      {item.tramo && (
                        <td rowSpan={item.tramoRowspan}>{item.tramo}</td>
                      )}
                      <td>{item.fecha}</td>
                      <td>{item.actividad}</td>
                      <td>{item.dificultades}</td>
                      <td>{item.horaInicio}</td>
                      <td>{item.horaFin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-section">
                <p className="text-gray-500 italic">No se ha especificado itinerario</p>
              </div>
            )}
          </div>

          {/* Risk Management - Show both assumptions and detailed risks */}
          <div className="section">
            <h2>GESTIÓN DE RIESGOS</h2>
            
            {/* Supuestos del Itinerario */}
            {(() => {
              const includedAssumptions = getGroupedAssumptionsWithRowspan();
              
              return includedAssumptions.length > 0 ? (
                <div>
                  <h3 style={{margin: '10px 0', fontSize: '14px', fontWeight: 'bold'}}>Supuestos del Itinerario:</h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tramo</th>
                        <th>Supuesto</th>
                        <th>Tipo</th>
                        <th>Probabilidad</th>
                        <th>Impacto</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {includedAssumptions.map((assumption, index) => (
                        <tr key={index}>
                          {assumption.tramo && (
                            <td rowSpan={assumption.tramoRowspan}>{assumption.tramo}</td>
                          )}
                          <td>{assumption.supuesto || ''}</td>
                          <td>{formatValue(assumption.tipo) || ''}</td>
                          <td>{formatValue(assumption.probabilidad) || ''}</td>
                          <td>{formatValue(assumption.impacto) || ''}</td>
                          <td>{formatValue(assumption.accion) || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null;
            })()}

            {/* Riesgos Detallados */}
            {riesgos.length > 0 && (
              <div style={{marginTop: '20px'}}>
                <h3 style={{margin: '10px 0', fontSize: '14px', fontWeight: 'bold'}}>Gestión Detallada de Riesgos:</h3>
                                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Supuesto</th>
                        <th>Riesgo</th>
                        <th>Peligro</th>
                        <th>Lugar</th>
                        <th>Acción Probabilidad</th>
                        <th>Acción Exposición</th>
                        <th>Acción Consecuencias</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getGroupedRisksWithRowspan().map((risk, index) => (
                        <tr key={index}>
                          {risk.supuesto && (
                            <td rowSpan={risk.supuestoRowspan}>{risk.supuesto}</td>
                          )}
                          <td>{risk.riesgo || ''}</td>
                          <td>{risk.peligro || ''}</td>
                          <td>{risk.lugar || ''}</td>
                          <td>{risk.accionProbabilidad || ''}</td>
                          <td>{risk.accionExposicion || ''}</td>
                          <td>{risk.accionConsecuencias || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            )}

            {(() => {
              const includedAssumptions = getGroupedAssumptionsWithRowspan();
              
              return includedAssumptions.length === 0 && riesgos.length === 0 ? (
                <div className="empty-section">
                  <p className="text-gray-500 italic">No se han especificado riesgos para incluir en el aviso</p>
                </div>
              ) : null;
            })()}
          </div>

          {/* Page Break */}
          <div className="page-break-before" style={{ height: '0', pageBreakBefore: 'always', breakBefore: 'page' }}></div>

          {/* Emergency Contacts */}
          <div className="section">
            <h2>CUERPOS DE RESCATE OFICIALES:</h2>
            <div className="emergency-contacts-box">
              <div className="emergency-contacts">
                <p><strong>Socorro Andino Magallanes:</strong> +56 9 6594 4314</p>
                <p><strong>Carabineros:</strong> 133</p>
                <p><strong>Bomberos:</strong> 132</p>
                <p><strong>SAMU (Servicio de Atención Médica de Urgencia):</strong> 131</p>
                <p><strong>PDI (Policía de Investigaciones):</strong> 134</p>
                <p><strong>Socorro Andino Los Andes:</strong> +56 9 9442 4294</p>
                <p><strong>Socorro Andino Santiago:</strong> +56 9 9680 5512</p>
                <p><strong>Socorro Andino Valparaíso:</strong> +56 9 8225 7085</p>
                <p><strong>Cuerpo de Socorro Andino Aconcagua:</strong> +56 9 9164 5890</p>
                <p><strong>CONAF (Emergencias en Parques Nacionales):</strong> +56 2 2663 0000</p>
                <p><strong>Armada de Chile (Rescate Marítimo):</strong> +56 32 220 8888</p>
                <p><strong>FACH (Fuerza Aérea - Rescate Aéreo):</strong> +56 2 2690 1000</p>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="section">
            <h2 className="centered">RESPONSABILIDAD DE LA CORDADA</h2>
            <ul className="responsibility-list">
              <li>Hacer su aviso de salida de forma completa y responsable y enviarlo al egroup Montañismo UC</li>
              <li>Buscar alguien responsable y que se encuentre disponible y dispuesto a ejercer la función de Contacto CAU para su salida</li>
              <li>Informar a su contacto CAU sobre los detalles de la salida, su motivación y sus ambiciones</li>
              <li>Tomar decisiones en terreno que respeten la hora de retorno señalada para evitar la activación de los protocolos de emergencia y el gasto de recursos económicos y humanos de forma innecesaria</li>
              <li>Dar aviso de su retorno antes de la hora señalada en el aviso de salida</li>
              <li>En caso de accidente dar primeros auxilios al accidentado y luego comunicarse directamente con el contacto CAU quién activará el protocolo de emergencia.</li>
            </ul>
          </div>

          <div className="section">
            <h2 className="centered">RESPONSABILIDAD DEL CONTACTO CAU</h2>
            <ul className="responsibility-list">
              <li>Informarse de los detalles de la salida de la cordada a monitorear</li>
              <li>Tener conocimiento del protocolo de emergencia a activar en caso de emergencia</li>
              <li>Estar disponible y "contactable" para verificar el retorno o no retorno de la cordada</li>
              <li>Dar aviso del retorno o no retorno de la cordada según corresponda</li>
              <li>En caso de no retorno o accidente confirmado activar el protocolo de emergencia</li>
            </ul>
          </div>

          <div className="section">
            <h2 className="centered">EN CASO DE NO RETORNO O ACCIDENTE CONFIRMADO ACTIVAR EL PROTOCOLO DE EMERGENCIA</h2>
          </div>

          <div className="section">
            <h2>PROTOCOLO DE EMERGENCIA PARA CONTACTO CAU:</h2>
            
            <div className="protocol-section">
              <h3>1. Caso de No Retorno:</h3>
              <ul className="protocol-list">
                <li>Intentar comunicación o seguimiento de la cordada a través del dispositivo InReach y de la página MapShare.</li>
                <li>En caso de no tener información, dar aviso a los cuerpos oficiales de rescate (CSA y GOPE) del no retorno de la cordada entregando toda la información recopilada en el aviso de salida.</li>
                <li>Preguntar a los cuerpos de rescate qué tipo de información, recursos humanos, técnicos o de equipo podría aportar el CAU en el procedimiento.</li>
                <li>Avisar a los contactos de emergencia de la situación, explicándoles que lo más posible es que se trate de un retraso y no de un accidente. Informar que ya se le dio aviso a los cuerpos de rescate y que el CAU está organizándose un grupo de apoyo para lo que sea requerido por los cuerpos de rescate.</li>
                <li>Dar aviso por email al e-group Montañismo UC de la situación y solicitar apoyo de señalada por los cuerpos de rescate.</li>
                <li>El DT se encargará de convocar en primera instancia un grupo de búsqueda que pueda prepararse y permanecer "en espera" en caso de ser requerido.</li>
                <li>Mantener al club informado a través del e-group de los acontecimientos importantes</li>
              </ul>
            </div>

            <div className="protocol-section">
              <h3>2. Caso de Accidente Confirmado</h3>
              <ul className="protocol-list">
                <li>Mantener la calma y obtener información de cómo sucedió el accidente, número de accidentados, lesiones diagnosticadas, ubicación geográfica, la atención de primeros auxilios entregada y de la gravedad de la situación.</li>
                <li>Pedir al que da aviso de accidente que en lo posible permanezca disponible como primera fuente en caso de requerir más información por los cuerpos de rescate.</li>
                <li>Dar aviso a los cuerpos oficiales de rescate (CSA y GOPE) del accidente de la cordada entregando toda la información entregada por la cordada y la recopilada en el aviso de salida.</li>
                <li>Preguntar a los cuerpos de rescate qué tipo de información, recursos humanos, técnicos o de equipo podría aportar el CAU en el procedimiento.</li>
                <li>Avisar a los contactos de emergencia de la situación. Informar que ya se le dio aviso a los cuerpos de rescate y que el CAU está organizándose un grupo de apoyo para lo que sea requerido por los cuerpos de rescate. Mantengán la calma</li>
                <li>Dar aviso por email al e-group Montañismo UC de la situación y solicitar apoyo de señalada por los cuerpos de rescate.</li>
                <li>El DT se encargará de convocar en primera instancia un grupo de rescate que pueda prepararse y permanecer "en espera" en caso de ser requerido.</li>
                <li>Mantener al club informado a través del e-group de los acontecimientos importantes</li>
              </ul>
            </div>
          </div>

          <div className="footer">
            <span>{new Date().toLocaleDateString('es-CL')}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-print {
          display: block;
        }

        .print-container {
          max-width: 210mm;
          margin: 20px auto;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border: 2px solid #ccc;
          min-height: calc(100vh - 40px);
        }

        .print-content {
          padding: 15mm;
          font-family: Arial, sans-serif;
          font-size: 10px;
          line-height: 1.2;
          background: white;
          min-height: 100%;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          position: relative;
        }

        .logo {
          flex-shrink: 0;
        }

        .title {
          flex-grow: 1;
          text-align: center;
          padding: 0 20px;
        }

        .title h1 {
          font-size: 14px;
          font-weight: bold;
          margin: 0;
        }

        .contact-box {
          width: 55mm;
          border: 1px solid #000;
          padding: 5px;
          font-size: 7px;
          flex-shrink: 0;
        }

        .contact-item {
          margin-bottom: 3px;
        }

        .section {
          margin-bottom: 15px;
        }

        .section h2 {
          font-size: 10px;
          font-weight: bold;
          margin: 0 0 8px 0;
        }

        .section h2.centered {
          text-align: center;
          font-size: 12px;
          margin-bottom: 15px;
        }

        .activity-details {
          font-size: 8px;
        }

        .detail-row {
          display: flex;
          margin-bottom: 3px;
        }

        .label {
          width: 45mm;
          font-weight: normal;
        }

        .value {
          flex-grow: 1;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 7px;
          margin-bottom: 10px;
        }

        .data-table th,
        .data-table td {
          border: 1px solid #000;
          padding: 2px;
          text-align: left;
          vertical-align: top;
        }

        .data-table th {
          background-color: #f0f0f0;
          font-weight: bold;
        }

        .medical-table {
          font-size: 6px;
        }

        .medical-table th,
        .medical-table td {
          padding: 1px;
        }

        .weather-images {
          margin-bottom: 10px;
        }

        .weather-image img {
          max-width: 100%;
          max-height: 150px;
          object-fit: contain;
          border: 1px solid #ddd;
        }

        .empty-weather,
        .empty-section {
          padding: 10px;
          background-color: #f9f9f9;
          border: 1px dashed #ccc;
          text-align: center;
          margin-bottom: 10px;
        }

        .responsibility-list {
          font-size: 9px;
          padding-left: 20px;
        }

        .responsibility-list li {
          margin-bottom: 5px;
        }

        .emergency-contacts {
          font-size: 8px;
        }

        .emergency-contacts p {
          margin: 2px 0;
        }

        .footer {
          margin-top: 20px;
          font-size: 8px;
        }

        .page-break-before {
          break-before: page !important;
          page-break-before: always !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .emergency-contacts-box {
          border: 1px solid #000;
          padding: 5px;
          font-size: 7px;
        }

        .protocol-section h3 {
          font-size: 9px;
          font-weight: bold;
          margin-top: 10px;
          margin-bottom: 5px;
        }

        .protocol-list {
          font-size: 8px;
          padding-left: 20px;
        }

                 .protocol-list li {
           margin-bottom: 3px;
           text-align: justify;
         }

         @media print {
          .no-print {
            display: none !important;
          }

          .print-container {
            max-width: none !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            min-height: auto !important;
          }

          .print-content {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: none !important;
            min-height: auto !important;
          }

          .empty-weather,
          .empty-section {
            background-color: transparent !important;
            border: 1px dashed #999 !important;
          }

          .emergency-contacts-box {
            border: 1px solid #000 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          .data-table {
            page-break-inside: auto !important;
            width: 100% !important;
          }

          .data-table th,
          .data-table td {
            border: 1px solid #000 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          .section {
            page-break-inside: auto !important;
            margin-bottom: 15px !important;
          }

          .page-break-before {
            break-before: page !important;
            page-break-before: always !important;
          }

          .protocol-section {
            page-break-inside: avoid !important;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }

          html {
            width: 100% !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          @page {
            margin: 15mm !important;
            size: A4 !important;
          }
        }
      `}</style>
    </div>
  );
} 