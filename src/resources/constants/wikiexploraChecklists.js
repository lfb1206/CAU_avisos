// Checklists de Wikiexplora para trekking y montañismo
// Basado en: https://www.wikiexplora.com/Checklists_para_trekking_y_monta%C3%B1ismo

export const wikiexploraChecklists = {
  'tipo1': {
    name: 'Ruta de baja altitud, sin acampe, nieve ni frío',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para caminata en terreno fácil' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Opcional: cortos' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo2': {
    name: 'Ruta de mediana altitud, sin acampe ni nieve, algo de frío',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para terreno moderado' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Ideal tela sintética tipo polar' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para frío moderado' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Ropa', item: 'Cortaviento liviano', cantidad: 1, observaciones: 'Protección contra viento' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Ropa', item: 'Guantes de primera capa', cantidad: 1, observaciones: 'Para frío' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo3': {
    name: 'Ruta sin acampe, con nieve',
    imprescindibles: [
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Obligatorio para nieve' },
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar labial', cantidad: 1, observaciones: 'Protección labios' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual (nieve no se derrite a tiempo sin cocinilla)' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Ropa', item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Equipo', item: 'Polainas', cantidad: 1, observaciones: 'Salvo nieve escasa' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Raquetas', cantidad: 1, observaciones: 'Dependiendo de la cantidad de nieve' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo4': {
    name: 'Ruta de baja altitud, sin nieve ni frío, con acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para caminata en terreno fácil' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Opcional: cortos' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo5': {
    name: 'Ruta con nieve y acampe',
    imprescindibles: [
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Obligatorio para nieve' },
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar labial', cantidad: 1, observaciones: 'Protección labios' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual (nieve no se derrite a tiempo sin cocinilla)' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Ropa', item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Equipo', item: 'Polainas', cantidad: 1, observaciones: 'Salvo nieve escasa' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Raquetas', cantidad: 1, observaciones: 'Dependiendo de la cantidad de nieve' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo6': {
    name: 'Alta montaña, ruta no técnica y sin caminata sobre hielo',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol o antiparras con protección UV', cantidad: 1, observaciones: 'Protección UV alta' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Tercera capa superior', cantidad: 1, observaciones: 'Puede ser de baja aislación' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal de montaña' },
      { categoria: 'Ropa', item: 'Gorro para el frío', cantidad: 1, observaciones: 'Protección térmica' },
      { categoria: 'Ropa', item: 'Guantes delgados', cantidad: 1, observaciones: 'Para frío' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Recipiente para el agua', cantidad: 1, observaciones: 'Mínimo 1L' },
      { categoria: 'Equipo', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Alimentación', item: 'Comida', cantidad: 1, observaciones: 'Ración de marcha' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Medicina', item: 'Acetazolamida', cantidad: 1, observaciones: 'Para mal de altura' },
      { categoria: 'Equipo', item: 'Cortaplumas o cuchillo de camping', cantidad: 1, observaciones: 'Multiuso' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radios', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Equipo', item: 'Cargador para el teléfono en el auto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Pilas de repuesto para GPS', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Bolsas durables y distintivas para distribuir la comida', cantidad: 1, observaciones: 'Organización' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol de repuesto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo7': {
    name: 'Alta montaña, ruta no técnica pero con caminata sobre hielo',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para alta montaña con hielo' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol o antiparras con protección UV', cantidad: 1, observaciones: 'Protección UV alta' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Tercera capa superior', cantidad: 1, observaciones: 'Puede ser de baja aislación' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal de montaña' },
      { categoria: 'Ropa', item: 'Gorro para el frío', cantidad: 1, observaciones: 'Protección térmica' },
      { categoria: 'Ropa', item: 'Guantes delgados', cantidad: 1, observaciones: 'Para frío' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Recipiente para el agua', cantidad: 1, observaciones: 'Mínimo 1L' },
      { categoria: 'Equipo', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Alimentación', item: 'Comida', cantidad: 1, observaciones: 'Ración de marcha' },
      { categoria: 'Equipo de Nieve', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en hielo' },
      { categoria: 'Equipo de Nieve', item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Medicina', item: 'Acetazolamida', cantidad: 1, observaciones: 'Para mal de altura' },
      { categoria: 'Equipo', item: 'Cortaplumas o cuchillo de camping', cantidad: 1, observaciones: 'Multiuso' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radios', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Equipo', item: 'Cargador para el teléfono en el auto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Pilas de repuesto para GPS', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Bolsas durables y distintivas para distribuir la comida', cantidad: 1, observaciones: 'Organización' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol de repuesto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo8': {
    name: 'Trekking seco de altitud, con acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol o antiparras con protección UV', cantidad: 1, observaciones: 'Protección UV alta' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Tercera capa superior', cantidad: 1, observaciones: 'Puede ser de baja aislación' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal de montaña' },
      { categoria: 'Ropa', item: 'Gorro para el frío', cantidad: 1, observaciones: 'Protección térmica' },
      { categoria: 'Ropa', item: 'Guantes delgados', cantidad: 1, observaciones: 'Para frío' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Recipiente para el agua', cantidad: 1, observaciones: 'Mínimo 1L' },
      { categoria: 'Equipo', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Alimentación', item: 'Comida', cantidad: 1, observaciones: 'Ración de marcha' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Medicina', item: 'Acetazolamida', cantidad: 1, observaciones: 'Para mal de altura' },
      { categoria: 'Equipo', item: 'Cortaplumas o cuchillo de camping', cantidad: 1, observaciones: 'Multiuso' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radios', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Equipo', item: 'Cargador para el teléfono en el auto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Pilas de repuesto para GPS', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Bolsas durables y distintivas para distribuir la comida', cantidad: 1, observaciones: 'Organización' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol de repuesto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' }
    ]
  },
  
  'tipo9': {
    name: 'Mediamontaña no técnica, sin caminata sobre hielo, sin o poca nieve, con acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para mediamontaña' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para mediamontaña' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' }
    ]
  },
  
  'tipo10': {
    name: 'Mediamontaña no técnica, con caminata sobre hielo o altas pendientes de nieve, con acampe',
    imprescindibles: [
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Obligatorio para nieve' },
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar labial', cantidad: 1, observaciones: 'Protección labios' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual (nieve no se derrite a tiempo sin cocinilla)' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Ropa', item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Equipo', item: 'Polainas', cantidad: 1, observaciones: 'Salvo nieve escasa' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' },
      { categoria: 'Equipo de Nieve', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en nieve' },
      { categoria: 'Equipo de Nieve', item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Raquetas', cantidad: 1, observaciones: 'Dependiendo de la cantidad de nieve' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' }
    ]
  },
  
  'tipo11': {
    name: 'Trekking multidía en baja altura, en zona templada lluviosa',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Chaqueta resistente al agua', cantidad: 1, observaciones: 'Impermeable o respirable' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
      { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Temperatura según zona' },
      { categoria: 'Campamento', item: 'Aislante', cantidad: 1, observaciones: 'Para aislar del suelo' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' },
      { categoria: 'Campamento', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Campamento', item: 'Cocina de gas', cantidad: 1, observaciones: 'Con combustible' }
    ]
  },
  
  'tipo12': {
    name: 'Ruta en Patagonia en primavera o verano sin acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Chaqueta resistente al agua', cantidad: 1, observaciones: 'Impermeable o respirable' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo13': {
    name: 'Mediamontaña no técnica, con caminata sobre hielo o altas pendientes de nieve, sin acampe',
    imprescindibles: [
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Obligatorio para nieve' },
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar labial', cantidad: 1, observaciones: 'Protección labios' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual (nieve no se derrite a tiempo sin cocinilla)' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Ropa', item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Equipo', item: 'Polainas', cantidad: 1, observaciones: 'Salvo nieve escasa' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' },
      { categoria: 'Equipo de Nieve', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en nieve' },
      { categoria: 'Equipo de Nieve', item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Raquetas', cantidad: 1, observaciones: 'Dependiendo de la cantidad de nieve' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo14': {
    name: 'Travesía sobre glaciar agrietado, sin escalada en hielo',
    imprescindibles: [
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Obligatorio para nieve' },
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar labial', cantidad: 1, observaciones: 'Protección labios' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Ropa', item: 'Guantes', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Equipo', item: 'Polainas', cantidad: 1, observaciones: 'Para nieve' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Equipo de Nieve', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en glaciar' },
      { categoria: 'Equipo de Nieve', item: 'Crampones', cantidad: 1, observaciones: 'Para tracción en hielo' },
      { categoria: 'Seguridad', item: 'Arnés', cantidad: 1, observaciones: 'Para encordamiento' },
      { categoria: 'Seguridad', item: 'Cuerda', cantidad: 1, observaciones: 'Para encordamiento' },
      { categoria: 'Seguridad', item: 'Mosquetones', cantidad: 4, observaciones: 'Para encordamiento' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo15': {
    name: 'Trekking seco de altitud, sin acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol o antiparras con protección UV', cantidad: 1, observaciones: 'Protección UV alta' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Tercera capa superior', cantidad: 1, observaciones: 'Puede ser de baja aislación' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Para alta montaña' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal de montaña' },
      { categoria: 'Ropa', item: 'Gorro para el frío', cantidad: 1, observaciones: 'Protección térmica' },
      { categoria: 'Ropa', item: 'Guantes delgados', cantidad: 1, observaciones: 'Para frío' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Recipiente para el agua', cantidad: 1, observaciones: 'Mínimo 1L' },
      { categoria: 'Equipo', item: 'Linterna frontal', cantidad: 1, observaciones: 'Con baterías de repuesto' },
      { categoria: 'Equipo', item: 'Mochila amplia', cantidad: 1, observaciones: 'Capacidad 40-60L' },
      { categoria: 'Alimentación', item: 'Comida', cantidad: 1, observaciones: 'Ración de marcha' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Medicina', item: 'Acetazolamida', cantidad: 1, observaciones: 'Para mal de altura' },
      { categoria: 'Equipo', item: 'Cortaplumas o cuchillo de camping', cantidad: 1, observaciones: 'Multiuso' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radios', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa del área', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Equipo', item: 'Cargador para el teléfono en el auto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Pilas de repuesto para GPS', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Equipo', item: 'Bolsas durables y distintivas para distribuir la comida', cantidad: 1, observaciones: 'Organización' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol de repuesto', cantidad: 1, observaciones: 'Backup' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  },
  
  'tipo16': {
    name: 'Mediamontaña en trópicos, sin acampe',
    imprescindibles: [
      { categoria: 'Calzado', item: 'Zapatos apropiados', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Primera capa superior', cantidad: 1, observaciones: 'Camiseta técnica' },
      { categoria: 'Ropa', item: 'Segunda capa superior', cantidad: 1, observaciones: 'Aislamiento térmico' },
      { categoria: 'Ropa', item: 'Chaqueta resistente al agua', cantidad: 1, observaciones: 'Impermeable o respirable' },
      { categoria: 'Ropa', item: 'Pantalones cómodos para caminar', cantidad: 1, observaciones: 'Impermeables' },
      { categoria: 'Ropa', item: 'Calcetines apropiados', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Ropa', item: 'Calcetines de recambio', cantidad: 1, observaciones: 'Ideal especializados' },
      { categoria: 'Protección Solar', item: 'Bloqueador solar', cantidad: 1, observaciones: 'Factor alto' },
      { categoria: 'Protección Solar', item: 'Sombrero para el sol', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Hidratación', item: 'Agua', cantidad: 1, observaciones: 'Completa autonomía individual si no hay fuentes' },
      { categoria: 'Alimentación', item: 'Ración de marcha', cantidad: 1, observaciones: 'Comida para el día' },
      { categoria: 'Equipo', item: 'Mochila liviana', cantidad: 1, observaciones: 'Capacidad 20-30L' }
    ],
    aconsejables: [
      { categoria: 'Documentación', item: 'Documentación de la ruta', cantidad: 1, observaciones: 'Impresa o cargada para teléfono sin conexión' },
      { categoria: 'Protección Solar', item: 'Anteojos de sol con protección UV', cantidad: 1, observaciones: 'Protección UV' },
      { categoria: 'Equipo', item: 'Bastones de trekking', cantidad: 2, observaciones: 'Ideal telescópicos y con canastillos de invierno' },
      { categoria: 'Comunicación', item: 'Teléfono con batería al 100%', cantidad: 1, observaciones: 'Al momento de salir' },
      { categoria: 'Equipo', item: 'Cámara de fotos', cantidad: 1, observaciones: 'Opcional' },
      { categoria: 'Primeros Auxilios', item: 'Vendaje adhesivo para ampollas', cantidad: 1, observaciones: 'Prevención' },
      { categoria: 'Navegación', item: 'GPS', cantidad: 1, observaciones: 'Ideal con track/waypoints precargados' },
      { categoria: 'Comunicación', item: 'Radio', cantidad: 1, observaciones: 'Para grupo' },
      { categoria: 'Navegación', item: 'Mapa de la ruta', cantidad: 1, observaciones: 'Backup de navegación' },
      { categoria: 'Comunicación', item: 'Dispositivo de comunicación satelital', cantidad: 1, observaciones: 'Emergencias' }
    ]
  }
};

// Función para obtener todos los checklists disponibles
export const getAvailableChecklists = () => {
  return Object.entries(wikiexploraChecklists).map(([key, checklist]) => ({
    value: key,
    label: checklist.name
  }));
};

// Función para obtener un checklist específico
export const getChecklist = (checklistKey) => {
  return wikiexploraChecklists[checklistKey];
};

// Función para aplicar un checklist al equipo
export const applyChecklistToEquipment = (checklistKey, includeAdvisable = true) => {
  const checklist = getChecklist(checklistKey);
  if (!checklist) return [];

  let equipment = [...checklist.imprescindibles];

  if (includeAdvisable) {
    equipment = [...equipment, ...checklist.aconsejables];
  }

  return equipment.map(item => ({
    ...item,
    checked: false,
    observaciones: `${item.observaciones} (Checklist: ${checklist.name})`
  }));
}; 