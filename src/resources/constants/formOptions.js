// Form Options Configuration
// This file contains all dropdown options and predefined data for the form
// Easy to modify and extend

export const formOptions = {
  // Basic Information Options
  contactoCAU: [
    'Juan Pérez',
    'María González',
    'Carlos Rodríguez',
    'Ana Martínez',
    'Luis Fernández',
    'Carmen López',
    'Roberto Silva',
    'Patricia Morales',
    'Fernando Herrera',
    'Isabel Vargas'
  ],

  actividades: [
    'Ascenso técnico',
    'Trekking',
    'Escalada en roca',
    'Escalada en hielo',
    'Alpinismo',
    'Montañismo',
    'Senderismo',
    'Caminata',
    'Exploración',
    'Rescate',
    'Entrenamiento',
    'Investigación',
    'Fotografía de montaña',
    'Geología',
    'Biología de montaña'
  ],

  cerrosSectores: [
    'Cerro Tenerife',
    'Torres del Paine',
    'Cerro San Lorenzo',
    'Monte Fitz Roy',
    'Cerro Torre',
    'Volcán Villarrica',
    'Volcán Osorno',
    'Cerro El Plomo',
    'Cerro Marmolejo',
    'Cerro Aconcagua',
    'Cerro Mercedario',
    'Cerro Bonete',
    'Cerro Pissis',
    'Cerro Ojos del Salado',
    'Cerro Tres Cruces',
    'Cerro Incahuasi',
    'Cerro Tupungato',
    'Cerro Maipo',
    'Cerro Marmolejo',
    'Cerro San José'
  ],

  // Equipment Categories and Items
  equipmentCategories: [
    { value: 'comunicaciones', label: 'Comunicaciones' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'escalada', label: 'Escalada' },
    { value: 'campamento', label: 'Campamento' },
    { value: 'cocina', label: 'Cocina' },
    { value: 'navegacion', label: 'Navegación' },
    { value: 'primeros_auxilios', label: 'Primeros Auxilios' },
    { value: 'vestuario', label: 'Vestuario' },
    { value: 'iluminacion', label: 'Iluminación' },
    { value: 'documentacion', label: 'Documentación' },
    { value: 'otros', label: 'Otros' }
  ],

  equipmentItems: {
    comunicaciones: [
      'Radio en frecuencia CAU 151.250',
      'Teléfono satelital',
      'Walkie-talkie',
      'Cargador portátil',
      'Baterías extra',
      'Antena portátil',
      'Repetidor de señal'
    ],
    seguridad: [
      'Casco',
      'Arnés',
      'Cuerda',
      'Mosquetones',
      'Piolet',
      'Crampones',
      'Avalanche beacon',
      'Sonda de avalancha',
      'Pala de avalancha',
      'Kit de rescate',
      'Dispositivo de localización'
    ],
    escalada: [
      'Cuerda de escalada',
      'Quickdraws',
      'Friends',
      'Nuts',
      'Cordinos',
      'Cintas',
      'Grigri',
      'Asegurador',
      'Jumar',
      'Descensor',
      'Poleas'
    ],
    campamento: [
      'Carpa',
      'Colchoneta',
      'Saco de dormir',
      'Aislante',
      'Mochila',
      'Bolsa de vivac',
      'Estacas',
      'Vientos',
      'Bolsas de dormir'
    ],
    cocina: [
      'Cocina de gas',
      'Combustible',
      'Ollas',
      'Cubiertos',
      'Termo',
      'Filtro de agua',
      'Encendedor',
      'Fósforos',
      'Cuchillo'
    ],
    navegacion: [
      'GPS',
      'Brújula',
      'Mapa topográfico',
      'Altímetro',
      'Reloj con altímetro',
      'Baterías GPS',
      'Cargador GPS'
    ],
    primeros_auxilios: [
      'Botiquín',
      'Kit de supervivencia',
      'Manta térmica',
      'Vendas',
      'Antiséptico',
      'Medicamentos',
      'Tijeras',
      'Pinzas',
      'Guantes médicos'
    ],
    vestuario: [
      'Ropa técnica',
      'Gore-tex',
      'Guantes',
      'Gorros',
      'Botas',
      'Polainas',
      'Chaleco',
      'Pantalones',
      'Camisetas térmicas'
    ],
    iluminacion: [
      'Linterna frontal',
      'Linterna de mano',
      'Baterías',
      'Pilas de repuesto',
      'Lámpara de campamento'
    ],
    documentacion: [
      'Permisos',
      'Documentos de identidad',
      'Seguro de viaje',
      'Contactos de emergencia',
      'Mapas',
      'Guías'
    ],
    otros: [
      'Cámara',
      'Libreta',
      'Lápiz',
      'Papel higiénico',
      'Protector solar',
      'Repelente',
      'Cremas',
      'Toallas'
    ]
  },

  // Transport Options
  transportTypes: [
    { value: 'privado', label: 'Privado' },
    { value: 'publico', label: 'Público' },
    { value: 'institucional', label: 'Institucional' },
    { value: 'alquiler', label: 'Alquiler' },
    { value: 'compartido', label: 'Compartido' },
    { value: 'aereo', label: 'Aéreo' },
    { value: 'maritimo', label: 'Marítimo' },
    { value: 'ferroviario', label: 'Ferroviario' }
  ],

  vehicleBrands: [
    'Toyota', 'Nissan', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Mazda',
    'Honda', 'Mitsubishi', 'Subaru', 'Volkswagen', 'BMW', 'Mercedes-Benz',
    'Audi', 'Volvo', 'Peugeot', 'Renault', 'Citroën', 'Fiat', 'Jeep',
    'Dodge', 'Chrysler', 'Lexus', 'Infiniti', 'Acura', 'Buick', 'Cadillac',
    'Lincoln', 'Pontiac', 'Saturn', 'Oldsmobile', 'Plymouth'
  ],

  // Medical Options
  bloodTypes: [
    { value: 'a_positivo', label: 'A+' },
    { value: 'a_negativo', label: 'A-' },
    { value: 'b_positivo', label: 'B+' },
    { value: 'b_negativo', label: 'B-' },
    { value: 'ab_positivo', label: 'AB+' },
    { value: 'ab_negativo', label: 'AB-' },
    { value: 'o_positivo', label: 'O+' },
    { value: 'o_negativo', label: 'O-' },
    { value: 'desconocido', label: 'Desconocido' }
  ],

  allergies: [
    'Ninguna',
    'Polen',
    'Polvo',
    'Ácaros',
    'Moho',
    'Pelo de animales',
    'Picaduras de insectos',
    'Alimentos específicos',
    'Medicamentos',
    'Látex',
    'Frutos secos',
    'Mariscos',
    'Lácteos',
    'Gluten',
    'Otros'
  ],

  medicalConditions: [
    'Ninguna',
    'Asma',
    'Diabetes',
    'Hipertensión',
    'Problemas cardíacos',
    'Problemas respiratorios',
    'Problemas de rodilla',
    'Problemas de espalda',
    'Problemas de vista',
    'Problemas de oído',
    'Problemas de equilibrio',
    'Problemas de circulación',
    'Problemas de sueño',
    'Ansiedad',
    'Depresión',
    'Claustrofobia',
    'Vértigo',
    'Epilepsia',
    'Artritis',
    'Osteoporosis',
    'Otros'
  ],

  medications: [
    'Ninguno',
    'Antihistamínicos',
    'Broncodilatadores',
    'Antiinflamatorios',
    'Analgésicos',
    'Antibióticos',
    'Medicamentos para la presión',
    'Medicamentos para la diabetes',
    'Medicamentos para la ansiedad',
    'Medicamentos para el sueño',
    'Vitaminas',
    'Suplementos',
    'Anticoagulantes',
    'Betabloqueadores',
    'Diuréticos',
    'Otros'
  ],

  specialConditions: [
    'Ninguna',
    'Problemas de aclimatación',
    'Sensibilidad al frío',
    'Sensibilidad al calor',
    'Problemas de altitud',
    'Problemas de equilibrio',
    'Problemas de coordinación',
    'Problemas de memoria',
    'Problemas de concentración',
    'Problemas de visión nocturna',
    'Problemas de audición',
    'Problemas de movilidad',
    'Problemas de fuerza',
    'Problemas de resistencia',
    'Mareos en altura',
    'Dolor de cabeza en altura',
    'Otros'
  ],

  // Itinerary Options
  tramos: [
    'Base - Campamento 1',
    'Campamento 1 - Campamento 2',
    'Campamento 2 - Cumbre',
    'Cumbre - Campamento 2',
    'Campamento 2 - Campamento 1',
    'Campamento 1 - Base',
    'Aproximación - Base',
    'Base - Refugio',
    'Refugio - Cumbre',
    'Cumbre - Refugio',
    'Refugio - Base',
    'Glaciar - Cumbre',
    'Cumbre - Glaciar',
    'Arenal - Cumbre',
    'Cumbre - Arenal',
    'Valle - Cumbre',
    'Cumbre - Valle',
    'Río - Cumbre',
    'Cumbre - Río',
    'Bosque - Cumbre',
    'Cumbre - Bosque'
  ],

  supuestos: [
    'Se logra cruzar el glaciar',
    'Las condiciones climáticas son favorables',
    'El grupo mantiene buen ritmo',
    'No hay problemas de aclimatación',
    'El equipo funciona correctamente',
    'La comunicación es efectiva',
    'Los participantes están en buen estado físico',
    'La ruta está libre de obstáculos',
    'El tiempo permite completar el tramo',
    'No hay emergencias médicas',
    'La logística funciona según lo planeado',
    'Los permisos están en orden',
    'El transporte llega a tiempo',
    'La comida y agua son suficientes',
    'El refugio está disponible',
    'El terreno es estable',
    'No hay riesgo de avalancha',
    'La visibilidad es buena',
    'El viento es moderado',
    'La temperatura es adecuada',
    'No hay tormentas previstas',
    'Los puentes están en buen estado',
    'Los senderos están marcados',
    'No hay fauna peligrosa',
    'El agua es potable',
    'Los anclajes están seguros'
  ],

  tipoSupuestos: [
    { value: 'grupo_humano', label: 'Grupo humano' },
    { value: 'itinerario', label: 'Itinerario' },
    { value: 'condiciones', label: 'Condiciones' },
    { value: 'equipo', label: 'Equipo' },
    { value: 'clima', label: 'Clima' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'logistica', label: 'Logística' },
    { value: 'comunicacion', label: 'Comunicación' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'medico', label: 'Médico' }
  ],

  probabilidades: [
    { value: 'muy_improbable', label: 'Muy improbable (D)' },
    { value: 'poco_probable', label: 'Poco probable (C)' },
    { value: 'algo_probable', label: 'Algo probable (B)' },
    { value: 'muy_probable', label: 'Muy probable (A)' }
  ],

  impactos: [
    { value: 'minimo', label: 'Mínimo (A)' },
    { value: 'manejable', label: 'Manejable (B)' },
    { value: 'significativo', label: 'Significativo (C)' },
    { value: 'critico', label: 'Crítico (D)' }
  ],

  // Risk Management Options
  riesgos: [
    'Accidentes de tránsito',
    'Agotamiento',
    'Ahogamiento',
    'Caídas',
    'Caídas en grietas',
    'Congelaciones',
    'Deshidratación',
    'Enterramiento',
    'Extravíos',
    'Golpes',
    'Hipotermia',
    'Intoxicación',
    'Lesiones músculo esqueléticas',
    'Lesiones por sobrecarga',
    'Mal Agudo de Montaña',
    'Retraso',
    'Accidente de escalada',
    'Caída de roca',
    'Tormenta eléctrica',
    'Viento fuerte',
    'Visibilidad reducida',
    'Falta de oxígeno',
    'Edema pulmonar',
    'Edema cerebral',
    'Accidente de montaña',
    'Avalancha',
    'Desprendimiento',
    'Incendio',
    'Accidente de transporte'
  ],

  peligros: [
    'Agua en mal estado',
    'Alimentación inadecuada',
    'Aludes (rocas, barro, agua)',
    'Atascamiento de cuerda',
    'Avalanchas',
    'Caída de rocas',
    'Cambio de condiciones',
    'Deficiencias físicas',
    'Deficiencias técnicas',
    'Deshidratación',
    'Dinámicas de grupo',
    'Equipo/vestuario inadecuado',
    'Extravío',
    'Falla de anclajes',
    'Fallas/pérdidas equipo/vestuario',
    'Falta de aclimatación',
    'Falta de información (topo/meteo)',
    'Grietas',
    'Mala planificación',
    'Mala visibilidad',
    'Retrasos',
    'Terreno irregular oculto',
    'Condiciones climáticas adversas',
    'Falta de experiencia',
    'Equipo defectuoso',
    'Comunicación inefectiva',
    'Decisiones erradas',
    'Fatiga extrema',
    'Falta de coordinación',
    'Falta de entrenamiento',
    'Condiciones meteorológicas extremas',
    'Falta de equipamiento adecuado',
    'Problemas de navegación',
    'Falta de preparación física',
    'Condiciones de terreno peligrosas'
  ]
};

export default formOptions; 