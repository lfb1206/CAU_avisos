// =============================================================================
// DATOS DE ACTIVIDADES CON EQUIPAMIENTO
// =============================================================================
// Este archivo relaciona actividades con su equipamiento recomendado
// y permite gestionar estas relaciones de forma centralizada
// =============================================================================

export const activityEquipmentData = {
  // Actividades generales con equipamiento básico
  activities: {
    'Trekking': {
      category: 'Tierra',
      difficulty: 'Baja a Media',
      basicEquipment: [
        { item: 'Botas de trekking', category: 'Calzado', essential: true },
        { item: 'Mochila 20-30L', category: 'Equipo', essential: true },
        { item: 'Bastones de trekking', category: 'Equipo', essential: false },
        { item: 'Bloqueador solar', category: 'Protección Solar', essential: true },
        { item: 'Cantimplora 1L', category: 'Hidratación', essential: true }
      ],
      weatherEquipment: {
        'Lluvia': [
          { item: 'Chaqueta impermeable', category: 'Ropa', essential: true },
          { item: 'Pantalones impermeables', category: 'Ropa', essential: true }
        ],
        'Frío': [
          { item: 'Ropa térmica', category: 'Ropa', essential: true },
          { item: 'Gorro térmico', category: 'Ropa', essential: true }
        ]
      }
    },
    'Montañismo': {
      category: 'Alta Montaña',
      difficulty: 'Media a Alta',
      basicEquipment: [
        { item: 'Botas de montaña', category: 'Calzado', essential: true },
        { item: 'Mochila 40-60L', category: 'Equipo', essential: true },
        { item: 'Piolet', category: 'Equipo de Nieve', essential: true },
        { item: 'Crampones', category: 'Equipo de Nieve', essential: true },
        { item: 'Anteojos de sol UV', category: 'Protección Solar', essential: true }
      ],
      weatherEquipment: {
        'Nieve': [
          { item: 'Polainas', category: 'Equipo de Nieve', essential: true },
          { item: 'Guantes impermeables', category: 'Ropa', essential: true }
        ],
        'Frío Extremo': [
          { item: 'Ropa de alta montaña', category: 'Ropa', essential: true },
          { item: 'Gorro térmico', category: 'Ropa', essential: true }
        ]
      }
    },
    'Escalada': {
      category: 'Técnica',
      difficulty: 'Alta',
      basicEquipment: [
        { item: 'Zapatos de escalada', category: 'Calzado', essential: true },
        { item: 'Arnés', category: 'Seguridad', essential: true },
        { item: 'Cuerda', category: 'Seguridad', essential: true },
        { item: 'Mosquetones', category: 'Seguridad', essential: true },
        { item: 'Casco', category: 'Seguridad', essential: true }
      ],
      weatherEquipment: {
        'Lluvia': [
          { item: 'Chaqueta impermeable', category: 'Ropa', essential: true }
        ],
        'Frío': [
          { item: 'Guantes de escalada', category: 'Ropa', essential: true }
        ]
      }
    },
    'Campamento': {
      category: 'Multidía',
      difficulty: 'Baja a Media',
      basicEquipment: [
        { item: 'Carpa', category: 'Campamento', essential: true },
        { item: 'Saco de dormir', category: 'Campamento', essential: true },
        { item: 'Aislante', category: 'Campamento', essential: true },
        { item: 'Linterna frontal', category: 'Campamento', essential: true },
        { item: 'Cocina de gas', category: 'Campamento', essential: true }
      ],
      weatherEquipment: {
        'Lluvia': [
          { item: 'Carpa impermeable', category: 'Campamento', essential: true }
        ],
        'Frío': [
          { item: 'Saco de dormir térmico', category: 'Campamento', essential: true }
        ]
      }
    }
  },

  // Actividades específicas con equipamiento detallado
  specificActivities: {
    'Ascenso al campamento': {
      parentActivity: 'Trekking',
      difficulty: 'Media',
      equipment: [
        { item: 'Botas de trekking', category: 'Calzado', essential: true },
        { item: 'Mochila 30-40L', category: 'Equipo', essential: true },
        { item: 'Bastones de trekking', category: 'Equipo', essential: false },
        { item: 'Bloqueador solar', category: 'Protección Solar', essential: true }
      ]
    },
    'Descenso del cerro': {
      parentActivity: 'Trekking',
      difficulty: 'Media',
      equipment: [
        { item: 'Botas con buena tracción', category: 'Calzado', essential: true },
        { item: 'Bastones de trekking', category: 'Equipo', essential: true },
        { item: 'Protección solar', category: 'Protección Solar', essential: true }
      ]
    },
    'Escalada en roca': {
      parentActivity: 'Escalada',
      difficulty: 'Alta',
      equipment: [
        { item: 'Zapatos de escalada', category: 'Calzado', essential: true },
        { item: 'Arnés certificado', category: 'Seguridad', essential: true },
        { item: 'Cuerda dinámica', category: 'Seguridad', essential: true },
        { item: 'Mosquetones', category: 'Seguridad', essential: true },
        { item: 'Casco', category: 'Seguridad', essential: true }
      ]
    },
    'Rapel en cascada': {
      parentActivity: 'Escalada',
      difficulty: 'Alta',
      equipment: [
        { item: 'Zapatos de escalada', category: 'Calzado', essential: true },
        { item: 'Arnés certificado', category: 'Seguridad', essential: true },
        { item: 'Cuerda estática', category: 'Seguridad', essential: true },
        { item: 'Descensor', category: 'Seguridad', essential: true },
        { item: 'Casco', category: 'Seguridad', essential: true }
      ]
    },
    'Travesía por glaciar': {
      parentActivity: 'Montañismo',
      difficulty: 'Alta',
      equipment: [
        { item: 'Botas de montaña', category: 'Calzado', essential: true },
        { item: 'Piolet', category: 'Equipo de Nieve', essential: true },
        { item: 'Crampones', category: 'Equipo de Nieve', essential: true },
        { item: 'Arnés', category: 'Seguridad', essential: true },
        { item: 'Cuerda', category: 'Seguridad', essential: true }
      ]
    },
    'Campamento base': {
      parentActivity: 'Campamento',
      difficulty: 'Baja',
      equipment: [
        { item: 'Carpa', category: 'Campamento', essential: true },
        { item: 'Saco de dormir', category: 'Campamento', essential: true },
        { item: 'Aislante', category: 'Campamento', essential: true },
        { item: 'Linterna frontal', category: 'Campamento', essential: true }
      ]
    }
  }
};

// Funciones de utilidad
export const getActivityEquipment = (activityName) => {
  return activityEquipmentData.activities[activityName] || null;
};

export const getSpecificActivityEquipment = (specificActivityName) => {
  return activityEquipmentData.specificActivities[specificActivityName] || null;
};

export const getEquipmentForActivity = (activityName, weatherConditions = []) => {
  const activity = getActivityEquipment(activityName);
  if (!activity) return [];

  let equipment = [...activity.basicEquipment];

  // Agregar equipamiento específico del clima
  weatherConditions.forEach(condition => {
    if (activity.weatherEquipment[condition]) {
      equipment = [...equipment, ...activity.weatherEquipment[condition]];
    }
  });

  return equipment;
};

export const getEquipmentForSpecificActivity = (specificActivityName) => {
  const specificActivity = getSpecificActivityEquipment(specificActivityName);
  if (!specificActivity) return [];

  return specificActivity.equipment;
};

export const getAllActivities = () => {
  return Object.keys(activityEquipmentData.activities);
};

export const getAllSpecificActivities = () => {
  return Object.keys(activityEquipmentData.specificActivities);
};

export default activityEquipmentData; 