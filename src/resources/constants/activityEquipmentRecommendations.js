// =============================================================================
// RECOMENDACIONES DE EQUIPO POR ACTIVIDAD - DATOS DE AUTORELLENADO
// =============================================================================
// Este archivo contiene las recomendaciones de equipamiento basadas en
// el tipo de actividad y el itinerario
// =============================================================================

export const activityEquipmentRecommendations = {
  // Recomendaciones por tipo de actividad
  activityRecommendations: {
    'Trekking': [
      { categoria: 'Calzado', item: 'Botas de trekking', cantidad: 1, observaciones: 'Impermeables y cómodas', source: 'Actividad: Trekking' },
      { categoria: 'Ropa', item: 'Ropa técnica', cantidad: 1, observaciones: 'Capa base y media', source: 'Actividad: Trekking' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto', source: 'Actividad: Trekking' },
      { categoria: 'Hidratación', item: 'Cantimplora', cantidad: 1, observaciones: 'Mínimo 1L', source: 'Actividad: Trekking' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Con track precargado', source: 'Actividad: Trekking' }
    ],
    'Montañismo': [
      { categoria: 'Calzado', item: 'Botas de montaña', cantidad: 1, observaciones: 'Para alta montaña', source: 'Actividad: Montañismo' },
      { categoria: 'Ropa', item: 'Ropa de alta montaña', cantidad: 1, observaciones: 'Tres capas', source: 'Actividad: Montañismo' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol', cantidad: 1, observaciones: 'Protección UV alta', source: 'Actividad: Montañismo' },
      { categoria: 'Equipo', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión', source: 'Actividad: Montañismo' },
      { categoria: 'Equipo', item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo', source: 'Actividad: Montañismo' }
    ],
    'Escalada': [
      { categoria: 'Calzado', item: 'Zapatos de escalada', cantidad: 1, observaciones: 'Específicos para escalada', source: 'Actividad: Escalada' },
      { categoria: 'Seguridad', item: 'Arnés', cantidad: 1, observaciones: 'Certificado', source: 'Actividad: Escalada' },
      { categoria: 'Seguridad', item: 'Cuerda', cantidad: 1, observaciones: 'Diámetro apropiado', source: 'Actividad: Escalada' },
      { categoria: 'Seguridad', item: 'Mosquetones', cantidad: 4, observaciones: 'Para aseguramiento', source: 'Actividad: Escalada' },
      { categoria: 'Seguridad', item: 'Casco', cantidad: 1, observaciones: 'Protección contra caída de rocas', source: 'Actividad: Escalada' }
    ],
    'Rapel': [
      { categoria: 'Calzado', item: 'Zapatos de escalada', cantidad: 1, observaciones: 'Para rapel', source: 'Actividad: Rapel' },
      { categoria: 'Seguridad', item: 'Arnés', cantidad: 1, observaciones: 'Certificado', source: 'Actividad: Rapel' },
      { categoria: 'Seguridad', item: 'Cuerda', cantidad: 1, observaciones: 'Longitud suficiente', source: 'Actividad: Rapel' },
      { categoria: 'Seguridad', item: 'Descensor', cantidad: 1, observaciones: 'Para control de descenso', source: 'Actividad: Rapel' },
      { categoria: 'Seguridad', item: 'Casco', cantidad: 1, observaciones: 'Protección contra caída de rocas', source: 'Actividad: Rapel' }
    ],
    'Campamento': [
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas', source: 'Actividad: Campamento' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona', source: 'Actividad: Campamento' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo', source: 'Actividad: Campamento' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto', source: 'Actividad: Campamento' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible', source: 'Actividad: Campamento' }
    ]
  },

  // Recomendaciones por dificultad del terreno
  terrainRecommendations: {
    'Terreno técnico': [
      { categoria: 'Seguridad', item: 'Casco', cantidad: 1, observaciones: 'Protección contra caída de rocas', source: 'Dificultad: Terreno técnico' },
      { categoria: 'Equipo', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión técnica', source: 'Dificultad: Terreno técnico' },
      { categoria: 'Seguridad', item: 'Arnés', cantidad: 1, observaciones: 'Para aseguramiento', source: 'Dificultad: Terreno técnico' }
    ],
    'Pendiente pronunciada': [
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Para estabilidad', source: 'Dificultad: Pendiente pronunciada' },
      { categoria: 'Calzado', item: 'Botas con buena tracción', cantidad: 1, observaciones: 'Para terreno empinado', source: 'Dificultad: Pendiente pronunciada' }
    ],
    'Terreno expuesto': [
      { categoria: 'Seguridad', item: 'Cuerda', cantidad: 1, observaciones: 'Para aseguramiento', source: 'Dificultad: Terreno expuesto' },
      { categoria: 'Seguridad', item: 'Arnés', cantidad: 1, observaciones: 'Para protección', source: 'Dificultad: Terreno expuesto' },
      { categoria: 'Seguridad', item: 'Mosquetones', cantidad: 4, observaciones: 'Para aseguramiento', source: 'Dificultad: Terreno expuesto' }
    ],
    'Grietas en glaciar': [
      { categoria: 'Equipo de Nieve', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en glaciar', source: 'Dificultad: Grietas en glaciar' },
      { categoria: 'Equipo de Nieve', item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo', source: 'Dificultad: Grietas en glaciar' },
      { categoria: 'Seguridad', item: 'Arnés', cantidad: 1, observaciones: 'Para encordamiento', source: 'Dificultad: Grietas en glaciar' },
      { categoria: 'Seguridad', item: 'Cuerda', cantidad: 1, observaciones: 'Para encordamiento', source: 'Dificultad: Grietas en glaciar' }
    ]
  },

  // Recomendaciones por condiciones climáticas
  weatherRecommendations: {
    'Nieve': [
      { categoria: 'Equipo de Nieve', item: 'Polainas', cantidad: 1, observaciones: 'Para nieve', source: 'Clima: Nieve' },
      { categoria: 'Equipo de Nieve', item: 'Raquetas', cantidad: 1, observaciones: 'Dependiendo de la cantidad de nieve', source: 'Clima: Nieve' },
      { categoria: 'Ropa', item: 'Guantes impermeables', cantidad: 1, observaciones: 'Para nieve', source: 'Clima: Nieve' }
    ],
    'Lluvia': [
      { categoria: 'Ropa', item: 'Chaqueta impermeable', cantidad: 1, observaciones: 'Para lluvia', source: 'Clima: Lluvia' },
      { categoria: 'Ropa', item: 'Pantalones impermeables', cantidad: 1, observaciones: 'Para lluvia', source: 'Clima: Lluvia' },
      { categoria: 'Calzado', item: 'Botas impermeables', cantidad: 1, observaciones: 'Para lluvia', source: 'Clima: Lluvia' }
    ],
    'Viento': [
      { categoria: 'Ropa', item: 'Cortaviento', cantidad: 1, observaciones: 'Para viento', source: 'Clima: Viento' },
      { categoria: 'Ropa', item: 'Gorro', cantidad: 1, observaciones: 'Para viento', source: 'Clima: Viento' }
    ],
    'Frío': [
      { categoria: 'Ropa', item: 'Ropa térmica', cantidad: 1, observaciones: 'Para frío', source: 'Clima: Frío' },
      { categoria: 'Ropa', item: 'Guantes térmicos', cantidad: 1, observaciones: 'Para frío', source: 'Clima: Frío' },
      { categoria: 'Ropa', item: 'Gorro térmico', cantidad: 1, observaciones: 'Para frío', source: 'Clima: Frío' }
    ]
  }
};

// Función para analizar actividades y generar recomendaciones
export const analyzeActivitiesForEquipment = (itinerario, actividadGeneral) => {
  const recommendations = [];
  
  // Agregar recomendaciones por actividad general
  if (activityEquipmentRecommendations.activityRecommendations[actividadGeneral]) {
    recommendations.push(...activityEquipmentRecommendations.activityRecommendations[actividadGeneral]);
  }
  
  // Analizar itinerario para dificultades
  itinerario.forEach(day => {
    if (day.dificultadesPrincipales) {
      day.dificultadesPrincipales.forEach(dificultad => {
        if (activityEquipmentRecommendations.terrainRecommendations[dificultad]) {
          recommendations.push(...activityEquipmentRecommendations.terrainRecommendations[dificultad]);
        }
      });
    }
  });
  
  // Eliminar duplicados basándose en item y categoría
  const uniqueRecommendations = recommendations.filter((rec, index, self) => 
    index === self.findIndex(r => r.item === rec.item && r.categoria === rec.categoria)
  );
  
  return uniqueRecommendations;
};

export default activityEquipmentRecommendations; 