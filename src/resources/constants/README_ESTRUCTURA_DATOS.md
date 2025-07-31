# Estructura de Datos de Autorellenado - CAU Avisos

## Descripción General

Los datos de autorellenado han sido reorganizados en archivos separados por tipo de funcionalidad para mejorar la mantenibilidad y facilitar la gestión desde el panel de administración.

## Archivos de Datos

### 1. `contactsData.js`
**Propósito**: Contactos del Club Andino Universitario
- **Contenido**: Lista de contactos con teléfono y email
- **Uso**: Autocompletar información de contacto en formularios
- **Estructura**: `{ nombre: { telefono, email } }`

### 2. `participantsData.js`
**Propósito**: Participantes frecuentes con datos médicos
- **Contenido**: Información completa de participantes incluyendo datos médicos
- **Uso**: Autocompletar formularios de participantes
- **Estructura**: `{ nombre: { rut, telefono, contactoEmergencia, grupoSanguineo, alergias, enfermedades, medicamentos, condicionesEspeciales } }`

### 3. `basicFormOptions.js`
**Propósito**: Opciones básicas para formularios
- **Contenido**: Listas de actividades, cerros, sectores, tramos
- **Uso**: Autocompletar campos de selección en formularios
- **Estructura**: `{ contactoCAU, actividades, actividadesEspecificas, cerrosSectores, tramos }`

### 4. `medicalOptions.js`
**Propósito**: Opciones médicas y de salud
- **Contenido**: Tipos de sangre, alergias, condiciones médicas, medicamentos
- **Uso**: Autocompletar información médica de participantes
- **Estructura**: `{ bloodTypes, allergies, medicalConditions, medications, specialConditions }`

### 5. `transportOptions.js`
**Propósito**: Opciones de transporte
- **Contenido**: Tipos de transporte y marcas de vehículos
- **Uso**: Autocompletar información de transporte
- **Estructura**: `{ transportTypes, vehicleBrands }`

### 6. `equipmentOptions.js`
**Propósito**: Opciones de equipamiento
- **Contenido**: Categorías e items de equipamiento
- **Uso**: Autocompletar listas de equipamiento
- **Estructura**: `{ equipmentCategories, equipmentItems }`

### 7. `riskManagementOptions.js`
**Propósito**: Opciones de gestión de riesgos
- **Contenido**: Dificultades, supuestos, probabilidades, impactos, peligros, riesgos
- **Uso**: Autocompletar información de gestión de riesgos
- **Estructura**: `{ dificultadesPrincipales, supuestos, tipoSupuestos, probabilidades, impactos, peligros, riesgos }`

### 8. `activityEquipmentRecommendations.js`
**Propósito**: Recomendaciones de equipo por actividad
- **Contenido**: Recomendaciones basadas en tipo de actividad y dificultades
- **Uso**: Sugerir equipamiento según la actividad
- **Estructura**: `{ activityRecommendations, terrainRecommendations, weatherRecommendations }`

### 9. `difficultyAssumptionRecommendations.js`
**Propósito**: Recomendaciones de supuestos por dificultad
- **Contenido**: Supuestos recomendados según las dificultades identificadas
- **Uso**: Sugerir supuestos clave para gestión de riesgos
- **Estructura**: `{ dificultad: [supuestos] }`

### 10. `wikiexploraChecklists.js`
**Propósito**: Checklists de equipamiento de Wikiexplora
- **Contenido**: Checklists específicos por tipo de actividad y condiciones
- **Uso**: Aplicar checklists completos de equipamiento
- **Estructura**: `{ tipo: { name, imprescindibles, aconsejables } }`

## Panel de Administración

El panel de administración (`/audit`) permite:

### Funcionalidades Principales
- **Revisión de datos**: Ver todos los datos organizados por categorías
- **Modificación**: Editar, agregar y eliminar entradas
- **Estadísticas**: Generar estadísticas básicas de los datos
- **Exportación**: Exportar datos completos o cambios específicos
- **Backup**: Crear copias de seguridad

### Tabs Disponibles
1. **Contactos**: Gestión de contactos CAU
2. **Participantes**: Gestión de participantes frecuentes
3. **Opciones Básicas**: Gestión de actividades, cerros, tramos
4. **Opciones Médicas**: Gestión de datos médicos
5. **Estadísticas**: Ver estadísticas de los datos

## Ventajas de la Nueva Estructura

### 1. Separación de Responsabilidades
- Cada archivo tiene una responsabilidad específica
- Facilita el mantenimiento y actualización
- Reduce la complejidad de cada archivo

### 2. Mejor Organización
- Datos agrupados lógicamente
- Fácil localización de información específica
- Estructura clara y predecible

### 3. Facilita la Gestión
- Panel de administración organizado por categorías
- Modificaciones específicas por tipo de dato
- Exportación selectiva de datos

### 4. Mantenimiento Simplificado
- Archivos más pequeños y manejables
- Cambios aislados por funcionalidad
- Menor riesgo de conflictos

## Migración de Referencias

Todos los archivos que usaban `autocompleteData.js` han sido actualizados para importar directamente de los archivos específicos:

```javascript
// Antes
import { autocompleteData } from '../../constants/autocompleteData';

// Ahora
import { savedContacts } from '../../constants/contactsData';
import { basicFormOptions } from '../../constants/basicFormOptions';
```

## Archivos Eliminados

- `autocompleteData.js`: Consolidado en archivos separados
- `auditUtils.js`: Funcionalidad de auditoría eliminada
- `AuditPanel.jsx`: Reemplazado por DataAdminPanel.jsx
- Documentación de auditoría: Ya no aplica

## Próximos Pasos

1. **Verificar funcionamiento**: Probar que todos los formularios funcionen correctamente
2. **Explorar panel**: Usar el panel de administración para familiarizarse con las nuevas funcionalidades
3. **Crear backup**: Generar un backup inicial de los datos
4. **Personalizar datos**: Modificar los datos según las necesidades específicas del CAU 