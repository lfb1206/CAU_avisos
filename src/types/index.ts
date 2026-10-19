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
  /** Extra addresses CC'd on the submission confirmation (and overdue-alert) email. */
  destinatariosAdicionales?: string[];
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
  // Optional on the type: aviso rápido's lighter flow never collects these.
  // isParticipantValid (src/resources/contexts/formValidation.ts) still enforces
  // them as required at runtime for the aviso largo flow.
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  vestimenta?: string;   // clothing description for terrain identification
  mochila?: string;      // backpack description for terrain identification
  isDuplicate?: boolean;
}

export interface Causa {
  lugar: string;
  accionProbabilidad: string;
  accionExposicion: string;
  accionConsecuencias: string;
  peligros: string[];
  riesgos: string[];
  [key: string]: unknown;
}

export interface Assumption {
  supuesto: string;
  accion: 'gestionar' | 'monitoreo_intenso' | 'monitoreo_normal' | 'aceptar' | '';
  incluir?: boolean;
  tipoSupuesto?: string;
  probabilidad?: string;
  impacto?: string;
  causas?: Causa[];
  [key: string]: unknown;
}

export interface ItineraryDay {
  fecha: string;
  tramo: string;
  actividades: string[];
  horaInicio: string;
  horaFin: string;
  altitudInicio?: string;
  altitudFin?: string;
  altitudMax?: string;
  supuestos: Assumption[];
  dificultadesPrincipales?: string[];
  [key: string]: unknown;
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
  | { type: 'SET_CUERPOS_RESCATE'; cuerposRescate: RescueBody[] }
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
  saveToApi: () => Promise<{ success: boolean; avisoId?: number; error?: string }>;
  loadData: (data: Partial<FormState>) => void;
  isSaving: boolean;
}

// ── People data ───────────────────────────────────────────────────────────────

export interface Person {
  nombre: string;
  rut?: string;
  telefono?: string;
  email?: string;
}

// ── Talleres & Ediciones ──────────────────────────────────────────────────────

export type TallerBranch = 'base' | 'nieve_hielo' | 'roca';
export type TallerLevel = 'introductorio' | 'intermedio' | 'intermedio_avanzado' | 'avanzado';
export type EdicionStatus =
  | 'planificada'
  | 'inscripciones_abiertas'
  | 'en_curso'
  | 'finalizada'
  | 'cancelada';
export type InscripcionStatus =
  | 'postulando'
  | 'aceptado'
  | 'en_lista'
  | 'rechazado'
  | 'no_asiste'
  | 'completado'
  | 'reprobado'
  | 'retirado'
  | 'rezagado';
export type UserRole = 'admin' | 'coordinador' | 'custodio' | 'member';
export type MemberCourseStatus = 'completado' | 'disponible' | 'bloqueado';

export interface Taller {
  id: number;
  name: string;
  description: string;
  branch: TallerBranch;
  level: TallerLevel;
  order_index: number;
  prerequisite_taller_ids: number[];
  content_outline?: unknown;
}

export interface EdicionTaller {
  id: number;
  taller_id: number;
  name: string;
  year: number;
  semester: number;
  start_date?: string | null;
  end_date?: string | null;
  capacity: number;
  price?: number | null;
  status: EdicionStatus;
  enrollment_open: boolean;
  required_points: number;
  coordinador_id?: string | null;
  location?: string | null;
}

export interface Inscripcion {
  id: number;
  edicion_id: number;
  user_id: string;
  status: InscripcionStatus;
  aprobado?: boolean | null;
  inscrito_at: string;
}

export interface CoursePoints {
  id: number;
  user_id: string;
  edicion_id?: number | null;
  points: number;
  awarded_by: string;
  description?: string | null;
  earned_at: string;
  expires_at: string;
}

// ── Equipo Club (lending) ──────────────────────────────────────────────────────

export type ItemCondition = 'nuevo' | 'bueno' | 'con_uso' | 'gastado' | 'roto';
export type LoanStatus = 'pendiente' | 'aprobado' | 'entregado' | 'devuelto' | 'rechazado' | 'cancelado';

export interface InventoryPool {
  id: number;
  key: string;
  name: string;
  custodian_id?: string | null;
  requisitos?: string | null;
}

export interface InventoryItem {
  id: number;
  pool_id: number;
  uso: string;
  descripcion: string;
  cantidad: number;
  estado: ItemCondition;
  en_inspeccion: number;
  fecha_compra?: string | null;
  observaciones?: string | null;
  instrucciones_uso?: string | null;
  active: boolean;
  /** Present only on responses that compute it (browse/catalog list), never stored. */
  disponible?: number;
  /** Present only on responses that compute it — cheap existence check, no image payload. */
  tiene_foto_reciente?: boolean;
}

export interface LoanItem {
  id: number;
  loan_request_id: number;
  inventory_item_id: number;
  quantity: number;
  inventory_item?: Pick<InventoryItem, 'id' | 'descripcion' | 'uso'>;
}

export interface LoanRequest {
  id: number;
  pool_id: number;
  user_id: string;
  aviso_id?: number | null;
  status: LoanStatus;
  cancel_reason?: string | null;
  pickup_due_date: string;
  return_due_date: string;
  pickup_photo_base64?: string | null;
  return_photo_base64?: string | null;
  return_photo_uploaded_at?: string | null;
  notas_custodio?: string | null;
  requested_at: string;
  decided_at?: string | null;
  delivered_at?: string | null;
  returned_at?: string | null;
  items?: LoanItem[];
  /** Present on custodio-facing responses only. */
  user?: { id: string; name: string; email: string; phone?: string | null; rut?: string | null };
  /** Privacy-safe aviso summary only — never the full form_data. */
  aviso?: {
    id: number;
    location: string | null;
    activity_date: string | null;
    activity_type: string | null;
    participant_names_text: string | null;
  } | null;
}

/** Cart line used by the member-facing request form before a LoanRequest exists. */
export interface LoanCartLine {
  inventory_item_id: number;
  descripcion: string;
  uso: string;
  disponible: number;
  quantity: number;
}
