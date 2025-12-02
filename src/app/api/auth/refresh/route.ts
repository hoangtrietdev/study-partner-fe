import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token is required' }, { status: 400 });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Connect to database
    await connectDB();

    // Find user and verify refresh token
    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken,
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
    });

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ message: 'Token refresh failed' }, { status: 401 });
  }
}
