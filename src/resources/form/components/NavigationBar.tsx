'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  name: string;
  role: 'admin' | 'member';
}

export default function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', user.id)
        .single();
      setProfile(data ?? null);
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
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
              Formulario
            </Link>
            <Link href="/cursos" className={linkClass('/cursos')}>
              Cursos
            </Link>

            {!loading && profile && (
              <>
                <Link href="/dashboard" className={linkClass('/dashboard')}>
                  Panel
                </Link>
                {profile.role === 'admin' && (
                  <Link href="/admin" className={linkClass('/admin')}>
                    Admin
                  </Link>
                )}
              </>
            )}

            {/* Auth */}
            {!loading && (
              profile ? (
                <div className="flex items-center space-x-2 ml-2">
                  <span className="hidden sm:block text-sm text-gray-600 truncate max-w-[120px]">
                    {profile.name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-600 hover:text-red-600 px-2 py-1 rounded transition-colors"
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
