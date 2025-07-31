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
      tipoSupuesto: 'condiciones',
      probabilidad: 'poco_probable',
      impacto: 'significativo'
    },
    {
      supuesto: 'Equipamiento técnico en buen estado',
      tipoSupuesto: 'condiciones',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    }
  ],
  'Pendiente pronunciada': [
    {
      supuesto: 'Pendiente segura para las capacidades del grupo',
      tipoSupuesto: 'condiciones',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    },
    {
      supuesto: 'Equipamiento de seguridad disponible',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Terreno expuesto': [
    {
      supuesto: 'Terreno estable y seguro para el grupo',
      tipoSupuesto: 'condiciones',
      probabilidad: 'poco_probable',
      impacto: 'critico'
    },
    {
      supuesto: 'Sistemas de aseguramiento disponibles',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'significativo'
    }
  ],
  'Grietas en glaciar': [
    {
      supuesto: 'Glaciar estable sin grietas peligrosas',
      tipoSupuesto: 'condiciones',
      probabilidad: 'poco_probable',
      impacto: 'critico'
    },
    {
      supuesto: 'Equipamiento de rescate en grietas disponible',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'significativo'
    }
  ],
  'Distancia larga': [
    {
      supuesto: 'Itinerario realizable en el tiempo planificado',
      tipoSupuesto: 'itinerario',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    },
    {
      supuesto: 'Condiciones físicas del grupo adecuadas',
      tipoSupuesto: 'grupo_humano',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Carga pesada': [
    {
      supuesto: 'Carga adecuada para las capacidades del grupo',
      tipoSupuesto: 'grupo_humano',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    },
    {
      supuesto: 'Distribución de carga equilibrada',
      tipoSupuesto: 'itinerario',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Falta de refugio': [
    {
      supuesto: 'Disponibilidad de refugio o campamento adecuado',
      tipoSupuesto: 'itinerario',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    },
    {
      supuesto: 'Equipamiento de campamento completo',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Problemas de comunicación': [
    {
      supuesto: 'Comunicación efectiva con base durante toda la actividad',
      tipoSupuesto: 'itinerario',
      probabilidad: 'poco_probable',
      impacto: 'significativo'
    },
    {
      supuesto: 'Equipamiento de comunicación funcional',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Avalancha': [
    {
      supuesto: 'Ausencia de riesgo de avalancha en zona de paso',
      tipoSupuesto: 'condiciones',
      probabilidad: 'poco_probable',
      impacto: 'critico'
    },
    {
      supuesto: 'Condiciones de nieve estables',
      tipoSupuesto: 'condiciones',
      probabilidad: 'algo_probable',
      impacto: 'significativo'
    }
  ],
  'Hipotermia': [
    {
      supuesto: 'Temperatura adecuada y equipamiento térmico disponible',
      tipoSupuesto: 'condiciones',
      probabilidad: 'poco_probable',
      impacto: 'critico'
    },
    {
      supuesto: 'Condiciones climáticas favorables',
      tipoSupuesto: 'condiciones',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    }
  ],
  'Mal de altura': [
    {
      supuesto: 'Aclimatación adecuada para la altura',
      tipoSupuesto: 'grupo_humano',
      probabilidad: 'algo_probable',
      impacto: 'significativo'
    },
    {
      supuesto: 'Ascenso gradual sin complicaciones',
      tipoSupuesto: 'itinerario',
      probabilidad: 'muy_probable',
      impacto: 'manejable'
    }
  ],
  'Lesión de participante': [
    {
      supuesto: 'Todos los participantes en buen estado de salud',
      tipoSupuesto: 'grupo_humano',
      probabilidad: 'poco_probable',
      impacto: 'significativo'
    },
    {
      supuesto: 'Equipamiento de primeros auxilios disponible',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Condiciones climáticas adversas': [
    {
      supuesto: 'Condiciones climáticas favorables',
      tipoSupuesto: 'condiciones',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    },
    {
      supuesto: 'Equipamiento adecuado para condiciones adversas',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Falta de agua': [
    {
      supuesto: 'Disponibilidad de fuentes de agua',
      tipoSupuesto: 'itinerario',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    },
    {
      supuesto: 'Sistema de purificación de agua disponible',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Problemas de navegación': [
    {
      supuesto: 'Navegación clara y sin complicaciones',
      tipoSupuesto: 'itinerario',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    },
    {
      supuesto: 'Equipamiento de navegación funcional',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Retrasos en itinerario': [
    {
      supuesto: 'Cumplimiento del itinerario planificado',
      tipoSupuesto: 'itinerario',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    },
    {
      supuesto: 'Flexibilidad en horarios de regreso',
      tipoSupuesto: 'itinerario',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Problemas de equipamiento': [
    {
      supuesto: 'Funcionamiento correcto de todo el equipamiento',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    },
    {
      supuesto: 'Equipamiento de respaldo disponible',
      tipoSupuesto: 'condiciones',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    }
  ],
  'Problemas de salud': [
    {
      supuesto: 'Salud óptima de todos los participantes',
      tipoSupuesto: 'grupo_humano',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    },
    {
      supuesto: 'Botiquín de primeros auxilios completo',
      tipoSupuesto: 'condiciones',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    }
  ],
  'Problemas de transporte': [
    {
      supuesto: 'Transporte disponible y funcional',
      tipoSupuesto: 'itinerario',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    },
    {
      supuesto: 'Plan de contingencia para transporte',
      tipoSupuesto: 'itinerario',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    }
  ],
  'Problemas de logística': [
    {
      supuesto: 'Logística organizada y eficiente',
      tipoSupuesto: 'itinerario',
      probabilidad: 'muy_probable',
      impacto: 'minimo'
    },
    {
      supuesto: 'Plan de contingencia logístico',
      tipoSupuesto: 'itinerario',
      probabilidad: 'algo_probable',
      impacto: 'manejable'
    }
  ]
};

export default difficultyAssumptionRecommendations; 