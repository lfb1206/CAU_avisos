// =============================================================================
// UTILIDADES DE EXPORTACIÓN E IMPORTACIÓN DE DATOS
// =============================================================================
// Este archivo contiene funciones para exportar e importar datos modificados
// desde el panel de administración
// =============================================================================

import { peopleData } from './peopleData.js';
import { basicFormOptions } from './basicFormOptions.js';
import { medicalOptions } from './medicalOptions.js';
import { transportOptions } from './transportOptions.js';
import { riskManagementOptions } from './riskManagementOptions.js';

/**
 * Exporta los datos actuales a un archivo JSON
 * @param {Object} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 */
export const exportDataToJSON = (data, filename = 'autocomplete_data.json') => {
  const dataToExport = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    data: data
  };

  const jsonString = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Exporta los datos modificados desde el panel de administración
 * @param {Object} modifiedData - Datos modificados
 * @param {string} dataType - Tipo de datos (contacts, participants, etc.)
 */
export const exportModifiedData = (modifiedData, dataType) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${dataType}_modified_${timestamp}.json`;
  
  // Obtener datos originales según el tipo
  let originalData;
  switch(dataType) {
    case 'peopleData':
      originalData = peopleData;
      break;
    case 'basicFormOptions':
      originalData = basicFormOptions;
      break;
    case 'medicalOptions':
      originalData = medicalOptions;
      break;
    case 'transportOptions':
      originalData = transportOptions;
      break;
    case 'riskManagementOptions':
      originalData = riskManagementOptions;
      break;
    default:
      originalData = {};
  }
  
  const exportData = {
    timestamp: new Date().toISOString(),
    dataType: dataType,
    originalData: originalData,
    modifiedData: modifiedData,
    changes: getChanges(originalData, modifiedData)
  };

  exportDataToJSON(exportData, filename);
};

/**
 * Compara datos originales con modificados y retorna los cambios
 * @param {Object} originalData - Datos originales
 * @param {Object} modifiedData - Datos modificados
 * @returns {Object} - Objeto con los cambios detectados
 */
export const getChanges = (originalData, modifiedData) => {
  const changes = {
    added: [],
    removed: [],
    modified: []
  };

  // Encontrar elementos agregados y modificados
  Object.keys(modifiedData).forEach(key => {
    if (!originalData[key]) {
      changes.added.push(key);
    } else if (JSON.stringify(originalData[key]) !== JSON.stringify(modifiedData[key])) {
      changes.modified.push(key);
    }
  });

  // Encontrar elementos eliminados
  Object.keys(originalData).forEach(key => {
    if (!modifiedData[key]) {
      changes.removed.push(key);
    }
  });

  return changes;
};

/**
 * Genera un reporte de cambios
 * @param {Object} changes - Cambios detectados
 * @returns {string} - Reporte formateado
 */
export const generateChangesReport = (changes) => {
  let report = `=== REPORTE DE CAMBIOS ===\n`;
  report += `Fecha: ${new Date().toISOString()}\n\n`;
  
  if (changes.added.length > 0) {
    report += `ELEMENTOS AGREGADOS (${changes.added.length}):\n`;
    changes.added.forEach(item => {
      report += `+ ${item}\n`;
    });
    report += `\n`;
  }
  
  if (changes.removed.length > 0) {
    report += `ELEMENTOS ELIMINADOS (${changes.removed.length}):\n`;
    changes.removed.forEach(item => {
      report += `- ${item}\n`;
    });
    report += `\n`;
  }
  
  if (changes.modified.length > 0) {
    report += `ELEMENTOS MODIFICADOS (${changes.modified.length}):\n`;
    changes.modified.forEach(item => {
      report += `* ${item}\n`;
    });
    report += `\n`;
  }
  
  if (changes.added.length === 0 && changes.removed.length === 0 && changes.modified.length === 0) {
    report += `No se detectaron cambios.\n`;
  }
  
  return report;
};

/**
 * Exporta un reporte de cambios a un archivo de texto
 * @param {Object} changes - Cambios detectados
 * @param {string} filename - Nombre del archivo
 */
export const exportChangesReport = (changes, filename = 'changes_report.txt') => {
  const reportText = generateChangesReport(changes);
  const blob = new Blob([reportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Valida los datos antes de exportar
 * @param {Object} data - Datos a validar
 * @returns {Object} - Resultado de la validación
 */
export const validateDataForExport = (data) => {
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Validar estructura básica
  if (!data || typeof data !== 'object') {
    validation.isValid = false;
    validation.errors.push('Los datos no tienen una estructura válida');
    return validation;
  }

  // Validar datos de contactos
  if (data.savedContacts) {
    Object.entries(data.savedContacts).forEach(([name, contact]) => {
      if (!contact.telefono || !contact.email) {
        validation.warnings.push(`Contacto "${name}" tiene datos incompletos`);
      }
    });
  }

  // Validar datos de participantes
  if (data.savedParticipants) {
    Object.entries(data.savedParticipants).forEach(([name, participant]) => {
      if (!participant.rut || !participant.telefono) {
        validation.warnings.push(`Participante "${name}" tiene datos incompletos`);
      }
    });
  }

  return validation;
};

/**
 * Exporta todos los datos actuales del sistema
 * @param {Object} currentData - Datos actuales del panel
 */
export const exportAllData = (currentData) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `complete_autocomplete_data_${timestamp}.json`;
  
  const exportData = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    description: 'Datos completos de autorellenado del sistema CAU',
    data: {
      peopleData: currentData.people || peopleData,
      basicFormOptions: currentData.basicOptions || basicFormOptions,
      medicalOptions: currentData.medicalOptions || medicalOptions,
      transportOptions: currentData.transportOptions || transportOptions,
      riskManagementOptions: currentData.riskOptions || riskManagementOptions
    }
  };

  // Validar antes de exportar
  const validation = validateDataForExport(exportData.data);
  if (!validation.isValid) {
    throw new Error('Los datos no son válidos para exportar: ' + validation.errors.join(', '));
  }

  if (validation.warnings.length > 0) {
    console.warn('Advertencias en los datos:', validation.warnings);
  }

  exportDataToJSON(exportData, filename);
};

/**
 * Genera un backup de los datos originales
 */
export const createBackup = () => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `backup_original_data_${timestamp}.json`;
  
  const backupData = {
    timestamp: new Date().toISOString(),
    type: 'backup',
    description: 'Backup de datos originales antes de modificaciones',
    data: {
      peopleData,
      basicFormOptions,
      medicalOptions,
      transportOptions,
      riskManagementOptions
    }
  };

  exportDataToJSON(backupData, filename);
};

/**
 * Importa datos desde un archivo JSON
 * @param {File} file - Archivo JSON a importar
 * @returns {Promise<Object>} - Datos importados
 */
export const importDataFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validar estructura básica
        if (!importedData.data) {
          reject(new Error('El archivo no contiene datos válidos'));
          return;
        }

        // Validar datos antes de importar
        const validation = validateDataForExport(importedData.data);
        if (!validation.isValid) {
          reject(new Error('Los datos importados no son válidos: ' + validation.errors.join(', ')));
          return;
        }

        resolve(importedData);
      } catch (error) {
        reject(new Error('Error al parsear el archivo JSON: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsText(file);
  });
};

export default {
  exportDataToJSON,
  exportModifiedData,
  getChanges,
  generateChangesReport,
  exportChangesReport,
  validateDataForExport,
  exportAllData,
  createBackup,
  importDataFromJSON
}; 