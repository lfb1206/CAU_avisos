'use client';
import React, { useRef, useState } from 'react';

interface LoanPhotoCaptureProps {
  label: string;
  onCapture: (base64: string) => void;
  initialPreview?: string | null;
}

function resizeToBase64(file: File, maxWidth = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo procesar la imagen'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * One-tap photo capture: opens the device camera directly (not a gallery picker),
 * resizes client-side, shows an instant thumbnail. Deliberately minimal — the point
 * is that taking the photo is never the reason someone skips it.
 */
export default function LoanPhotoCapture({ label, onCapture, initialPreview }: LoanPhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialPreview ?? null);
  const [processing, setProcessing] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const base64 = await resizeToBase64(file);
      setPreview(base64);
      onCapture(base64);
    } catch {
      alert('No se pudo procesar la foto. Intenta de nuevo.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {preview ? (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={label} className="w-full max-h-64 object-cover rounded-lg border border-gray-200" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Reemplazar foto
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">{processing ? 'Procesando...' : label}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
