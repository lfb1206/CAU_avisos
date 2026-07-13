'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  name: string;
  role: 'admin' | 'coordinador' | 'member';
}

export default function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      const { data } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', user.id)
        .single();
      setProfile(data ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (!session) setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const isActive = (path: string) =>
    pathname === path || (path !== '/' && pathname.startsWith(path));

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-blue-700 bg-blue-50'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
    }`;

  const loading = isLoggedIn === null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/Logo.png" alt="CAU Logo" className="h-8 w-auto" />
              <span className="text-xl font-semibold text-gray-900 hidden sm:block">
                CAU Avisos
              </span>
            </Link>
          </div>

          {/* Nav links */}
          <div className="flex items-center space-x-1">
            <Link href="/" className={linkClass('/')}>
              Aviso Largo
            </Link>
            <Link href="/aviso/rapido" className={linkClass('/aviso/rapido')}>
              Aviso Rápido
            </Link>
            <Link href="/avisos" className={linkClass('/avisos')}>
              Biblioteca
            </Link>
            <Link href="/cursos" className={linkClass('/cursos')}>
              Cursos
            </Link>

            {!loading && isLoggedIn && (
              <>
                <Link href="/dashboard" className={linkClass('/dashboard')}>
                  Panel
                </Link>
                {profile?.role === 'coordinador' && (
                  <Link href="/coordinador" className={linkClass('/coordinador')}>
                    Coordinador
                  </Link>
                )}
                {profile?.role === 'admin' && (
                  <Link href="/admin" className={linkClass('/admin')}>
                    Admin
                  </Link>
                )}
              </>
            )}

            {/* Auth */}
            {!loading && (
              isLoggedIn ? (
                <div className="flex items-center space-x-1 ml-2">
                  <Link
                    href="/perfil"
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors ${isActive('/perfil') ? 'bg-blue-50 text-blue-700' : ''}`}
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden sm:block truncate max-w-[120px]">
                      {profile?.name ?? '…'}
                    </span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 hover:text-red-600 px-2 py-1 rounded transition-colors"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="ml-2 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Ingresar
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
