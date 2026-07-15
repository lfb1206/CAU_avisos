import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/auth/check-email?email=... — returns { allowed: boolean }
// Used by the registration page to enforce the email whitelist before calling signUp().
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.toLowerCase().trim();
  if (!email) return NextResponse.json({ allowed: false });

  const existing = await prisma.profile.findFirst({
    where: { email },
    select: { id: true, is_registered: true },
  });

  if (!existing) return NextResponse.json({ allowed: false, reason: 'not_whitelisted' });
  if (existing.is_registered) return NextResponse.json({ allowed: false, reason: 'already_registered' });

  return NextResponse.json({ allowed: true });
}
