import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Match } from '@/lib/models/Match';
import { User } from '@/lib/models/User';
import { requireAuth } from '@/lib/auth-middleware';
import { calculateMatchScore } from '@/lib/groq';

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'random';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100);

    // Get current user
    const currentUser = await User.findOne({ _id: auth.userId });
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get all existing matches for this user
    const existingMatches = await Match.find({
      $or: [{ userAId: auth.userId }, { userBId: auth.userId }],
    });

    const excludedUserIds = new Set(existingMatches.flatMap((m) => [m.userAId, m.userBId]));
    excludedUserIds.add(auth.userId);

    // Build query
    const query: any = {
      _id: { $nin: Array.from(excludedUserIds) },
    };

    if (mode === 'strict') {
      query.schoolName = currentUser.schoolName;
    }

    // Get candidate users
    const candidates = await User.find(query).limit(limit).select('-refreshToken');

    // Calculate scores for each candidate
    const suggestions = await Promise.all(
      candidates.map(async (candidate) => {
        const { score, explanation } = await calculateMatchScore(currentUser, candidate);

        return {
          user: candidate,
          score,
          explanation,
        };
      }),
    );

    // Sort by score descending
    suggestions.sort((a, b) => b.score - a.score);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Get suggestions error:', error);
    return NextResponse.json({ message: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
