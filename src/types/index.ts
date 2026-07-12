// ── Form data shapes ──────────────────────────────────────────────────────────

export interface WeatherImage {
  id: number;
  name: string;
  base64: string;
  url: string;
  fechaObtencion?: string;
  file?: File;
}

export interface BasicInfo {
  contactoCAU: string;
  telefonoContacto: string;
  emailContacto: string;
  fechaHoraReporteRegreso: string;
  actividad: string;
  cerroOSector: string;
  ruta: string;
  linkPronostico: string;
  linkRuta: string;
  llevaInreach?: boolean;
  numeroInreach?: string;
  codigoInreach?: string;
  weatherImages: WeatherImage[];
}

export interface Participant {
  nombre: string;
  rut: string;
  telefono: string;
  email?: string;
  grupoSanguineo?: string;
  alergias?: string;
  medicamentos?: string;
  enfermedades?: string;
  condicionesEspeciales?: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
  isDuplicate?: boolean;
}

export interface Causa {
  lugar: string;
  accionProbabilidad: string;
  accionExposicion: string;
  accionConsecuencias: string;
  peligros: string[];
  riesgos: string[];
}

export interface Assumption {
  supuesto: string;
  accion: 'gestionar' | 'monitoreo_intenso' | 'monitoreo_normal' | 'aceptar';
  incluir?: boolean;
  tipoSupuesto?: string;
  probabilidad?: string;
  impacto?: string;
  causas?: Causa[];
}

export interface ItineraryDay {
  fecha: string;
  tramo: string;
  actividades: string[];
  horaInicio: string;
  horaFin: string;
  altitudInicio?: string;
  altitudFin?: string;
  supuestos: Assumption[];
  dificultadesPrincipales?: string[];
}

export interface EquipmentItem {
  categoria: string;
  item: string;
  cantidad: string;
  observaciones?: string;
  checked: boolean;
}

export interface Transport {
  tipo: string;
  conductor: string;
  marca?: string;
  modelo?: string;
  color?: string;
  patente?: string;
  distancia: string;
  tipoCombustible?: string;
  tipoAuto?: string;
  anioVehiculo?: string;
  capacidad?: string;
  huellaCarbono?: string;
}

export interface RescueBody {
  nombre: string;
  telefono: string;
  incluir: boolean;
}

// ── Global form state ─────────────────────────────────────────────────────────

export interface FormState {
  currentStep: number;
  avisoId: number | null;
  basicInfo: BasicInfo;
  participantes: Participant[];
  itinerario: ItineraryDay[];
  equipo: EquipmentItem[];
  transporte: Transport[];
  cuerposRescate: RescueBody[];
}

// ── Reducer actions ───────────────────────────────────────────────────────────

export type FormAction =
  | { type: 'UPDATE_FORM_FIELD'; section: string; field: string; value: unknown }
  | { type: 'ADD_ITEM'; section: string; item: unknown }
  | { type: 'REMOVE_ITEM'; section: string; index: number }
  | { type: 'UPDATE_ITEM'; section: string; index: number; field?: string; value?: unknown; updates?: Record<string, unknown> }
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_AVISO_ID'; avisoId: number }
  | { type: 'RESET_FORM' }
  | { type: 'UPDATE_WEATHER_IMAGES'; images: WeatherImage[] }
  | { type: 'LOAD_SAVED_DATA'; data: Partial<FormState> };

// ── Context value ─────────────────────────────────────────────────────────────

export interface FormContextValue {
  formData: FormState;
  updateFormField: (section: string, field: string, value: unknown) => void;
  addItem: (section: string, item: unknown) => void;
  removeItem: (section: string, index: number) => void;
  updateItem: (section: string, index: number, updatedItem: Record<string, unknown>) => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  updateWeatherImages: (images: WeatherImage[]) => void;
  isStepValid: (step: number) => boolean;
  checkFormCompletion: () => boolean;
  saveToApi: () => Promise<{ success: boolean; error?: string }>;
  isSaving: boolean;
}

// ── People data ───────────────────────────────────────────────────────────────

export interface Person {
  nombre: string;
  rut?: string;
  telefono?: string;
  email?: string;
}

// ── Courses ───────────────────────────────────────────────────────────────────

export type CourseBranch = 'base' | 'nieve_hielo' | 'roca';
export type CourseLevel = 'introductorio' | 'intermedio' | 'intermedio_avanzado' | 'avanzado';
export type CourseStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';
export type EnrollmentStatus = 'enrolled' | 'waitlisted' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'member';

export interface Course {
  id: number;
  name: string;
  description: string;
  instructor_id: number;
  start_date: string;
  end_date: string;
  capacity: number;
  status: CourseStatus;
  location: string;
  price?: number;
  order_index: number;
  prerequisite_course_ids: number[];
  branch: CourseBranch;
  level: CourseLevel;
}

export type MemberCourseStatus = 'completado' | 'disponible' | 'bloqueado';

export interface CourseWithMemberStatus extends Course {
  memberStatus: MemberCourseStatus;
  enrolledCount: number;
}
