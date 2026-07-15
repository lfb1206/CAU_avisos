'use client';
import React, { useState, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CourseCard from '@/resources/courses/CourseCard';
import type { MemberCourseStatus } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// ── Types ────────────────────────────────────────────────────────────────────

type EdicionRow = {
  id: number;
  name: string;
  status: string;
  enrollment_open: boolean;
  capacity: number;
  required_points: number;
  start_date: string | null;
  inscripciones: { status: string }[];
  ayudantias: { asistio: boolean | null }[];
  _count: { inscripciones: number };
};

type TallerRow = {
  id: number;
  name: string;
  description: string;
  branch: string;
  level: string;
  order_index: number;
  prerequisite_taller_ids: number[];
  ediciones: EdicionRow[];
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function resolveMemberStatus(
  taller: TallerRow,
  completedIds: Set<number>,
  isLoggedIn: boolean
): MemberCourseStatus {
  if (!isLoggedIn) return 'bloqueado';
  if (taller.branch === 'base') return 'completado';
  if (completedIds.has(taller.id)) return 'completado';
  const prereqsMet = taller.prerequisite_taller_ids.every((pid) => completedIds.has(pid));
  return prereqsMet ? 'disponible' : 'bloqueado';
}

function getOpenEdicion(taller: TallerRow): EdicionRow | null {
  return (
    taller.ediciones.find(
      (e) => e.enrollment_open && e.status !== 'cancelada' && e.status !== 'finalizada'
    ) ?? null
  );
}

// ── Fixed node positions (x, y = top-left corner) ────────────────────────────
//
// Layout (each column = 195px, each row = 125px):
//
//   y=45:   Avalanchas  PerfEsquí                 Travesía   TecnInv
//   y=150:  IAM                                   EscHielo
//   y=265:  M1                        ProgNH
//   y=375:  IntroEsc  Manejo  Aseg  EvalBásica  Multilargos  EscTrad
//
// M1 modules run left (x=-780) to center (x=0), then fan into both branches.
// 'Montañismo Básico M1' is intentionally absent — not shown as a separate node.
const POSITIONS: Record<string, { x: number; y: number }> = {
  // M1 sub-talleres (linear chain with a fork at CAMP)
  'Técnicas Básicas de Montañismo':          { x: -780, y: 265 },
  'Planificación y Gestión del Riesgo':       { x: -585, y: 265 },
  'Técnicas de Campamento y Mínimo Impacto':  { x: -390, y: 265 },
  'Primeros Auxilios en Montaña':             { x: -195, y: 155 },
  'Orientación en Zonas Remotas':             { x: -195, y: 375 },
  'Técnicas Básicas en Nieve':               { x: 0,    y: 265 },

  // Nieve / Hielo branch
  'Iniciación a la Alta Montaña':            { x: 195,  y: 150 },
  'Avalanchas':                              { x: 390,  y: 45  },
  'Perfeccionamiento de Esquí':              { x: 585,  y: 45  },

  // Roca branch
  'Introducción a la Escalada Deportiva':    { x: 195,  y: 375 },
  'Manejo de Cuerdas':                       { x: 390,  y: 375 },
  'Aseguramiento y Polipastos':              { x: 585,  y: 375 },
  'Evaluación Básica Cuerdas':               { x: 780,  y: 375 },

  // Advanced Nieve / Hielo
  'Progresión en Nieve y Hielo':             { x: 975,  y: 265 },
  'Escalada en Hielo':                       { x: 1170, y: 150 },
  'Travesía y Autorescate en Glaciar':       { x: 1170, y: 45  },
  'Técnicas Invernales Avanzadas':           { x: 1365, y: 45  },

  // Advanced Roca
  'Escalada en Multilargos':                 { x: 975,  y: 375 },
  'Escalada Tradicional':                    { x: 1170, y: 375 },
};

// ── Custom node ──────────────────────────────────────────────────────────────

type CourseNodeData = {
  name: string;
  status: MemberCourseStatus;
  requiredPoints: number;
};

function CourseFlowNode({ data, selected }: { data: CourseNodeData; selected: boolean }) {
  const border =
    data.status === 'completado'
      ? 'border-green-400 bg-green-50'
      : data.status === 'disponible'
      ? 'border-blue-400 bg-white'
      : 'border-gray-200 bg-gray-50';

  const ring = selected ? 'ring-2 ring-offset-1 ring-blue-500' : '';
  const text = data.status === 'bloqueado' ? 'text-gray-400' : 'text-gray-900';

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none' }} />
      <div className={`border-2 rounded-xl px-3 py-2.5 w-[165px] shadow-sm transition-all cursor-pointer select-none ${border} ${ring}`}>
        <p className={`text-[11px] font-semibold leading-snug ${text}`}>{data.name}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {data.status === 'completado' && (
            <span className="text-[10px] font-bold text-green-700">✓ Completado</span>
          )}
          {data.status === 'bloqueado' && (
            <span className="text-[10px] text-gray-400">🔒 Pendiente</span>
          )}
          {data.status === 'disponible' && (
            <span className="text-[10px] font-medium text-blue-600">Disponible</span>
          )}
          {data.requiredPoints > 0 && (
            <span className="ml-auto text-[10px] text-gray-400">{data.requiredPoints} pts</span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />
    </>
  );
}

const nodeTypes = { course: CourseFlowNode };

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CursosPage() {
  const { data, isLoading } = useSWR('/api/cursos', fetcher);
  const [selectedTaller, setSelectedTaller] = useState<TallerRow | null>(null);

  const talleres: TallerRow[] = data?.talleres ?? [];
  const userActivePoints: number = data?.userActivePoints ?? 0;
  const isLoggedIn = data !== undefined && !data?.error;

  const completedIds = useMemo(() => {
    const s = new Set<number>();
    for (const t of talleres) {
      if (t.branch === 'base' && isLoggedIn) s.add(t.id);
      else if (t.ediciones.some((e) => e.inscripciones.some((i) => i.status === 'completado'))) {
        s.add(t.id);
      }
    }
    return s;
  }, [talleres, isLoggedIn]);

  const tallerMap = useMemo(() => new Map(talleres.map((t) => [String(t.id), t])), [talleres]);

  const { nodes, edges } = useMemo<{ nodes: Node[]; edges: Edge[] }>(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    for (const taller of talleres) {
      const pos = POSITIONS[taller.name];
      if (!pos) continue;

      const status = resolveMemberStatus(taller, completedIds, isLoggedIn);
      const openEdicion = getOpenEdicion(taller);

      nodes.push({
        id: String(taller.id),
        type: 'course',
        position: pos,
        draggable: false,
        selectable: true,
        data: {
          name: taller.name,
          status,
          requiredPoints: openEdicion?.required_points ?? 0,
        },
      });

      for (const prereqId of taller.prerequisite_taller_ids) {
        const edgeColor = status === 'bloqueado' ? '#e5e7eb' : '#9ca3af';
        edges.push({
          id: `e${prereqId}-${taller.id}`,
          source: String(prereqId),
          target: String(taller.id),
          animated: status === 'disponible',
          style: { stroke: edgeColor, strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor, width: 14, height: 14 },
        });
      }
    }

    return { nodes, edges };
  }, [talleres, completedIds, isLoggedIn]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const taller = tallerMap.get(node.id);
      setSelectedTaller(taller ?? null);
    },
    [tallerMap]
  );

  // Derive props for the detail panel
  const panelStatus = selectedTaller
    ? resolveMemberStatus(selectedTaller, completedIds, isLoggedIn)
    : null;
  const panelOpenEdicion = selectedTaller ? getOpenEdicion(selectedTaller) : null;
  const panelInscripcionStatus =
    panelOpenEdicion
      ? (selectedTaller?.ediciones.find((e) => e.id === panelOpenEdicion.id)
          ?.inscripciones[0]?.status ?? null)
      : null;
  const panelIsAyudante =
    panelOpenEdicion
      ? (selectedTaller?.ediciones.some(
          (e) => e.id === panelOpenEdicion.id && e.ayudantias.length > 0
        ) ?? false)
      : false;
  const panelMissingPrereqs =
    panelStatus === 'bloqueado' && selectedTaller
      ? selectedTaller.prerequisite_taller_ids
          .filter((pid) => !completedIds.has(pid))
          .map((pid) => talleres.find((t) => t.id === pid)?.name ?? `Taller #${pid}`)
      : [];

  return (
    <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>

      {/* Floating top bar */}
      <div className="absolute top-3 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur rounded-2xl px-5 py-2.5 shadow-sm text-center pointer-events-auto">
          <h1 className="text-base font-bold text-gray-900">Talleres del Club Andino Universitario</h1>
          <p className="text-xs text-gray-500 mt-0.5">Haz clic en un taller para ver detalles · Rueda para hacer zoom · Arrastra para mover</p>
          {!isLoading && !isLoggedIn && (
            <p className="text-xs text-blue-700 mt-1">
              <a href="/auth/login" className="font-semibold hover:underline">Inicia sesión</a> para ver tu progreso y postular
            </p>
          )}
          {!isLoading && isLoggedIn && userActivePoints > 0 && (
            <p className="text-xs text-purple-700 mt-0.5 font-medium">
              {userActivePoints} punto{userActivePoints !== 1 ? 's' : ''} activos
            </p>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-16 left-4 z-10 bg-white/90 backdrop-blur rounded-xl px-3 py-2.5 shadow-sm">
        <div className="space-y-1.5">
          {[
            { cls: 'border-green-400 bg-green-50', label: 'Completado' },
            { cls: 'border-blue-400 bg-white', label: 'Disponible' },
            { cls: 'border-gray-200 bg-gray-50', label: 'Pendiente de prerequisitos' },
          ].map(({ cls, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-3 rounded border-2 ${cls}`} />
              <span className="text-[10px] text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-sm text-gray-400">Cargando talleres…</div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnDoubleClick={false}
        >
          <Background gap={28} size={1} color="#e5e7eb" />
          <Controls position="bottom-right" showInteractive={false} />
        </ReactFlow>
      )}

      {/* Detail panel */}
      {selectedTaller && panelStatus && (
        <div className="absolute right-0 top-0 bottom-0 w-80 z-20 bg-white shadow-2xl border-l border-gray-100 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <span className="text-sm font-semibold text-gray-800">Detalle del taller</span>
            <button
              onClick={() => setSelectedTaller(null)}
              className="text-gray-400 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <CourseCard
              id={selectedTaller.id}
              name={selectedTaller.name}
              description={selectedTaller.description}
              level={selectedTaller.level}
              status={panelStatus}
              openEdicion={
                panelOpenEdicion
                  ? {
                      id: panelOpenEdicion.id,
                      name: panelOpenEdicion.name,
                      start_date: panelOpenEdicion.start_date,
                      capacity: panelOpenEdicion.capacity,
                      required_points: panelOpenEdicion.required_points,
                      _count: panelOpenEdicion._count,
                    }
                  : null
              }
              userInscripcionStatus={panelInscripcionStatus}
              isAyudante={panelIsAyudante}
              missingPrerequisiteNames={panelMissingPrereqs}
              userActivePoints={userActivePoints}
            />
          </div>
        </div>
      )}
    </div>
  );
}
