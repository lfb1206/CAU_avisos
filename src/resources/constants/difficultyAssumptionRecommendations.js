// =============================================================================
// RECOMENDACIONES DE SUPUESTOS POR DIFICULTAD - DATOS DE AUTORELLENADO
// =============================================================================
// Este archivo contiene las recomendaciones de supuestos basadas en
// las dificultades principales identificadas
// =============================================================================

export const difficultyAssumptionRecommendations = {
  'Terreno técnico': [
    {
      supuesto: 'Terreno técnico dentro de las capacidades del grupo',
      tipoSupuesto: 'terreno',
      probabilidad: 'poco_probable',
      impacto: 'significativo'
    },
    {
      supuesto: 'Equipamiento técnico en buen estado',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    }
  ],
  'Pendiente pronunciada': [
    {
      supuesto: 'Pendiente segura para las capacidades del grupo',
      tipoSupuesto: 'terreno',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    },
    {
      supuesto: 'Equipamiento de seguridad disponible',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'leve'
    }
  ],
  'Terreno expuesto': [
    {
      supuesto: 'Terreno estable y seguro para el grupo',
      tipoSupuesto: 'terreno',
      probabilidad: 'poco_probable',
      impacto: 'critico'
    },
    {
      supuesto: 'Sistemas de aseguramiento disponibles',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'significativo'
    }
  ],
  'Grietas en glaciar': [
    {
      supuesto: 'Glaciar estable sin grietas peligrosas',
      tipoSupuesto: 'terreno',
      probabilidad: 'poco_probable',
      impacto: 'critico'
    },
    {
      supuesto: 'Equipamiento de rescate en grietas disponible',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'significativo'
    }
  ],
  'Distancia larga': [
    {
      supuesto: 'Itinerario realizable en el tiempo planificado',
      tipoSupuesto: 'logistica',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    },
    {
      supuesto: 'Condiciones físicas del grupo adecuadas',
      tipoSupuesto: 'grupo_humano',
      probabilidad: 'probable',
      impacto: 'leve'
    }
  ],
  'Carga pesada': [
    {
      supuesto: 'Carga adecuada para las capacidades del grupo',
      tipoSupuesto: 'grupo_humano',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    },
    {
      supuesto: 'Distribución de carga equilibrada',
      tipoSupuesto: 'logistica',
      probabilidad: 'probable',
      impacto: 'leve'
    }
  ],
  'Falta de refugio': [
    {
      supuesto: 'Disponibilidad de refugio o campamento adecuado',
      tipoSupuesto: 'logistica',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    },
    {
      supuesto: 'Equipamiento de campamento completo',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'leve'
    }
  ],
  'Problemas de comunicación': [
    {
      supuesto: 'Comunicación efectiva con base durante toda la actividad',
      tipoSupuesto: 'comunicacion',
      probabilidad: 'poco_probable',
      impacto: 'significativo'
    },
    {
      supuesto: 'Equipamiento de comunicación funcional',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'moderado'
    }
  ],
  'Avalancha': [
    {
      supuesto: 'Ausencia de riesgo de avalancha en zona de paso',
      tipoSupuesto: 'terreno',
      probabilidad: 'poco_probable',
      impacto: 'critico'
    },
    {
      supuesto: 'Condiciones de nieve estables',
      tipoSupuesto: 'clima',
      probabilidad: 'algo_probable',
      impacto: 'significativo'
    }
  ],
  'Hipotermia': [
    {
      supuesto: 'Temperatura adecuada y equipamiento térmico disponible',
      tipoSupuesto: 'medico',
      probabilidad: 'poco_probable',
      impacto: 'critico'
    },
    {
      supuesto: 'Condiciones climáticas favorables',
      tipoSupuesto: 'clima',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    }
  ],
  'Mal de altura': [
    {
      supuesto: 'Aclimatación adecuada para la altura',
      tipoSupuesto: 'medico',
      probabilidad: 'algo_probable',
      impacto: 'significativo'
    },
    {
      supuesto: 'Ascenso gradual sin complicaciones',
      tipoSupuesto: 'logistica',
      probabilidad: 'probable',
      impacto: 'moderado'
    }
  ],
  'Lesión de participante': [
    {
      supuesto: 'Todos los participantes en buen estado de salud',
      tipoSupuesto: 'medico',
      probabilidad: 'poco_probable',
      impacto: 'significativo'
    },
    {
      supuesto: 'Equipamiento de primeros auxilios disponible',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'leve'
    }
  ],
  'Condiciones climáticas adversas': [
    {
      supuesto: 'Condiciones climáticas favorables',
      tipoSupuesto: 'clima',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    },
    {
      supuesto: 'Equipamiento adecuado para condiciones adversas',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'leve'
    }
  ],
  'Falta de agua': [
    {
      supuesto: 'Disponibilidad de fuentes de agua',
      tipoSupuesto: 'logistica',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    },
    {
      supuesto: 'Sistema de purificación de agua disponible',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'leve'
    }
  ],
  'Problemas de navegación': [
    {
      supuesto: 'Navegación clara y sin complicaciones',
      tipoSupuesto: 'navegacion',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    },
    {
      supuesto: 'Equipamiento de navegación funcional',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'leve'
    }
  ],
  'Retrasos en itinerario': [
    {
      supuesto: 'Cumplimiento del itinerario planificado',
      tipoSupuesto: 'tiempo',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    },
    {
      supuesto: 'Flexibilidad en horarios de regreso',
      tipoSupuesto: 'logistica',
      probabilidad: 'probable',
      impacto: 'leve'
    }
  ],
  'Problemas de equipamiento': [
    {
      supuesto: 'Funcionamiento correcto de todo el equipamiento',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'leve'
    },
    {
      supuesto: 'Equipamiento de respaldo disponible',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    }
  ],
  'Problemas de salud': [
    {
      supuesto: 'Salud óptima de todos los participantes',
      tipoSupuesto: 'medico',
      probabilidad: 'probable',
      impacto: 'leve'
    },
    {
      supuesto: 'Botiquín de primeros auxilios completo',
      tipoSupuesto: 'equipamiento',
      probabilidad: 'probable',
      impacto: 'leve'
    }
  ],
  'Problemas de transporte': [
    {
      supuesto: 'Transporte disponible y funcional',
      tipoSupuesto: 'transporte',
      probabilidad: 'probable',
      impacto: 'leve'
    },
    {
      supuesto: 'Plan de contingencia para transporte',
      tipoSupuesto: 'logistica',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    }
  ],
  'Problemas de logística': [
    {
      supuesto: 'Logística organizada y eficiente',
      tipoSupuesto: 'logistica',
      probabilidad: 'probable',
      impacto: 'leve'
    },
    {
      supuesto: 'Plan de contingencia logístico',
      tipoSupuesto: 'logistica',
      probabilidad: 'algo_probable',
      impacto: 'moderado'
    }
  ]
};

export default difficultyAssumptionRecommendations; 