import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/auth/check-email?email=... — returns { allowed: boolean }
// Used by the registration page to enforce the email whitelist before calling signUp().
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.toLowerCase().trim();
  if (!email) return NextResponse.json({ allowed: false });

  const profile = await prisma.profile.findFirst({
    where: { email, is_registered: false },
    select: { id: true },
  });

  return NextResponse.json({ allowed: !!profile });
}
