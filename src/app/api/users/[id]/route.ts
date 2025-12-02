import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const user = await User.findOne({ _id: params.id }).select('-refreshToken');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
  }
}
