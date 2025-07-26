// Mapeo de actividades con equipos recomendados
export const activityEquipmentMapping = {
  // Actividades de montaña
  'ascenso': {
    categoria: 'Equipo de Escalada',
    items: [
      { item: 'Casco', cantidad: 1, observaciones: 'Obligatorio para ascensos' },
      { item: 'Arnés', cantidad: 1, observaciones: 'Para seguridad en ascensos' },
      { item: 'Cuerda', cantidad: 1, observaciones: 'Longitud según ruta' },
      { item: 'Mosquetones', cantidad: 6, observaciones: 'Mínimo 6 unidades' },
      { item: 'Aseguradores', cantidad: 2, observaciones: 'Para rapel y aseguramiento' }
    ]
  },
  'rapel': {
    categoria: 'Equipo de Escalada',
    items: [
      { item: 'Casco', cantidad: 1, observaciones: 'Obligatorio para rapel' },
      { item: 'Arnés', cantidad: 1, observaciones: 'Para seguridad en rapel' },
      { item: 'Asegurador', cantidad: 1, observaciones: 'Para control de descenso' },
      { item: 'Cuerda', cantidad: 1, observaciones: 'Longitud según altura' }
    ]
  },
  'escalada': {
    categoria: 'Equipo de Escalada',
    items: [
      { item: 'Casco', cantidad: 1, observaciones: 'Obligatorio para escalada' },
      { item: 'Arnés', cantidad: 1, observaciones: 'Para seguridad' },
      { item: 'Cuerda', cantidad: 1, observaciones: 'Longitud según ruta' },
      { item: 'Mosquetones', cantidad: 8, observaciones: 'Para anclajes' },
      { item: 'Aseguradores', cantidad: 2, observaciones: 'Para aseguramiento' },
      { item: 'Pies de gato', cantidad: 1, observaciones: 'Calzado específico' }
    ]
  },
  
  // Actividades de campamento
  'campamento': {
    categoria: 'Equipo de Campamento',
    items: [
      { item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
      { item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' }
    ]
  },
  'pernocta': {
    categoria: 'Equipo de Campamento',
    items: [
      { item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
      { item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' }
    ]
  },
  
  // Actividades de nieve/hielo
  'nieve': {
    categoria: 'Equipo de Nieve',
    items: [
      { item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en nieve' },
      { item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo' },
      { item: 'Gafas de sol', cantidad: 1, observaciones: 'Protección UV' },
      { item: 'Protector solar', cantidad: 1, observaciones: 'Factor alto' },
      { item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' }
    ]
  },
  'glaciar': {
    categoria: 'Equipo de Nieve',
    items: [
      { item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en glaciar' },
      { item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo' },
      { item: 'Arnés', cantidad: 1, observaciones: 'Para encordamiento' },
      { item: 'Cuerda', cantidad: 1, observaciones: 'Para encordamiento' },
      { item: 'Mosquetones', cantidad: 4, observaciones: 'Para encordamiento' },
      { item: 'Gafas de sol', cantidad: 1, observaciones: 'Protección UV' }
    ]
  },
  
  // Actividades de trekking
  'trekking': {
    categoria: 'Equipo de Trekking',
    items: [
      { item: 'Bastones', cantidad: 2, observaciones: 'Para estabilidad' },
      { item: 'Botas', cantidad: 1, observaciones: 'Impermeables y cómodas' },
      { item: 'Mochila', cantidad: 1, observaciones: 'Capacidad según duración' },
      { item: 'Botella de agua', cantidad: 1, observaciones: 'Mínimo 1L' }
    ]
  },
  'caminata': {
    categoria: 'Equipo de Trekking',
    items: [
      { item: 'Bastones', cantidad: 2, observaciones: 'Para estabilidad' },
      { item: 'Botas', cantidad: 1, observaciones: 'Impermeables y cómodas' },
      { item: 'Mochila', cantidad: 1, observaciones: 'Capacidad según duración' },
      { item: 'Botella de agua', cantidad: 1, observaciones: 'Mínimo 1L' }
    ]
  },
  
  // Actividades acuáticas
  'vadeo': {
    categoria: 'Equipo de Vadeo',
    items: [
      { item: 'Botas de vadeo', cantidad: 1, observaciones: 'Impermeables' },
      { item: 'Bastón de vadeo', cantidad: 1, observaciones: 'Para estabilidad' },
      { item: 'Cuerda', cantidad: 1, observaciones: 'Para aseguramiento' }
    ]
  },
  'río': {
    categoria: 'Equipo de Vadeo',
    items: [
      { item: 'Botas de vadeo', cantidad: 1, observaciones: 'Impermeables' },
      { item: 'Bastón de vadeo', cantidad: 1, observaciones: 'Para estabilidad' },
      { item: 'Cuerda', cantidad: 1, observaciones: 'Para aseguramiento' }
    ]
  },
  
  // Equipo básico siempre recomendado
  'basico': {
    categoria: 'Equipo Básico',
    items: [
      { item: 'Botiquín', cantidad: 1, observaciones: 'Primeros auxilios' },
      { item: 'Silbato', cantidad: 1, observaciones: 'Para emergencias' },
      { item: 'Manta térmica', cantidad: 1, observaciones: 'Para emergencias' },
      { item: 'Navaja', cantidad: 1, observaciones: 'Multiuso' },
      { item: 'Encendedor', cantidad: 1, observaciones: 'Con repuesto' }
    ]
  }
};

// Función para analizar actividades y sugerir equipo
export const analyzeActivitiesForEquipment = (itinerario, actividadGeneral) => {
  const suggestedEquipment = new Map(); // Usar Map para evitar duplicados
  
  // Agregar equipo básico siempre
  if (activityEquipmentMapping.basico) {
    activityEquipmentMapping.basico.items.forEach(item => {
      const key = `${item.item}-${item.categoria}`;
      suggestedEquipment.set(key, {
        ...item,
        categoria: activityEquipmentMapping.basico.categoria,
        source: 'básico'
      });
    });
  }
  
  // Analizar actividad general
  if (actividadGeneral) {
    const generalActivity = actividadGeneral.toLowerCase();
    Object.keys(activityEquipmentMapping).forEach(activityKey => {
      if (generalActivity.includes(activityKey) && activityKey !== 'basico') {
        const mapping = activityEquipmentMapping[activityKey];
        mapping.items.forEach(item => {
          const key = `${item.item}-${item.categoria}`;
          if (!suggestedEquipment.has(key)) {
            suggestedEquipment.set(key, {
              ...item,
              categoria: mapping.categoria,
              source: 'actividad general'
            });
          }
        });
      }
    });
  }
  
  // Analizar actividades específicas de cada tramo
  itinerario.forEach((day, dayIndex) => {
    if (day.actividad) {
      const dayActivity = day.actividad.toLowerCase();
      Object.keys(activityEquipmentMapping).forEach(activityKey => {
        if (dayActivity.includes(activityKey) && activityKey !== 'basico') {
          const mapping = activityEquipmentMapping[activityKey];
          mapping.items.forEach(item => {
            const key = `${item.item}-${item.categoria}`;
            if (!suggestedEquipment.has(key)) {
              suggestedEquipment.set(key, {
                ...item,
                categoria: mapping.categoria,
                source: `tramo ${dayIndex + 1}: ${day.tramo || 'Sin tramo'}`
              });
            }
          });
        }
      });
    }
  });
  
  return Array.from(suggestedEquipment.values());
}; 