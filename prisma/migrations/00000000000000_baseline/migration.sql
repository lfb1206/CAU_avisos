-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'coordinador', 'custodio', 'member');

-- CreateEnum
CREATE TYPE "AvisoStatus" AS ENUM ('draft', 'submitted', 'archived');

-- CreateEnum
CREATE TYPE "AvisoTipo" AS ENUM ('rapido', 'largo');

-- CreateEnum
CREATE TYPE "TallerBranch" AS ENUM ('base', 'nieve_hielo', 'roca');

-- CreateEnum
CREATE TYPE "TallerLevel" AS ENUM ('introductorio', 'intermedio', 'intermedio_avanzado', 'avanzado');

-- CreateEnum
CREATE TYPE "EdicionStatus" AS ENUM ('planificada', 'inscripciones_abiertas', 'en_curso', 'finalizada', 'cancelada');

-- CreateEnum
CREATE TYPE "InscripcionStatus" AS ENUM ('postulando', 'aceptado', 'en_lista', 'rechazado', 'no_asiste', 'completado', 'reprobado', 'retirado', 'rezagado');

-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('nuevo', 'bueno', 'con_uso', 'gastado', 'roto');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('pendiente', 'aprobado', 'entregado', 'devuelto', 'rechazado', 'cancelado');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "rut" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'member',
    "avatar_url" TEXT,
    "is_registered" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blood_type" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "medical_conditions" TEXT,
    "has_first_aid" BOOLEAN NOT NULL DEFAULT false,
    "emergency_contact" TEXT,
    "emergency_phone" TEXT,
    "membership_expires_at" TIMESTAMP(3),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avisos" (
    "id" SERIAL NOT NULL,
    "created_by" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "status" "AvisoStatus" NOT NULL DEFAULT 'draft',
    "tipo" "AvisoTipo" NOT NULL DEFAULT 'largo',
    "form_data" JSONB NOT NULL DEFAULT '{}',
    "location" TEXT,
    "activity_date" TIMESTAMP(3),
    "activity_type" TEXT,
    "participant_names_text" TEXT,
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "equipment_recommendations" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_items" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "equipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rescue_bodies" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "default_incluir" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "rescue_bodies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic_form_options" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "basic_form_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supuestos" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "supuesto" TEXT NOT NULL,
    "tramos" TEXT[],
    "actividades" TEXT[],
    "dificultades" TEXT[],
    "estab_prob" TEXT,
    "estab_expo" TEXT,
    "mitigacion" TEXT,
    "senal" TEXT,
    "regla" TEXT,

    CONSTRAINT "supuestos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_options" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "probability" TEXT,
    "impact" TEXT,

    CONSTRAINT "risk_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talleres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "branch" "TallerBranch" NOT NULL,
    "level" "TallerLevel" NOT NULL,
    "order_index" INTEGER NOT NULL,
    "prerequisite_taller_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "content_outline" JSONB,
    "objetivo" TEXT,
    "contenidos" TEXT,
    "habilidades" TEXT,
    "equipo_personal" TEXT,
    "equipo_recomendado" TEXT,
    "equipo_cau" TEXT,
    "evaluacion_metodo" TEXT,
    "lugar_tipico" TEXT,
    "condiciones_lugar" TEXT,
    "requisitos_personales" TEXT,
    "observaciones" TEXT,
    "rutas_posibles" TEXT,
    "bibliografia" TEXT,
    "prueba_convalidacion" TEXT,
    "horas_clases" DOUBLE PRECISION,
    "horas_practica" DOUBLE PRECISION,
    "horas_evaluacion" DOUBLE PRECISION,
    "dias_terreno" DOUBLE PRECISION,
    "dias_traslado" DOUBLE PRECISION,

    CONSTRAINT "talleres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ediciones_taller" (
    "id" SERIAL NOT NULL,
    "taller_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "capacity" INTEGER NOT NULL DEFAULT 20,
    "max_ayudantes" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2),
    "price_student" DECIMAL(10,2),
    "status" "EdicionStatus" NOT NULL DEFAULT 'planificada',
    "enrollment_open" BOOLEAN NOT NULL DEFAULT false,
    "enrollment_opens_at" TIMESTAMP(3),
    "required_points" INTEGER NOT NULL DEFAULT 0,
    "profesor" TEXT,
    "fecha_clases" TEXT,
    "fecha_salida" TEXT,

    CONSTRAINT "ediciones_taller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id" SERIAL NOT NULL,
    "edicion_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "InscripcionStatus" NOT NULL DEFAULT 'postulando',
    "aprobado" BOOLEAN,
    "rezagado" BOOLEAN NOT NULL DEFAULT false,
    "pago_recibido" BOOLEAN NOT NULL DEFAULT false,
    "grupo_sanguineo" TEXT,
    "alergias" TEXT,
    "medicamentos" TEXT,
    "condiciones_especiales" TEXT,
    "tiene_primeros_auxilios" BOOLEAN NOT NULL DEFAULT false,
    "notas_coordinador" TEXT,
    "inscrito_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aprobado_at" TIMESTAMP(3),

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ayudantias" (
    "id" SERIAL NOT NULL,
    "edicion_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "seleccionado" BOOLEAN,
    "asistio" BOOLEAN,
    "puntos_otorgados" BOOLEAN NOT NULL DEFAULT false,
    "signed_up_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ayudantias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklists" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "items" JSONB NOT NULL,

    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_points" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "edicion_id" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 1,
    "awarded_by" UUID NOT NULL,
    "description" TEXT,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_pools" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "custodian_id" UUID,
    "requisitos" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" SERIAL NOT NULL,
    "pool_id" INTEGER NOT NULL,
    "uso" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "estado" "ItemCondition" NOT NULL DEFAULT 'bueno',
    "en_inspeccion" INTEGER NOT NULL DEFAULT 0,
    "fecha_compra" TIMESTAMP(3),
    "observaciones" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_requests" (
    "id" SERIAL NOT NULL,
    "pool_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "aviso_id" INTEGER,
    "status" "LoanStatus" NOT NULL DEFAULT 'pendiente',
    "cancel_reason" TEXT,
    "pickup_due_date" TIMESTAMP(3) NOT NULL,
    "return_due_date" TIMESTAMP(3) NOT NULL,
    "pickup_photo_base64" TEXT,
    "return_photo_base64" TEXT,
    "return_photo_uploaded_at" TIMESTAMP(3),
    "notas_custodio" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "returned_at" TIMESTAMP(3),

    CONSTRAINT "loan_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_items" (
    "id" SERIAL NOT NULL,
    "loan_request_id" INTEGER NOT NULL,
    "inventory_item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "loan_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "activities_name_key" ON "activities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "basic_form_options_type_value_key" ON "basic_form_options"("type", "value");

-- CreateIndex
CREATE UNIQUE INDEX "supuestos_code_key" ON "supuestos"("code");

-- CreateIndex
CREATE UNIQUE INDEX "talleres_name_branch_key" ON "talleres"("name", "branch");

-- CreateIndex
CREATE UNIQUE INDEX "ediciones_taller_taller_id_name_key" ON "ediciones_taller"("taller_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_edicion_id_user_id_key" ON "inscripciones"("edicion_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ayudantias_edicion_id_user_id_key" ON "ayudantias"("edicion_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "checklists_key_key" ON "checklists"("key");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_pools_key_key" ON "inventory_pools"("key");

-- CreateIndex
CREATE INDEX "inventory_items_pool_id_idx" ON "inventory_items"("pool_id");

-- CreateIndex
CREATE INDEX "loan_requests_pool_id_status_idx" ON "loan_requests"("pool_id", "status");

-- CreateIndex
CREATE INDEX "loan_requests_user_id_idx" ON "loan_requests"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "loan_items_loan_request_id_inventory_item_id_key" ON "loan_items"("loan_request_id", "inventory_item_id");

-- AddForeignKey
ALTER TABLE "avisos" ADD CONSTRAINT "avisos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ediciones_taller" ADD CONSTRAINT "ediciones_taller_taller_id_fkey" FOREIGN KEY ("taller_id") REFERENCES "talleres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_edicion_id_fkey" FOREIGN KEY ("edicion_id") REFERENCES "ediciones_taller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayudantias" ADD CONSTRAINT "ayudantias_edicion_id_fkey" FOREIGN KEY ("edicion_id") REFERENCES "ediciones_taller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayudantias" ADD CONSTRAINT "ayudantias_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_points" ADD CONSTRAINT "course_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_points" ADD CONSTRAINT "course_points_awarded_by_fkey" FOREIGN KEY ("awarded_by") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_points" ADD CONSTRAINT "course_points_edicion_id_fkey" FOREIGN KEY ("edicion_id") REFERENCES "ediciones_taller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_pools" ADD CONSTRAINT "inventory_pools_custodian_id_fkey" FOREIGN KEY ("custodian_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "inventory_pools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_requests" ADD CONSTRAINT "loan_requests_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "inventory_pools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_requests" ADD CONSTRAINT "loan_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_requests" ADD CONSTRAINT "loan_requests_aviso_id_fkey" FOREIGN KEY ("aviso_id") REFERENCES "avisos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_items" ADD CONSTRAINT "loan_items_loan_request_id_fkey" FOREIGN KEY ("loan_request_id") REFERENCES "loan_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_items" ADD CONSTRAINT "loan_items_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

