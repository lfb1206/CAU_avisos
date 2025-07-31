// =============================================================================
// OPCIONES DE TRANSPORTE - DATOS DE AUTORELLENADO
// =============================================================================
// Este archivo contiene las opciones de transporte para autocompletar
// información en los formularios
// =============================================================================

export const transportOptions = {
  transportTypes: [
    { value: 'auto particular', label: 'Auto particular' },
    { value: 'bus', label: 'Bus (transporte público)' },
    { value: 'taxi/uber', label: 'Taxi/Uber' },
    { value: 'metro', label: 'Metro' },
    { value: 'tren', label: 'Tren' },
    { value: 'helicóptero', label: 'Helicóptero' },
    { value: 'avión', label: 'Avión' },
    { value: 'ferry', label: 'Ferry' },
    { value: 'barco privado', label: 'Barco privado' }
  ],
  vehicleBrands: [
    'Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi',
    'Ford', 'Chevrolet', 'Dodge', 'Jeep', 'Chrysler',
    'Volkswagen', 'Audi', 'BMW', 'Mercedes-Benz', 'Volvo',
    'Hyundai', 'Kia', 'Suzuki', 'Daihatsu',
    'Peugeot', 'Renault', 'Citroën', 'Fiat',
    'Otro'
  ]
};

// Factores de emisión de carbono (kg CO2/km)
export const carbonEmissionFactors = {
  // Factores por tipo de combustible
  fuelFactors: {
    gasolina: 0.15,
    diesel: 0.17,
    electrico: 0.05, // Considerando mix energético chileno
    hibrido: 0.10
  },

  // Factores por tipo de transporte (kg CO2/km por VIAJE)
  transportTypeFactors: {
    // Vehículos motorizados (por viaje)
    'auto particular': 0.20,
    'bus': 0.08, // Bus público por viaje
    'taxi/uber': 0.18,
    
    // Transporte público (por viaje individual)
    'metro': 0.03, // Por viaje individual
    'tren': 0.04,  // Por viaje individual
    
    // Transporte privado (por viaje total)
    'helicóptero': 0.45, // Privado - no se divide
    'barco privado': 0.20, // Privado - no se divide
    
    // Transporte público masivo (por viaje individual)
    'avión': 0.25, // Comercial - por pasajero
    'ferry': 0.10  // Público - por pasajero
  },

  // Factores por tipo de auto (solo si es auto particular)
  vehicleFactors: {
    suv: 0.25,
    sedan: 0.18,
    pickup: 0.28,
    van: 0.22,
    hatchback: 0.16,
    station_wagon: 0.20,
    jeep: 0.30
  },

  // Factor de eficiencia por año del vehículo
  getEfficiencyFactor: (anio) => {
    if (!anio) return 1.0;
    const year = parseInt(anio);
    if (year >= 2020) return 0.9;  // Vehículos nuevos más eficientes
    if (year >= 2015) return 0.95;
    if (year >= 2010) return 1.0;
    if (year >= 2005) return 1.05;
    return 1.1;  // Vehículos antiguos menos eficientes
  },

  // Factor de ocupación (más pasajeros = menor huella per cápita)
  getOccupancyFactor: (capacidad, tipo) => {
    if (!capacidad) return 1.0;
    const cap = parseInt(capacidad);
    if (cap >= 8) return 0.7;  // Transporte colectivo
    if (cap >= 4) return 0.85; // Van/SUV con varios pasajeros
    return 1.0;  // Auto particular
  },

  // Información sobre cómo se calcula cada tipo
  calculationInfo: {
    'auto particular': 'Por viaje total del vehículo (incluye ocupación)',
    'bus': 'Por viaje total del bus (incluye ocupación)',
    'taxi/uber': 'Por viaje individual',
    'metro': 'Por viaje individual',
    'tren': 'Por viaje individual',
    'helicóptero': 'Por viaje total (transporte privado)',
    'avión': 'Por viaje individual (transporte comercial)',
    'ferry': 'Por viaje individual (transporte público)',
    'barco privado': 'Por viaje total (transporte privado)'
  }
}; 