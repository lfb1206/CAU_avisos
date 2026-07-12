'use client';
import React, { useEffect } from 'react';
import { transportOptions } from '../../constants/transportOptions';
import AutocompleteInput from './AutocompleteInput';

export default function TransportForm({
  transport,
  index,
  onUpdate,
  onRemove,
  getConductorOptions
}) {
  const isAutoParticular = transport.tipo?.toLowerCase() === 'auto particular';

  // Clear auto-particular fields when switching away from that type
  useEffect(() => {
    if (transport.tipo && !isAutoParticular) {
      onUpdate(index, 'conductor', '');
      onUpdate(index, 'tipoCombustible', '');
      onUpdate(index, 'tipoAuto', '');
      onUpdate(index, 'anioVehiculo', '');
      onUpdate(index, 'capacidad', '');
      onUpdate(index, 'marca', '');
      onUpdate(index, 'modelo', '');
      onUpdate(index, 'color', '');
      onUpdate(index, 'patente', '');
    }
  }, [transport.tipo]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="border border-gray-200 rounded-lg p-4 md:p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900">
          Transporte {index + 1}
        </h4>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AutocompleteInput
          label="Tipo"
          value={(() => {
            const selectedOption = transportOptions.transportTypes.find(option => option.value === transport.tipo);
            return selectedOption ? selectedOption.label : transport.tipo || '';
          })()}
          onChange={(value) => {
            const selectedOption = transportOptions.transportTypes.find(option => option.label === value);
            const actualValue = selectedOption ? selectedOption.value : value;
            onUpdate(index, 'tipo', actualValue);
          }}
          options={transportOptions.transportTypes.map(t => t.label)}
          placeholder="Seleccione o escriba el tipo de transporte"
          required
        />

        {isAutoParticular && (
          <>
            <AutocompleteInput
              label="Conductor"
              value={transport.conductor || ''}
              onChange={(value) => onUpdate(index, 'conductor', value)}
              options={getConductorOptions()}
              placeholder="Seleccione o escriba el conductor"
              required
            />

            <AutocompleteInput
              label="Marca"
              value={transport.marca || ''}
              onChange={(value) => onUpdate(index, 'marca', value)}
              options={transportOptions.vehicleBrands}
              placeholder="Seleccione o escriba la marca"
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <input
                type="text"
                value={transport.modelo || ''}
                onChange={(e) => onUpdate(index, 'modelo', e.target.value)}
                placeholder="Modelo del vehículo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="text"
                value={transport.color || ''}
                onChange={(e) => onUpdate(index, 'color', e.target.value)}
                placeholder="Color del vehículo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Patente</label>
              <input
                type="text"
                value={transport.patente || ''}
                onChange={(e) => onUpdate(index, 'patente', e.target.value)}
                placeholder="Patente del vehículo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Tipo de Combustible
                <div className="relative group" id="tooltip-combustible">
                  <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    <div className="font-semibold mb-1">Factores de emisión por combustible:</div>
                    <div>Gasolina: 0.15 kg CO2/km</div>
                    <div>Diesel: 0.17 kg CO2/km</div>
                    <div>Eléctrico: 0.05 kg CO2/km</div>
                    <div>Híbrido: 0.10 kg CO2/km</div>
                  </span>
                </div>
              </label>
              <select
                value={transport.tipoCombustible || ''}
                onChange={(e) => onUpdate(index, 'tipoCombustible', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione tipo de combustible</option>
                <option value="gasolina">Gasolina</option>
                <option value="diesel">Diesel</option>
                <option value="electrico">Eléctrico</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Tipo de Auto
                <div className="relative group" id="tooltip-tipo-auto">
                  <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    <div className="font-semibold mb-1">Tipos de auto y factores de emisión:</div>
                    <div><strong>SUV:</strong> Camioneta alta (ej: RAV4, CR-V)</div>
                    <div><strong>Sedán:</strong> Auto normal (ej: Corolla, Civic)</div>
                    <div><strong>Pickup:</strong> Camioneta con caja (ej: Hilux, Ranger)</div>
                    <div><strong>Van:</strong> Furgón de pasajeros (ej: Hiace, Sprinter)</div>
                    <div><strong>Hatchback:</strong> Auto chico (ej: Swift, Yaris)</div>
                    <div><strong>Station Wagon:</strong> Familiar (ej: Subaru Outback)</div>
                    <div><strong>Jeep:</strong> Vehículo todoterreno (ej: Wrangler, Defender)</div>
                  </span>
                </div>
              </label>
              <select
                value={transport.tipoAuto || ''}
                onChange={(e) => onUpdate(index, 'tipoAuto', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione tipo de auto</option>
                <option value="suv">SUV (Camioneta alta)</option>
                <option value="sedan">Sedán (Auto normal)</option>
                <option value="pickup">Pickup (Camioneta con caja)</option>
                <option value="van">Van (Furgón de pasajeros)</option>
                <option value="hatchback">Hatchback (Auto chico)</option>
                <option value="station_wagon">Station Wagon (Familiar)</option>
                <option value="jeep">Jeep (Vehículo todoterreno)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Año del Vehículo
                <div className="relative group" id="tooltip-anio">
                  <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    <div className="font-semibold mb-1">Factor de eficiencia por año:</div>
                    <div>2020+: 0.9 (más eficiente)</div>
                    <div>2015-2019: 0.95</div>
                    <div>2010-2014: 1.0</div>
                    <div>2005-2009: 1.05</div>
                    <div>&lt;2005: 1.1 (menos eficiente)</div>
                  </span>
                </div>
              </label>
              <input
                type="number"
                value={transport.anioVehiculo || ''}
                onChange={(e) => onUpdate(index, 'anioVehiculo', e.target.value)}
                placeholder="Ej: 2020"
                min="1990"
                max="2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Capacidad (pasajeros)
                <div className="relative group" id="tooltip-capacidad">
                  <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    <div className="font-semibold mb-1">Factor de ocupación:</div>
                    <div>8+ pasajeros: 0.7 (transporte colectivo)</div>
                    <div>4-7 pasajeros: 0.85 (van/SUV)</div>
                    <div>&lt;4 pasajeros: 1.0 (auto particular)</div>
                    <div className="mt-1 text-gray-300">* Más pasajeros = menor huella per cápita</div>
                  </span>
                </div>
              </label>
              <input
                type="number"
                value={transport.capacidad || ''}
                onChange={(e) => onUpdate(index, 'capacidad', e.target.value)}
                placeholder="Ej: 5"
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Distancia (km)</label>
          <input
            type="number"
            value={transport.distancia || ''}
            onChange={(e) => onUpdate(index, 'distancia', e.target.value)}
            placeholder="Distancia total ida y vuelta"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Huella de Carbono (kg CO2)</label>
          <input
            type="number"
            value={transport.huellaCarbono || ''}
            onChange={(e) => onUpdate(index, 'huellaCarbono', e.target.value)}
            placeholder="Calculado automáticamente"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            readOnly
          />
          <p className="text-xs text-gray-500">
            {isAutoParticular ?
              'Huella total del viaje del vehículo (incluye combustible, tipo de auto, año y ocupación).' :
             transport.tipo?.toLowerCase() === 'bus' ?
              'Huella total del viaje del bus (incluye combustible y factor de ocupación).' :
             transport.tipo?.toLowerCase() === 'metro' || transport.tipo?.toLowerCase() === 'tren' ?
              'Huella por viaje individual (transporte público).' :
             transport.tipo?.toLowerCase() === 'helicóptero' || transport.tipo?.toLowerCase() === 'barco privado' ?
              'Huella total del viaje (transporte privado).' :
             transport.tipo?.toLowerCase() === 'avión' || transport.tipo?.toLowerCase() === 'ferry' ?
              'Huella por viaje individual (transporte comercial/público).' :
              'Huella por viaje individual (taxi/uber).'}
          </p>
          <p className="text-xs text-blue-600 font-medium">
            Para auto particular y bus: divide entre pasajeros para obtener huella por persona.
          </p>
        </div>
      </div>
    </div>
  );
}
