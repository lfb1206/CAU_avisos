# CAU Avisos - Generador de PDFs

Aplicación web para generar avisos de salida de montaña del Club Andino Universitario (CAU).

## Características

- ✅ Formulario dinámico con validación
- ✅ Generación de PDF profesional
- ✅ Tablas dinámicas para participantes, itinerario, equipo y transporte
- ✅ Gestión de riesgos y datos médicos
- ✅ Descarga automática del PDF

## Tecnologías

- **Next.js 15** - Framework de React
- **jsPDF** - Generación de PDFs
- **jspdf-autotable** - Tablas en PDF
- **Tailwind CSS** - Estilos

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## Uso

1. Complete el formulario con la información de la actividad
2. Agregue participantes, itinerario, equipo y transporte
3. Haga clic en "Generar PDF"
4. El PDF se descargará automáticamente

## Estructura del Proyecto

```
src/
├── app/
│   └── page.js          # Página principal
├── resources/
│   ├── constants/
│   │   └── docFields.js # Configuración de campos
│   ├── form/
│   │   ├── DynamicForm.jsx
│   │   └── FormField.jsx
│   ├── lib/
│   │   └── pdfUtils.js  # Generación de PDF
│   └── imgs/
│       └── Logo.png     # Logo CAU
```

## Campos del Formulario

- **Información de Contacto**: CAU, teléfono, email
- **Detalles de Actividad**: Cerro, ruta, enlaces
- **Participantes**: Nombre, RUT, teléfono, contacto de emergencia
- **Itinerario**: Fecha, actividad, horario, altitud
- **Gestión de Riesgos**: Supuestos, lugares, acciones
- **Equipo**: Categorías, items, cantidades
- **Transporte**: Tipo, conductor, vehículo, distancia
- **Datos Médicos**: Enfermedades, medicamentos, grupo sanguíneo

## Licencia

Club Andino Universitario (CAU)
