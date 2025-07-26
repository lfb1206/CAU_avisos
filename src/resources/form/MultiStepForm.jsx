'use client';
import React from 'react';
import { useFormContext } from '../contexts/FormContext';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2Participants from './steps/Step2Participants';
import Step3ItineraryAssumptions from './steps/Step3ItineraryAssumptions';
import Step4RiskManagement from './steps/Step4RiskManagement';
import Step5EquipmentTransport from './steps/Step5EquipmentTransport';
import Step6FinalReview from './steps/Step7FinalReview';

export default function MultiStepForm() {
  const { formData, goToStep, isStepValid } = useFormContext();

  const steps = [
    { id: 1, name: 'Información Básica', component: Step1BasicInfo },
    { id: 2, name: 'Participantes', component: Step2Participants },
    { id: 3, name: 'Itinerario y Supuestos', component: Step3ItineraryAssumptions },
    { id: 4, name: 'Gestión de Riesgos', component: Step4RiskManagement },
    { id: 5, name: 'Equipo y Transporte', component: Step5EquipmentTransport },
    { id: 6, name: 'Revisión Final', component: Step6FinalReview }
  ];

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
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Aviso de Salida CAU
          </h1>
          <span className="text-sm text-gray-500">
            Paso {formData.currentStep} de {steps.length}
          </span>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
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
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {CurrentStepComponent && <CurrentStepComponent />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => goToStep(Math.max(1, formData.currentStep - 1))}
          disabled={formData.currentStep === 1}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        
        <button
          onClick={() => goToStep(Math.min(steps.length, formData.currentStep + 1))}
          disabled={formData.currentStep === steps.length || !isStepValid(formData.currentStep)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {!isStepValid(formData.currentStep) && formData.currentStep !== steps.length ? 'Complete los campos requeridos' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
} 