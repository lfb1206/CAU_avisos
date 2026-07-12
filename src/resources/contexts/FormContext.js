'use client';
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { LOCALSTORAGE_KEY, ASSUMPTION_ACTIONS } from '@/resources/constants/formConstants';

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
  equipo: [],
  transporte: [],
  cuerposRescate: [
    { nombre: 'Socorro Andino Santiago', telefono: '226994764 - 226989094', incluir: true },
    { nombre: 'Carabineros', telefono: '133', incluir: true },
    { nombre: 'Bomberos', telefono: '132', incluir: true },
    { nombre: 'FACH (Fuerza Aérea - Rescate Aéreo)', telefono: '+56 2 2690 1000', incluir: true },
    { nombre: 'Socorro Andino Magallanes', telefono: '+56 9 6594 4314', incluir: false },
    { nombre: 'SAMU (Servicio de Atención Médica de Urgencia)', telefono: '131', incluir: false },
    { nombre: 'PDI (Policía de Investigaciones)', telefono: '134', incluir: false },
    { nombre: 'Socorro Andino Los Andes', telefono: '+56 9 9442 4294', incluir: false },
    { nombre: 'Socorro Andino Valparaíso', telefono: '+56 9 8225 7085', incluir: false },
    { nombre: 'Cuerpo de Socorro Andino Aconcagua', telefono: '+56 9 9164 5890', incluir: false },
    { nombre: 'CONAF (Emergencias en Parques Nacionales)', telefono: '+56 2 2663 0000', incluir: false },
    { nombre: 'Armada de Chile (Rescate Marítimo)', telefono: '+56 32 220 8888', incluir: false }
  ]
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          [action.field]: action.value
        }
      };

    case 'ADD_ITEM': {
      const currentSection = Array.isArray(state[action.section]) ? state[action.section] : [];
      return {
        ...state,
        [action.section]: [...currentSection, action.item]
      };
    }

    case 'REMOVE_ITEM': {
      const sectionToRemoveFrom = Array.isArray(state[action.section]) ? state[action.section] : [];
      return {
        ...state,
        [action.section]: sectionToRemoveFrom.filter((_, index) => index !== action.index)
      };
    }

    case 'UPDATE_ITEM': {
      const sectionToUpdate = Array.isArray(state[action.section]) ? state[action.section] : [];
      const updatedSection = [...sectionToUpdate];
      if (updatedSection[action.index]) {
        if (action.field) {
          updatedSection[action.index] = { ...updatedSection[action.index], [action.field]: action.value };
        } else if (action.updates) {
          updatedSection[action.index] = { ...updatedSection[action.index], ...action.updates };
        }
      }
      return {
        ...state,
        [action.section]: updatedSection
      };
    }

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

    case 'LOAD_SAVED_DATA': {
      const loadedData = {
        ...initialFormState,
        ...action.data,
        currentStep: action.data.currentStep || 1,
        basicInfo: {
          ...initialFormState.basicInfo,
          ...(action.data.basicInfo || {})
        },
        participantes: Array.isArray(action.data.participantes) ? action.data.participantes : [],
        itinerario: Array.isArray(action.data.itinerario) ? action.data.itinerario : [],
        equipo: Array.isArray(action.data.equipo) ? action.data.equipo : [],
        transporte: Array.isArray(action.data.transporte) ? action.data.transporte : [],
        cuerposRescate: Array.isArray(action.data.cuerposRescate) ? action.data.cuerposRescate : initialFormState.cuerposRescate
      };
      return loadedData;
    }

    default:
      return state;
  }
};

// --- Shared validation helpers ---

const isParticipantValid = (p) =>
  p.nombre && p.rut && p.telefono && p.contactoEmergencia && p.telefonoEmergencia;

const isItineraryDayValid = (day, reporteDate) => {
  if (!day.tramo || !day.actividades || day.actividades.length === 0 || !day.horaInicio || !day.horaFin) {
    return false;
  }
  if (day.fecha) {
    const today = new Date(new Date().toISOString().split('T')[0]);
    const tramoDate = new Date(day.fecha);
    if (tramoDate < today) return false;
    if (reporteDate && tramoDate > reporteDate) return false;
  }
  return true;
};

const getRisksCompletionStatus = (itinerario) => {
  const supuestosGestionar = [];
  const supuestosIncompletos = [];

  itinerario.forEach((day) => {
    (day.supuestos || []).forEach((assumption) => {
      if (
        assumption.accion === ASSUMPTION_ACTIONS.GESTIONAR ||
        (assumption.accion === ASSUMPTION_ACTIONS.MONITOREO_INTENSO && assumption.incluir === true)
      ) {
        supuestosGestionar.push(assumption);
        if (!assumption.causas || assumption.causas.length === 0) {
          supuestosIncompletos.push(assumption);
        } else {
          const hasIncompleteCausas = assumption.causas.some(
            (causa) =>
              !causa.peligros || causa.peligros.length === 0 ||
              !causa.riesgos || causa.riesgos.length === 0 ||
              causa.peligros.some((p) => !p.trim()) ||
              causa.riesgos.some((r) => !r.trim())
          );
          if (hasIncompleteCausas) supuestosIncompletos.push(assumption);
        }
      }
    });
  });

  return supuestosGestionar.length === 0 || supuestosIncompletos.length === 0;
};

// ---

const FormContext = createContext();

export const FormContextProvider = ({ children }) => {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.basicInfo?.weatherImages) {
          parsedData.basicInfo.weatherImages = parsedData.basicInfo.weatherImages.map((img) => ({
            ...img,
            url: img.base64 || ''
          }));
        }
        dispatch({ type: 'LOAD_SAVED_DATA', data: parsedData });
      } catch (error) {
        console.error('Error loading form data from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    const dataToSave = {
      ...formData,
      basicInfo: {
        ...formData.basicInfo,
        weatherImages: formData.basicInfo.weatherImages || []
      }
    };
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, isInitialized]);

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
      const field = Object.keys(updatedItem)[0];
      const value = Object.values(updatedItem)[0];
      dispatch({ type: 'UPDATE_ITEM', section, index, field, value });
    } else if (typeof updatedItem === 'object') {
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
    localStorage.removeItem(LOCALSTORAGE_KEY);
  };

  const updateWeatherImages = (images) => {
    dispatch({ type: 'UPDATE_WEATHER_IMAGES', images });
  };

  const isStepValid = (step) => {
    const participantes = Array.isArray(formData.participantes) ? formData.participantes : [];
    const equipo = Array.isArray(formData.equipo) ? formData.equipo : [];
    const transporte = Array.isArray(formData.transporte) ? formData.transporte : [];
    const itinerario = Array.isArray(formData.itinerario) ? formData.itinerario : [];
    const reporteDate = formData.basicInfo.fechaHoraReporteRegreso
      ? new Date(formData.basicInfo.fechaHoraReporteRegreso)
      : null;

    switch (step) {
      case 1: {
        const basicValid =
          formData.basicInfo.contactoCAU &&
          formData.basicInfo.telefonoContacto &&
          formData.basicInfo.emailContacto &&
          formData.basicInfo.fechaHoraReporteRegreso &&
          formData.basicInfo.actividad &&
          formData.basicInfo.cerroOSector;
        const inReachValid =
          !formData.basicInfo.llevaInreach ||
          (formData.basicInfo.numeroInreach && formData.basicInfo.codigoInreach);
        return Boolean(basicValid && inReachValid);
      }
      case 2:
        return participantes.length > 0 && participantes.every(isParticipantValid);
      case 3:
        return itinerario.length > 0 && itinerario.every((day) => isItineraryDayValid(day, reporteDate));
      case 4: // FIX BUG-1: added return statement
        return getRisksCompletionStatus(itinerario);
      case 5: {
        if (equipo.length === 0 && transporte.length === 0) return true;
        const validEquipo = equipo.filter((e) => e.categoria && e.item && e.cantidad);
        const validTransporte = transporte.filter((t) => {
          if (!t.tipo || !t.distancia) return false;
          if (t.tipo.toLowerCase() === 'auto particular') return Boolean(t.conductor);
          return true;
        });
        if (equipo.length > 0 && validEquipo.length !== equipo.length) return false;
        if (transporte.length > 0 && validTransporte.length !== transporte.length) return false;
        return true;
      }
      case 6:
        return checkFormCompletion();
      default:
        return false;
    }
  };

  const checkFormCompletion = () => {
    const participantes = Array.isArray(formData.participantes) ? formData.participantes : [];
    const equipo = Array.isArray(formData.equipo) ? formData.equipo : [];
    const transporte = Array.isArray(formData.transporte) ? formData.transporte : [];
    const itinerario = Array.isArray(formData.itinerario) ? formData.itinerario : [];
    const reporteDate = formData.basicInfo.fechaHoraReporteRegreso
      ? new Date(formData.basicInfo.fechaHoraReporteRegreso)
      : null;

    const basicInfoComplete =
      formData.basicInfo.contactoCAU &&
      formData.basicInfo.telefonoContacto &&
      formData.basicInfo.emailContacto &&
      formData.basicInfo.fechaHoraReporteRegreso &&
      formData.basicInfo.actividad &&
      formData.basicInfo.cerroOSector;

    const inReachComplete =
      !formData.basicInfo.llevaInreach ||
      (formData.basicInfo.numeroInreach && formData.basicInfo.codigoInreach);

    const participantsComplete =
      participantes.length > 0 && participantes.every(isParticipantValid);

    const itineraryComplete =
      itinerario.length > 0 && itinerario.every((day) => isItineraryDayValid(day, reporteDate));

    // FIX BUG-2: uses shared helper with plural field names (peligros/riesgos)
    const risksComplete = getRisksCompletionStatus(itinerario);

    const validEquipo = equipo.filter((e) => e.categoria && e.item && e.cantidad);
    const validTransporte = transporte.filter((t) => t.tipo && t.conductor);
    const equipmentComplete = equipo.length === 0 || validEquipo.length === equipo.length;
    const transportComplete = transporte.length === 0 || validTransporte.length === transporte.length;

    return Boolean(
      basicInfoComplete &&
      inReachComplete &&
      participantsComplete &&
      itineraryComplete &&
      risksComplete &&
      equipmentComplete &&
      transportComplete
    );
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

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormContextProvider');
  }
  return context;
};
