# Cambios en la Evaluación de Riesgos - Supuestos de Tramos

## Resumen de Cambios

Se ha actualizado la lógica de evaluación de riesgos en los supuestos de los tramos para considerar tanto la **probabilidad** como el **impacto**, implementando la siguiente fórmula:

```
=IF(ISBLANK(M2);"";(IF(AND(OR(Probabilidad=Muy improbable;Probabilidad=Poco probable);OR(Impacto=significativo;Impacto=critico));"Gestionar";IF(Impacto=critico;"monitoreo intenso";"monitoreo normal"))))
```

## Nueva Lógica de Evaluación

### Criterios de Evaluación

1. **GESTIONAR**: 
   - Si (probabilidad = "muy improbable" O "poco probable") Y (impacto = "significativo" O "crítico")
   - **Inclusión automática**: Los supuestos con acción "gestionar" se incluyen automáticamente en la gestión de riesgos y el aviso de salida

2. **MONITOREO INTENSO**: 
   - Si impacto = "crítico" (independientemente de la probabilidad)

3. **MONITOREO NORMAL**: 
   - Para todos los demás casos

## Cambios Implementados

### 1. Función `calculateRiskAction` (Step3ItineraryAssumptions.jsx)
- **Antes**: Solo consideraba la probabilidad
- **Ahora**: Considera tanto probabilidad como impacto según la fórmula especificada

### 2. Inclusión Automática
- **Antes**: Todos los supuestos requerían marcado manual para inclusión
- **Ahora**: Los supuestos con acción "gestionar" se incluyen automáticamente

### 3. Interfaz de Usuario
- **Toggle deshabilitado**: Para supuestos con acción "gestionar", el toggle de inclusión se deshabilita
- **Indicador visual**: Se muestra "Incluir en aviso (automático)" para supuestos con inclusión automática

### 4. Validaciones Actualizadas
- **FormContext.js**: Actualizada la lógica de validación para incluir automáticamente supuestos con acción "gestionar"
- **Step4RiskManagement.jsx**: Actualizada la lógica de filtrado para gestión de riesgos
- **Step7FinalReview.jsx**: Actualizada la validación final
- **PrintView.jsx**: Actualizada la lógica de inclusión en el aviso de salida

## Archivos Modificados

1. `src/resources/form/steps/Step3ItineraryAssumptions.jsx`
   - Función `calculateRiskAction` actualizada
   - Función `updateAssumption` con inclusión automática
   - Función `addSuggestedAssumptions` con inclusión automática
   - Instrucciones actualizadas

2. `src/resources/form/components/ItineraryDayForm.jsx`
   - Toggle de inclusión deshabilitado para acción "gestionar"
   - Indicador visual de inclusión automática

3. `src/resources/form/steps/Step4RiskManagement.jsx`
   - Lógica de filtrado actualizada
   - Mensajes informativos actualizados

4. `src/resources/contexts/FormContext.js`
   - Validación actualizada para incluir automáticamente supuestos con acción "gestionar"

5. `src/resources/form/steps/Step7FinalReview.jsx`
   - Validación final actualizada

6. `src/resources/form/components/PrintView.jsx`
   - Lógica de inclusión en aviso actualizada

## Beneficios

1. **Mayor precisión**: La evaluación ahora considera tanto probabilidad como impacto
2. **Automatización**: Reduce la necesidad de marcado manual para supuestos críticos
3. **Consistencia**: Asegura que todos los supuestos que requieren gestión sean incluidos automáticamente
4. **Mejor UX**: Indicadores visuales claros para el usuario

## Compatibilidad

- Los cambios son compatibles con datos existentes
- La lógica anterior sigue funcionando para supuestos con acción "monitoreo_intenso" que requieren marcado manual
- No se requieren migraciones de datos 