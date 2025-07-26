'use client';
import React, { useRef } from 'react';

export default function WeatherImageUpload({ 
  weatherImages = [], 
  onImageUpload, 
  onImageRemove, 
  onImageDateUpdate 
}) {
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          url: URL.createObjectURL(file),
          base64: e.target.result,
          fechaObtencion: new Date().toISOString().split('T')[0]
        };
        onImageUpload(newImage);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (event) => {
    processFiles(event.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (imageId) => {
    const removed = weatherImages.find(img => img.id === imageId);
    if (removed) {
      URL.revokeObjectURL(removed.url);
    }
    onImageRemove(imageId);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
      >
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-gray-600">
            <p className="font-medium">Arrastra y suelta imágenes aquí, o</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              haz clic para seleccionar
            </button>
          </div>
          <p className="text-sm text-gray-500">PNG, JPG, GIF hasta 10MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Uploaded Images */}
      {weatherImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherImages.map((image) => (
            <div key={image.id} className="relative border border-gray-200 rounded-lg p-3">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-32 object-cover rounded"
              />
              <div className="mt-2 space-y-2">
                <p className="text-sm font-medium text-gray-900 truncate">{image.name}</p>
                <input
                  type="date"
                  value={image.fechaObtencion}
                  onChange={(e) => onImageDateUpdate(image.id, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="w-full px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 