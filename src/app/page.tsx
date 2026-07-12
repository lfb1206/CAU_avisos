'use client';
import { FormContextProvider } from '@/resources/contexts/FormContext';
import MultiStepForm from '@/resources/form/MultiStepForm';

export default function Home() {
  return (
    <FormContextProvider>
      <MultiStepForm />
    </FormContextProvider>
  );
}