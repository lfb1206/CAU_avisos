'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      Imprimir / Guardar PDF
    </button>
  );
}
