# 🎯 Sistema de Análisis de Actividades y Sugerencias de Equipo

## 📋 Descripción

El sistema ahora analiza automáticamente las actividades de todos los tramos del itinerario y sugiere equipo específico basado en esas actividades. Esto hace que el proceso de preparación sea más inteligente y completo.

## 🔧 Cómo Funciona

### **1. Análisis de Actividades**
- **Actividad General:** Se analiza la actividad principal del aviso
- **Actividades por Tramo:** Se analizan las actividades específicas de cada tramo
- **Detección Inteligente:** El sistema busca palabras clave en las actividades

### **2. Mapeo de Actividades → Equipo**
El sistema incluye mapeos para:

#### **🏔️ Actividades de Montaña**
- `ascenso` → Casco, Arnés, Cuerda, Mosquetones, Aseguradores
- `rapel` → Casco, Arnés, Asegurador, Cuerda
- `escalada` → Casco, Arnés, Cuerda, Mosquetones, Aseguradores, Pies de gato

#### **🏕️ Actividades de Campamento**
- `campamento` → Carpa, Saco de dormir, Aislante, Linterna frontal, Cocina de gas
- `pernocta` → Carpa, Saco de dormir, Aislante, Linterna frontal

#### **❄️ Actividades de Nieve/Hielo**
- `nieve` → Piolet, Crampones, Gafas de sol, Protector solar, Guantes
- `glaciar` → Piolet, Crampones, Arnés, Cuerda, Mosquetones, Gafas de sol

#### **🥾 Actividades de Trekking**
- `trekking` → Bastones, Botas, Mochila, Botella de agua
- `caminata` → Bastones, Botas, Mochila, Botella de agua

#### **🌊 Actividades Acuáticas**
- `vadeo` → Botas de vadeo, Bastón de vadeo, Cuerda
- `río` → Botas de vadeo, Bastón de vadeo, Cuerda

#### **🛠️ Equipo Básico (Siempre Incluido)**
- Botiquín, Silbato, Manta térmica, Navaja, Encendedor

## 🎮 Cómo Usar

### **Paso 1: Completar Información Básica**
```
Actividad: Ascenso al cerro
```

### **Paso 2: Agregar Tramo con Actividades Específicas**
```
Tramo 1: Aproximación al campamento base
Actividad: Trekking por sendero de montaña

Tramo 2: Ascenso al campamento alto
Actividad: Ascenso técnico con rapel

Tramo 3: Cumbre
Actividad: Escalada en roca y nieve

Tramo 4: Descenso y pernocta
Actividad: Rapel y campamento
```

### **Paso 3: Ir a Equipo y Transporte**
- Hacer clic en **"Analizar actividades"** (botón azul)
- El sistema mostrará todas las sugerencias basadas en las actividades

### **Paso 4: Revisar y Aplicar Sugerencias**
El sistema sugerirá:
- **Equipo Básico:** Botiquín, Silbato, etc.
- **Equipo de Trekking:** Bastones, Botas, Mochila (por "trekking")
- **Equipo de Escalada:** Casco, Arnés, Cuerda, etc. (por "ascenso", "rapel", "escalada")
- **Equipo de Nieve:** Piolet, Crampones, etc. (por "nieve")
- **Equipo de Campamento:** Carpa, Saco de dormir, etc. (por "campamento", "pernocta")

## 📊 Ejemplo Práctico

### **Actividades Ingresadas:**
```
Actividad General: Ascenso al cerro Tronador
Tramo 1: Trekking de aproximación
Tramo 2: Ascenso técnico con rapel
Tramo 3: Campamento en altura
Tramo 4: Descenso por glaciar
```

### **Equipo Sugerido Automáticamente:**

#### **🛠️ Equipo Básico**
- Botiquín (Sugerido por: básico)
- Silbato (Sugerido por: básico)
- Manta térmica (Sugerido por: básico)
- Navaja (Sugerido por: básico)
- Encendedor (Sugerido por: básico)

#### **🥾 Equipo de Trekking**
- Bastones (Sugerido por: tramo 1: Trekking de aproximación)
- Botas (Sugerido por: tramo 1: Trekking de aproximación)
- Mochila (Sugerido por: tramo 1: Trekking de aproximación)
- Botella de agua (Sugerido por: tramo 1: Trekking de aproximación)

#### **🏔️ Equipo de Escalada**
- Casco (Sugerido por: tramo 2: Ascenso técnico con rapel)
- Arnés (Sugerido por: tramo 2: Ascenso técnico con rapel)
- Cuerda (Sugerido por: tramo 2: Ascenso técnico con rapel)
- Mosquetones (Sugerido por: tramo 2: Ascenso técnico con rapel)
- Aseguradores (Sugerido por: tramo 2: Ascenso técnico con rapel)

#### **🏕️ Equipo de Campamento**
- Carpa (Sugerido por: tramo 3: Campamento en altura)
- Saco de dormir (Sugerido por: tramo 3: Campamento en altura)
- Aislante (Sugerido por: tramo 3: Campamento en altura)
- Linterna frontal (Sugerido por: tramo 3: Campamento en altura)

#### **❄️ Equipo de Nieve**
- Piolet (Sugerido por: tramo 4: Descenso por glaciar)
- Crampones (Sugerido por: tramo 4: Descenso por glaciar)
- Arnés (Sugerido por: tramo 4: Descenso por glaciar)
- Cuerda (Sugerido por: tramo 4: Descenso por glaciar)
- Mosquetones (Sugerido por: tramo 4: Descenso por glaciar)
- Gafas de sol (Sugerido por: tramo 4: Descenso por glaciar)

## ✨ Beneficios

1. **🎯 Precisión:** Equipo específico para cada actividad
2. **⏱️ Eficiencia:** Ahorra tiempo en la planificación
3. **🛡️ Seguridad:** Asegura que no falte equipo crítico
4. **📝 Trazabilidad:** Muestra qué actividad generó cada sugerencia
5. **🔄 Flexibilidad:** Permite aceptar/rechazar sugerencias
6. **📊 Completo:** Incluye cantidad y observaciones específicas

## 🔧 Personalización

El sistema es fácilmente extensible. Para agregar nuevas actividades:

1. **Editar `activityEquipmentMapping.js`**
2. **Agregar nueva actividad con su mapeo**
3. **El sistema automáticamente la detectará**

## 🎉 Resultado Final

El usuario obtiene una lista completa y contextualizada de equipo recomendado, basada en las actividades reales de su expedición, con la flexibilidad de personalizar según sus necesidades específicas. 