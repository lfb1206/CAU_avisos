# Panel de Administración - CAU Avisos

## Descripción General

El sistema de administración de CAU Avisos ha sido reorganizado para proporcionar una gestión más granular y especializada de los diccionarios de datos. Cada tipo de dato tiene su propia página de administración dedicada.

## Estructura de Navegación

### 🏠 Panel Principal (`/admin`)
- **Propósito**: Página de entrada al sistema de administración
- **Funcionalidades**: 
  - Navegación a todas las secciones especializadas
  - Información general del sistema
  - Acceso rápido a funcionalidades principales

### 👥 Gestión de Personas (`/admin/people`)
- **Propósito**: Administrar contactos CAU y participantes frecuentes
- **Datos gestionados**:
  - Contactos del CAU (teléfono, email, rol)
  - Participantes frecuentes (RUT, datos médicos, experiencia)
- **Funcionalidades**:
  - Agregar/editar/eliminar contactos y participantes
  - Exportar datos por tipo o completos
  - Crear backups
  - Gestión de estados activo/inactivo

### 🏔️ Gestión de Actividades (`/admin/activities`)
- **Propósito**: Administrar actividades y su equipamiento recomendado
- **Datos gestionados**:
  - Actividades generales (Trekking, Montañismo, Escalada, etc.)
  - Actividades específicas (Ascenso al campamento, Rapel, etc.)
  - Equipamiento recomendado por actividad
  - Condiciones climáticas y equipamiento específico
- **Funcionalidades**:
  - Agregar/editar/eliminar actividades
  - Gestionar equipamiento por actividad
  - Exportar datos por tipo
  - Relacionar actividades específicas con actividades generales

### 🎒 Gestión de Equipamiento (`/admin/equipment`)
- **Propósito**: Administrar categorías e items de equipamiento
- **Datos gestionados**:
  - Categorías de equipamiento (Calzado, Ropa, Protección, etc.)
  - Items por categoría
  - Marcado de items esenciales
- **Funcionalidades**:
  - Agregar/editar/eliminar items
  - Gestionar categorías
  - Filtrar items esenciales
  - Exportar por categoría o completos

### ⚙️ Panel General (`/audit`)
- **Propósito**: Panel de administración general (legacy)
- **Funcionalidades**:
  - Gestión de todos los datos en una sola vista
  - Estadísticas del sistema
  - Exportación general
  - Navegación a páginas especializadas

## Diccionarios de Datos

### 1. Personas (`peopleData.js`)
```javascript
{
  contacts: {
    'Juan Pérez': {
      type: 'contact',
      telefono: '+56912345678',
      email: 'juan.perez@cau.cl',
      role: 'Coordinador',
      active: true
    }
  },
  participants: {
    'Juan Carlos Pérez': {
      type: 'participant',
      rut: '12.345.678-9',
      telefono: '+56912345678',
      // ... más datos médicos
    }
  }
}
```

### 2. Actividades (`activityEquipmentData.js`)
```javascript
{
  activities: {
    'Trekking': {
      category: 'Tierra',
      difficulty: 'Baja a Media',
      basicEquipment: [...],
      weatherEquipment: {...}
    }
  },
  specificActivities: {
    'Ascenso al campamento': {
      parentActivity: 'Trekking',
      difficulty: 'Media',
      equipment: [...]
    }
  }
}
```

### 3. Equipamiento (`equipmentData.js`)
```javascript
{
  categories: [
    { id: 'calzado', name: 'Calzado', description: '...' }
  ],
  items: {
    calzado: [
      { name: 'Botas de trekking', essential: true, description: '...' }
    ]
  }
}
```

## Funcionalidades Comunes

### Exportación de Datos
- **Exportación individual**: Cada página permite exportar sus datos específicos
- **Exportación completa**: Descarga de todos los datos en formato JSON
- **Backup**: Creación de copias de seguridad con timestamp

### Gestión de Datos
- **Agregar**: Crear nuevos registros con formularios especializados
- **Editar**: Modificar datos existentes en modales
- **Eliminar**: Borrar registros con confirmación
- **Validación**: Verificación de datos antes de guardar

### Interfaz de Usuario
- **Responsive**: Diseño adaptativo para móviles y desktop
- **Navegación**: Tabs y breadcrumbs para fácil navegación
- **Feedback**: Mensajes de confirmación y error
- **Búsqueda**: Filtros y búsqueda en listas largas

## Flujo de Trabajo Recomendado

### 1. Configuración Inicial
1. Acceder a `/admin` para ver el panel principal
2. Revisar la información del sistema
3. Navegar a las secciones específicas según necesidad

### 2. Gestión de Datos
1. **Personas**: Comenzar con contactos CAU, luego participantes
2. **Actividades**: Definir actividades generales, luego específicas
3. **Equipamiento**: Crear categorías, luego agregar items

### 3. Mantenimiento
1. Exportar datos regularmente
2. Crear backups antes de cambios importantes
3. Validar datos antes de publicar cambios

## Consideraciones Técnicas

### Persistencia de Datos
- Los cambios se guardan en memoria durante la sesión
- Para persistir cambios, exportar y actualizar archivos fuente
- Los backups incluyen timestamp y metadatos

### Rendimiento
- Carga lazy de datos grandes
- Paginación en listas extensas
- Filtros para búsqueda eficiente

### Seguridad
- Validación de datos en frontend y backend
- Sanitización de inputs
- Confirmación para acciones destructivas

## Próximos Pasos

### Mejoras Planificadas
1. **Integración con backend**: Persistencia automática de cambios
2. **Sincronización**: Actualización en tiempo real entre páginas
3. **Auditoría**: Log de cambios con usuario y timestamp
4. **Importación**: Cargar datos desde archivos JSON
5. **Validación avanzada**: Reglas de negocio más complejas

### Nuevas Funcionalidades
1. **Templates**: Plantillas predefinidas para actividades comunes
2. **Búsqueda global**: Buscar en todos los diccionarios
3. **Estadísticas avanzadas**: Métricas de uso y tendencias
4. **API REST**: Endpoints para integración externa

## Soporte

Para dudas o problemas:
1. Revisar la documentación técnica
2. Verificar los logs del navegador
3. Exportar datos antes de cambios importantes
4. Crear backup antes de modificaciones masivas 