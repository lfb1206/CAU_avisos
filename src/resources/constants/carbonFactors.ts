// Carbon emission factors for transport footprint calculations.
// These are numeric constants used in client-side calculations — not form option data.

export type FuelType = 'gasolina' | 'diesel' | 'electrico' | 'hibrido';
export type VehicleType = 'suv' | 'sedan' | 'pickup' | 'van' | 'hatchback' | 'station_wagon' | 'jeep';

/** Factors by fuel type (kg CO2/km) */
export const fuelFactors: Record<FuelType, number> = {
  gasolina: 0.15,
  diesel: 0.17,
  electrico: 0.05, // Considering Chilean energy mix
  hibrido: 0.10,
};

/** Factors by transport type (kg CO2/km per TRIP) */
export const transportTypeFactors: Record<string, number> = {
  'auto particular': 0.20,
  'bus': 0.08,
  'taxi/uber': 0.18,
  'metro': 0.03,
  'tren': 0.04,
  'helicóptero': 0.45,
  'barco privado': 0.20,
  'avión': 0.25,
  'ferry': 0.10,
};

/** Factors by car type — only relevant for auto particular */
export const vehicleFactors: Record<VehicleType, number> = {
  suv: 0.25,
  sedan: 0.18,
  pickup: 0.28,
  van: 0.22,
  hatchback: 0.16,
  station_wagon: 0.20,
  jeep: 0.30,
};

/** Efficiency factor based on vehicle year — newer vehicles are more efficient */
export function getEfficiencyFactor(anio: string | undefined): number {
  if (!anio) return 1.0;
  const year = parseInt(anio, 10);
  if (year >= 2020) return 0.9;
  if (year >= 2015) return 0.95;
  if (year >= 2010) return 1.0;
  if (year >= 2005) return 1.05;
  return 1.1;
}

/** Occupancy factor — more passengers per vehicle = lower footprint per capita */
export function getOccupancyFactor(capacidad: string | undefined, _tipo: string): number {
  if (!capacidad) return 1.0;
  const cap = parseInt(capacidad, 10);
  if (cap >= 8) return 0.7;
  if (cap >= 4) return 0.85;
  return 1.0;
}

// Namespace-style re-export for consumers that used carbonEmissionFactors.xxx
export const carbonEmissionFactors = {
  fuelFactors,
  transportTypeFactors,
  vehicleFactors,
  getEfficiencyFactor,
  getOccupancyFactor,
};
