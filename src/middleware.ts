import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: unknown }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  // Use getSession() (local JWT validation, no network call) so the BCG corporate
  // proxy doesn't block middleware on every request. Server components that need
  // the fully verified user still call getUser() individually.
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  const protectedPrefixes = ['/aviso', '/dashboard', '/cursos', '/coordinador', '/perfil', '/avisos'];
  const isProtected = pathname === '/' || protectedPrefixes.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Coordinador-only routes — role check is done in the page/API itself
  // (middleware can't query the DB without a network-capable runtime here)

  // Redirect already-authenticated users away from auth pages
  // Exception: /auth/reset-password/confirm needs a valid session to call updateUser()
  if (user && pathname.startsWith('/auth/') && pathname !== '/auth/reset-password/confirm') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
