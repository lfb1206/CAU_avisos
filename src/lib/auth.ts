import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

// ── Server-component guards (redirect on failure) ──────────────────────────────

/** Asserts the request comes from an authenticated user; redirects to login otherwise. */
export async function requireAuth(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  return user;
}

/** Asserts the user has the `admin` role; redirects to /dashboard otherwise. */
export async function requireAdmin(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!profile || profile.role !== 'admin') redirect('/dashboard');
  return user;
}

/** Asserts the user has the `coordinador` or `admin` role; redirects to /dashboard otherwise. */
export async function requireCoordinador(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!profile || (profile.role !== 'coordinador' && profile.role !== 'admin')) {
    redirect('/dashboard');
  }
  return user;
}

// ── API route guards (return NextResponse on failure) ──────────────────────────

type AuthResult = { user: User; profile: Profile };

/**
 * Verifies the caller is authenticated.
 * Returns `{ user, profile }` on success or a `NextResponse` with 401 on failure.
 */
export async function apiRequireAuth(_request: Request): Promise<AuthResult | NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  return { user, profile };
}

/**
 * Verifies the caller is an admin.
 * Returns `{ user, profile }` on success, 401 if unauthenticated, 403 if not admin.
 */
export async function apiRequireAdmin(request: Request): Promise<AuthResult | NextResponse> {
  const result = await apiRequireAuth(request);
  if (result instanceof NextResponse) return result;

  if (result.profile.role !== 'admin') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }
  return result;
}

/**
 * Verifies the caller is a coordinador or admin.
 * Returns `{ user, profile }` on success, 401 if unauthenticated, 403 if insufficient role.
 */
export async function apiRequireCoordinador(request: Request): Promise<AuthResult | NextResponse> {
  const result = await apiRequireAuth(request);
  if (result instanceof NextResponse) return result;

  if (result.profile.role !== 'coordinador' && result.profile.role !== 'admin') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }
  return result;
}
