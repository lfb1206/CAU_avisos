'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial form state
const initialFormState = {
  currentStep: 1,
  basicInfo: {
    contactoCAU: '',
    telefonoContacto: '',
    emailContacto: '',
    fechaHoraReporteRegreso: '',
    actividad: '',
    cerroOSector: '',
    ruta: '',
    linkPronostico: '',
    linkRuta: '',
    weatherImages: []
  },
  participantes: [],
  itinerario: [],
  riesgos: [],
  equipo: [],
  transporte: []
};

// Form reducer
const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          [action.field]: action.value
        }
      };
    
    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          [action.field]: action.value
        }
      };
    
    case 'ADD_ITEM':
      // Ensure the section exists and is an array
      const currentSection = Array.isArray(state[action.section]) ? state[action.section] : [];
      return {
        ...state,
        [action.section]: [...currentSection, action.item]
      };
    
    case 'REMOVE_ITEM':
      // Ensure the section exists and is an array
      const sectionToRemoveFrom = Array.isArray(state[action.section]) ? state[action.section] : [];
      return {
        ...state,
        [action.section]: sectionToRemoveFrom.filter((_, index) => index !== action.index)
      };
    
    case 'UPDATE_ITEM':
      // Ensure the section exists and is an array
      const sectionToUpdate = Array.isArray(state[action.section]) ? state[action.section] : [];
      const updatedSection = [...sectionToUpdate];
      if (updatedSection[action.index]) {
        if (action.field) {
          // Single field update
          updatedSection[action.index] = { ...updatedSection[action.index], [action.field]: action.value };
        } else if (action.updates) {
          // Multiple field update
          updatedSection[action.index] = { ...updatedSection[action.index], ...action.updates };
        }
      }
      return {
        ...state,
        [action.section]: updatedSection
      };
    
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step
      };
    
    case 'RESET_FORM':
      return initialFormState;
    
    case 'UPDATE_WEATHER_IMAGES':
      return {
        ...state,
        basicInfo: {
          ...state.basicInfo,
          weatherImages: action.images
        }
      };
    
    case 'LOAD_SAVED_DATA':
      // Ensure all array fields exist in the loaded data
      const loadedData = {
        ...initialFormState,
        ...action.data,
        basicInfo: {
          ...initialFormState.basicInfo,
          ...(action.data.basicInfo || {})
        },
        participantes: Array.isArray(action.data.participantes) ? action.data.participantes : [],
        itinerario: Array.isArray(action.data.itinerario) ? action.data.itinerario : [],
        riesgos: Array.isArray(action.data.riesgos) ? action.data.riesgos : [],
        equipo: Array.isArray(action.data.equipo) ? action.data.equipo : [],
        transporte: Array.isArray(action.data.transporte) ? action.data.transporte : []
      };
      return loadedData;
    
    default:
      return state;
  }
};

// Create context
const FormContext = createContext();

// Provider component
export const FormContextProvider = ({ children }) => {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);

  // Load data from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('formData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Use the new LOAD_SAVED_DATA action to properly merge data
        dispatch({ type: 'LOAD_SAVED_DATA', data: parsedData });
      } catch (error) {
        console.error('Error loading form data from sessionStorage:', error);
      }
    }
  }, []);

  // Save data to sessionStorage whenever formData changes
  useEffect(() => {
    // Don't save weather images to sessionStorage as they're too large
    const dataToSave = {
      ...formData,
      basicInfo: {
        ...formData.basicInfo,
        weatherImages: [] // Don't save images to sessionStorage
      }
    };
    sessionStorage.setItem('formData', JSON.stringify(dataToSave));
  }, [formData]);

  // Context functions
  const updateFormField = (section, field, value) => {
    dispatch({ type: 'UPDATE_FORM_FIELD', section, field, value });
  };

  const addItem = (section, item) => {
    dispatch({ type: 'ADD_ITEM', section, item });
  };

  const removeItem = (section, index) => {
    dispatch({ type: 'REMOVE_ITEM', section, index });
  };

  const updateItem = (section, index, updatedItem) => {
    if (typeof updatedItem === 'object' && Object.keys(updatedItem).length === 1) {
      // Single field update (backward compatibility)
      const field = Object.keys(updatedItem)[0];
      const value = Object.values(updatedItem)[0];
      dispatch({ type: 'UPDATE_ITEM', section, index, field, value });
    } else if (typeof updatedItem === 'object') {
      // Multiple field update - single dispatch
      dispatch({ type: 'UPDATE_ITEM', section, index, updates: updatedItem });
    } else {
      dispatch({ type: 'UPDATE_ITEM', section, index, field: 'value', value: updatedItem });
    }
  };

  const goToStep = (step) => {
    dispatch({ type: 'SET_STEP', step });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
    sessionStorage.removeItem('formData');
  };

  const updateWeatherImages = (images) => {
    dispatch({ type: 'UPDATE_WEATHER_IMAGES', images });
  };

  // Check if current step is valid - UPDATED FOR INTEGRATED MEDICAL DATA
  const isStepValid = (step) => {
    // Ensure arrays exist before checking
    const participantes = Array.isArray(formData.participantes) ? formData.participantes : [];
    const equipo = Array.isArray(formData.equipo) ? formData.equipo : [];
    const transporte = Array.isArray(formData.transporte) ? formData.transporte : [];

    switch (step) {
      case 1: // Basic Info
        const basicValid = formData.basicInfo.contactoCAU &&
                          formData.basicInfo.telefonoContacto &&
                          formData.basicInfo.emailContacto &&
                          formData.basicInfo.fechaHoraReporteRegreso &&
                          formData.basicInfo.actividad &&
                          formData.basicInfo.cerroOSector;
        
        // If InReach is enabled, check those fields too
        const inReachValid = !formData.basicInfo.llevaInreach || 
                           (formData.basicInfo.numeroInreach && formData.basicInfo.codigoInreach);
        
        return basicValid && inReachValid;
      case 2: // Participants (now includes medical data)
        return participantes.length > 0 &&
               participantes.every(p => p.nombre && p.rut && p.telefono && p.contactoEmergencia && p.telefonoEmergencia);
      case 3: // Itinerary & Assumptions - MADE OPTIONAL
        return true; // Always valid, optional step
      case 4: // Risk Management - MADE OPTIONAL
        return true; // Always valid, optional step
      case 5: // Equipment & Transport
        // Check if there's at least one valid equipment or transport
        const validEquipo = equipo.filter(e => e.categoria && e.item && e.cantidad);
        const validTransporte = transporte.filter(t => t.tipo && t.conductor);
        return validEquipo.length > 0 || validTransporte.length > 0;
      case 6: // Final Review (removed medical data step)
        return checkFormCompletion();
      default:
        return false;
    }
  };

  // Check if form is complete for PDF generation - UPDATED FOR INTEGRATED MEDICAL DATA
  const checkFormCompletion = () => {
    const participantes = Array.isArray(formData.participantes) ? formData.participantes : [];
    const equipo = Array.isArray(formData.equipo) ? formData.equipo : [];
    const transporte = Array.isArray(formData.transporte) ? formData.transporte : [];

    const basicInfoComplete = formData.basicInfo.contactoCAU &&
                             formData.basicInfo.telefonoContacto &&
                             formData.basicInfo.emailContacto &&
                             formData.basicInfo.fechaHoraReporteRegreso &&
                             formData.basicInfo.actividad &&
                             formData.basicInfo.cerroOSector;

    const inReachComplete = !formData.basicInfo.llevaInreach || 
                           (formData.basicInfo.numeroInreach && formData.basicInfo.codigoInreach);

    const participantsComplete = participantes.length > 0 &&
                               participantes.every(p => p.nombre && p.rut && p.telefono && p.contactoEmergencia && p.telefonoEmergencia);

    const validEquipo = equipo.filter(e => e.categoria && e.item && e.cantidad);
    const validTransporte = transporte.filter(t => t.tipo && t.conductor);
    const equipmentComplete = validEquipo.length > 0 || validTransporte.length > 0;

    return basicInfoComplete && inReachComplete && participantsComplete && equipmentComplete;
  };

  const value = {
    formData,
    updateFormField,
    addItem,
    removeItem,
    updateItem,
    goToStep,
    resetForm,
    updateWeatherImages,
    isStepValid,
    checkFormCompletion
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

// Hook to use form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormContextProvider');
  }
  return context;
}; 