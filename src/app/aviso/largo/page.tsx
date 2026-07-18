'use client';

import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { FormContextProvider, useFormContext } from '@/resources/contexts/FormContext';
import Step1BasicInfo from '@/resources/form/steps/Step1BasicInfo';
import Step2Participants from '@/resources/form/steps/Step2Participants';
import Step3ItineraryAssumptions from '@/resources/form/steps/Step3ItineraryAssumptions';
import Step5EquipmentTransport from '@/resources/form/steps/Step5EquipmentTransport';
import Step7FinalReview from '@/resources/form/steps/Step7FinalReview';

// ctx step number → UI step index (0-based)
const STEPS = [
  { ctx: 1, label: 'Info Básica' },
  { ctx: 2, label: 'Participantes' },
  { ctx: 3, label: 'Itinerario' },
  { ctx: 5, label: 'Equipo' },
  { ctx: 7, label: 'Revisión' },
] as const;

function AvisoLargoInner() {
  const { formData, goToStep, isStepValid, loadData, saveToApi, isSaving } = useFormContext();
  const searchParams = useSearchParams();
  const avisoIdParam = searchParams.get('id');
  const loadedRef = useRef(false);
  const isLoadingFromApiRef = useRef(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  // Load existing aviso when ?id= is present (returning to a draft or cloning from library)
  useEffect(() => {
    if (!avisoIdParam || loadedRef.current) return;
    loadedRef.current = true;
    fetch(`/api/avisos/${avisoIdParam}`)
      .then((r) => r.json())
      .then((data: { form_data?: Record<string, unknown> }) => {
        if (data?.form_data) {
          isLoadingFromApiRef.current = true;
          // Override any stale avisoId in form_data with the actual URL param ID
          loadData({ ...data.form_data, avisoId: Number(avisoIdParam) });
          setIsDirty(false);
        }
      })
      .catch(() => {});
  }, [avisoIdParam, loadData]);

  // Mark form as dirty whenever formData changes after initial load
  const formDataRef = useRef(formData);
  useEffect(() => {
    if (formDataRef.current !== formData) {
      if (isLoadingFromApiRef.current) {
        // This change was caused by loadData() — skip dirty flag
        isLoadingFromApiRef.current = false;
        formDataRef.current = formData;
        return;
      }
      formDataRef.current = formData;
      setIsDirty(true);
    }
  }, [formData]);

  // Warn browser on close/refresh when there are unsaved changes
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const handleSave = useCallback(async () => {
    const result = await saveToApi();
    if (result.success) {
      setIsDirty(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      setSaveStatus('error');
    }
  }, [saveToApi]);

  const currentCtxStep = formData.currentStep;
  const stepIdx = STEPS.findIndex((s) => s.ctx === currentCtxStep);
  const effectiveIdx = stepIdx === -1 ? 0 : stepIdx;
  const isLastStep = effectiveIdx === STEPS.length - 1;

  const handleNext = () => {
    if (effectiveIdx < STEPS.length - 1) {
      goToStep(STEPS[effectiveIdx + 1].ctx);
    }
  };

  const handleBack = () => {
    if (effectiveIdx > 0) {
      goToStep(STEPS[effectiveIdx - 1].ctx);
    }
  };

  const canGoNext = isStepValid(currentCtxStep);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <a href="/dashboard" className="hover:text-blue-600">Panel</a>
          <span>/</span>
          <span className="text-gray-800 font-medium">Aviso Largo</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Aviso de Salida</h1>
            <p className="text-gray-500 text-sm mt-1">
              Para actividades con pernocte, expediciones y salidas de alta montaña.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {saveStatus === 'saved' && (
              <span className="text-xs text-green-600 font-medium">Guardado</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-xs text-red-600 font-medium">Error al guardar</span>
            )}
            {isDirty && saveStatus === 'idle' && (
              <span className="text-xs text-gray-400">Cambios sin guardar</span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Guardando…' : 'Guardar borrador'}
            </button>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
        {STEPS.map((step, idx) => (
          <React.Fragment key={step.ctx}>
            {idx > 0 && (
              <div
                className={`flex-1 h-px min-w-[20px] ${
                  idx <= effectiveIdx ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            )}
            <button
              onClick={() => idx < effectiveIdx && goToStep(step.ctx)}
              disabled={idx > effectiveIdx}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  idx < effectiveIdx
                    ? 'bg-blue-600 text-white'
                    : idx === effectiveIdx
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx < effectiveIdx ? '✓' : idx + 1}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap hidden sm:block ${
                  idx === effectiveIdx ? 'text-blue-700' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {currentCtxStep === 1 && <Step1BasicInfo />}
        {currentCtxStep === 2 && <Step2Participants />}
        {currentCtxStep === 3 && <Step3ItineraryAssumptions />}
        {currentCtxStep === 5 && <Step5EquipmentTransport />}
        {currentCtxStep === 7 && <Step7FinalReview />}
      </div>

      {/* Navigation buttons — not shown on final review step (Step7 has its own submit) */}
      {!isLastStep && (
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          {effectiveIdx > 0 && (
            <button
              onClick={handleBack}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Atrás
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente: {STEPS[effectiveIdx + 1]?.label} →
          </button>
        </div>
      )}
    </div>
  );
}

function AvisoLargoContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Cargando…</p>
        </div>
      }
    >
      <AvisoLargoInner />
    </Suspense>
  );
}

export default function AvisoLargoPage() {
  return (
    <FormContextProvider>
      <AvisoLargoContent />
    </FormContextProvider>
  );
}
