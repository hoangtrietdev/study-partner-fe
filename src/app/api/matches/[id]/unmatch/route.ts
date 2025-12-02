import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Match, MatchStatus } from '@/lib/models/Match';
import { Message } from '@/lib/models/Message';
import { requireAuth } from '@/lib/auth-middleware';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Update status to unmatched
    match.status = MatchStatus.UNMATCHED;
    await match.save();

    // Optionally delete associated messages
    await Message.updateMany({ matchId: params.id }, { $set: { deleted: true } });

    return NextResponse.json({ message: 'Match unmatched successfully' });
  } catch (error) {
    console.error('Unmatch error:', error);
    return NextResponse.json({ message: 'Failed to unmatch' }, { status: 500 });
  }
}
