import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Message } from '@/lib/models/Message';
import { Match, MatchStatus } from '@/lib/models/Match';
import { requireAuth } from '@/lib/auth-middleware';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { matchId, content } = await request.json();

    if (!matchId || !content) {
      return NextResponse.json({ message: 'matchId and content are required' }, { status: 400 });
    }

    await connectDB();

    // Verify match exists and user is part of it
    const match = await Match.findOne({
      _id: matchId,
      status: MatchStatus.MATCHED,
      $or: [{ userAId: auth.userId }, { userBId: auth.userId }],
    });

    if (!match) {
      return NextResponse.json({ message: 'Match not found or not active' }, { status: 404 });
    }

    // Determine recipient
    const recipientId = match.userAId === auth.userId ? match.userBId : match.userAId;

    // Create message
    const message = await Message.create({
      _id: uuidv4(),
      matchId,
      senderId: auth.userId,
      recipientId,
      content,
      deleted: false,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ message: 'Failed to create message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    if (!matchId) {
      return NextResponse.json({ message: 'matchId is required' }, { status: 400 });
    }

    await connectDB();

    // Verify user is part of this match
    const match = await Match.findOne({
      _id: matchId,
      $or: [{ userAId: auth.userId }, { userBId: auth.userId }],
    });

    if (!match) {
      return NextResponse.json({ message: 'Match not found or access denied' }, { status: 404 });
    }

    // Get messages
    const messages = await Message.find({
      matchId,
      deleted: false,
    }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ message: 'Failed to fetch messages' }, { status: 500 });
  }
}
