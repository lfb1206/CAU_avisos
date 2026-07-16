'use client';
import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { LOCALSTORAGE_KEY, ASSUMPTION_ACTIONS } from '@/resources/constants/formConstants';
import type {
  FormState,
  FormAction,
  FormContextValue,
  Participant,
  ItineraryDay,
  WeatherImage,
} from '@/types';

const initialFormState: FormState = {
  currentStep: 1,
  avisoId: null,
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
    weatherImages: [],
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
    { nombre: 'Armada de Chile (Rescate Marítimo)', telefono: '+56 32 220 8888', incluir: false },
  ],
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        [action.section]: {
          ...(state[action.section as keyof FormState] as unknown as Record<string, unknown>),
          [action.field]: action.value,
        },
      };

    case 'ADD_ITEM': {
      const current = Array.isArray(state[action.section as keyof FormState])
        ? (state[action.section as keyof FormState] as unknown[])
        : [];
      return { ...state, [action.section]: [...current, action.item] };
    }

    case 'REMOVE_ITEM': {
      const arr = Array.isArray(state[action.section as keyof FormState])
        ? (state[action.section as keyof FormState] as unknown[])
        : [];
      return { ...state, [action.section]: arr.filter((_, i) => i !== action.index) };
    }

    case 'UPDATE_ITEM': {
      const arr = Array.isArray(state[action.section as keyof FormState])
        ? [...(state[action.section as keyof FormState] as unknown as Record<string, unknown>[])]
        : [];
      if (arr[action.index]) {
        if (action.field !== undefined) {
          arr[action.index] = { ...arr[action.index], [action.field]: action.value };
        } else if (action.updates) {
          arr[action.index] = { ...arr[action.index], ...action.updates };
        }
      }
      return { ...state, [action.section]: arr };
    }

    case 'SET_STEP':
      return { ...state, currentStep: action.step };

    case 'SET_AVISO_ID':
      return { ...state, avisoId: action.avisoId };

    case 'RESET_FORM':
      return initialFormState;

    case 'UPDATE_WEATHER_IMAGES':
      return { ...state, basicInfo: { ...state.basicInfo, weatherImages: action.images } };

    case 'LOAD_SAVED_DATA': {
      const d = action.data;
      return {
        ...initialFormState,
        ...d,
        currentStep: d.currentStep ?? 1,
        basicInfo: { ...initialFormState.basicInfo, ...(d.basicInfo ?? {}) },
        participantes: Array.isArray(d.participantes) ? d.participantes : [],
        itinerario: Array.isArray(d.itinerario) ? d.itinerario : [],
        equipo: Array.isArray(d.equipo) ? d.equipo : [],
        transporte: Array.isArray(d.transporte) ? d.transporte : [],
        cuerposRescate: Array.isArray(d.cuerposRescate)
          ? d.cuerposRescate
          : initialFormState.cuerposRescate,
      };
    }

    default:
      return state;
  }
};

// ── Shared validation helpers ─────────────────────────────────────────────────

const isParticipantValid = (p: Participant): boolean =>
  Boolean(p.nombre && p.rut && p.telefono && p.contactoEmergencia && p.telefonoEmergencia);

const isItineraryDayValid = (day: ItineraryDay, reporteDate: Date | null): boolean => {
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

const getRisksCompletionStatus = (itinerario: ItineraryDay[]): boolean => {
  let managed = 0;
  let incomplete = 0;

  itinerario.forEach((day) => {
    (day.supuestos ?? []).forEach((assumption) => {
      if (
        assumption.accion === ASSUMPTION_ACTIONS.GESTIONAR ||
        (assumption.accion === ASSUMPTION_ACTIONS.MONITOREO_INTENSO && assumption.incluir === true)
      ) {
        managed++;
        if (!assumption.causas || assumption.causas.length === 0) {
          incomplete++;
        } else {
          const hasIncompleteCausas = assumption.causas.some(
            (c) =>
              !c.peligros || c.peligros.length === 0 ||
              !c.riesgos || c.riesgos.length === 0 ||
              c.peligros.some((p) => !p.trim()) ||
              c.riesgos.some((r) => !r.trim())
          );
          if (hasIncompleteCausas) incomplete++;
        }
      }
    });
  });

  return managed === 0 || incomplete === 0;
};

// ── Context ───────────────────────────────────────────────────────────────────

const FormContext = createContext<FormContextValue | null>(null);

export const FormContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as Partial<FormState>;
        if (parsed.basicInfo?.weatherImages) {
          parsed.basicInfo.weatherImages = parsed.basicInfo.weatherImages.map((img: WeatherImage) => ({
            ...img,
            url: img.base64 || '',
          }));
        }
        dispatch({ type: 'LOAD_SAVED_DATA', data: parsed });
      } catch (error) {
        console.error('Error loading form data from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify({
        ...formData,
        basicInfo: { ...formData.basicInfo, weatherImages: formData.basicInfo.weatherImages ?? [] },
      })
    );
  }, [formData, isInitialized]);

  const updateFormField = (section: string, field: string, value: unknown) =>
    dispatch({ type: 'UPDATE_FORM_FIELD', section, field, value });

  const addItem = (section: string, item: unknown) =>
    dispatch({ type: 'ADD_ITEM', section, item });

  const removeItem = (section: string, index: number) =>
    dispatch({ type: 'REMOVE_ITEM', section, index });

  const updateItem = (section: string, index: number, updatedItem: Record<string, unknown>) => {
    const keys = Object.keys(updatedItem);
    if (keys.length === 1) {
      dispatch({ type: 'UPDATE_ITEM', section, index, field: keys[0], value: updatedItem[keys[0]] });
    } else {
      dispatch({ type: 'UPDATE_ITEM', section, index, updates: updatedItem });
    }
  };

  const goToStep = (step: number) => dispatch({ type: 'SET_STEP', step });

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
    localStorage.removeItem(LOCALSTORAGE_KEY);
  };

  const updateWeatherImages = (images: WeatherImage[]) =>
    dispatch({ type: 'UPDATE_WEATHER_IMAGES', images });

  const saveToApi = useCallback(async (): Promise<{ success: boolean; avisoId?: number; error?: string }> => {
    setIsSaving(true);
    try {
      const basicInfo = formData.basicInfo;
      const autoTitle = basicInfo.cerroOSector
        ? `${basicInfo.cerroOSector}${basicInfo.actividad ? ` — ${basicInfo.actividad}` : ''}`
        : 'Aviso sin título';

      if (formData.avisoId) {
        const res = await fetch(`/api/avisos/${formData.avisoId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: autoTitle, form_data: formData }),
        });
        if (res.status === 401) return { success: false, error: 'Inicia sesión para guardar en la nube.' };
        if (!res.ok) return { success: false, error: 'Error al actualizar el aviso.' };
      } else {
        const res = await fetch('/api/avisos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: autoTitle, form_data: formData }),
        });
        if (res.status === 401) return { success: false, error: 'Inicia sesión para guardar en la nube.' };
        if (!res.ok) return { success: false, error: 'Error al crear el aviso.' };
        const aviso = await res.json() as { id: number };
        dispatch({ type: 'SET_AVISO_ID', avisoId: aviso.id });
        return { success: true, avisoId: aviso.id };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Error de conexión. Datos guardados localmente.' };
    } finally {
      setIsSaving(false);
    }
  }, [formData]);

  const isStepValid = (step: number): boolean => {
    const participantes = formData.participantes ?? [];
    const equipo = formData.equipo ?? [];
    const transporte = formData.transporte ?? [];
    const itinerario = formData.itinerario ?? [];
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
      case 4:
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

  const loadData = (data: Partial<FormState>) => {
    dispatch({ type: 'LOAD_SAVED_DATA', data });
  };

  const checkFormCompletion = (): boolean => {
    const participantes = formData.participantes ?? [];
    const equipo = formData.equipo ?? [];
    const transporte = formData.transporte ?? [];
    const itinerario = formData.itinerario ?? [];
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

    const validEquipo = equipo.filter((e) => e.categoria && e.item && e.cantidad);
    const validTransporte = transporte.filter((t) => t.tipo && t.conductor);

    return Boolean(
      basicInfoComplete &&
        inReachComplete &&
        participantes.length > 0 &&
        participantes.every(isParticipantValid) &&
        itinerario.length > 0 &&
        itinerario.every((day) => isItineraryDayValid(day, reporteDate)) &&
        getRisksCompletionStatus(itinerario) &&
        (equipo.length === 0 || validEquipo.length === equipo.length) &&
        (transporte.length === 0 || validTransporte.length === transporte.length)
    );
  };

  const value: FormContextValue = {
    formData,
    updateFormField,
    addItem,
    removeItem,
    updateItem,
    goToStep,
    resetForm,
    updateWeatherImages,
    isStepValid,
    checkFormCompletion,
    saveToApi,
    loadData,
    isSaving,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useFormContext = (): FormContextValue => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within a FormContextProvider');
  return context;
};
