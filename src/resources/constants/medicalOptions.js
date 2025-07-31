// =============================================================================
// OPCIONES MÉDICAS - DATOS DE AUTORELLENADO
// =============================================================================
// Este archivo contiene las opciones médicas para autocompletar
// información de salud en los formularios
// =============================================================================

export const medicalOptions = {
  // Tipos de sangre
  bloodTypes: [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'Desconocido', label: 'Desconocido' }
  ],

  // Alergias comunes
  allergies: [
    'Ninguna',
    'Polen',
    'Ácaros',
    'Polvo',
    'Pelos de animales',
    'Picaduras de insectos',
    'Frutos secos',
    'Mariscos',
    'Lácteos',
    'Gluten',
    'Penicilina',
    'Látex',
    'Metales',
    'Lana',
    'Látex',
    'Otros medicamentos'
  ],

  // Condiciones médicas
  medicalConditions: [
    'Ninguna',
    'Asma',
    'Diabetes',
    'Hipertensión',
    'Epilepsia',
    'Problemas cardíacos',
    'Problemas respiratorios',
    'Problemas de visión',
    'Problemas de audición',
    'Problemas de movilidad',
    'Problemas de equilibrio',
    'Problemas de aclimatación',
    'Problemas de presión',
    'Problemas de azúcar',
    'Problemas de tiroides',
    'Problemas renales',
    'Problemas hepáticos',
    'Problemas digestivos',
    'Problemas neurológicos',
    'Problemas psiquiátricos'
  ],

  // Medicamentos comunes
  medications: [
    'Ninguno',
    'Antihistamínicos',
    'Broncodilatadores',
    'Metformina',
    'Enalapril',
    'Insulina',
    'Anticoagulantes',
    'Antidepresivos',
    'Ansiolíticos',
    'Analgésicos',
    'Antiinflamatorios',
    'Antibióticos',
    'Corticoides',
    'Betabloqueantes',
    'Calcioantagonistas',
    'Diuréticos',
    'Estatinas',
    'Antiplaquetarios',
    'Anticonvulsivos',
    'Hormonas tiroideas'
  ],

  // Condiciones especiales
  specialConditions: [
    'Ninguna',
    'Problemas de aclimatación',
    'Control de azúcar',
    'Control de presión',
    'Alergia a medicamentos',
    'Reacción severa a picaduras',
    'Problemas de equilibrio',
    'Problemas de visión nocturna',
    'Problemas de audición',
    'Problemas de movilidad',
    'Problemas de coordinación',
    'Problemas de memoria',
    'Problemas de concentración',
    'Problemas de sueño',
    'Problemas de ansiedad',
    'Problemas de claustrofobia',
    'Problemas de vértigo',
    'Problemas de mareo',
    'Problemas de náuseas',
    'Problemas de fatiga'
  ]
};

export default medicalOptions; 