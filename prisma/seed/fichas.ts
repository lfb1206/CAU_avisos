import { PrismaClient, TallerBranch } from '@prisma/client';

function toFloat(val: string | number | undefined | null): number | null {
  if (val == null) return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  const cleaned = val.toString().replace(',', '.').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function clean(val: string | undefined | null): string | null {
  if (!val) return null;
  const t = val.trim();
  if (t === '' || t === '--' || t === '|') return null;
  return t;
}

type FichaRow = {
  name: string;
  branch: TallerBranch;
  objetivo?: string | null;
  contenidos?: string | null;
  habilidades?: string | null;
  equipo_personal?: string | null;
  equipo_recomendado?: string | null;
  equipo_cau?: string | null;
  evaluacion_metodo?: string | null;
  lugar_tipico?: string | null;
  condiciones_lugar?: string | null;
  requisitos_personales?: string | null;
  observaciones?: string | null;
  rutas_posibles?: string | null;
  bibliografia?: string | null;
  prueba_convalidacion?: string | null;
  horas_clases?: number | null;
  horas_practica?: number | null;
  horas_evaluacion?: number | null;
  dias_terreno?: number | null;
  dias_traslado?: number | null;
};

const fichas: FichaRow[] = [
  // ── M1 / Base ────────────────────────────────────────────────────────────
  {
    name: 'Técnicas Básicas de Montañismo',
    branch: 'base',
    objetivo:
      'Lograr realizar ascensiones por el día de manera segura (tanto para sí mismo como para quienes le acompañan), sabiendo interpretar las señales visuales en terreno, desplazándose cómodamente por terrenos irregulares y con pendiente, e identificar qué y porqué usar cierto tipo de vestimenta y equipo.',
    contenidos:
      '1- Aprender cómo desplazarse en terreno irregular e inclinado, con especial énfasis en acarreos\n2- Conocer y usar herramientas de apoyo como son el piolet y los bastones\n3- Entender y experimentar el trabajo en cordada\n4- Orientación visual en terreno\n5- Fundamentos de la planificación de una salida, en particular de una salida por el dia\n6- Equipo y vestimenta, sistema de capas, materiales y sus características',
    habilidades:
      '-Desplazarse cómodamente en terrenos inclinados y dinámicos, haciendo uso de herramientas de apoyo.\n-Orientarse visualmente en terreno de montaña.\n-Identificar cual es la vestimenta y calzado más adecuados para una salida por el dia.\n-Explicar la importancia de la cordada y su conducta con sus compañeros en la misma.',
    equipo_personal:
      'a. Zapatos de trekking caña alta\nb. Casco de escalada \nc. Piolet\nd. Linterna frontal\ne. Guantes\nf. Anteojos de sol, gorro con visera y bloqueador solar\ng. Mochila personal con ración de marcha, agua y botiquín\nh. Vestimenta adecuada a las condiciones como aquellas vistas en clases, tales como:  pantalón largo (no short), polera manga larga (idealmente), cortaviento.',
    equipo_recomendado: 'Bastones\nPolainas',
    equipo_cau: 'Piolet',
    evaluacion_metodo: 'Examen escrito online',
    lugar_tipico:
      'Clases - en línea\nSalidas\n1era salida - acarreo de quebrada el perrito\n2da salida - ascenso por ruta alternativa al cerro cortaderas del barroso',
    condiciones_lugar:
      '1era salida - debe tener una aproximación con una extensión y un desnivel que permita testear la condición física de los alumnos, idealmente una ascensión de 1 hora y 300 metros de desnivel\n2da salida - cerro con múltiples opciones de ascenso, cuyas rutas opcionales no sean tan evidentes y tengan un terreno irregular con áreas de material suelto y/o acarreo. Y en el cual sea posible encontrar un sector donde pueda reunirse el grupo y dictar una clase.',
    requisitos_personales:
      'Condición física que le permita recorrer un desnivel de 300 metros en 1 hora con una carga superior a 5kg.',
    rutas_posibles:
      'Cerros cuyas ascensiones solo impliquen caminar y en los que se pueda llegar a la cumbre y bajar el mismo día, y cuya altitud no supere los 3500 msnm',
    bibliografia: 'Capítulos 2, 6, 7 y 8 del libro "montañismo, la libertad de las cimas"',
    prueba_convalidacion:
      'NA, pero en condiciones excepcionales se le permite a un alumnos, previa solicitud de este, el no asistir a uno de las dos salidas, o ambas. Siempre y cuando su currículo indique actividades que permitan conjeturar que posee las habilidades necesarias para no realizar el taller.',
    horas_clases: 3,
    horas_practica: 14,
    horas_evaluacion: 1,
    dias_terreno: 2,
    dias_traslado: 0,
  },
  {
    name: 'Planificación y Gestión del Riesgo',
    branch: 'base',
    objetivo:
      'Introducir una forma de pensar la planificación y la gestión del riesgo integradamente, apoyándose en la teoría, utilizando un método y una herramienta en una etapa formativa inicial, que luego se vaya completando con conocimiento y experiencia.',
    contenidos:
      '-Concientizar acerca del riesgo que asumimos \n-Contexto montañismo en Chile \n-Cómo se producen los accidentes \n-Introducir un marco teórico de gestión del riesgo \n-Proponer y utilizar un método para planificar y gestionar el riesgo \n-Utilizar una herramienta para planificar y gestionar el riesgo',
    habilidades:
      '-Planificar una salida de montaña identificando los supuestos clave que soportan cada una de sus partes, los peligros y riesgos a los que se exponen y hacer una gestión de estos elementos para maximizar las probabilidades de una actividad exitosa y sin accidentes. \n-Identificar los supuestos clave o críticos que soportan cada tramo de la actividad en planificación. \n-Diferenciar entre los peligros presentes en el lugar donde realizan sus actividades y los riesgos a los que se exponen. \n-Identificar los peligros y riesgos de la actividad. \n-Establecer acciones de gestión, control y mitigación para los supuestos y riesgos, integrándolas en la planificación de la actividad. \n-Realizar un aviso de salida que muestre la planificación, de acuerdo a un formato provisto.',
    equipo_personal: 'Dispositivo con conexión a Internet, cámara y micrófono.',
    equipo_recomendado:
      'Lugar tranquilo, con condiciones aptas para asistir a una clase y realizar trabajo colaborativo en línea.',
    equipo_cau: null,
    evaluacion_metodo:
      'Prueba de alternativas (LINK) y verificación de envío de aviso de salida con revisión y comentarios formativos',
    lugar_tipico: 'En línea',
    condiciones_lugar:
      'Alumno de M1 o que tome el taller en acuerdo con coordinación. (socio o postulantes a socio para convalidación M1)',
    rutas_posibles: 'Cualquiera, se trata de un taller de carácter general',
    bibliografia:
      'Gestión de riesgo en montaña y en actividades al aire libre. 2da Edición. Alberto Ayora, Desnivel Ediciones.\n\nRiesgo y Liderazgo. Cómo organizar y guiar actividades en el medio natural. 2da Edición, Alberto Ayora, Desnivel Ediciones.\n\nMontañismo: Libertad de las Cimas. 6º Edición, Desnivel Ediciones.\n\nEverest the hard way – Chris Bonnington',
    prueba_convalidacion:
      'Se puede utilizar el mismo examen y la entrega de una planificación en el aviso de salida.',
    horas_clases: 2,
    horas_practica: 3,
    horas_evaluacion: 1,
    dias_terreno: 0,
    dias_traslado: 0,
  },
  {
    name: 'Técnicas de Campamento y Mínimo Impacto',
    branch: 'base',
    objetivo:
      'Entregar habilidades para planificar y realizar ascensiones de montañas que involucren más de una jornada, buscando minimizar el impacto en la naturaleza. Además de entregar herramientas necesarias para seleccionar y utilizar el equipo que permita realizar exitosamente la ascensión de un cerro basándose en una detallada planificación.',
    contenidos:
      '1. Campamento\n1.1 Elección del lugar\n1.2 Organización\n1.3 Tipos\n\n2. La Carpa\n2.1 Características\n2.2 Partes\n2.3 Tipos\n2.4 Cuidado\n2.5 Vivac\n\n3. Equipo\n3.1 Equipo de cordada\n3.2 Equipo personal\n\n4. Alimentación\n\n5. Mínimo Impacto',
    equipo_personal:
      'a. Zapatos de trekking caña alta\nb. Casco de escalada \nc. Piolet\nd. Linterna frontal\ne. Guantes\nf. Anteojos de sol, gorro con visera y bloqueador solar\ng. Mochila personal de mínimo 40 L con ración de marcha, agua y botiquín\nh. Colchoneta para dormir\ni. Anafre\nh. Vestimenta adecuada a las condiciones, tales como:  pantalón largo (no short), polera manga larga (idealmente), cortaviento.',
    equipo_recomendado: 'Bastones\nPolainas',
    equipo_cau: 'Piolet',
    evaluacion_metodo: 'Examen escrito online',
    lugar_tipico: 'Clases - en línea\nSalidas - Cerro Los Lunes',
    requisitos_personales:
      'Condición física que le permita recorrer un desnivel de 500 metros con carga de 15 a 20kg para el día siguiente realizar una ascensión de 1000m de desnivel con 5kg de carga aprox',
    rutas_posibles:
      'Cerros cuyas ascensiones solo impliquen caminar y en los que se pueda llegar a la cumbre y bajar con pernoctaciones de uno a dos días, y cuya altitud no supere los 3500 msnm',
    prueba_convalidacion:
      'NA, pero en condiciones excepcionales se le permite a alumnos, previa solicitud de este, el no asistir al curso siempre y cuando su currículo indique actividades que permitan conjeturar que posee las habilidades necesarias para no realizar el taller. El compromiso es que el alumno luego debe ir de ayudante del curso',
    horas_clases: 3,
    horas_practica: 36,
    horas_evaluacion: 1,
    dias_terreno: 1.5,
    dias_traslado: 0.5,
  },
  {
    name: 'Orientación en Zonas Remotas',
    branch: 'base',
    objetivo:
      'Entregar los conocimientos necesarios para orientarse a través del uso de Brújula, carta topográfica y GPS en terrenos remotos, mediante triangulación por azimut y retro-azimut. Además de entregar los conocimientos para planificar una salida en terrenos sin rutas antes descritas.',
    contenidos:
      'Orientación, navegación\nOrientación como acción sensitiva (visual, auditiva, olfato)\n2. Indicadores\nNaturaleza: posición del sol, estrellas, \nGeográficos: viento, vegetación, topografía, hidrografía\nMarcas humanas\nHerramientas (brújula, gps, carta topográfica, imágenes)\n3. Cartas topográficas\na. Definición de Datum, sistema de coordenadas geográficas vs proyectadas (UTM)\nb. Elementos de una carta: escala, datum, coordenadas, orientación (norte), curvas de nivel\nc. Uso con brújula, triangulación, azimut, retro-azimut\n4. Navegación y GPS\na. Funcionamiento, utilidad y limitaciones del sistema GPS\nb. Definiciones: waypoint, track, etc.\nc. Consideraciones en uso de GPS',
    habilidades:
      'Los participantes del taller serán capaces de determinar las coordenadas en el sistema UTM de la posición dónde se encuentran utilizando la técnica de triangulación con ayuda de una brújula y una carta topográfica. Además podrán trazar rutas en una carta topográfica y seguirlas en terreno. Esto se evaluará mediante un ejercicio práctico en terreno.',
    equipo_personal:
      'Se pide el mismo equipamiento para el taller de técnicas de campamento y mínimo impacto, salvo el uso de casco de escalada.',
    equipo_recomendado:
      'Poner atención a las condiciones meteorológicas previas y eventualmente utilizar equipo para nieve o barro de ser necesario.',
    equipo_cau:
      '* 6 brújulas\n* 6 GPS (con pilas + set de pilas de repuesto)\n* 6 reglas \n* 6 compás\n* 6 gomas de borrar\n* 6 Lápiz mina\n* 6 Lápiz Pasta\nDisponible cada uno en 6 bolsas separadas',
    evaluacion_metodo: 'Evaluación Escrito online',
    lugar_tipico:
      'Los Maitenes, en la confluencia del Estero Aucayes con el Río Colorado, utilizando puntos ya definidos y utilizados en ruta hacia el campamento base del cerro El Durazno.',
    requisitos_personales:
      'Condición física que le permita recorrer un desnivel de 500 metros con carga de 15 a 20 kg',
    bibliografia:
      'Lectura del capítulo 5: "La orientación",del libro "Montañismo La libertad de las cimas" Ed. Desnivel (9ª ed.).',
    prueba_convalidacion:
      'NA, pero en condiciones excepcionales se le permite a alumnos, previa solicitud de este, el no asistir al curso siempre y cuando su currículo indique actividades que permitan conjeturar que posee las habilidades necesarias para no realizar el taller. El compromiso es que el alumno luego debe ir de ayudante del curso',
    horas_clases: 3,
    horas_practica: 12,
    horas_evaluacion: 1,
    dias_terreno: 1.5,
    dias_traslado: 0.5,
  },
  {
    name: 'Primeros Auxilios en Montaña',
    branch: 'base',
    objetivo:
      'Entregar herramientas básicas para evitar y enfrentarse a lesiones, enfermedades y accidentes\nEncaminarlos a ser un aporte ante situaciones adversas de salud, pudiendo comunicarse efectivamente en caso de solicitar asistencia médica\nTener nociones para aprovechar cursos más avanzados de Primeros Auxilios',
    contenidos:
      'Enfrentamiento inicial: Seguridad de escena, Evaluación Primaria y Secundaria\nEnfermedades habituales en Montaña: Patologías por Calor y Frío, Traumatismos e inmovilizaciones, Ampollas y lesiones comunes, Diarrea y Potabilización de agua\nBotiquín',
    habilidades:
      'Hacer una Evaluación Sistemática y manejo inicial de víctimas de trauma o enfermedad\nRCP básica y Control de Sangrado\nHacer un reporte radial útil\nEvacuar a un lugar accesible\nArmar un botiquín y poder aprovechar cursos más avanzados (WAFA/WFR)',
    equipo_personal: 'Equipo habitual para salidas por más de un día, y lo que tenga preparado como su botiquín',
    evaluacion_metodo:
      'Evaluación formativa en terreno de capacidad de realizar evaluación sistemática de víctima, desempeñándose como líder de equipo que provee Primeros Auxilios\nEvaluación sumativa online, prueba de alternativas',
    lugar_tipico: 'Clases en linea\nSalida con acampada, Laguna Piuquenes (estival)',
    condiciones_lugar:
      'Cómodo para acampar, con bajo nivel de dificultad de acceso, con sitios cercanos para simular accidentes y ejercicio de traslado de víctimas',
    bibliografia:
      'Guías actualizadas de manejo clínico de la Wilderness Medical Society\nhttps://wms.org/WMS/WMS/Research/WEM/CPG.aspx',
    prueba_convalidacion: 'Certificación WAFA o equivalente: Requiere demostrar conocimientos desarrollando caso de simulación de atención a víctima',
    horas_clases: 3,
    horas_practica: 12,
    horas_evaluacion: 1,
    dias_terreno: 1.5,
    dias_traslado: 0.25,
  },
  {
    name: 'Técnicas Básicas en Nieve',
    branch: 'base',
    objetivo:
      'Adquirir conocimientos y habilidades que le permita al alumno adentrarse de manera segura en terreno nevado.\nLograr realizar ascensiones de manera segura en terrenos nevados, con pendientes iguales o inferiores a 40° de inclinación y altitudes inferiores a 4000 msnm',
    contenidos:
      '1- Aprender cómo desplazarse en terreno nevado\n2- Autodetención en terrenos nevados\n3- Campamento en nieve\n4- Orientación visual en terreno\n5- Planificación de una salida en condiciones invernales\n6- Equipo y vestimenta',
    habilidades:
      '- autodetención en pendientes nevadas\n- establecer campamentos en terreno nevado\n- conocer, identificar y entender el equipo y la vestimenta más adecuados para condiciones nevadas e invernales\n- evaluar y recorrer rutas nevadas en montañas con pendientes inferiores a los 40° y de baja dificultad técnica (sin crampones, sin pasos de escalada)\n- conocer los fundamentos de la formación de nieve y hielo\n- conocer a un nivel básico la formación de avalanchas\n- conocer e identificar algunos refugios en nieve',
    equipo_personal:
      'Vestimenta para condiciones invernales\nZapatos de media/alta montaña\nPiolet\nCasco\nLinterna\nEquipo de campamento\n(Revisar equipo propuesto en Pág web)',
    equipo_recomendado: 'Bastones\nPolainas',
    equipo_cau: 'Piolet',
    evaluacion_metodo:
      'examen online de los contenidos vistos en clase teórica y salida\nevaluación en la ejecución de una correcta autodetención',
    lugar_tipico:
      'Clase en línea\nLugar con nieve de una profundidad mayor a 1 metro\nLaderas cercanas (no más de 1 km o 45 min de aproximación) al campamento con pendientes iguales o superiores a los 40°\nzona de campamento lo suficientemente amplia como para un grupo de 50 personas\naproximación al campamento (1 a 6 horas)\nascensión desde el campamento (3 a 6 horas)',
    condiciones_lugar:
      'Condiciones ideales: nieve compacta, estable, que en su momento de mayor congelamiento permita abrir huella sin el uso de crampones',
    observaciones:
      'Los tiempos indicados no son mandatorios, sino una estimación idealizada, pueden ampliarse si el lugar posee las características descritas\nEs ideal, aunque no imprescindible, que el alumno pueda ver en terreno un corte en el manto para entender el proceso de formación de la nieve. De igual modo es útil ver algún método de testeo de condiciones de avalanchas, actualmente ven el test de stress',
    rutas_posibles:
      'Montañas nevadas con inclinaciones iguales o inferiores a 40°, que no tengan altitudes superiores a los 3500-4000 msnm, y cuyas rutas no tengan hielo, terreno congelado o pasos de escalada.',
    bibliografia: 'Capítulos 2, 3, 6  y 16 del libro "montañismo, la libertad de las cimas"',
    prueba_convalidacion: 'NA, en ocasiones muy especiales se realiza un examen de autodetención',
    horas_clases: 3,
    horas_practica: 36,
    horas_evaluacion: 1,
    dias_terreno: 2.5,
    dias_traslado: 0.5,
  },

  // ── Nieve y Hielo ─────────────────────────────────────────────────────────
  {
    name: 'Iniciación a la Alta Montaña',
    branch: 'nieve_hielo',
    objetivo:
      'Proveer al alumno con conocimientos teóricos y prácticos para realizar ascensos de forma segura, en cordadas independientes, en condiciones de alta montaña  con presencia de nieve y sin mayores dificultades técnicas. \nEntregar conocimientos sobre enfermedades por frío y mal de altura y poner en práctica conocimientos en terreno.',
    contenidos:
      '- Planificación: consideraciones de la ruta, distancias, desniveles, tiempos, meteorología.\n- Equipo alta montaña: uso y mantención. equipo técnico, vestuario, campamento.\n- Técnicas de marcha en terreno de alta montaña: ascenso por neveros duros de hasta 50°, autodetención con  crampones, pasadas  roca  hasta  grado  iii, traverse, desescalar  por  pendientes  de  hasta  50° sin exposición.\n- Prevención y manejo de primeros auxilios respecto de enfermedades por frío.\n- Enfermedades por altura.\n- Crampones: elección, mantención, tipos, historia.\n- Gestión del riesgo: práctica de lo aprendido en curso CAU respectivo: evaluación de riesgos, toma de decisiones, estrategias, elección de rutas de ascenso y descenso\n- Comunicación en montaña: uso de radio, navegación con gps y carta.',
    habilidades:
      '- Planificar rutas en cerros de altura y baja dificultad técnica.\n- Correcto uso de las distintas técnicas existentes en marcha con crampones.\n- Correcto armado de carpa en condiciones de alta montaña.\n- Identificación y buena gestión de enfermedades por altura.',
    equipo_personal:
      '- casco.\n- crampones afilados.\n- piolet de marcha.\n- bastones de trekking o esquí.\n- vestuario adecuado para alta montaña.\n- equipo para salida: mochila 45lt mín, linterna frontal, botiquín, botella, termo, aislante, saco de dormir, cocinilla, ollas, gas, carpa.\n- botiquín personal.',
    equipo_recomendado: '- radio vhf/uhf (1)',
    equipo_cau: '*Prioridad alumnos para uso de crampones\n*Inreach',
    evaluacion_metodo: '- Evaluación en terreno.\n- Evaluación tarea de planificación de ruta.',
    lugar_tipico: 'cerro mohai o cerro evelio (por confirmar)',
    condiciones_lugar:
      '- La condición más relevante es contar con un sector de nieve dura para poder hacer más realista la práctica del uso del crampones.',
    requisitos_personales:
      '- Abierto para todos los socios cau con sus cuotas al día, exalumnos que hayan completado todos los talleres del curso básico M1.\n- Tener el equipo adecuado y condición física y mental para una salida de alta exigencia física.',
    rutas_posibles:
      'aconcagua por ruta falso polacos, volcán ojos del salado, volcán san josé, punta negra, piuquencillo, volcanes parinacota, pomerape, acotango guallatire, volcanes llaima y lanín, cerro moai y punta chile, cerro varela, cerro alto la posada, cerro ojos de agua, picos del barroso por pangal, cerro la paloma por nevado del rincón, cerro el plomo, cerro punta universitaria, cerro torre de flores, cerro descabezado y cerro azul, cerro tórtolas, volcán tolhuaca, volcán villarrica, volcán planchón, volcán tupungato, volcán maipo, nevado de piuquenes, sierra bella, nevado del plomo, cerro gloria, volcán sajama, volcán llullaillaco, cerro kiñewen.',
    prueba_convalidacion: 'No. Se evalúa caso a caso y solicita asistencia como practicante.',
    horas_clases: 3,
    horas_practica: 15,
    horas_evaluacion: 1,
    dias_terreno: 2,
    dias_traslado: 0.25,
  },
  {
    name: 'Avalanchas',
    branch: 'nieve_hielo',
    objetivo:
      'Desarrollar una comprensión de la seguridad en terreno de avalanchas, que el alumno logre una comprensión del terreno y pueda tomar la decisión de ingresar o no a terreno de avalanchas. desarrollar ejercicios de evaluación del manto de nieve y determinar la calidad del manto. que el alumno sea capaz de identificar las trampas de terreno y poder evitarlas en el itinerario del cerro. ejercicios prácticos para búsqueda y rescate de víctimas de avalanchas.',
    contenidos:
      '- que saber antes de salir.\n- nivología, avalanchas y seguridad (mención de arva y otros dispositivos).\n- protocolo de rescate de avalanchas\n- planificación y toma de decisiones en terrenos de avalanchas.\n- evaluación del manto nivoso, construcción de calicatas.\n- evaluación de terrenos con riesgo de avalanchas (ejemplos y tareas).',
    habilidades:
      '- Identificar terreno de avalanchas . \n- Reconocer los peligros en terreno nevado que los puede llevar una avalancha. \n- Tomar la decisión de dónde moverse en cerros de altura con pendientes de nieve o glaciares.',
    equipo_personal:
      '- pala metálica personal\n- tener dos arva o dva (detector de víctimas de avalancha) por cordada.\n- sierra (deseable 1 por cordada)\n- ropa de abrigo adecuada para el trabajo en terreno de nieve.\n- anteojos categoría 3 o 4 (no se dejará realizar la actividad práctica quien no cuente con ellos)',
    equipo_recomendado: '- Antiparras de ski. \n- radio vhf/uhf',
    equipo_cau: 'Arva, Pala, Sonda, sierras de nieve.\n*Inreach',
    evaluacion_metodo:
      '- Evaluación en terreno, preguntas a cada persona individualmente. \n* A implementar, completar cuestionarios que existen de avalanchas en páginas relacionadas (Mini talleres ayuda memoria)',
    lugar_tipico: 'Centro Ski La Parva / Cajón del Maipo (Arenas o San Gabriel) / Alfalfal (Pinelli\'s Spot).',
    condiciones_lugar: '- Terreno nevado a lo más 1,5 m de profundidad.',
    requisitos_personales:
      '- Abierto para todos los socios cau con sus cuotas al día.\n- Tener 3 puntos de ayudantía en montañismo básico, intermedio o avanzado en el último año.\n- Haber  realizado  todos  los  cursos  de  prerrequisito  según  la  malla  del  club  andino universitario.\n- Tener el equipo adecuado.',
    rutas_posibles: '- Ascenso a cerros en época invernal.',
    bibliografia:
      '-Montañismo libertad de las cimas, capitulo 26, 658-673. (teoría pura)\n-Avalanchas, nociones imprescindibles. bruce tremper. (teoría y práctica)\n-Glacier mountaineering, andy tyson & mike clelland.  (algo de teoría y muchos tips y elementos para llevar a la práctica más fácil)\n-¡Avalancha! robert bolognesi. ediciones desnivel (lo encuentran en tatoo, buen libro practico)',
    prueba_convalidacion: 'No. Se evalúa caso a caso y solicita asistencia como practicante.',
    horas_clases: 2,
    horas_practica: 12,
    horas_evaluacion: 2,
    dias_terreno: 2,
    dias_traslado: 0.5,
  },
  {
    name: 'Progresión en Nieve y Hielo',
    branch: 'nieve_hielo',
    objetivo:
      'Dotar a los asistentes de los conocimientos y habilidades necesarias para desarrollar itinerarios montañosos que presenten terrenos de nieve y hielo en pendientes  de  entre  30 y  60°, por  medio  de  distintas  técnicas  de  progresión  y  aseguramiento, mediante uso de cuerdas y anclajes, naturales y artificiales.',
    contenidos:
      '- tipos de terreno de progresiones en hielo y nieve.\n- técnicas de ascenso y descenso en pendientes fuertes nevadas.\n- aseguramientos en nieve.\n- descenso con medios disponibles.\n- progresiones en hielo, técnicas de cramponaje.\n- colocación de seguros en nieve y hielo.',
    habilidades:
      '- Avanzar en terreno de nieve, hielo y mixto sobre pendientes mayores a 45° y menores de 70° de forma segura y autoevaluando el nivel de riesgo.\n- Planificar la ejecución de actividades de montaña sobre terrenos inclinados de forma autónoma y segura.\n- Identificar factores de riesgo y condiciones extremas que pueden condicionar nuestra actividad.',
    equipo_personal:
      '- radio vhf/uhf (1)\n- arnés (1)\n- descendedor con mosquetón c/seguro (1)\n- cordín autoseguro rappel (1) o shunt.\n- casco (1)\n- linterna frontal (1)\n- crampones (1)\n- piolet técnico de marcha (1)\n- piolet hielero (1)\n- leashes o cordín de aseguramiento del piolet incluidos mosquetones (2)\n- tornillo de hielo (1)\n- estaca de nieve (2)\n- cinta expréss (3)\n- línea de vida (1)\n- reunión completa (incluye mosquetones con seguro)\n- anilla 60 cm (2)\n- mosquetones sin seguro (4)\n- mosquetones con seguro (2)\n- cordín 6 mm, 1 m (1)\n- cinta plana de 3 metros (1)',
    equipo_recomendado: '- GPS\n- Equipo vivac',
    equipo_cau:
      'dependiendo del lugar, condiciones y quórum:\ncuerdas dry\n12 tornillos\n12 cintas\npiolets hieleros\n*Inreach',
    evaluacion_metodo: '- Evaluación en terreno.',
    lugar_tipico: '- Diente del Diablo\n- Aparejo\n- Gloria',
    condiciones_lugar:
      '- Terrenos nevados con pendientes sobre 45° sin peligro de avalanchas.\n- Terrenos escarpados nevados para ejercicios de rappel, desescale, traversse y escale.',
    requisitos_personales:
      '- Abierto para todos los socios cau con sus cuotas al día.\n- Haber realizado al menos 4 puntos de ayudantías en el último año (mayor cantidad de puntos entrega prioridad).\n- Haber realizado todos los cursos de prerrequisito según la malla del club.\n- Tener el equipo adecuado y condición física de alta exigencia.',
    observaciones:
      'Estado físico muy compatible con jornadas extenuantes y frío, al incluir actividades nocturnas previas a la actividad final',
    rutas_posibles:
      '-Cerro Punta Negra.\n-Cerro Aparejo.\n-Cerro Diente del Diablo.\n-Punta Yamakawa.\n-Cerro Parva del Inca.',
    bibliografia:
      '-Alpinismo extremo (mark twight): versión en inglés descargable.\n-Escalada en hielo y mixta (will gadd, desnivel).\n-Montañismo invernal (n°75, desnivel).\n-Montañismo, libertad de las cimas, capitulo 16, 384-429.',
    prueba_convalidacion: 'No. Se evalúa caso a caso y solicita asistencia como practicante.',
    horas_clases: 3,
    horas_practica: 27,
    horas_evaluacion: null, // "En la salida." — not a fixed number
    dias_terreno: 3,
    dias_traslado: 0.5,
  },
  {
    name: 'Perfeccionamiento de Esquí',
    branch: 'nieve_hielo',
    objetivo:
      'Tomar un grupo de alumnos con un nivel de esquí similar y guiarlos para mejorar su técnica y su nivel de esquí backcountry. De esta forma, se pretende generar esquiadores que estén más seguros y rápidos en ambientes alpinos. Además, como objetivo del taller se abordarán las diferencias entre la amplia variedad de opciones de equipo en el mercado y se orientará a los alumnos sobre cómo sacarle mejor provecho a su equipo  e indicarles si es el adecuado para su capacidad presente y objetivos',
    contenidos:
      'Teórico\n-tipos de skis\n-tipos de fijaciones\n-botas y sus consideraciones\n-diferencia entre casco de ski y de montaña\n-como escoger tu equipo\nPractico\n-control del ski\n-rodillas y transferencia de fuerza\n-caderas y posicionamiento de canto\n-tronco y control de dirección\n-bastones y balance',
    habilidades:
      'Se pretende que los alumnos sean capaces de autocorregir su forma de ski en el tiempo para mejorar de forma autónoma',
    equipo_personal:
      'obligatorio\n-skis\n-casco de ski\n-antiparras\n-guantes\n-bastones\n-botas de ski que se ajusten al pie\n-vestuario de ski adecuado\n-ticket del centro de ski asignado para el taller',
    equipo_recomendado: '- radio vhf/uhf (1)',
    equipo_cau: '*Inreach',
    evaluacion_metodo:
      'Se le pedirá a los alumnos una evaluación personal de su equipo respecto de sus capacidades (el profesor los corregirá en caso de ser errónea) y se les pédira que corrijan la técnica de sus compañeros',
    lugar_tipico: 'Centro de ski la Parva u otro centro de ski en caso de falta de nieve',
    condiciones_lugar: 'Condiciones normales de un centro de ski sin tormenta activa',
    requisitos_personales:
      '- Abierto para todos los socios cau con sus cuotas al día y que cumplan con los requisitos curriculares. \n- Tener 3 puntos de ayudantía en montañismo básico, intermedio o avanzado en el último año.\n- Tener el equipo adecuado y condición física y mental para una salida de alta exigencia física.',
    observaciones:
      'Se solicitará a los postulantes enviar un video para verificar/evaluar su nivel de ski y poder realizar un taller con alumnos en nivel uniforme.  \nLos alumnos deben considerar que deben pagar su propio ticket para el centro de ski escogido.',
    rutas_posibles:
      'Dependerá del nivel de ski que logre cada persona en particular pero estará enfocado a que amplíen su rango de acceso en cuanto a líneas de ski',
    prueba_convalidacion: 'No aplica, ya que, el curso busca perfeccionamiento, independiente de el nivel',
    horas_clases: null, // "Video Online" — no fixed count
    horas_practica: 16,
    horas_evaluacion: null, // "en las clases prácticas"
    dias_terreno: 2,
    dias_traslado: null, // "N/A"
  },
  {
    name: 'Escalada en Hielo',
    branch: 'nieve_hielo',
    objetivo:
      'Proveer los conocimientos y competencias necesarias para iniciarse en la escalada en hielo, de manera autónoma y segura, principalmente en modalidad alpina en cuanto el ascenso de montañas que lo requieran.',
    contenidos:
      '- Condiciones del terreno\n- Riesgos\n- Equipo\n- Anclajes en hielo\n- Técnicas básicas de escalada en hielo\n- Técnicas de descenso',
    habilidades:
      '- Determinar las condiciones y características del hielo favorables para la escalada\n- Escalar de primero (Lead) posicionando adecuadamente los sistemas de seguridad\n- Escalar multilargo de hielo de manera autónoma\n- Abandonar/retirarse de una vía de hielo de forma segura',
    equipo_personal:
      '- Arnés\n- Casco de escalada con linterna frontal\n- Lentes de sol\n- 2 piolet hieleros\n- 2 tornillos de hielo\n- Par de crampones semi o automático (idealmente de puntas frontales vertical o híbrido en T)\n- Leash o cordines autoseguro piolets (5 mm cordín o superior) incluyendo mosquetones (2).\n- 1 cinta o cordín de autoseguro con mosquetón.\n-  1 reunión armada incluyendo mosquetones (3)\n- (2) cintas express\n- (1) dispositivo descendedor / asegurador apto para segundo (tipo atc guide) incluyendo mosquetón con seguro.\n- (1) cordin de 6 o 7 mm de 4 m\n- Abalakov\n- 2 cordines de 1 m de 5 mm hacia arriba para abalakov\n- Radio UHF/VHF\n- Bota de suela rígida (obligatorio)\n- Guantes para la nieve cómodos (no mitones)',
    equipo_recomendado:
      '- Antiparras ski o similares\n- Chaqueta pluma o sintética de abrigo\n- Cortaviento',
    equipo_cau:
      'dependiendo del lugar, condiciones y quórum:\ncuerdas dry\n12 tornillos\n12 cintas\npiolets hieleros\n*Inreach',
    evaluacion_metodo: '- Observación de la aplicación de los conocimientos principales',
    lugar_tipico:
      '- Cascadas el Manto y Mantito (Túnel Cristo Redentor, Los Andes)\n- Cascadas del Cerro Gloria (Cajón del Peñón, Los Andes)',
    condiciones_lugar:
      '- Cascadas de hielo formadas y consolidadas\n- Isoterma < 3k msnm\n- Viento < 10 nudos',
    requisitos_personales:
      '- Abierto para todos los socios cau con sus cuotas al día.\n- Haber realizado al menos 4 puntos de ayudantías en montañismo básico, intermedio o avanzado en el último año.\n- Haber realizado el taller de progresión en nieve y hielo u otro homologable.\n- Tener el equipo adecuado.',
    rutas_posibles:
      '- Glaciar colgante del Cerro El Plomo\n- Normal cerro gemelos\n- Cerro La Picada\n- Volcán Puntiagudo\n- Alpamayo (Perú)',
    bibliografia:
      '-Alpinismo extremo. mark twight. editorial desnivel.\n-Escalada en hielo y mixto. will gad. editorial desnivel.\n-Montañismo: la libertad de las cimas, editorial desnivel. capítulo 4.',
    prueba_convalidacion:
      'Si hay una, debería incluirse el enlace al documento. De lo contrario se debería analizar si sería conveniente desarrollar una.',
    horas_clases: 2,
    horas_practica: 20,
    horas_evaluacion: 1,
    dias_terreno: 2.5,
    dias_traslado: 0.5,
  },
  {
    name: 'Travesía y Autorescate en Glaciar',
    branch: 'nieve_hielo',
    objetivo:
      'Dotar de conocimientos, habilidades y comportamientos adecuados para el desplazamiento seguro sobre glaciares y la solución de problemas durante esta actividad, tales como el rescate en grietas y el izamiento de carga.',
    contenidos:
      '1. Glaciares\n• Geomorfología glacial\n• Selección de itinerarios sobre glaciares\n2. Encordamiento\n• ¿Por qué, cuándo y cómo hacerlo?\n• Equipo para encordamiento y rescate\n• Repaso y uso de nudos de encordamiento y rescate\n• Planificación de cordada\n• Movimientos encordados\n3. Rescate en grietas\n• Opciones de rescate (auto y por rescatistas)\n• Anclajes y reuniones para rescate\n• Panificación y movimientos para rescate',
    habilidades:
      '-Planificar rutas que incluyan glaciares\n-Seleccionar equipamiento\n-Desplazarse sobre glaciares con técnicas adecuadas\n-Detener caídas en grietas\n-Planificar y realizar rescates en grietas',
    equipo_cau:
      'Dependiendo del lugar, condiciones y quórum:\ncuerdas dry\n12 tornillos\n12 mosquetones con seguro\n12 mosquetones sin seguro\npoleas simples\npoleas tandem\npolea traxion\npiolets hieleros\n*Inreach',
    evaluacion_metodo:
      '-Evaluación en terreno de acuerdo a rúbrica\n-Evaluación de una tarea de planificación de ruta sobre glaciar',
    lugar_tipico: 'Glaciar juncal o alguno con acceso similar o más fácil',
    condiciones_lugar:
      'Existencia de grietas abiertas en las que se pueda descender a lo menos 3-4 m. idealmente sin manto nivoso.',
    requisitos_personales:
      '- Abierto para todos los socios cau con sus cuotas al día.\n- Haber realizado al menos 4 puntos de ayudantías en montañismo básico, intermedio o avanzado en el último año.\n- Haber realizado el taller de progresión en nieve y hielo u otro homologable.\n- Tener el equipo adecuado.\n-Demostrar experiencia en 3 ascensiones autónomas en las que haya utilizado los conocimientos y habilidades del taller de Progresión en Nieve y Hielo.',
    rutas_posibles:
      '- Volcán palomo, normal\n- Cerro morado, normal\n- Nevado juncal, normal\n- Nevado tocllaraju, normal\n- Pequeño alpamayo, normal',
    bibliografia:
      '-Montañismo libertad de las cimas, capitulo 17 "Marcha por glaciar y rescate en grietas", 454-489 (2011). ed.desnivel.\n- Progresión en glaciares y rescate en grietas, andy selters, manuales desnivel.',
    prueba_convalidacion: 'sí',
    horas_clases: 3,
    horas_practica: 17,
    horas_evaluacion: 1,
    dias_terreno: 2.5,
    dias_traslado: 0.5,
  },
  {
    name: 'Técnicas Invernales Avanzadas',
    branch: 'nieve_hielo',
    objetivo:
      'Integrar conocimientos y habilidades necesarias para la realización segura de salidas y expediciones de carácter invernal.',
    contenidos:
      'Repaso breve avalanchas\n1. El ciclo de la nieve y las avalanchas. (introducción básica)\n2. Tipos de avalanchas y factores de riesgo\n3. Evaluación básica de riesgo de avalanchas técnicas especiales\n4. Equipo para salidas y expediciones invernales\n5. Configuración y armado de carpas en condiciones invernales\n6. Refugios en nieve\n    a. Iglú\n    b. Trinchera\n    c. Cueva\n    d. Iglú\n    e. Muros de nieve\n7. Repaso de anclajes en nieve y anclajes con elementos disponibles\n8. Encordamiento y movimientos con trineo, traverse, ascenso, descenso, izamiento, descuelgue y rapel.',
    habilidades:
      '-Planificar el equipamiento de acuerdo a los requerimientos de expediciones invernales.\n-Evaluar rutas seguras y efectivas para la realización de expediciones invernales.\n-Evaluar en terreno el riesgo de avalanchas.\n-Establecer un buen campamento para condiciones de expediciones invernales, considerando las diferencias con un campamento normal de montaña.\n-Evaluar el terreno y las condiciones para luego construir un refugio en nieve.\n-Encordarse con trineo y ser capaz de realizar movimiento de cordada con ellos, tales como ascenso y descenso simple, traverse, izamiento, rapel y descuelgue',
    equipo_personal:
      '- arnés\n- casco\n- 4 mosquetones con seguro (2 hms y 2 normales) \n- 1 piolet hielero (coordinar entre todos)\n- 1 piolet de marcha\n- botas de montaña para usar con crampones\n- crampones\n- dispositivo de aseguramiento y descenso\n-cintas y/o cordines para anclajes y maniobras con cuerdas en nieve.\nse recomienda llevar esquíes o raquetas',
    equipo_cau:
      'Dependiendo del lugar, condiciones y quórum:\nCuerdas dry (todas las que se puedan)\n12 tornillos (no si es en el maule)\n12 mosquetones con seguro\n12 mosquetones sin seguro\nPiolets hieleros\n*Inreach',
    evaluacion_metodo:
      '-Observación del equipamiento que lleven a la salida y cómo lo usen.\n-Realización de una observación y al menos de un test de columna o columna extendida.\n-Ejercicio de observación del lugar de campamento y la revisión de un campamento.\n-Construcción de distintos tipos de refugio.\n-Realización de ejercicios prácticos con trineo de ascenso y descenso simple, traverse, izamiento, rapel y descuelgue.',
    lugar_tipico:
      'Lugar con nieve abundante que permita construir todo tipo de refugios. Si se trata de un glaciar nevado, mejor aún pues permite practicar la evaluación de rutas y las técnicas de travesía glaciar. Además se debe contar con una pendiente de a lo menos 40º para las prácticas de izamiento, rapel, descuelgue, etc.',
    condiciones_lugar:
      'Terreno nevado, con un manto de a lo menos 1m que permita la construcción de distintos tipos de refugios. Además se requieren pendientes para la práctica de maniobras con trineo.',
    requisitos_personales:
      '-Ser socio cau al día.\n-Haber realizado al menos 4 puntos de ayudantías en montañismo básico, intermedio o avanzado en el último año.\n-Haber aprobado el taller de Travesía y autorrescate en glaciar y todos los prerrequisitos del mismo. \n-Demostrar experiencia en ascensiones o travesías donde se utilicen las técnicas de dicho taller.',
    observaciones:
      'Dada la experiencia y conocimientos que se piden como requisito, el taller se realizará en un formato semi-autónomo en el que las cordadas deberán cumplir metas fijadas antes de la salida, siendo la programación de los tiempos ajustada a estas metas. El profesor y los ayudantes realizarán una labor de supervisión y corrección cuando sea necesario.',
    rutas_posibles:
      'Expediciones en condiciones invernales que requieran gran integración de conocimientos, por ej. a campos de hielo, otros lugares en la patagonia y en los círculos polares.',
    bibliografia:
      'La libertad de las cimas:\n•capítulo 17 de "montañismo, la libertad de las cimas", desnivel, llamado "marcha por glaciar y rescate en grietas".  \n•cap. 3, acampada y alimentación, sección de acampada en invierno y sobre nieve.\n•cap.16, marcha y escalada por nieve, secciones de "técnicas para escalar sobre nieve y con cuerda", "búsqueda del itinerario en nieve", "seguridad frente a las avalanchas".\n•cap.20, escalada expedicionaria, sección de "técnicas de escalada en expediciones"',
    prueba_convalidacion: 'sí',
    horas_clases: 3,
    horas_practica: 17,
    horas_evaluacion: 1,
    dias_terreno: 2,
    dias_traslado: 1,
  },

  // ── Roca ──────────────────────────────────────────────────────────────────
  {
    name: 'Introducción a la Escalada Deportiva',
    branch: 'roca',
    objetivo:
      'El taller busca desarrollar las habilidades y adquirir los conocimientos básicos para una práctica segura de la escalada deportiva. Se centra en entregar las herramientas necesarias para su práctica y sentar las bases para los siguientes talleres.',
    contenidos:
      '• Tipos de escalada según el material y terreno: escalada deportiva, tradicional, hielo, boulder, etc.\n• Tipos de roca y sus consideraciones.\n• Graduación de rutas y bloques.\n• Equipo necesario.\n• Resistencia del equipo.\n• Modalidades de escalada: escalada de primero y en top.\n• Aseguramiento: procedimientos y precauciones.\n• Nudos básicos.\n• Tipos de reuniones.\n• Desequipamiento de rutas.\n• Rappel.',
    habilidades:
      '• Asegurar a un primero.\n• Equipar una ruta.\n• Limpiar una ruta.\n• Rappelear.',
    equipo_personal:
      '• Arnés\n• Casco de escalada\n• Descendedor ATC o equivalente (recomendado: ATC Guide o equivalente)\n• 3 mosquetones con seguro (1 HMS tamaño normal y 2 forma de D tamaño pequeño)\n• Cabo de anclaje\n• 1 cordín de 6mm de diámetro y 1.5m de largo (nudo de seguridad)\n• Anilla Cosida de 120 cm',
    equipo_recomendado: 'Zapatos de escalada',
    equipo_cau:
      '• Cintas express\n• Cuerdas simples (4)\n• Cuerda fija (1)\n• Mosquetones D (19) y HMS (7)\n• Tabla de reuniones',
    evaluacion_metodo:
      '1. Exámen escrito online\n2. Exámen en terreno:\nPauta de procedimientos\nPauta examen\nTemario examen',
    lugar_tipico: '• Sector de escalada "Cuesta Chacabuco".',
    condiciones_lugar:
      'El lugar del taller debe contar con :\n•  1 reunión a pie de vía por cada 3 alumnos.\n• 1 ruta de grado menor o igual a 5.9 por cada 2 alumnos para la evaluación.',
    rutas_posibles: 'Los conocimientos entregados en este taller no son suficientes para progresar en cerros técnicos.',
    bibliografia:
      '1. Maniobras. Petzl tech tips.\nhttps://www.petzl.com/INT/en/Sport/Indoor-and-Outdoor-Climbing\nhttps://www.petzl.com/INT/en/Sport/Multi-Pitch-Climbing\n2. Equipo. Manuales técnicos, revisión de equipo y normas.\n3. Nudos.\n• Manual completo de nudos, Cristian Biosca Rolland.',
    prueba_convalidacion: 'Si',
    horas_clases: 6,
    horas_practica: 20,
    horas_evaluacion: 4,
    dias_terreno: 2,
    dias_traslado: 0,
  },
  {
    name: 'Manejo de Cuerdas',
    branch: 'roca',
    objetivo:
      'Dotar a los participantes de los conocimientos y habilidades necesarias para:\n- Evaluar y montar anclajes naturales seguros.\n- Realizar ascensos y descensos controlados por cuerda en terrenos inclinados o verticales.\n\nEl taller busca que los asistentes puedan desenvolverse con autonomía básica en escenarios donde el uso correcto de la cuerda y los anclajes es fundamental para la seguridad.',
    contenidos:
      '1. Descenso por cuerda: técnica de rapel, con y sin dispositivos de freno\n2. Ascenso por cuerda: técnicas de ascenso por cuerda.\n3. Resolución de problemas: transiciones\n4.Anclajes naturales',
    habilidades:
      '- Rapelear, variaciones de la técnica, profundización y perfeccionamiento de la tecnica, tecnicas de emergencia sin dispositivos de freno\n- Ascenso por cuerda, distintas técnicas\n- Transiciones ascenso-rapel\n- Montaje de anclajes naturales, identificación de lugares para anclajes\n- Rapelear de anclajes naturales',
    equipo_personal:
      '• Arnés\n• Casco de escalada\n• Descendedor ATC o equivalente (recomendado: ATC Guide o equivalente)\n• 3 mosquetones con seguro (1 HMS tamaño normal y 3 forma de D tamaño pequeño)\n• Cabo de Anclaje x2\n• 1 cordín de 6mm de diámetro y 1.5m de largo (nudo de seguridad)\n• 2 coordines 6mm (2m y 3m)\n• 1 anilla cosida de 60cm de nylon/poliamida\n• Guantes de cuero o de palma de cuero\n• Linterna Frontal',
    equipo_cau:
      '- 28 Mosquetones con seguro, al menos 7 de ellos tipo HMS\n- Cuerdas estáticas o semiestaticas, cantidad variable dependiendo de la longitud de las cuerdas\n- 1 par de ascendedores',
    evaluacion_metodo:
      'Examen admisión (previo a salida)\nPrueba de nudos\n1. ocho, por seno y por chicote\n2. ocho con orejas\n3. ballestrinque (con dos manos, con una sola mano)\n4. pescador doble\n5. gaza simple\n6. dinámico\n7. prusik\n8. machard\n\nPruebas Taller (durante la salida)\nRapel, Ascenso por cuerda, Anclajes y Rapel de anclaje natural',
    lugar_tipico: 'Sector Manejo de cuerda en Chacabuco',
    condiciones_lugar:
      'Se requiere: \n- terreno vertical o con una inclinación superior a 70°, \n- al menos una reunión por cada 2 alumnos, \n- acceso expedito a la reunión (idealmente caminando)\n- una zona aledaña con terreno vertical que permita poner anclajes naturales',
    requisitos_personales: 'Condición física acorde a actividades que implican subir y bajar multiples veces por cuerda durante el dia',
    observaciones:
      '- Este taller de dos días incluye una noche, y considera el acampar en una zona próxima al área de clases\n- La clase práctica del primer dia esta diseñada para realizar la tarea más compleja del dia en las primeras horas de la noche, esto es para forzar a los alumnos a aplicar lo aprendido durante el día en condiciones de cansancio y poca luz',
    rutas_posibles: 'Los conocimientos en este taller buscan preparar a los alumnos para la Evaluación Básica de Cuerdas',
    bibliografia:
      '• descenso rapel https://www.petzl.com/ES/es/Sport/Descender-en-rapel\n• ascenso cuerda https://www.youtube.com/watch?v=uA1lpDgyMeY\n* Capitulo "Aseguramientos", tema "Anclajes", La liberad de las Cimas\n* Presentacion clase Anclajes',
    prueba_convalidacion: 'No',
    horas_clases: 0,
    horas_practica: 20,
    horas_evaluacion: null, // "3 horas por cordada o pares de cordadas"
    dias_terreno: 2,
    dias_traslado: 0,
  },
  {
    name: 'Aseguramiento y Polipastos',
    branch: 'roca',
    objetivo:
      'Dotar a los asistentes de las competencias básicas necesarias para asegurar de forma segura en contextos alpinos, y comprender, armar y aplicar sistemas de polipastos en montaña para izado de cargas, tensado de cuerdas y maniobras de rescate.',
    contenidos:
      'Aseguramiento\n1. Asegurar a un segundo (uso de dispositivos tipo ATC Guide, manejo de carga, protocolos de cordada).\n2. Aseguramiento alpino: técnicas de aseguramiento en distintos escenarios de progresión.\n\nPolipastos\n1. Elementos a utilizar.\n2. Nudos específicos: machard bidireccional, bachman, mariner (nudo de fuga).\n3. Presentación de los polipastos y su utilización.\n4. Descomposición de fuerzas en polipastos según poleas móviles y fijas.\n5. Polipasto Simples, Compuestos y Complejos\n6. Eficiencia en mosquetones y poleas.\n7. Izado de carga con sistema en posición vertical.\n8. Aplicaciones prácticas: izado de carga en pared, rescates, tensado de cuerdas y armado de tirolesas',
    habilidades:
      'Identificar mejor método para asegurar en distintas situaciones.\nTransferir de asegurar a un polipasto par rescate.\nIdentificar distintos tipos de polipastos\nIzado de cargas/Cordada mediantes uso de polipastos\nArmado de tirolesa mediante uso de polipastos',
    equipo_personal:
      '• Arnés\n• Casco de escalada\n• ATC Guide o equivalente\n• 3 mosquetones con seguro (1 HMS tamaño normal y 2 forma de D tamaño pequeño)\n• Cabo de Anclaje\n• 1 cordín de 6mm de diámetro y 1.5m de largo (nudo de seguridad)\n• 1 anilla cosida de 60cm de nylon/poliamida \n• 1 mosquetón tipo "D" (aparte de lo ya solicitado en Intro)\n• 2 coordines 6mm (2m y 3m)\n• Linterna Frontal\n• Guantes',
    equipo_cau:
      '- 3x cuerdas estáticas\n- 3 poleas tandem\n- 1 polea doble\n- 2 poleas simples\n- 3 ascendedores jumars\n- 5 mosquetones "ovales" con seguro (para las 5 poleas)\n- 12 mosquetones "tipo D" con seguro\n- Rack Simple + Juego Stoppers\n-1 cuerda dinámica',
    evaluacion_metodo:
      'Examen Online\nExámenes en Terreno\nSe deben aprobar ambas evaluaciones por separado, 70% para aprobación.',
    lugar_tipico: 'Los Loros Cajón del Maipo, Alt Sector Manejo de cuerda en Chacabuco',
    condiciones_lugar:
      'El lugar debe contar con:\n- reunión cada 3 alumnos\n- Sector para anclajes naturales y rapel\n- Sector a pie de vía para montar reuniones (Anclajes tradicionales)\n- Sector a pie de vía para montar polipastos (Idealmente árboles)',
    requisitos_personales: 'Condición física acorde, capacidad para elevar a la cordada mediante el uso de polipastos',
    observaciones: 'Taller de dos dias, incluye acampada finaliza con evaluación y empanadas',
    rutas_posibles: 'Los conocimientos en este taller buscan preparar a los alumnos para la Evaluación Básica de Cuerdas',
    bibliografia:
      '• Montañismo, la libertad de las cimas, 2011, pp. 478-482, 635-638. Ediciones Desnivel.\nhttps://www.petzl.com/ES/es/Sport/Nudos-autobloqueantes\nhttps://www.vdiffclimbing.com/guide-mode/',
    prueba_convalidacion: 'No',
    horas_clases: 2,
    horas_practica: 20,
    horas_evaluacion: null, // "3 horas por cordada o pares de cordadas"
    dias_terreno: 2,
    dias_traslado: 0,
  },
  {
    name: 'Evaluación Básica Cuerdas',
    branch: 'roca',
    objetivo:
      'Este hito busca evaluar las competencias adquiridas por los alumnos durante los 3 talleres iniciales de la línea de roca.',
    contenidos:
      '- ascenso por cuerda\n- descenso por cuerda\n- anclajes naturales\n- polipastos\n- aseguramientos alpinos\n- resolución de problemas (tal y como son vistos en los talleres)',
    equipo_cau:
      '- 1 cuerda estática x cordada de al menos 40 metros de longitud "nuevas"\n- 1 cuerda dinamica corta (20 m) para linea de vida\n- 2 mosquetones  tipo D + 1 HMS por cordada\n- Cordines/cintas varios de 5 metros o más de longitud, para que puedan armar reuniones en anclajes naturales grandes',
    evaluacion_metodo: 'Examen práctico en terreno.',
    rutas_posibles: 'Bismarck, Gratt, punta ventanas',
    dias_terreno: 1,
    dias_traslado: 0,
  },
  {
    name: 'Escalada en Multilargos',
    branch: 'roca',
    objetivo:
      'Este taller busca dotar a los participantes del conocimiento y habilidades para realizar técnicas de aseguramiento en escaladas de varios largos, así como los criterios asociados a esta práctica, además de la solución de algunos problemas frecuentes.',
    contenidos:
      '1. Equipo\n2. Reuniones\n3. Manejo de cuerda\n4. Resolución de problemas comunes\n5. Estrategias y logística para la escalada multilargo\n6. Autorescate',
    habilidades:
      '- Reuniones, armado, organización de la cordada y su equipo\n- Aseguramientos de primero, de segundo, para cordada de 2 o 3 personas\n- Manejo de cuerda, simple y doble\n- Resolución de problemas (asistencia ascenso 2do, asistencia descenso 2do, Rapel asistido, Rapel con cuerda dañada, recuperacion cuerda bloqueada)',
    equipo_personal:
      '• Arnés\n• Casco de escalada\n• Zapatillas de escalada\n• Descendedor ATC o equivalente (recomendado: ATC Guide o equivalente)\n• 3 mosquetones con seguro (1 HMS tamaño normal y 3 forma de D tamaño pequeño)\n• 1 cordín de 7mm de diámetro y 3.5m de largo (línea de vida)\n• 1 cordín de 6mm de diámetro y 1.5m de largo (nudo de seguridad)\n• 2 coordines 6mm (2m y 3m)\n• 1 anilla cosida de 60cm de nylon/poliamida\n• Guantes de cuero o de palma de cuero\n• 2 cintas cosidas de 60 cm\n• 1 cinta cosida de 120 cm\n• 7 m de cordin de 7mm (Quad)\n• 5 cintas express por alumno, o 10 por cordada',
    equipo_recomendado:
      '- Zapatillas de aproximación mosquetoneables\n- Botella para agua mosquetoneable\n- Mochila pequeña',
    equipo_cau:
      '- 2 parejas de cuerdas dobles\n- 2 a 3 cuerdas estáticas o semi estáticas de longitud superior a 40m\n- proteccion para cuerdas\n- 15 mosquetones con seguro tipo D\n- 1 o 2 parejas de ascendedores\n- 20 cintas express',
    evaluacion_metodo:
      'Examen en terreno a realizarse en 2 partes, cada una al final de la jornada diaria. Los alumnos deben demostrar manejar correctamente las tecnicas aprendidas en clase.',
    lugar_tipico: 'Sector de escalada escuela multilargo CAU "Cuesta Chacabuco"',
    condiciones_lugar:
      'El lugar debe contar con al menos 2 rutas de escalada multilargos con grados de alrededor de 10a, con más de 2 largos y en los que cada largo no supere los 20 mts',
    requisitos_personales: 'Condición física acorde a actividades de escalada deportiva',
    observaciones: '- Este taller de dos días incluye una noche, y considera el acampar en una zona próxima al área de clases',
    rutas_posibles: '- Placa Verde\n- Pared de Jabbah\n- Torrecillas',
    bibliografia:
      '• Cómo escalar vías de varios largos - Ignacio Luján, Tino Nuñez - Editorial Desnivel\n• Autorescate en escalada - Andy Tyson, Molly Loomis - Editorial Desnivel',
    prueba_convalidacion: 'No',
    horas_clases: 6,
    horas_practica: 20,
    horas_evaluacion: null, // "3 horas" — qualitative note
    dias_terreno: 2,
    dias_traslado: 0,
  },
  {
    name: 'Escalada Tradicional',
    branch: 'roca',
    objetivo:
      'El taller busca desarrollar las habilidades y adquirir los conocimientos básicos para una práctica segura de la escalada tradicional. Para esto, el taller tendrá dos sesiones de práctica donde el alumno podrá conocer el equipo necesario y el uso correcto de éste según el tipo de escalada al que se enfrente (tradicional monolargo, multilargo, escalada alpina). El taller requiere conocimiento y manejo previo de escalada deportiva y deportiva multilargo',
    contenidos:
      'Equipo para escalada tradicional (stoppers, friends, tricams, hex, clavos, etc.)\nEscalada con cuerdas simples/dobles/gemelas\nConceptos de direccionalidad de anclajes\nSeguros en oposición\nSelección de rack según tipo de escalada\nUso de stoppers\nUso de friends/cams\nUso de hex/tricams\nUso de clavos\nMantención de equipo\nTips para organizar el equipo en el arnés\nEscalada tradicional multilargo. Escalada en cordadas de más de 2 personas',
    habilidades: 'Escalar trad sin morir',
    equipo_personal:
      '• Arnés\n• Casco de escalada \n• Descendedor ATC o equivalente (recomendado: ATC Guide o equivalente)\n• 3 mosquetones con seguro (1 HMS tamaño normal y 3 forma de D tamaño pequeño)\n• 1 cordín de 7mm de diámetro y 3.5m de largo (línea de vida)\n• 1 cordín de 6mm de diámetro y 1.5m de largo (nudo de seguridad)\n• 2 coordines 6mm (2m y 3m)\n• 3 anilla cosida de 60cm de nylon/poliamida\n• 1 anilla cosida de 120 cm de nylon/poliamida\n• Guantes de cuero o de palma de cuero\n• 7 m de cordin de 7mm (Quad)\n• Linterna frontal\n• Cuchillo pequeño o cortapluma (1 por persona)\n• Botiquín básico',
    equipo_recomendado: 'Zapatillas de escalada',
    equipo_cau:
      '- 1 rack de escalada por cada cordada (importante reservarlo con antelacion porque es equipo de socios no de docencia)\n- 1 pareja de cuerdas dobles por cada cordada\n- 2 cuerdas estaticas de 40 m o mas\n- 1 pareja de ascendedores\n- proteccion para cuerdas',
    evaluacion_metodo: 'Evaluación en terreno',
    lugar_tipico: 'Los loros/espolones de San Gabriel',
    condiciones_lugar: 'Vía de trad de multilargo',
    requisitos_personales: 'Alimentar a los ayudantes',
    observaciones: 'Taller dos días',
    rutas_posibles: 'Alfalfal, Colombianos San Gabriel',
    bibliografia:
      'Montañismo, la libertad de las cimas, 2011, pp. 478-482, 635-638. Ediciones Desnivel.\nRock Climbing Anchors / Craig Luebben\nClimbing Anchors / John Long',
    prueba_convalidacion: 'NO',
    horas_clases: 0,
    horas_practica: 20,
    horas_evaluacion: 3,
    dias_terreno: 2,
    dias_traslado: 0,
  },
];

export async function seedFichas(prisma: PrismaClient) {
  console.log('Seeding ficha content for talleres...');

  let updated = 0;
  for (const row of fichas) {
    const { name, branch, ...fields } = row;

    // Clean text fields
    const data = {
      objetivo: clean(fields.objetivo),
      contenidos: clean(fields.contenidos),
      habilidades: clean(fields.habilidades),
      equipo_personal: clean(fields.equipo_personal),
      equipo_recomendado: clean(fields.equipo_recomendado),
      equipo_cau: clean(fields.equipo_cau),
      evaluacion_metodo: clean(fields.evaluacion_metodo),
      lugar_tipico: clean(fields.lugar_tipico),
      condiciones_lugar: clean(fields.condiciones_lugar),
      requisitos_personales: clean(fields.requisitos_personales),
      observaciones: clean(fields.observaciones),
      rutas_posibles: clean(fields.rutas_posibles),
      bibliografia: clean(fields.bibliografia),
      prueba_convalidacion: clean(fields.prueba_convalidacion),
      horas_clases: toFloat(fields.horas_clases),
      horas_practica: toFloat(fields.horas_practica),
      horas_evaluacion: toFloat(fields.horas_evaluacion),
      dias_terreno: toFloat(fields.dias_terreno),
      dias_traslado: toFloat(fields.dias_traslado),
    };

    await prisma.taller.update({
      where: { name_branch: { name, branch } },
      data,
    });
    updated++;
  }

  console.log(`  Updated ficha content for ${updated} talleres`);
}
