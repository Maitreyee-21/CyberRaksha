import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, findUserByUsername, createUser } from '@/lib/db';
import { hashPassword, signAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, username, password, confirmPassword } = body;

    // Validation: Full Name
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Full name is required.' },
        { status: 400 }
      );
    }
    if (fullName.trim().length < 2) {
      return NextResponse.json(
        { ok: false, error: 'Full name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    // Validation: Email
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }
    const emailClean = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Username: If not provided or blank, derive from email
    let rawUsername = typeof username === 'string' ? username.trim() : '';
    if (!rawUsername) {
      rawUsername = emailClean.split('@')[0];
    }
    // Replace spaces with underscores
    let usernameClean = rawUsername.replace(/\s+/g, '_').toLowerCase();

    // Allow alphanumeric, underscores, hyphens, dots, and at-signs
    if (!/^[a-zA-Z0-9_.\-@+]+$/.test(usernameClean)) {
      return NextResponse.json(
        { ok: false, error: 'Username can only contain letters, numbers, hyphens, dots, and underscores.' },
        { status: 400 }
      );
    }

    if (usernameClean.length < 2 || usernameClean.length > 50) {
      return NextResponse.json(
        { ok: false, error: 'Username must be between 2 and 50 characters.' },
        { status: 400 }
      );
    }

    // Validation: Password
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Password is required.' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json(
        { ok: false, error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingEmail = await findUserByEmail(emailClean);
    if (existingEmail) {
      return NextResponse.json(
        { ok: false, error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    // Check duplicate username
    const existingUsername = await findUserByUsername(usernameClean);
    if (existingUsername) {
      return NextResponse.json(
        { ok: false, error: 'This username is already taken. Please choose another or log in.' },
        { status: 409 }
      );
    }

    // Hash password securely with bcrypt
    const passwordHash = await hashPassword(password);

    // Save to persistent database
    const newUser = await createUser({
      fullName: fullName.trim(),
      email: emailClean,
      username: usernameClean,
      passwordHash,
    });

    // Generate JWT token so user is automatically authenticated
    const token = signAuthToken(newUser);

    const safeUser = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      username: newUser.username,
    };

    const response = NextResponse.json(
      {
        ok: true,
        message: 'Registration successful! Redirecting to login...',
        user: safeUser,
      },
      { status: 201 }
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
    console.error('Registration error:', err);
    return NextResponse.json(
      { ok: false, error: 'An internal server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
