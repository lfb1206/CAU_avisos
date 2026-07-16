'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      Imprimir / Guardar PDF
    </button>
  );
}
