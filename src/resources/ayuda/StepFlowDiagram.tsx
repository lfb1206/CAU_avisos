'use client';
import React, { useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export interface FlowStep {
  label: string;
  sublabel?: string;
  /** Shown below the diagram when this step is tapped — the non-obvious detail
   *  that doesn't fit in the box itself (e.g. a condition that blocks the step). */
  detail?: string;
}

interface StepNodeData {
  label: string;
  sublabel?: string;
  index: number;
  active: boolean;
  hasDetail: boolean;
  [key: string]: unknown;
}

function StepNode({ data }: { data: StepNodeData }) {
  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none' }} />
      <div
        className={`border-2 rounded-xl px-3 py-2.5 w-[170px] shadow-sm text-center transition-colors ${
          data.hasDetail ? 'cursor-pointer' : 'cursor-default'
        } ${data.active ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-white hover:border-blue-400'}`}
      >
        <div
          className={`w-5 h-5 mx-auto mb-1 rounded-full text-white text-[11px] font-bold flex items-center justify-center ${
            data.active ? 'bg-blue-700' : 'bg-blue-600'
          }`}
        >
          {data.index}
        </div>
        <p className="text-[11px] font-semibold text-gray-900 leading-snug">{data.label}</p>
        {data.sublabel && <p className="text-[10px] text-gray-500 mt-1 leading-snug">{data.sublabel}</p>}
        {data.hasDetail && <p className="text-[9px] text-blue-500 mt-1">Toca para más detalle</p>}
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />
    </>
  );
}

const nodeTypes = { step: StepNode };

/**
 * A small "step 1 → step 2 → ..." flow for the Ayuda manuals — deliberately not
 * the full state-machine diagrams the README has (those are for developers and
 * include every edge case). This is the normal, happy-path journey for a role's
 * main task, at a glance — tapping a step reveals the one detail that doesn't
 * fit in the box itself (e.g. a condition that blocks that step). Built with
 * @xyflow/react since it's already a dependency (used for the /cursos roadmap).
 */
export default function StepFlowDiagram({ steps, height = 150 }: { steps: FlowStep[]; height?: number }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { nodes, edges } = useMemo<{ nodes: Node[]; edges: Edge[] }>(() => {
    const nodes: Node[] = steps.map((step, i) => ({
      id: String(i),
      type: 'step',
      position: { x: i * 210, y: 0 },
      draggable: false,
      data: {
        label: step.label,
        sublabel: step.sublabel,
        index: i + 1,
        active: activeIndex === i,
        hasDetail: !!step.detail,
      },
    }));

    const edges: Edge[] = steps.slice(1).map((_, i) => ({
      id: `e${i}-${i + 1}`,
      source: String(i),
      target: String(i + 1),
      style: { stroke: '#93c5fd', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#93c5fd', width: 16, height: 16 },
    }));

    return { nodes, edges };
  }, [steps, activeIndex]);

  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    const index = Number(node.id);
    if (!steps[index]?.detail) return;
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const activeStep = activeIndex !== null ? steps[activeIndex] : null;
  const anyDetail = steps.some((s) => s.detail);

  return (
    <div className="space-y-2">
      <div style={{ height }} className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          panOnScroll={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} color="#e5e7eb" />
        </ReactFlow>
      </div>
      {activeStep?.detail ? (
        <div className="text-xs text-blue-900 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          <strong>{activeStep.label}:</strong> {activeStep.detail}
        </div>
      ) : (
        anyDetail && <p className="text-[11px] text-gray-400 italic">Toca un paso para ver más detalle.</p>
      )}
    </div>
  );
}
