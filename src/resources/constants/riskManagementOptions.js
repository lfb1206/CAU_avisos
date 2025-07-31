// =============================================================================
// OPCIONES DE GESTIÓN DE RIESGOS - DATOS DE AUTORELLENADO
// =============================================================================
// Este archivo contiene las opciones de gestión de riesgos para autocompletar
// información en los formularios
// =============================================================================

export const riskManagementOptions = {
  // Dificultades principales
  dificultadesPrincipales: [
    'Terreno técnico',
    'Pendiente pronunciada',
    'Terreno expuesto',
    'Grietas en glaciar',
    'Distancia larga',
    'Carga pesada',
    'Falta de refugio',
    'Problemas de comunicación',
    'Avalancha',
    'Hipotermia',
    'Mal de altura',
    'Lesión de participante',
    'Condiciones climáticas adversas',
    'Falta de agua',
    'Problemas de navegación',
    'Retrasos en itinerario',
    'Problemas de equipamiento',
    'Problemas de salud',
    'Problemas de transporte',
    'Problemas de logística'
  ],

  // Supuestos clave
  supuestos: [
    'Todos los participantes en buen estado de salud',
    'Terreno técnico dentro de las capacidades del grupo',
    'Terreno estable y seguro para el grupo',
    'Glaciar estable sin grietas peligrosas',
    'Itinerario realizable en el tiempo planificado',
    'Carga adecuada para las capacidades del grupo',
    'Disponibilidad de refugio o campamento adecuado',
    'Comunicación efectiva con base durante toda la actividad',
    'Ausencia de riesgo de avalancha en zona de paso',
    'Temperatura adecuada y equipamiento térmico disponible',
    'Aclimatación adecuada para la altura',
    'Equipamiento en buen estado',
    'Condiciones climáticas favorables',
    'Disponibilidad de fuentes de agua',
    'Navegación clara y sin complicaciones',
    'Cumplimiento del itinerario planificado',
    'Funcionamiento correcto de todo el equipamiento',
    'Salud óptima de todos los participantes',
    'Transporte disponible y funcional',
    'Logística organizada y eficiente'
  ],

  // Tipos de supuestos
  tipoSupuestos: [
    { value: 'grupo_humano', label: 'Grupo Humano' },
    { value: 'condiciones', label: 'Condiciones' },
    { value: 'itinerario', label: 'Itinerario' }
  ],

  // Probabilidades
  probabilidades: [
    { value: 'muy_improbable', label: 'Muy improbable' },
    { value: 'poco_probable', label: 'Poco probable' },
    { value: 'algo_probable', label: 'Algo probable' },
    { value: 'muy_probable', label: 'Muy probable' }
  ],

  // Impactos
  impactos: [
    { value: 'minimo', label: 'Mínimo' },
    { value: 'manejable', label: 'Manejable' },
    { value: 'significativo', label: 'Significativo' },
    { value: 'critico', label: 'Crítico' }
  ],

  // Peligros
  peligros: [
    'Caída',
    'Resbalón',
    'Torcedura',
    'Lesión',
    'Hipotermia',
    'Golpe de calor',
    'Deshidratación',
    'Mal de altura',
    'Avalancha',
    'Caída de rocas',
    'Grietas en glaciar',
    'Tormenta',
    'Viento fuerte',
    'Lluvia intensa',
    'Nieve',
    'Niebla',
    'Visibilidad reducida',
    'Problemas de navegación',
    'Pérdida de ruta',
    'Retraso',
    'Problemas de comunicación',
    'Falla de equipamiento',
    'Problemas de transporte',
    'Accidente vehicular',
    'Problemas de salud',
    'Enfermedad',
    'Lesión preexistente',
    'Problemas de alimentación',
    'Falta de agua',
    'Problemas de higiene'
  ],

  // Riesgos
  riesgos: [
    'Lesión por caída',
    'Lesión por resbalón',
    'Lesión por torcedura',
    'Lesión por impacto',
    'Hipotermia por exposición',
    'Golpe de calor por esfuerzo',
    'Deshidratación por falta de agua',
    'Mal de altura por ascenso rápido',
    'Sepultamiento por avalancha',
    'Lesión por caída de rocas',
    'Caída en grieta de glaciar',
    'Lesión por tormenta',
    'Problemas por viento fuerte',
    'Problemas por lluvia intensa',
    'Problemas por nieve',
    'Pérdida de ruta por niebla',
    'Problemas de navegación',
    'Retraso en itinerario',
    'Problemas de comunicación',
    'Falla crítica de equipamiento',
    'Accidente de transporte',
    'Problemas de salud agudos',
    'Enfermedad por exposición',
    'Agravamiento de lesión',
    'Problemas nutricionales',
    'Falta de agua potable',
    'Problemas sanitarios'
  ]
};

export default riskManagementOptions; 