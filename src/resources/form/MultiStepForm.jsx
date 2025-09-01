'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../contexts/FormContext';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2Participants from './steps/Step2Participants';
import Step3ItineraryAssumptions from './steps/Step3ItineraryAssumptions';
import Step4RiskManagement from './steps/Step4RiskManagement';
import Step5EquipmentTransport from './steps/Step5EquipmentTransport';
import Step6FinalReview from './steps/Step7FinalReview';

export default function MultiStepForm() {
  const { formData, goToStep, isStepValid, resetForm } = useFormContext();
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const steps = [
    { id: 1, name: 'Información Básica', component: Step1BasicInfo },
    { id: 2, name: 'Participantes', component: Step2Participants },
    { id: 3, name: 'Itinerario y Supuestos', component: Step3ItineraryAssumptions },
    { id: 4, name: 'Gestión de Supuestos', component: Step4RiskManagement },
    { id: 5, name: 'Equipo y Transporte', component: Step5EquipmentTransport },
    { id: 6, name: 'Revisión Final', component: Step6FinalReview }
  ];

  const handleClearData = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar toda la información guardada? Esta acción no se puede deshacer.')) {
      resetForm();
      setHasSavedData(false);
    }
  };

  // Check if there's saved data
  const checkSavedData = () => {
    try {
      const savedData = localStorage.getItem('formData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Check if there's meaningful data (not just initial state)
        const hasData = parsedData.basicInfo?.contactoCAU || 
                       parsedData.basicInfo?.telefonoContacto ||
                       parsedData.basicInfo?.emailContacto ||
                       parsedData.basicInfo?.actividad ||
                       parsedData.basicInfo?.cerroOSector ||
                       parsedData.participantes?.length > 0 || 
                       parsedData.itinerario?.length > 0 ||
                       parsedData.equipo?.length > 0 ||
                       parsedData.transporte?.length > 0;
        
        // Show notification if we just got saved data
        if (hasData && !hasSavedData) {
          setShowSaveNotification(true);
          setTimeout(() => setShowSaveNotification(false), 3000);
        }
        
        setHasSavedData(hasData);
      } else {
        setHasSavedData(false);
      }
    } catch (error) {
      console.error('MultiStepForm - Error checking saved data:', error);
      setHasSavedData(false);
    }
  };

  // Check saved data on mount and when formData changes
  useEffect(() => {
    checkSavedData();
  }, [formData]);

  // Additional effect to check saved data when component mounts
  useEffect(() => {
    // Migrate from sessionStorage to localStorage if needed
    const sessionData = sessionStorage.getItem('formData');
    if (sessionData) {
      localStorage.setItem('formData', sessionData);
      sessionStorage.removeItem('formData');
    }

    // Check saved data immediately on mount
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const hasData = parsedData.basicInfo?.contactoCAU || 
                       parsedData.basicInfo?.telefonoContacto ||
                       parsedData.basicInfo?.emailContacto ||
                       parsedData.basicInfo?.actividad ||
                       parsedData.basicInfo?.cerroOSector ||
                       parsedData.participantes?.length > 0 || 
                       parsedData.itinerario?.length > 0 ||
                       parsedData.equipo?.length > 0 ||
                       parsedData.transporte?.length > 0;
        
        setHasSavedData(hasData);
      } catch (error) {
        console.error('MultiStepForm - Error in initial check:', error);
      }
    }
  }, []);

  const getStepStatus = (stepId) => {
    if (stepId < formData.currentStep) {
      return 'completed';
    } else if (stepId === formData.currentStep) {
      return isStepValid(stepId) ? 'current' : 'current-error';
    } else {
      return 'pending';
    }
  };

  const getStepIcon = (status, stepId) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'current':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">{stepId}</span>
          </div>
        );
      case 'current-error':
        return (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">{stepId}</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">{stepId}</span>
          </div>
        );
    }
  };

  const CurrentStepComponent = steps.find(step => step.id === formData.currentStep)?.component;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Progreso guardado automáticamente</span>
        </div>
      )}

      {/* Auto-save Info */}
      {!hasSavedData && formData.currentStep === 1 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-700 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Tu progreso se guarda automáticamente. Puedes cerrar y volver más tarde.</span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Aviso de Salida CAU
            </h1>
            {hasSavedData && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Guardado</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClearData}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center space-x-1"
              title="Limpiar información guardada"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Limpiar</span>
            </button>
            <span className="text-sm text-gray-500">
              Paso {formData.currentStep} de {steps.length}
            </span>
          </div>
        </div>
        
        {/* Desktop Progress Bar */}
        <div className="hidden md:flex items-center justify-center space-x-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  {getStepIcon(status, step.id)}
                  <span className={`text-sm font-medium ${
                    status === 'completed' ? 'text-green-600' :
                    status === 'current' ? 'text-blue-600' :
                    status === 'current-error' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {step.name}
                    {step.optional && <span className="text-xs text-gray-400 ml-1">(Opcional)</span>}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile Progress Bar - Simplified */}
        <div className="md:hidden flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToStep(Math.max(1, formData.currentStep - 1))}
              disabled={formData.currentStep === 1}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{formData.currentStep}</span>
            </div>
            <span className="text-sm font-medium text-blue-600">
              {steps.find(s => s.id === formData.currentStep)?.name}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToStep(Math.min(steps.length, formData.currentStep + 1))}
              disabled={formData.currentStep === steps.length || !isStepValid(formData.currentStep)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Siguiente</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
        {CurrentStepComponent && <CurrentStepComponent />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 md:mt-8">
        <button
          onClick={() => goToStep(Math.max(1, formData.currentStep - 1))}
          disabled={formData.currentStep === 1}
          className="px-4 md:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
        >
          Anterior
        </button>
        
        <button
          onClick={() => goToStep(Math.min(steps.length, formData.currentStep + 1))}
          disabled={formData.currentStep === steps.length || !isStepValid(formData.currentStep)}
          className="px-4 md:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
        >
          {!isStepValid(formData.currentStep) && formData.currentStep !== steps.length ? 'Complete los campos requeridos' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
} 