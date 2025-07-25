import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateAvisoSalidaPDF = async (aviso) => {
  const doc = new jsPDF();

  doc.setFont('helvetica');
  doc.setFontSize(12);

  let y = 10;

  // Logo
  // if (aviso.logoUrl) {
  //   const logo = await fetch(aviso.logoUrl)
  //     .then(r => r.blob())
  //     .then(b => new Promise(res => {
  //       const reader = new FileReader();
  //       reader.onload = () => res(reader.result);
  //       reader.readAsDataURL(b);
  //     }));
  //   doc.addImage(logo, 'PNG', 10, y, 30, 30);
  // }

  doc.setFontSize(18);
  doc.text('Aviso de Salida - Cerro Tenerife', 50, y + 10);
  y += 35;

  doc.setFontSize(12);
  const generales = [
    ['Contacto CAU:', aviso.contactoCAU],
    ['Teléfono de contacto:', aviso.telefonoContacto],
    ['Email de contacto:', aviso.emailContacto],
    ['Fecha y hora de reporte de regreso:', aviso.fechaHoraReporteRegreso],
    ['Actividad:', aviso.actividad],
    ['Nombre del cerro o sector:', aviso.cerroOSector],
    ['Ruta:', aviso.ruta],
    ['Link al pronóstico del tiempo:', aviso.linkPronostico],
    ['Link a la ruta:', aviso.linkRuta],
    ['Transporte que se utiliza:', aviso.transporte],
    ['Equipo que se porta:', aviso.equipo]
  ];

  generales.forEach(([k, v]) => {
    doc.text(`${k} ${v}`, 10, y);
    y += 8;
  });

  // Imagen pronóstico
  // if (aviso.imagenPronosticoUrl) {
  //   const img = await fetch(aviso.imagenPronosticoUrl)
  //     .then(r => r.blob())
  //     .then(b => new Promise(res => {
  //       const reader = new FileReader();
  //       reader.onload = () => res(reader.result);
  //       reader.readAsDataURL(b);
  //     }));
  //   doc.addImage(img, 'PNG', 10, y, 180, 40);
  //   y += 45;
  // }

  // Tablas
  autoTable(doc, {
    startY: y,
    head: [['Nombre', 'Teléfono', 'RUT', 'Contacto Emergencia', 'Tel. Emergencia']],
    body: aviso.participantes.map(p => [
      p.nombre, p.telefono, p.rut, p.contactoEmergencia, p.telefonoEmergencia
    ]),
    margin: { left: 10 },
    theme: 'grid',
    styles: { fontSize: 9 }
  });
  y = doc.lastAutoTable.finalY + 10;

  autoTable(doc, {
    startY: y,
    head: [['Fecha', 'Ruta/Actividad', 'Horario', 'Altitud']],
    body: aviso.itinerario.map(i => [i.fecha, i.actividad, i.horario, i.altitud]),
    margin: { left: 10 },
    theme: 'grid',
    styles: { fontSize: 9 }
  });
  y = doc.lastAutoTable.finalY + 10;

  autoTable(doc, {
    startY: y,
    head: [['Supuesto Clave', 'Riesgo Relevante', 'Lugar/Coordenada', 'Acciones de Gestión']],
    body: aviso.gestionRiesgos.map(r => [r.supuesto, r.riesgo, r.lugar, r.acciones]),
    margin: { left: 10 },
    theme: 'grid',
    styles: { fontSize: 9 }
  });
  y = doc.lastAutoTable.finalY + 10;

  autoTable(doc, {
    startY: y,
    head: [['Nombre', 'Enfermedades/Alergias', 'Medicamentos', 'Grupo Sangre', 'Salud/Seguro', 'Comentarios']],
    body: aviso.datosMedicos.map(m => [
      m.nombre,
      m.enfermedades,
      m.medicamentos,
      m.grupoSangre,
      `${m.sistemaSalud} / ${m.seguros}`,
      m.comentarios
    ]),
    margin: { left: 10 },
    theme: 'grid',
    styles: { fontSize: 9 }
  });
  y = doc.lastAutoTable.finalY + 10;

  // Texto final
  const textoFinal = `
Este aviso tiene por objetivo facilitar una eventual activación de emergencia. La información aquí contenida es de exclusiva responsabilidad de quien la emite.
El CAU no se hace responsable por omisiones ni errores en los datos.
Se recomienda a los participantes mantener comunicación periódica con sus contactos de emergencia.
  `;
  doc.text(doc.splitTextToSize(textoFinal.trim(), 180), 10, y);

  doc.save(`aviso-salida-${aviso.cerroOSector || 'cerro'}.pdf`);
};
