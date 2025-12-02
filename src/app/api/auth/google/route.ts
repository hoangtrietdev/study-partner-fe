import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { v4 as uuidv4 } from 'uuid';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credential = body.credential || body.token;

    if (!credential) {
      return NextResponse.json(
        { message: 'Credential is required' },
        { status: 400 }
      );
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json(
        { message: 'Invalid Google token' },
        { status: 401 }
      );
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email || !name) {
      return NextResponse.json(
        { message: 'Email and name are required from Google' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      // New user - create with default values
      const userId = uuidv4();
      user = await User.create({
        _id: userId,
        googleId,
        email,
        name,
        imageUrl: picture,
        schoolName: 'Not specified',
        age: 18,
        major: 'Not specified',
        faculty: 'Not specified',
        interests: [],
        bio: '',
        settings: {
          aiSuggestionsEnabled: true,
          notifications: true,
          darkMode: false,
        },
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user._id,
      email: user.email,
    });

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        schoolName: user.schoolName,
        age: user.age,
        major: user.major,
        faculty: user.faculty,
        interests: user.interests,
        bio: user.bio,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json(
      { message: 'Authentication failed', error: String(error) },
      { status: 500 }
    );
  }
}
