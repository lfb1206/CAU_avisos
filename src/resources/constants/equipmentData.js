// =============================================================================
// DATOS DE EQUIPAMIENTO - CATEGORÍAS SIMPLIFICADAS
// =============================================================================
// Este archivo contiene el equipamiento organizado en categorías simplificadas
// para facilitar la gestión y selección
// =============================================================================

export const equipmentData = {
  // Categorías principales simplificadas
  categories: [
    { id: 'calzado', name: 'Calzado', description: 'Zapatos, botas y calzado especializado' },
    { id: 'ropa', name: 'Ropa', description: 'Ropa técnica y de protección' },
    { id: 'proteccion', name: 'Protección', description: 'Protección solar, térmica y de seguridad' },
    { id: 'equipo', name: 'Equipo', description: 'Equipamiento básico de montaña' },
    { id: 'seguridad', name: 'Seguridad', description: 'Equipamiento de seguridad y rescate' },
    { id: 'campamento', name: 'Campamento', description: 'Equipamiento para acampar' },
    { id: 'nieve', name: 'Nieve', description: 'Equipamiento específico para nieve y hielo' },
    { id: 'navegacion', name: 'Navegación', description: 'Equipamiento de orientación y comunicación' }
  ],

  // Items de equipamiento por categoría
  items: {
    calzado: [
      { name: 'Botas de trekking', essential: true, description: 'Para senderismo y caminatas' },
      { name: 'Botas de montaña', essential: true, description: 'Para alta montaña' },
      { name: 'Zapatos de escalada', essential: false, description: 'Para escalada en roca' },
      { name: 'Zapatillas de aproximación', essential: false, description: 'Para aproximaciones' },
      { name: 'Botas impermeables', essential: false, description: 'Para condiciones húmedas' }
    ],
    ropa: [
      { name: 'Primera capa superior', essential: true, description: 'Camiseta técnica' },
      { name: 'Segunda capa superior', essential: true, description: 'Polar o fleece' },
      { name: 'Tercera capa superior', essential: false, description: 'Cortaviento o chaqueta' },
      { name: 'Pantalones técnicos', essential: true, description: 'Pantalones de montaña' },
      { name: 'Calcetines técnicos', essential: true, description: 'Calcetines especializados' },
      { name: 'Guantes', essential: false, description: 'Para frío y protección' },
      { name: 'Gorro', essential: false, description: 'Protección térmica' }
    ],
    proteccion: [
      { name: 'Bloqueador solar', essential: true, description: 'Factor alto' },
      { name: 'Anteojos de sol', essential: true, description: 'Protección UV' },
      { name: 'Sombrero para el sol', essential: false, description: 'Protección UV' },
      { name: 'Chaqueta impermeable', essential: false, description: 'Para lluvia' },
      { name: 'Pantalones impermeables', essential: false, description: 'Para lluvia' }
    ],
    equipo: [
      { name: 'Mochila', essential: true, description: 'Capacidad según actividad' },
      { name: 'Bastones de trekking', essential: false, description: 'Para estabilidad' },
      { name: 'Linterna frontal', essential: true, description: 'Con baterías de repuesto' },
      { name: 'Cantimplora', essential: true, description: 'Mínimo 1L' },
      { name: 'Cámara de fotos', essential: false, description: 'Documentación' },
      { name: 'Cortaplumas', essential: false, description: 'Herramienta multiuso' }
    ],
    seguridad: [
      { name: 'Arnés', essential: false, description: 'Para actividades técnicas' },
      { name: 'Cuerda', essential: false, description: 'Para aseguramiento' },
      { name: 'Mosquetones', essential: false, description: 'Para aseguramiento' },
      { name: 'Casco', essential: false, description: 'Protección contra caída de rocas' },
      { name: 'Descensor', essential: false, description: 'Para rapel' },
      { name: 'Botiquín', essential: true, description: 'Primeros auxilios' }
    ],
    campamento: [
      { name: 'Carpa', essential: false, description: 'Para actividades multidía' },
      { name: 'Saco de dormir', essential: false, description: 'Temperatura según zona' },
      { name: 'Aislante', essential: false, description: 'Para aislar del suelo' },
      { name: 'Cocina de gas', essential: false, description: 'Con combustible' },
      { name: 'Ollas y utensilios', essential: false, description: 'Para cocinar' }
    ],
    nieve: [
      { name: 'Piolet', essential: false, description: 'Para progresión en nieve' },
      { name: 'Crampones', essential: false, description: 'Para tracción en hielo' },
      { name: 'Raquetas', essential: false, description: 'Para nieve profunda' },
      { name: 'Polainas', essential: false, description: 'Para nieve' },
      { name: 'Guantes impermeables', essential: false, description: 'Para nieve' }
    ],
    navegacion: [
      { name: 'GPS', essential: false, description: 'Navegación electrónica' },
      { name: 'Brújula', essential: false, description: 'Navegación tradicional' },
      { name: 'Mapa', essential: false, description: 'Información del terreno' },
      { name: 'Radio', essential: false, description: 'Comunicación' },
      { name: 'Dispositivo satelital', essential: false, description: 'Emergencias' }
    ]
  }
};

// Funciones de utilidad
export const getCategoryById = (categoryId) => {
  return equipmentData.categories.find(cat => cat.id === categoryId);
};

export const getItemsByCategory = (categoryId) => {
  return equipmentData.items[categoryId] || [];
};

export const getEssentialItems = () => {
  const essentialItems = [];
  Object.entries(equipmentData.items).forEach(([categoryId, items]) => {
    items.forEach(item => {
      if (item.essential) {
        essentialItems.push({
          ...item,
          category: categoryId,
          categoryName: getCategoryById(categoryId)?.name
        });
      }
    });
  });
  return essentialItems;
};

export const searchEquipment = (searchTerm) => {
  const results = [];
  Object.entries(equipmentData.items).forEach(([categoryId, items]) => {
    items.forEach(item => {
      if (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          ...item,
          category: categoryId,
          categoryName: getCategoryById(categoryId)?.name
        });
      }
    });
  });
  return results;
};

export const getEquipmentByCategories = (categoryIds) => {
  const equipment = {};
  categoryIds.forEach(categoryId => {
    equipment[categoryId] = getItemsByCategory(categoryId);
  });
  return equipment;
};

export default equipmentData; 