'use client';
import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { LOCALSTORAGE_KEY } from '@/resources/constants/formConstants';
import { isStepValid as isStepValidPure, checkFormCompletion as checkFormCompletionPure } from './formValidation';
import type { FormState, FormAction, FormContextValue, WeatherImage, RescueBody } from '@/types';

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
  // Populated from /api/rescueBodyOptions on mount (see FormContextProvider) rather
  // than hardcoded here, unless a saved draft already has its own values.
  cuerposRescate: [],
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

    case 'SET_CUERPOS_RESCATE':
      return { ...state, cuerposRescate: action.cuerposRescate };

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

// ── Context ───────────────────────────────────────────────────────────────────

const FormContext = createContext<FormContextValue | null>(null);

export const FormContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let draftHasCuerposRescate = false;
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
        draftHasCuerposRescate = Array.isArray(parsed.cuerposRescate) && parsed.cuerposRescate.length > 0;
        dispatch({ type: 'LOAD_SAVED_DATA', data: parsed });
      } catch (error) {
        console.error('Error loading form data from localStorage:', error);
      }
    }
    setIsInitialized(true);

    // Only fetch defaults when no saved draft already brought its own list —
    // never clobber what the user (or a restored draft) already has.
    if (!draftHasCuerposRescate) {
      fetch('/api/rescueBodyOptions')
        .then((r) => r.json())
        .then((data: RescueBody[]) => {
          if (Array.isArray(data) && data.length > 0) {
            dispatch({ type: 'SET_CUERPOS_RESCATE', cuerposRescate: data });
          }
        })
        .catch(() => {});
    }
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

  // Memoized so components depending on these in effect/callback dependency
  // arrays (e.g. Step2Participants' auto-add-first-row effect) get a stable
  // reference instead of a new function identity on every render.
  const updateFormField = useCallback(
    (section: string, field: string, value: unknown) =>
      dispatch({ type: 'UPDATE_FORM_FIELD', section, field, value }),
    []
  );

  const addItem = useCallback(
    (section: string, item: unknown) => dispatch({ type: 'ADD_ITEM', section, item }),
    []
  );

  const removeItem = useCallback(
    (section: string, index: number) => dispatch({ type: 'REMOVE_ITEM', section, index }),
    []
  );

  const updateItem = useCallback(
    (section: string, index: number, updatedItem: Record<string, unknown>) => {
      const keys = Object.keys(updatedItem);
      if (keys.length === 1) {
        dispatch({ type: 'UPDATE_ITEM', section, index, field: keys[0], value: updatedItem[keys[0]] });
      } else {
        dispatch({ type: 'UPDATE_ITEM', section, index, updates: updatedItem });
      }
    },
    []
  );

  const goToStep = useCallback((step: number) => dispatch({ type: 'SET_STEP', step }), []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
    localStorage.removeItem(LOCALSTORAGE_KEY);
  }, []);

  const updateWeatherImages = useCallback(
    (images: WeatherImage[]) => dispatch({ type: 'UPDATE_WEATHER_IMAGES', images }),
    []
  );

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

  // Thin wrappers over the pure, independently-testable predicates in
  // formValidation.ts — keeps the public FormContextValue API unchanged.
  const isStepValid = useCallback((step: number) => isStepValidPure(step, formData), [formData]);

  const checkFormCompletion = useCallback(() => checkFormCompletionPure(formData), [formData]);

  const loadData = useCallback((data: Partial<FormState>) => {
    dispatch({ type: 'LOAD_SAVED_DATA', data });
  }, []);

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
