import { PrismaClient } from '@prisma/client';

// ── Medical options ───────────────────────────────────────────────────────────

const bloodTypes = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Desconocido',
];

const allergies = [
  'Ninguna', 'Polen', 'Ácaros', 'Polvo', 'Pelos de animales',
  'Picaduras de insectos', 'Frutos secos', 'Mariscos', 'Lácteos', 'Gluten',
  'Penicilina', 'Látex', 'Metales', 'Lana', 'Otros medicamentos',
];

const medicalConditions = [
  'Ninguna', 'Asma', 'Diabetes', 'Hipertensión', 'Epilepsia',
  'Problemas cardíacos', 'Problemas respiratorios', 'Problemas de visión',
  'Problemas de audición', 'Problemas de movilidad', 'Problemas de equilibrio',
  'Problemas de aclimatación', 'Problemas de presión', 'Problemas de azúcar',
  'Problemas de tiroides', 'Problemas renales', 'Problemas hepáticos',
  'Problemas digestivos', 'Problemas neurológicos', 'Problemas psiquiátricos',
];

const medications = [
  'Ninguno', 'Antihistamínicos', 'Broncodilatadores', 'Metformina',
  'Enalapril', 'Insulina', 'Anticoagulantes', 'Antidepresivos', 'Ansiolíticos',
  'Analgésicos', 'Antiinflamatorios', 'Antibióticos', 'Corticoides',
  'Betabloqueantes', 'Calcioantagonistas', 'Diuréticos', 'Estatinas',
  'Antiplaquetarios', 'Anticonvulsivos', 'Hormonas tiroideas',
];

// ── Transport options ─────────────────────────────────────────────────────────

const transportTypes = [
  'auto particular', 'bus', 'taxi/uber', 'metro', 'tren',
  'helicóptero', 'avión', 'ferry', 'barco privado',
];

const vehicleBrands = [
  'Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi',
  'Ford', 'Chevrolet', 'Dodge', 'Jeep', 'Chrysler',
  'Volkswagen', 'Audi', 'BMW', 'Mercedes-Benz', 'Volvo',
  'Hyundai', 'Kia', 'Suzuki', 'Daihatsu',
  'Peugeot', 'Renault', 'Citroën', 'Fiat', 'Otro',
];

// ── Activity equipment data ───────────────────────────────────────────────────

type EquipmentEntry = {
  item: string;
  category: string;
  essential: boolean;
};

type WeatherEquipment = Record<string, EquipmentEntry[]>;

type ActivityData = {
  category: string;
  difficulty: string;
  basicEquipment: EquipmentEntry[];
  weatherEquipment: WeatherEquipment;
};

type SpecificActivityData = {
  parentActivity: string;
  difficulty: string;
  equipment: EquipmentEntry[];
};

type ActivityEquipmentJson = {
  activities: Record<string, ActivityData>;
  specificActivities: Record<string, SpecificActivityData>;
};

const activityEquipmentData: ActivityEquipmentJson = {
  activities: {
    Trekking: {
      category: 'Tierra',
      difficulty: 'Baja a Media',
      basicEquipment: [
        { item: 'Botas de trekking', category: 'Calzado', essential: true },
        { item: 'Mochila 20-30L', category: 'Equipo', essential: true },
        { item: 'Bastones de trekking', category: 'Equipo', essential: false },
        { item: 'Bloqueador solar', category: 'Protección Solar', essential: true },
        { item: 'Cantimplora 1L', category: 'Hidratación', essential: true },
      ],
      weatherEquipment: {
        Lluvia: [
          { item: 'Chaqueta impermeable', category: 'Ropa', essential: true },
          { item: 'Pantalones impermeables', category: 'Ropa', essential: true },
        ],
        Frío: [
          { item: 'Ropa térmica', category: 'Ropa', essential: true },
          { item: 'Gorro térmico', category: 'Ropa', essential: true },
        ],
      },
    },
    Montañismo: {
      category: 'Alta Montaña',
      difficulty: 'Media a Alta',
      basicEquipment: [
        { item: 'Botas de montaña', category: 'Calzado', essential: true },
        { item: 'Mochila 40-60L', category: 'Equipo', essential: true },
        { item: 'Piolet', category: 'Equipo de Nieve', essential: true },
        { item: 'Crampones', category: 'Equipo de Nieve', essential: true },
        { item: 'Anteojos de sol UV', category: 'Protección Solar', essential: true },
      ],
      weatherEquipment: {
        Nieve: [
          { item: 'Polainas', category: 'Equipo de Nieve', essential: true },
          { item: 'Guantes impermeables', category: 'Ropa', essential: true },
        ],
        'Frío Extremo': [
          { item: 'Ropa de alta montaña', category: 'Ropa', essential: true },
          { item: 'Gorro térmico', category: 'Ropa', essential: true },
        ],
      },
    },
    Escalada: {
      category: 'Técnica',
      difficulty: 'Alta',
      basicEquipment: [
        { item: 'Zapatos de escalada', category: 'Calzado', essential: true },
        { item: 'Arnés', category: 'Seguridad', essential: true },
        { item: 'Cuerda', category: 'Seguridad', essential: true },
        { item: 'Mosquetones', category: 'Seguridad', essential: true },
        { item: 'Casco', category: 'Seguridad', essential: true },
      ],
      weatherEquipment: {
        Lluvia: [
          { item: 'Chaqueta impermeable', category: 'Ropa', essential: true },
        ],
        Frío: [
          { item: 'Guantes de escalada', category: 'Ropa', essential: true },
        ],
      },
    },
    Campamento: {
      category: 'Multidía',
      difficulty: 'Baja a Media',
      basicEquipment: [
        { item: 'Carpa', category: 'Campamento', essential: true },
        { item: 'Saco de dormir', category: 'Campamento', essential: true },
        { item: 'Aislante', category: 'Campamento', essential: true },
        { item: 'Linterna frontal', category: 'Campamento', essential: true },
        { item: 'Cocina de gas', category: 'Campamento', essential: true },
      ],
      weatherEquipment: {
        Lluvia: [
          { item: 'Carpa impermeable', category: 'Campamento', essential: true },
        ],
        Frío: [
          { item: 'Saco de dormir térmico', category: 'Campamento', essential: true },
        ],
      },
    },
  },
  specificActivities: {
    'Ascenso al campamento': {
      parentActivity: 'Trekking',
      difficulty: 'Media',
      equipment: [
        { item: 'Botas de trekking', category: 'Calzado', essential: true },
        { item: 'Mochila 30-40L', category: 'Equipo', essential: true },
        { item: 'Bastones de trekking', category: 'Equipo', essential: false },
        { item: 'Bloqueador solar', category: 'Protección Solar', essential: true },
      ],
    },
    'Descenso del cerro': {
      parentActivity: 'Trekking',
      difficulty: 'Media',
      equipment: [
        { item: 'Botas con buena tracción', category: 'Calzado', essential: true },
        { item: 'Bastones de trekking', category: 'Equipo', essential: true },
        { item: 'Protección solar', category: 'Protección Solar', essential: true },
      ],
    },
    'Escalada en roca': {
      parentActivity: 'Escalada',
      difficulty: 'Alta',
      equipment: [
        { item: 'Zapatos de escalada', category: 'Calzado', essential: true },
        { item: 'Arnés certificado', category: 'Seguridad', essential: true },
        { item: 'Cuerda dinámica', category: 'Seguridad', essential: true },
        { item: 'Mosquetones', category: 'Seguridad', essential: true },
        { item: 'Casco', category: 'Seguridad', essential: true },
      ],
    },
    'Rapel en cascada': {
      parentActivity: 'Escalada',
      difficulty: 'Alta',
      equipment: [
        { item: 'Zapatos de escalada', category: 'Calzado', essential: true },
        { item: 'Arnés certificado', category: 'Seguridad', essential: true },
        { item: 'Cuerda estática', category: 'Seguridad', essential: true },
        { item: 'Descensor', category: 'Seguridad', essential: true },
        { item: 'Casco', category: 'Seguridad', essential: true },
      ],
    },
    'Travesía por glaciar': {
      parentActivity: 'Montañismo',
      difficulty: 'Alta',
      equipment: [
        { item: 'Botas de montaña', category: 'Calzado', essential: true },
        { item: 'Piolet', category: 'Equipo de Nieve', essential: true },
        { item: 'Crampones', category: 'Equipo de Nieve', essential: true },
        { item: 'Arnés', category: 'Seguridad', essential: true },
        { item: 'Cuerda', category: 'Seguridad', essential: true },
      ],
    },
    'Campamento base': {
      parentActivity: 'Campamento',
      difficulty: 'Baja',
      equipment: [
        { item: 'Carpa', category: 'Campamento', essential: true },
        { item: 'Saco de dormir', category: 'Campamento', essential: true },
        { item: 'Aislante', category: 'Campamento', essential: true },
        { item: 'Linterna frontal', category: 'Campamento', essential: true },
      ],
    },
  },
};

// ── Checklist items type ──────────────────────────────────────────────────────

type ChecklistItem = {
  categoria: string;
  item: string;
  cantidad: number;
  observaciones: string;
};

type ChecklistEntry = {
  name: string;
  imprescindibles: ChecklistItem[];
  aconsejables: ChecklistItem[];
};

const wikiexploraChecklists: Record<string, ChecklistEntry> = {
  tipo1: {
    name: 'Ruta de baja altitud, sin acampe, nieve ni frío',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para caminata en terreno fácil' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Opcional: cortos' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo2: {
    name: 'Ruta de mediana altitud, sin acampe ni nieve, algo de frío',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para terreno moderado' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Ideal tela sintética tipo polar' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para frío moderado' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Ropa', item: 'Cortaviento liviano', cantidad: 1, observaciones: 'Protección contra viento' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Ropa', item: 'Guantes de primera capa', cantidad: 1, observaciones: 'Para frío' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo3: {
    name: 'Ruta sin acampe, con nieve',
    imprescindibles: [
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Obligatorio para nieve' },
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar labial', cantidad: 1, observaciones: 'Protección labios' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual (nieve no se derrite a tiempo sin cocinilla)' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Ropa', item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Equipo', item: 'Polainas', cantidad: 1, observaciones: 'Salvo nieve escasa' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Raquetas', cantidad: 1, observaciones: 'Dependiendo de la cantidad de nieve' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo4: {
    name: 'Ruta de baja altitud, sin nieve ni frío, con acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para caminata en terreno fácil' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Opcional: cortos' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo5: {
    name: 'Ruta con nieve y acampe',
    imprescindibles: [
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Obligatorio para nieve' },
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar labial', cantidad: 1, observaciones: 'Protección labios' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual (nieve no se derrite a tiempo sin cocinilla)' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Ropa', item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Equipo', item: 'Polainas', cantidad: 1, observaciones: 'Salvo nieve escasa' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Raquetas', cantidad: 1, observaciones: 'Dependiendo de la cantidad de nieve' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo6: {
    name: 'Alta montaña, ruta no técnica y sin caminata sobre hielo',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol o antiparras con protección UV', cantidad: 1, observaciones: 'Protección UV alta' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Tercera capa superior', cantidad: 1, observaciones: 'Puede ser de baja aislación' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal de montaña' },
      { categoria: 'Ropa', item: 'Gorro para el frío', cantidad: 1, observaciones: 'Protección térmica' },
      { categoria: 'Ropa', item: 'Guantes delgados', cantidad: 1, observaciones: 'Para frío' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Recipiente para el agua', cantidad: 1, observaciones: 'Mínimo 1L' },
      { categoria: 'Equipo', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Alimentación', item: 'Comida', cantidad: 1, observaciones: 'Ración de marcha' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Medicina', item: 'Acetazolamida', cantidad: 1, observaciones: 'Para mal de altura' },
      { categoria: 'Equipo', item: 'Cortaplumas o cuchillo de camping', cantidad: 1, observaciones: 'Multiuso' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radios', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Equipo', item: 'Cargador para el teléfono en el auto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Pilas de repuesto para GPS', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Bolsas durables y distintivas para distribuir la comida', cantidad: 1, observaciones: 'Organización' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol de repuesto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo7: {
    name: 'Alta montaña, ruta no técnica pero con caminata sobre hielo',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para alta montaña con hielo' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol o antiparras con protección UV', cantidad: 1, observaciones: 'Protección UV alta' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Tercera capa superior', cantidad: 1, observaciones: 'Puede ser de baja aislación' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal de montaña' },
      { categoria: 'Ropa', item: 'Gorro para el frío', cantidad: 1, observaciones: 'Protección térmica' },
      { categoria: 'Ropa', item: 'Guantes delgados', cantidad: 1, observaciones: 'Para frío' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Recipiente para el agua', cantidad: 1, observaciones: 'Mínimo 1L' },
      { categoria: 'Equipo', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Alimentación', item: 'Comida', cantidad: 1, observaciones: 'Ración de marcha' },
      { categoria: 'Equipo de Nieve', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en hielo' },
      { categoria: 'Equipo de Nieve', item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Medicina', item: 'Acetazolamida', cantidad: 1, observaciones: 'Para mal de altura' },
      { categoria: 'Equipo', item: 'Cortaplumas o cuchillo de camping', cantidad: 1, observaciones: 'Multiuso' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radios', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Equipo', item: 'Cargador para el teléfono en el auto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Pilas de repuesto para GPS', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Bolsas durables y distintivas para distribuir la comida', cantidad: 1, observaciones: 'Organización' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol de repuesto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo8: {
    name: 'Trekking seco de altitud, con acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol o antiparras con protección UV', cantidad: 1, observaciones: 'Protección UV alta' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Tercera capa superior', cantidad: 1, observaciones: 'Puede ser de baja aislación' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal de montaña' },
      { categoria: 'Ropa', item: 'Gorro para el frío', cantidad: 1, observaciones: 'Protección térmica' },
      { categoria: 'Ropa', item: 'Guantes delgados', cantidad: 1, observaciones: 'Para frío' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Recipiente para el agua', cantidad: 1, observaciones: 'Mínimo 1L' },
      { categoria: 'Equipo', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Alimentación', item: 'Comida', cantidad: 1, observaciones: 'Ración de marcha' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Medicina', item: 'Acetazolamida', cantidad: 1, observaciones: 'Para mal de altura' },
      { categoria: 'Equipo', item: 'Cortaplumas o cuchillo de camping', cantidad: 1, observaciones: 'Multiuso' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radios', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Equipo', item: 'Cargador para el teléfono en el auto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Pilas de repuesto para GPS', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Bolsas durables y distintivas para distribuir la comida', cantidad: 1, observaciones: 'Organización' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol de repuesto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' },
    ],
  },
  tipo9: {
    name: 'Mediamontaña no técnica, sin caminata sobre hielo, sin o poca nieve, con acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para mediamontaña' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para mediamontaña' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' },
    ],
  },
  tipo10: {
    name: 'Mediamontaña no técnica, con caminata sobre hielo o altas pendientes de nieve, con acampe',
    imprescindibles: [
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Obligatorio para nieve' },
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar labial', cantidad: 1, observaciones: 'Protección labios' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual (nieve no se derrite a tiempo sin cocinilla)' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Ropa', item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Equipo', item: 'Polainas', cantidad: 1, observaciones: 'Salvo nieve escasa' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
      { categoria: 'Equipo de Nieve', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en nieve' },
      { categoria: 'Equipo de Nieve', item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Raquetas', cantidad: 1, observaciones: 'Dependiendo de la cantidad de nieve' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' },
    ],
  },
  tipo11: {
    name: 'Trekking multidía en baja altura, en zona templada lluviosa',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Chaqueta resistente al agua', cantidad: 1, observaciones: 'Impermeable o respirable' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' },
    ],
  },
  tipo12: {
    name: 'Ruta en Patagonia en primavera o verano sin acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Chaqueta resistente al agua', cantidad: 1, observaciones: 'Impermeable o respirable' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo13: {
    name: 'Mediamontaña no técnica, con caminata sobre hielo o altas pendientes de nieve, sin acampe',
    imprescindibles: [
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Obligatorio para nieve' },
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar labial', cantidad: 1, observaciones: 'Protección labios' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual (nieve no se derrite a tiempo sin cocinilla)' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Ropa', item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Equipo', item: 'Polainas', cantidad: 1, observaciones: 'Salvo nieve escasa' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' },
      { categoria: 'Equipo de Nieve', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en nieve' },
      { categoria: 'Equipo de Nieve', item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Raquetas', cantidad: 1, observaciones: 'Dependiendo de la cantidad de nieve' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo14: {
    name: 'Travesía sobre glaciar agrietado, sin escalada en hielo',
    imprescindibles: [
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Obligatorio para nieve' },
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar labial', cantidad: 1, observaciones: 'Protección labios' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Ropa', item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Equipo', item: 'Polainas', cantidad: 1, observaciones: 'Para nieve' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Equipo de Nieve', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en glaciar' },
      { categoria: 'Equipo de Nieve', item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo' },
      { categoria: 'Seguridad', item: 'Arnés', cantidad: 1, observaciones: 'Para encordamiento' },
      { categoria: 'Seguridad', item: 'Cuerda', cantidad: 1, observaciones: 'Para encordamiento' },
      { categoria: 'Seguridad', item: 'Mosquetones', cantidad: 4, observaciones: 'Para encordamiento' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo15: {
    name: 'Trekking seco de altitud, sin acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol o antiparras con protección UV', cantidad: 1, observaciones: 'Protección UV alta' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Tercera capa superior', cantidad: 1, observaciones: 'Puede ser de baja aislación' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal de montaña' },
      { categoria: 'Ropa', item: 'Gorro para el frío', cantidad: 1, observaciones: 'Protección térmica' },
      { categoria: 'Ropa', item: 'Guantes delgados', cantidad: 1, observaciones: 'Para frío' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Recipiente para el agua', cantidad: 1, observaciones: 'Mínimo 1L' },
      { categoria: 'Equipo', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Alimentación', item: 'Comida', cantidad: 1, observaciones: 'Ración de marcha' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Medicina', item: 'Acetazolamida', cantidad: 1, observaciones: 'Para mal de altura' },
      { categoria: 'Equipo', item: 'Cortaplumas o cuchillo de camping', cantidad: 1, observaciones: 'Multiuso' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radios', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Equipo', item: 'Cargador para el teléfono en el auto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Pilas de repuesto para GPS', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Bolsas durables y distintivas para distribuir la comida', cantidad: 1, observaciones: 'Organización' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol de repuesto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
  tipo16: {
    name: 'Mediamontaña en trópicos, sin acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Chaqueta resistente al agua', cantidad: 1, observaciones: 'Impermeable o respirable' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' },
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos y con canastillos de invierno' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa de la ruta', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
    ],
  },
};

// ── Seed function ─────────────────────────────────────────────────────────────

export async function seedChecklistsAndOptions(prisma: PrismaClient): Promise<void> {
  console.log('  Seeding medical options...');

  // Blood types
  for (const value of bloodTypes) {
    await prisma.basicFormOption.upsert({
      where: { type_value: { type: 'medical_blood_type', value } },
      update: {},
      create: { type: 'medical_blood_type', value },
    });
  }

  // Allergies (deduplicate — source has a duplicate 'Látex')
  const uniqueAllergies = [...new Set(allergies)];
  for (const value of uniqueAllergies) {
    await prisma.basicFormOption.upsert({
      where: { type_value: { type: 'medical_allergy', value } },
      update: {},
      create: { type: 'medical_allergy', value },
    });
  }

  // Medical conditions
  for (const value of medicalConditions) {
    await prisma.basicFormOption.upsert({
      where: { type_value: { type: 'medical_condition', value } },
      update: {},
      create: { type: 'medical_condition', value },
    });
  }

  // Medications
  for (const value of medications) {
    await prisma.basicFormOption.upsert({
      where: { type_value: { type: 'medical_medication', value } },
      update: {},
      create: { type: 'medical_medication', value },
    });
  }

  console.log('  Seeding transport options...');

  // Transport types — store the value field (e.g. 'auto particular')
  for (const value of transportTypes) {
    await prisma.basicFormOption.upsert({
      where: { type_value: { type: 'transport_type', value } },
      update: {},
      create: { type: 'transport_type', value },
    });
  }

  // Vehicle brands
  for (const value of vehicleBrands) {
    await prisma.basicFormOption.upsert({
      where: { type_value: { type: 'transport_vehicle_brand', value } },
      update: {},
      create: { type: 'transport_vehicle_brand', value },
    });
  }

  console.log('  Seeding activity equipment data...');

  for (const [name, data] of Object.entries(activityEquipmentData.activities)) {
    await prisma.activity.upsert({
      where: { name },
      update: { equipment_recommendations: data as unknown as object },
      create: { name, equipment_recommendations: data as unknown as object },
    });
  }

  console.log('  Seeding wikiexplora checklists...');

  for (const [key, checklist] of Object.entries(wikiexploraChecklists)) {
    await prisma.checklist.upsert({
      where: { key },
      update: {
        name: checklist.name,
        items: { imprescindibles: checklist.imprescindibles, aconsejables: checklist.aconsejables },
      },
      create: {
        key,
        name: checklist.name,
        items: { imprescindibles: checklist.imprescindibles, aconsejables: checklist.aconsejables },
      },
    });
  }

  console.log('  Done seeding checklists and options.');
}
