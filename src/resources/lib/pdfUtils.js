import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateAvisoSalidaPDF = async (aviso) => {
  const doc = new jsPDF();
  
  // Set up fonts and styles
  doc.setFont('helvetica');
  
  let y = 15;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const contentWidth = pageWidth - (2 * margin);

  // ===== PAGE 1 =====
  
  // Add CAU logo at the top left
  try {
    const logoModule = await import('@/resources/imgs/Logo.png');
    const logoUrl = logoModule.default;
    doc.addImage(logoUrl, 'PNG', margin, y, 40, 25);
  } catch (error) {
    console.log('Logo not found, continuing without logo');
  }
  
  // Header with title (centered)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AVISO DE ACTIVIDAD DE MONTAÑA', pageWidth / 2, y + 12, { align: 'center' });
  
  // Contact info box (top right)
  const contactBoxX = pageWidth - margin - 55;
  const contactBoxY = y;
  const contactBoxWidth = 55;
  const contactBoxHeight = 35;
  
  // Draw contact box
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(contactBoxX, contactBoxY, contactBoxWidth, contactBoxHeight);
  
  // Contact info inside box
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Contacto CAU:', contactBoxX + 2, contactBoxY + 5);
  doc.text(aviso.contactoCAU || '', contactBoxX + 2, contactBoxY + 9);
  doc.text('Teléfono contacto:', contactBoxX + 2, contactBoxY + 13);
  doc.text(aviso.telefonoContacto || '', contactBoxX + 2, contactBoxY + 17);
  doc.text('Email contacto:', contactBoxX + 2, contactBoxY + 21);
  doc.text(aviso.emailContacto || '', contactBoxX + 2, contactBoxY + 25);
  doc.text('Fecha y hora de reporte:', contactBoxX + 2, contactBoxY + 29);
  doc.text(aviso.fechaHoraReporteRegreso || '', contactBoxX + 2, contactBoxY + 33);

  y = 55;

  // Activity details section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLES DE LA ACTIVIDAD', margin, y);
  y += 8;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const activityDetails = [
    ['ACTIVIDAD:', aviso.actividad || ''],
    ['Nombre cerro o sector:', aviso.cerroOSector || ''],
    ['Ruta:', aviso.ruta || ''],
    ['Link Pronóstico del Tiempo:', aviso.linkPronostico || ''],
    ['Link a la ruta:', aviso.linkRuta || '']
  ];

  activityDetails.forEach(([label, value]) => {
    doc.text(label, margin, y);
    doc.text(value, margin + 45, y);
    y += 5;
  });

  y += 5;

  // Participants table
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PARTICIPANTES', margin, y);
  y += 5;

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
        fontSize: 7,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7
      }
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Add page number
  doc.setFontSize(8);
  doc.text('1', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // ===== PAGE 2 =====
  doc.addPage();
  y = 20;

  // Weather forecast section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PRONÓSTICO DE TIEMPO: última actualización martes 15:00 hrs', margin, y);
  y += 10;

  // Weather forecast table (empty template)
  autoTable(doc, {
    startY: y,
    head: [['Hora', 'Temperatura', 'Viento', 'Precipitación', 'Observaciones']],
    body: Array(8).fill(['', '', '', '', '']),
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { 
      fontSize: 7,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 7
    }
  });
  y = doc.lastAutoTable.finalY + 15;

  // Equipment section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('EQUIPO', margin, y);
  y += 5;

  if (aviso.equipo && aviso.equipo.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Tipo', 'Cantidad', 'Descripción', 'Observaciones']],
      body: aviso.equipo.map(e => [
        e.item || '',
        e.cantidad || '',
        e.descripcion || '',
        ''
      ]),
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 7,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7
      }
    });
    y = doc.lastAutoTable.finalY + 15;
  } else {
    // Default equipment table
    const defaultEquipment = [
      ['Radio en frecuencia CAU 145.350', '1', 'Comunicación de emergencia', ''],
      ['GPS', '1', 'Navegación', ''],
      ['Teléfono', '1', 'Comunicación', ''],
      ['Linterna', '1', 'Iluminación', ''],
      ['Botiquín', '1', 'Primeros auxilios', ''],
      ['Ropa personal', '1', 'Vestuario técnico', '']
    ];
    
    autoTable(doc, {
      startY: y,
      head: [['Tipo', 'Cantidad', 'Descripción', 'Observaciones']],
      body: defaultEquipment,
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 7,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7
      }
    });
    y = doc.lastAutoTable.finalY + 15;
  }

  // Transport section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSPORTE', margin, y);
  y += 5;

  if (aviso.transporte && aviso.transporte.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Conductor', 'Tipo', 'Marca', 'Modelo', 'Color', 'Patente', 'Puesto CAU (N°)']],
      body: aviso.transporte.map(t => [
        t.conductor || '',
        t.tipo || '',
        t.marca || '',
        t.modelo || '',
        t.color || '',
        t.patente || '',
        ''
      ]),
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 7,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7
      }
    });
    y = doc.lastAutoTable.finalY + 15;
  }

  // Medical data section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS MÉDICOS IMPORTANTES', margin, y);
  y += 5;

  if (aviso.participantes && aviso.participantes.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Nombre', 'Enfermedades, alergias a medicamentos, otras alergias', 'Medicamentos habituales', 'Grupo de sangre', 'Enfermedad y lesiones', 'Riesgo / comentarios']],
      body: aviso.participantes.map(p => [
        p.nombre || '',
        p.alergias || '',
        p.medicamentos || '',
        p.grupoSanguineo || '',
        p.enfermedades || '',
        p.condicionesEspeciales || ''
      ]),
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { 
        fontSize: 6,
        cellPadding: 1,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 6
      }
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Emergency contacts
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Bomberos de Rescate Montaña:', margin, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.text('Socorro Andino Magallanes: +56 9 8888 8214', margin, y);
  y += 4;
  doc.text('Carabineros: 133', margin, y);

  // Add page number
  doc.setFontSize(8);
  doc.text('2', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // ===== PAGE 3 =====
  doc.addPage();
  y = 20;

  // Responsibilities section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESPONSABILIDAD DE LA CORDADA', pageWidth / 2, y, { align: 'center' });
  y += 15;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const cordadaText = [
    'Completar el aviso de salida en el grupo de correo Montañismo BC.',
    'Designar un responsable como Contacto-CAU.',
    'Informar al Contacto-CAU sobre los detalles del viaje.',
    'Respetar el horario de entrada para evitar activación del protocolo de emergencia.',
    'Notificar su regreso antes del horario establecido.',
    'Proporcionar primeros auxilios y contactar al CAU en caso de accidente.'
  ];

  cordadaText.forEach(text => {
    doc.text(`• ${text}`, margin, y);
    y += 6;
  });

  y += 10;

  // CAU Contact responsibilities
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESPONSABILIDAD DEL CONTACTO-CAU', pageWidth / 2, y, { align: 'center' });
  y += 15;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const cauText = [
    'Monitorear los detalles de salida de la cordada.',
    'Conocer el protocolo de emergencia.',
    'Estar disponible y contactable para verificar el regreso.',
    'Notificar el regreso o no regreso según corresponda.'
  ];

  cauText.forEach(text => {
    doc.text(`• ${text}`, margin, y);
    y += 6;
  });

  // Footer with date
  doc.setFontSize(8);
  const today = new Date().toLocaleDateString('es-CL');
  doc.text(today, margin, pageHeight - 20);
  
  // Add page number
  doc.text('3', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save the PDF
  const fileName = `aviso-salida-${aviso.cerroOSector?.replace(/\s+/g, '-') || 'montaña'}.pdf`;
  doc.save(fileName);
};
