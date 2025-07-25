import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateAvisoSalidaPDF = async (aviso) => {
  const doc = new jsPDF();
  
  // Set up fonts and styles
  doc.setFont('helvetica');
  
  let y = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);

  // ===== PAGE 1 =====
  
  // Add CAU logo at the top
  try {
    // Import the logo dynamically
    const logoModule = await import('@/public/Logo.png');
    const logoUrl = logoModule.default;
    
    // Add logo to the top center
    doc.addImage(logoUrl, 'PNG', pageWidth / 2 - 25, y, 50, 30);
    y += 35; // Move down after logo
  } catch (error) {
    console.log('Logo not found, continuing without logo');
    y += 10;
  }
  
  // Header with title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AVISO DE ACTIVIDAD DE MONTAÑA', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Contact info box (top right)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const contactBoxX = pageWidth - margin - 60;
  const contactBoxY = 15;
  
  // Draw contact box border
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(contactBoxX, contactBoxY, 60, 40);
  
  // Contact info inside box
  doc.text('Contacto CAU:', contactBoxX + 2, contactBoxY + 8);
  doc.text(aviso.contactoCAU || '', contactBoxX + 2, contactBoxY + 12);
  doc.text('Teléfono contacto:', contactBoxX + 2, contactBoxY + 18);
  doc.text(aviso.telefonoContacto || '', contactBoxX + 2, contactBoxY + 22);
  doc.text('Email contacto:', contactBoxX + 2, contactBoxY + 28);
  doc.text(aviso.emailContacto || '', contactBoxX + 2, contactBoxY + 32);
  doc.text('Fecha y hora de reporte:', contactBoxX + 2, contactBoxY + 38);
  doc.text(aviso.fechaHoraReporteRegreso || '', contactBoxX + 2, contactBoxY + 42);

  // Activity details section
  y = 70;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLES DE LA ACTIVIDAD', margin, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const activityDetails = [
    ['Actividad:', aviso.actividad || ''],
    ['Nombre cerro o sector:', aviso.cerroOSector || ''],
    ['Ruta:', aviso.ruta || ''],
    ['Link Pronóstico del Tiempo:', aviso.linkPronostico || ''],
    ['Link a la ruta:', aviso.linkRuta || '']
  ];

  activityDetails.forEach(([label, value]) => {
    doc.text(label, margin, y);
    doc.text(value, margin + 50, y);
    y += 6;
  });

  // Participants table
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PARTICIPANTES', margin, y);
  y += 8;

  if (aviso.participantes && aviso.participantes.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Nombre', 'Teléfono', 'RUT', 'Contacto Emergencia', 'Teléfono Contacto Emergencia']],
      body: aviso.participantes.map(p => [
        p.nombre || '',
        p.telefono || '',
        p.rut || '',
        p.contactoEmergencia || '',
        p.telefonoEmergencia || ''
      ]),
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Itinerary table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ITINERARIO (Horario asociado principal)', margin, y);
  y += 8;

  if (aviso.itinerario && aviso.itinerario.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['N°', 'Fecha', 'Ruta / Actividad', 'Jornada (Horario)', 'Altitud (metros)', 'Desnivel (metros)']],
      body: aviso.itinerario.map((item, index) => [
        (index + 1).toString(),
        item.fecha || '',
        item.actividad || '',
        item.horario || '',
        item.altitud || '',
        item.desnivel || ''
      ]),
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Risk management table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('GESTIÓN DE RIESGOS', margin, y);
  y += 8;

  if (aviso.gestionRiesgos && aviso.gestionRiesgos.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Riesgos', 'Lugar o momento en que se manifiestan (MOM. M.)', 'Acciones de gestión de riesgos']],
      body: aviso.gestionRiesgos.map(r => [
        r.supuesto || '',
        r.lugar || '',
        r.acciones || ''
      ]),
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Add page number
  doc.setFontSize(10);
  doc.text('1', pageWidth - margin, pageWidth - margin, { align: 'right' });

  // ===== PAGE 2 =====
  doc.addPage();
  y = 20;

  // Weather forecast section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PRONÓSTICO DE TIEMPO: última actualización martes 15:00 hrs', margin, y);
  y += 15;

  // Weather forecast table (simplified - you can enhance this)
  autoTable(doc, {
    startY: y,
    head: [['Hora', 'Temperatura', 'Viento', 'Precipitación', 'Humedad']],
    body: [
      ['00:00', '-1°C', '4 km/h', '0%', '85%'],
      ['03:00', '0°C', '5 km/h', '10%', '80%'],
      ['06:00', '1°C', '6 km/h', '20%', '75%'],
      ['09:00', '3°C', '8 km/h', '0%', '70%'],
      ['12:00', '5°C', '10 km/h', '0%', '65%'],
      ['15:00', '4°C', '12 km/h', '0%', '70%'],
      ['18:00', '2°C', '8 km/h', '0%', '75%'],
      ['21:00', '0°C', '6 km/h', '0%', '80%']
    ],
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { 
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    }
  });
  y = doc.lastAutoTable.finalY + 15;

  // Equipment section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('EQUIPO', margin, y);
  y += 8;

  if (aviso.equipo && aviso.equipo.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Categoría', 'Item', 'Cantidad', 'Descripción']],
      body: aviso.equipo.map(e => [
        e.categoria || '',
        e.item || '',
        e.cantidad || '',
        e.descripcion || ''
      ]),
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });
    y = doc.lastAutoTable.finalY + 15;
  } else {
    // Fallback to simple equipment table
    autoTable(doc, {
      startY: y,
      head: [['Comunicaciones', 'Otros']],
      body: [
        ['Radio en frecuencia CAU 151.250', ''],
        ['GPS', ''],
        ['Teléfono', ''],
        ['Linterna', ''],
        ['Botiquín', ''],
        ['Ropa personal', '']
      ],
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });
    y = doc.lastAutoTable.finalY + 15;
  }

  // Transport section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSPORTE', margin, y);
  y += 8;

  if (aviso.transporte && aviso.transporte.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Tipo', 'Conductor', 'Marca', 'Modelo', 'Color', 'Patente', 'Distancia (km)', 'Huella CO2 (kg)']],
      body: aviso.transporte.map(t => [
        t.tipo || '',
        t.conductor || '',
        t.marca || '',
        t.modelo || '',
        t.color || '',
        t.patente || '',
        t.distancia || '',
        t.huellaCO2 || ''
      ]),
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });
    y = doc.lastAutoTable.finalY + 15;
  } else {
    // Fallback to simple transport table
    autoTable(doc, {
      startY: y,
      head: [['Conductor', 'Tipo', 'Marca', 'Modelo', 'Color', 'Patente', 'Puesto CAU (N°)']],
      body: [
        [aviso.transporte || '', '', '', '', '', '', '']
      ],
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });
    y = doc.lastAutoTable.finalY + 15;
  }

  // Medical data table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS MÉDICOS IMPORTANTES', margin, y);
  y += 8;

  if (aviso.datosMedicos && aviso.datosMedicos.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Nombre', 'Enfermedades, alergias a medicamentos, otras alergias', 'Medicamentos habituales', 'Grupo de sangre', 'Sistema de salud y seguros', 'Riesgo / comentarios']],
      body: aviso.datosMedicos.map(m => [
        m.nombre || '',
        m.enfermedades || '',
        m.medicamentos || '',
        m.grupoSangre || '',
        `${m.sistemaSalud || ''} / ${m.seguros || ''}`,
        m.comentarios || ''
      ]),
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 7,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Official rescue bodies
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Cuerpos de Rescate Oficiales:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Socorro Andino Magallanes: +56 9 8586 4214', margin, y);
  y += 5;
  doc.text('Carabineros: 133', margin, y);

  // Add page number
  doc.setFontSize(10);
  doc.text('2', pageWidth - margin, pageWidth - margin, { align: 'right' });

  // ===== PAGE 3 =====
  doc.addPage();
  y = 20;

  // Responsibilities section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESPONSABILIDAD DE LA CORDADA', pageWidth / 2, y, { align: 'center' });
  y += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const cordadaResponsibilities = [
    '• Completar el aviso de salida en el grupo de correo Montañismo UC.',
    '• Designar un responsable como Contacto CAU.',
    '• Informar al contacto CAU sobre los detalles del viaje.',
    '• Respetar el horario de regreso para evitar activación del protocolo de emergencia.',
    '• Notificar su regreso antes del horario establecido.',
    '• Proporcionar primeros auxilios y contactar al CAU en caso de accidente.'
  ];

  cordadaResponsibilities.forEach(responsibility => {
    doc.text(responsibility, margin, y);
    y += 6;
  });

  y += 15;

  // CAU Contact responsibilities
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESPONSABILIDAD DEL CONTACTO CAU', pageWidth / 2, y, { align: 'center' });
  y += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const cauResponsibilities = [
    '• Monitorear los detalles de salida de la cordada.',
    '• Conocer el protocolo de emergencia.',
    '• Estar disponible y contactable para verificar el regreso.',
    '• Notificar el regreso o no regreso según corresponda.'
  ];

  cauResponsibilities.forEach(responsibility => {
    doc.text(responsibility, margin, y);
    y += 6;
  });

  y += 15;

  // Emergency protocol header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('En caso de no retorno o accidente confirmado activar el protocolo de emergencia', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Emergency protocol for CAU contact
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PROTOCOLO DE EMERGENCIA PARA CONTACTO CAU:', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // No return case
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Caso de No Retorno:', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const noReturnSteps = [
    '• Intentar comunicación vía InReach/MapShare.',
    '• Notificar a cuerpos oficiales (CSA y GOPE) con información recopilada.',
    '• Consultar posible apoyo CAU (información, recursos humanos, técnicos, equipamiento).',
    '• Notificar a contactos de emergencia, explicando que probablemente es un retraso.',
    '• Enviar email al grupo Montañismo UC para apoyo.',
    '• Mantener informado al club vía grupo de correo.'
  ];

  noReturnSteps.forEach(step => {
    doc.text(step, margin, y);
    y += 5;
  });

  y += 10;

  // Confirmed accident case
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Caso de Accidente Confirmado:', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const accidentSteps = [
    '• Mantener la calma y recopilar detalles del accidente.',
    '• Solicitar al reportante que permanezca disponible para más información.',
    '• Notificar a cuerpos oficiales (CSA y GOPE) con toda la información disponible.',
    '• Consultar posible apoyo CAU (información, recursos humanos, técnicos, equipamiento).',
    '• Notificar a contactos de emergencia y aconsejar mantener la calma.',
    '• Enviar email al grupo Montañismo UC para apoyo.',
    '• Mantener informado al club vía grupo de correo.'
  ];

  accidentSteps.forEach(step => {
    doc.text(step, margin, y);
    y += 5;
  });

  // Footer with logo and date
  const footerY = pageWidth - 30;
  doc.setFontSize(8);
  doc.text('22/07/2025', margin, footerY);
  
  // Add page number
  doc.text('3', pageWidth - margin, footerY, { align: 'right' });

  // Save the PDF
  doc.save(`aviso-salida-${aviso.cerroOSector || 'cerro'}.pdf`);
};
