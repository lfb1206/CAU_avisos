'use client';
import React from 'react';
import Link from 'next/link';

export default function NavigationBar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/Logo.png" 
                alt="CAU Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold text-gray-900">
                CAU Avisos
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Formulario
            </Link>
            <Link 
              href="/audit" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Administración
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 