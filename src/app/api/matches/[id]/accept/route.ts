import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Match, MatchStatus } from '@/lib/models/Match';
import { requireAuth } from '@/lib/auth-middleware';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();

    const match = await Match.findOne({ _id: params.id });

    if (!match) {
      return NextResponse.json({ message: 'Match not found' }, { status: 404 });
    }

    // Verify user is part of this match
    if (match.userAId !== auth.userId && match.userBId !== auth.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Update to matched status
    match.status = MatchStatus.MATCHED;
    await match.save();

    return NextResponse.json(match);
  } catch (error) {
    console.error('Accept match error:', error);
    return NextResponse.json(
      { message: 'Failed to accept match' },
      { status: 500 }
    );
  }
}
