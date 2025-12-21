import React from 'react';
import Link from 'next/link';
import { PowerIcon } from '@heroicons/react/24/outline';
import { auth, signOut } from '@/auth';


export default async function NavigationBar() {
  const session = await auth();
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
          {session &&
            <div className="flex items-center space-x-4">
              <p> Hola, CAU! </p>
            </div>
          }
          
          <div className="flex items-center space-x-4">
            {!session &&
            <Link 
              href="/login" 
              className="ml-2 bg-gray-600 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Iniciar Sesión Socios
            </Link>
            }
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Formulario
            </Link>
            <Link 
              href="/admin" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Administración
            </Link>
          </div>
          {session &&
          <div className="flex items-center space-x-4">
           <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
          >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Cerrar sesión</div>
          </button>
          </form>
          </div>
          }
        </div>
      </div>
    </nav>
  );
} 