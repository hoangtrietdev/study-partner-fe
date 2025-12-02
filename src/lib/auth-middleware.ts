import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, JWTPayload } from '@/lib/jwt';

export function getAuthUser(request: NextRequest): JWTPayload | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    return verifyAccessToken(token);
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: NextRequest): JWTPayload | NextResponse {
  const user = getAuthUser(request);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return user;
}
