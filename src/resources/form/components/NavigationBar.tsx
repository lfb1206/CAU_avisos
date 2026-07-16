'use client';
import React, { useEffect, useRef, useState } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setIsLoggedIn(false); return; }
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

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const isActive = (path: string) =>
    pathname === path || (path !== '/' && pathname.startsWith(path));

  const desktopLinkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800'
    }`;

  const mobileLinkClass = (path: string) =>
    `block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
      isActive(path)
        ? 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800'
    }`;

  const loading = isLoggedIn === null;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 relative z-40" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/Logo.png" alt="CAU Logo" className="h-8 w-auto" />
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">
                Portal CAU
              </span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-1">
            {!loading && isLoggedIn && (
              <>
                <Link href="/aviso/largo" className={desktopLinkClass('/aviso/largo')}>Aviso Largo</Link>
                <Link href="/aviso/rapido" className={desktopLinkClass('/aviso/rapido')}>Aviso Rápido</Link>
                <Link href="/avisos" className={desktopLinkClass('/avisos')}>Biblioteca</Link>
                <Link href="/cursos" className={desktopLinkClass('/cursos')}>Cursos</Link>
                <Link href="/dashboard" className={desktopLinkClass('/dashboard')}>Panel</Link>
                {profile?.role === 'coordinador' && (
                  <Link href="/coordinador" className={desktopLinkClass('/coordinador')}>Coordinador</Link>
                )}
                {profile?.role === 'admin' && (
                  <Link href="/admin" className={desktopLinkClass('/admin')}>Admin</Link>
                )}
              </>
            )}

            {!loading && (
              isLoggedIn ? (
                <div className="flex items-center space-x-1 ml-2">
                  <Link
                    href="/perfil"
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isActive('/perfil') ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}`}
                  >
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="truncate max-w-[120px]">{profile?.name ?? '…'}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 px-2 py-1 rounded transition-colors"
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

          {/* Mobile: right side — profile name + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {!loading && isLoggedIn && profile?.name && (
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[100px]">{profile.name}</span>
            )}
            {!loading && !isLoggedIn && (
              <Link
                href="/auth/login"
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Ingresar
              </Link>
            )}
            {!loading && isLoggedIn && (
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Abrir menú"
                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {menuOpen ? (
                  /* X icon */
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  /* Hamburger */
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="px-3 py-3 space-y-1">
            <Link href="/aviso/rapido" className={mobileLinkClass('/aviso/rapido')}>Aviso Rápido</Link>
            <Link href="/cursos" className={mobileLinkClass('/cursos')}>Cursos</Link>
            <Link href="/avisos" className={mobileLinkClass('/avisos')}>Biblioteca</Link>
            <Link href="/aviso/largo" className={mobileLinkClass('/aviso/largo')}>Aviso Largo</Link>
            <Link href="/dashboard" className={mobileLinkClass('/dashboard')}>Panel</Link>
            <Link href="/perfil" className={mobileLinkClass('/perfil')}>Mi perfil</Link>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
