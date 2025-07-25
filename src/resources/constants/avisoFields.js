const avisoSalida = [
    { name: 'contactoCAU', label: 'Contacto CAU', placeholder: 'Nombre del contacto CAU', type: 'text' },
    { name: 'telefonoContacto', label: 'Teléfono de contacto', placeholder: '+569xxxxxxxx', type: 'text' },
    { name: 'emailContacto', label: 'Email de contacto', placeholder: 'correo@gmail.com', type: 'text' },
    { name: 'fechaHoraReporteRegreso', label: 'Fecha y hora de reporte de regreso', placeholder: 'DD/MM/YYYY HH:mm', type: 'datetime-local' },
    { name: 'actividad', label: 'Actividad', placeholder: 'Actividad realizada', type: 'text' },
    { name: 'cerroOSector', label: 'Cerro o Sector', placeholder: 'Cerro o Sector', type: 'text' },
    { name: 'ruta', label: 'Ruta', placeholder: 'Ruta', type: 'text' },
    { name: 'linkPronostico', label: 'Link al pronóstico del tiempo', placeholder: 'https://weather.com', type: 'text' },
    { name: 'linkRuta', label: 'Link a la ruta', placeholder: 'https://link-a-la-ruta.cl', type: 'text' },
    { name: 'participantes', label: 'Participantes', placeholder: 'Participantes', type: 'dynamic-list', fields: [
      { name: 'nombre', label: 'Nombre', placeholder: 'Nombre del participante', type: 'text' },
      { name: 'rut', label: 'RUT', placeholder: '12.345.678-9', type: 'text' },
      { name: 'telefono', label: 'Teléfono', placeholder: '+569xxxxxxxx', type: 'text' },
      { name: 'contactoEmergencia', label: 'Contacto de Emergencia', placeholder: 'Nombre del contacto de emergencia', type: 'text' },
      { name: 'telefonoEmergencia', label: 'Teléfono de Emergencia', placeholder: '+569xxxxxxxx', type: 'text' }
    ]},
    { name: 'itinerario', label: 'Itinerario', placeholder: 'Itinerario', type: 'dynamic-list', fields: [
      { name: 'fecha', label: 'Fecha', placeholder: 'DD/MM', type: 'text' },
      { name: 'actividad', label: 'Actividad', placeholder: 'Actividad del día', type: 'text' },
      { name: 'horario', label: 'Horario', placeholder: 'HH:mm - HH:mm', type: 'text' },
      { name: 'altitud', label: 'Altitud', placeholder: 'Altitud en msnm', type: 'text' }
    ]},
    { name: 'gestionRiesgos', label: 'Gestión de Riesgos', placeholder: 'Gestión de Riesgos', type: 'dynamic-list', fields: [
      { name: 'supuesto', label: 'Supuesto de Riesgo', placeholder: 'Supuesto de riesgo identificado', type: 'text' },
      { name: 'riesgo', label: 'Riesgo Asociado', placeholder: 'Riesgo asociado al supuesto', type: 'text' },
      { name: 'lugar', label: 'Lugar del Riesgo', placeholder: 'Lugar donde se presenta el riesgo', type: 'text' },
      { name: 'acciones', label: 'Acciones a Tomar', placeholder: 'Acciones a tomar ante el riesgo', type: 'text' }
    ]},
    { name: 'imagenPronosticoUrl', label: 'Imagen del Pronóstico del Tiempo (URL)', placeholder: 'https://url-a-imagen.png', type: 'text' },
    { name: 'equipo', label: 'Equipo Portado', placeholder: 'Equipo que se porta en la actividad', type: 'text' },
    { name: 'transporte', label: 'Transporte Utilizado', placeholder: 'Transporte utilizado para llegar al lugar', type: 'text' },
    { name: 'datosMedicos', label: 'Datos Médicos', placeholder: 'Datos médicos relevantes', type: 'dynamic-list', fields: [
      { name: 'nombre', label: 'Nombre del Participante', placeholder: 'Nombre del participante', type: 'text' },
      { name: 'enfermedades', label: 'Enfermedades Relevantes', placeholder: 'Enfermedades relevantes del participante', type: 'text' },
      { name: 'medicamentos', label: 'Medicamentos', placeholder: 'Medicamentos que lleva el participante', type: 'text' },
      { name: 'grupoSangre', label: 'Grupo Sanguíneo', placeholder: 'Grupo sanguíneo del participante', type: 'text' },
      { name: 'sistemaSalud', label: 'Sistema de Salud', placeholder: 'Fonasa, Isapre, etc.', type: 'text' },
      { name: 'seguros', label: 'Seguros Asociados', placeholder: 'Seguros de salud o accidentes', type: 'text' },
      { name: 'comentarios', label: 'Comentarios Adicionales', placeholder: 'Comentarios adicionales sobre la salud del participante', type: 'text' }
    ]}
  ]

  
export default avisoSalida;
    