// =============================================================================
// OPCIONES DE EQUIPAMIENTO - DATOS DE AUTORELLENADO
// =============================================================================
// Este archivo contiene las opciones de equipamiento para autocompletar
// información en los formularios
// =============================================================================

export const equipmentOptions = {
  // Categorías de equipamiento
  equipmentCategories: [
    { value: 'calzado', label: 'Calzado' },
    { value: 'ropa', label: 'Ropa' },
    { value: 'proteccion_solar', label: 'Protección Solar' },
    { value: 'hidratacion', label: 'Hidratación' },
    { value: 'alimentacion', label: 'Alimentación' },
    { value: 'equipo', label: 'Equipo' },
    { value: 'documentacion', label: 'Documentación' },
    { value: 'comunicacion', label: 'Comunicación' },
    { value: 'navegacion', label: 'Navegación' },
    { value: 'primeros_auxilios', label: 'Primeros Auxilios' },
    { value: 'campamento', label: 'Campamento' },
    { value: 'equipo_nieve', label: 'Equipo de Nieve' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'medicina', label: 'Medicina' }
  ],

  // Items de equipamiento por categoría
  equipmentItems: {
    calzado: [
      'Zapatos apropiados',
      'Botas de montaña',
      'Zapatillas de trekking',
      'Botas impermeables',
      'Zapatos de escalada',
      'Botas de alta montaña'
    ],
    ropa: [
      'Primera capa superior',
      'Segunda capa superior',
      'Tercera capa superior',
      'Pantalones cómodos para caminar',
      'Calcetines apropiados',
      'Calcetines de recambio',
      'Gorro para el frío',
      'Guantes delgados',
      'Guantes',
      'Cortaviento liviano',
      'Chaqueta resistente al agua',
      'Gorro para el frío'
    ],
    proteccion_solar: [
      'Bloqueador solar',
      'Bloqueador solar labial',
      'Sombrero para el sol',
      'Anteojos de sol',
      'Anteojos de sol con protección UV',
      'Anteojos de sol o antiparras con protección UV',
      'Anteojos de sol de repuesto'
    ],
    hidratacion: [
      'Agua',
      'Recipiente para el agua',
      'Cantimplora',
      'Botella de agua',
      'Sistema de hidratación'
    ],
    alimentacion: [
      'Ración de marcha',
      'Comida',
      'Snacks',
      'Barras energéticas',
      'Frutos secos',
      'Chocolate'
    ],
    equipo: [
      'Mochila liviana',
      'Mochila amplia',
      'Bastones de trekking',
      'Linterna frontal',
      'Cámara de fotos',
      'Cortaplumas o cuchillo de camping',
      'Pilas de repuesto para GPS',
      'Cargador para el teléfono en el auto',
      'Bolsas durables y distintivas para distribuir la comida'
    ],
    documentacion: [
      'Documentación de la ruta',
      'Mapa del área',
      'Mapa de la ruta',
      'Permisos',
      'Documentos de identidad',
      'Seguros'
    ],
    comunicacion: [
      'Teléfono con batería al 100%',
      'Radio',
      'Radios',
      'Dispositivo de comunicación satelital'
    ],
    navegacion: [
      'GPS',
      'Brújula',
      'Altímetro',
      'Reloj con GPS'
    ],
    primeros_auxilios: [
      'Vendaje adhesivo para ampollas',
      'Botiquín de primeros auxilios',
      'Vendas',
      'Antiséptico',
      'Analgésicos',
      'Antiinflamatorios'
    ],
    campamento: [
      'Carpa',
      'Saco de dormir',
      'Aislante',
      'Linterna frontal',
      'Cocina de gas'
    ],
    equipo_nieve: [
      'Piolet',
      'Crampones',
      'Raquetas',
      'Polainas'
    ],
    seguridad: [
      'Arnés',
      'Cuerda',
      'Mosquetones',
      'Casco',
      'Casco de escalada'
    ],
    medicina: [
      'Acetazolamida',
      'Medicamentos personales',
      'Kit de emergencia médica'
    ]
  }
};

export default equipmentOptions; 