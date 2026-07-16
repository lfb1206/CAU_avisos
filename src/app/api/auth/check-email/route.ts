import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/auth/check-email?email=... — returns { allowed: boolean }
// Used by the registration page to enforce the email whitelist before calling signUp().
// NOTE: We deliberately do NOT expose the reason for refusal to prevent user enumeration.
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.toLowerCase().trim();
  if (!email) return NextResponse.json({ allowed: false });

  try {
    const existing = await prisma.profile.findFirst({
      where: { email },
      select: { id: true, is_registered: true },
    });

    if (!existing || existing.is_registered) {
      return NextResponse.json({ allowed: false });
    }

    return NextResponse.json({ allowed: true });
  } catch (error) {
    console.error('[check-email GET]:', error);
    return NextResponse.json({ allowed: false });
  }
}
