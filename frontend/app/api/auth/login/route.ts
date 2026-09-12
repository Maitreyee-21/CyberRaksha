import { NextRequest, NextResponse } from 'next/server';
import { findUsersByIdentifier, findUserByIdentifier } from '@/lib/db';
import { verifyPassword, signAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Please enter your email or username.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Please enter your password.' },
        { status: 400 }
      );
    }

    // Lookup users by email, username, or full name
    const matchingUsers = await findUsersByIdentifier(identifier.trim());
    if (!matchingUsers || matchingUsers.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Invalid username/email or password.' },
        { status: 401 }
      );
    }

    // Verify hashed password using bcrypt against matched user(s)
    let authenticatedUser = null;
    for (const u of matchingUsers) {
      const isMatch = await verifyPassword(password, u.passwordHash);
      if (isMatch) {
        authenticatedUser = u;
        break;
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { ok: false, error: 'Invalid username/email or password.' },
        { status: 401 }
      );
    }

    const user = authenticatedUser;

    // Generate JWT token
    const token = signAuthToken(user);

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
    };

    const response = NextResponse.json(
      {
        ok: true,
        message: `Welcome back, ${user.fullName}!`,
        user: safeUser,
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { ok: false, error: 'An internal server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
