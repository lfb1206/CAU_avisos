# Estructura de Datos del Sistema CAU

Este documento describe la estructura y organización de los datos de autocompletado del sistema CAU.

## Archivos de Datos

### 1. `peopleData.js`
**Propósito:** Datos unificados de participantes y contactos CAU.
**Contenido:** 
- Lista de personas con información médica completa
- Identificación automática de CAU contacts por email (@cau.cl)
- Funciones de utilidad para filtrar y buscar personas

### 2. `basicFormOptions.js`
**Propósito:** Opciones básicas para el formulario principal.
**Contenido:**
- Actividades generales y específicas
- Contactos CAU
- Cerros y sectores
- Tramos de ruta

### 3. `activityEquipmentData.js`
**Propósito:** Mapeo de actividades con equipamiento recomendado.
**Contenido:**
- Actividades generales con equipamiento básico
- Actividades específicas con equipamiento detallado
- Funciones para obtener recomendaciones de equipo

### 4. `equipmentData.js`
**Propósito:** Datos de equipamiento organizados por categorías.
**Contenido:**
- Categorías de equipamiento
- Items de equipamiento con estado esencial
- Funciones de utilidad para gestión de equipamiento

### 5. `medicalOptions.js`
**Propósito:** Opciones médicas para participantes.
**Contenido:**
- Tipos de sangre
- Alergias comunes
- Condiciones médicas

### 6. `transportOptions.js`
**Propósito:** Opciones de transporte.
**Contenido:**
- Tipos de vehículos
- Marcas de vehículos

### 7. `riskManagementOptions.js`
**Propósito:** Opciones para gestión de riesgos.
**Contenido:**
- Tipos de supuestos
- Probabilidades
- Impactos
- Dificultades principales

### 8. `difficultyAssumptionRecommendations.js`
**Propósito:** Recomendaciones de supuestos basadas en dificultades.
**Contenido:**
- Mapeo de dificultades con supuestos sugeridos
- Funciones para generar recomendaciones automáticas

### 9. `wikiexploraChecklists.js`
**Propósito:** Checklists de Wikiexplora para diferentes actividades.
**Contenido:**
- Checklists detallados por actividad
- Items imprescindibles y aconsejables
- Funciones para aplicar checklists

### 10. `dataExportUtils.js`
**Propósito:** Utilidades para exportar e importar datos.
**Contenido:**
- Funciones de exportación a JSON
- Funciones de importación desde JSON
- Validación de datos
- Generación de reportes de cambios

### 11. `docFields.js`
**Propósito:** Definición de campos para documentos.
**Contenido:**
- Estructura de campos para formularios dinámicos
- Validaciones y tipos de campos

### 12. `savedData.js`
**Propósito:** Datos guardados del sistema (legacy).
**Contenido:**
- Datos históricos del sistema
- Estructuras de datos anteriores

## Estructura de Datos Unificada

### PeopleData
```javascript
export const peopleData = {
  "persona1": {
    nombre: "Juan Pérez",
    rut: "12345678-9",
    email: "juan@cau.cl", // CAU contact si contiene @cau.cl
    telefono: "+56912345678",
    contactoEmergencia: "María Pérez",
    telefonoEmergencia: "+56987654321",
    grupoSanguineo: "O+",
    alergias: ["Frutos secos"],
    enfermedades: ["Ninguna"],
    medicamentos: ["Ninguno"],
    condicionesEspeciales: ["Ninguna"]
  }
};
```

### ActivityEquipmentData
```javascript
export const activityEquipmentData = {
  activities: {
    "Escalada": {
      basicEquipment: [
        { item: "Arnés", category: "Seguridad", essential: true },
        { item: "Cuerda", category: "Seguridad", essential: true }
      ]
    }
  },
  specificActivities: {
    "Travesía por glaciar": {
      parentActivity: "Montañismo",
      difficulty: "Alta",
      equipment: [
        { item: "Piolet", category: "Equipo de Nieve", essential: true },
        { item: "Crampones", category: "Equipo de Nieve", essential: true }
      ]
    }
  }
};
```

## Funciones de Utilidad

### PeopleData
- `getContacts()` - Obtiene solo contactos CAU
- `getParticipants()` - Obtiene solo participantes
- `getAllPeople()` - Obtiene todas las personas
- `findPerson(rut)` - Busca persona por RUT

### ActivityEquipmentData
- `getActivityEquipment(activityName)` - Equipo para actividad general
- `getSpecificActivityEquipment(specificActivityName)` - Equipo para actividad específica
- `getEquipmentForSpecificActivity(specificActivityName)` - Items de equipo específico
- `getAllActivities()` - Lista de actividades generales
- `getAllSpecificActivities()` - Lista de actividades específicas

### EquipmentData
- `getCategoryById(id)` - Obtiene categoría por ID
- `getItemsByCategory(categoryId)` - Items de una categoría
- `getEssentialItems()` - Items marcados como esenciales

## Panel de Administración

El sistema incluye paneles de administración dedicados:

1. **PeopleAdminPanel** - Gestión de participantes y contactos
2. **ActivitiesAdminPanel** - Gestión de actividades y equipamiento
3. **EquipmentAdminPanel** - Gestión de categorías e items de equipamiento
4. **FormsAdminPanel** - Gestión de datos de autocompletado
5. **ChecklistsAdminPanel** - Visualización de checklists de Wikiexplora

## Migración de Datos

Los archivos eliminados (`contactsData.js`, `participantsData.js`, `equipmentOptions.js`, `activityEquipmentRecommendations.js`, `formOptions.js`) han sido consolidados en archivos más lógicos:

- `contactsData.js` + `participantsData.js` → `peopleData.js`
- `equipmentOptions.js` → `equipmentData.js`
- `activityEquipmentRecommendations.js` → `activityEquipmentData.js`
- `formOptions.js` → `basicFormOptions.js`

## Notas Importantes

- Los datos se mantienen en memoria durante la sesión
- Las exportaciones crean archivos JSON con timestamp
- Los backups incluyen datos originales antes de modificaciones
- La validación se realiza antes de exportar/importar datos 