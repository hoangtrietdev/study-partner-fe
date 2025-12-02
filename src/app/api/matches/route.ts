import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Match, MatchStatus } from '@/lib/models/Match';
import { User } from '@/lib/models/User';
import { requireAuth } from '@/lib/auth-middleware';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { userBId, score, explanation } = await request.json();

    if (!userBId) {
      return NextResponse.json({ message: 'userBId is required' }, { status: 400 });
    }

    await connectDB();

    // Check if target user exists
    const userB = await User.findOne({ _id: userBId });
    if (!userB) {
      return NextResponse.json({ message: 'Target user not found' }, { status: 404 });
    }

    // Check if match already exists
    const existingMatch = await Match.findOne({
      $or: [
        { userAId: auth.userId, userBId },
        { userAId: userBId, userBId: auth.userId },
      ],
    });

    if (existingMatch) {
      return NextResponse.json({ message: 'Match already exists' }, { status: 409 });
    }

    // Create new match
    const match = await Match.create({
      _id: uuidv4(),
      userAId: auth.userId,
      userBId,
      status: MatchStatus.PENDING,
      score,
      explanation,
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error('Create match error:', error);
    return NextResponse.json({ message: 'Failed to create match' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as MatchStatus | null;

    const query: any = {
      $or: [{ userAId: auth.userId }, { userBId: auth.userId }],
    };

    if (status) {
      query.status = status;
    }

    const matches = await Match.find(query).sort({ createdAt: -1 });

    // Populate user data
    const populatedMatches = await Promise.all(
      matches.map(async (match) => {
        const otherUserId = match.userAId === auth.userId ? match.userBId : match.userAId;
        const otherUser = await User.findOne({ _id: otherUserId }).select('-refreshToken');

        return {
          ...match.toObject(),
          otherUser,
        };
      }),
    );

    // Filter out matches where the other user doesn't exist
    const validMatches = populatedMatches.filter((m) => m.otherUser);

    return NextResponse.json(validMatches);
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json({ message: 'Failed to fetch matches' }, { status: 500 });
  }
}
