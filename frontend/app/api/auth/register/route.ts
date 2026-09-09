import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, findUserByUsername, createUser } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, username, password, confirmPassword } = body;

    // Validation: Empty fields
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

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Username is required.' },
        { status: 400 }
      );
    }
    const usernameClean = username.trim();
    if (usernameClean.length < 3 || usernameClean.length > 20) {
      return NextResponse.json(
        { ok: false, error: 'Username must be between 3 and 20 characters.' },
        { status: 400 }
      );
    }
    if (!/^[a-zA-Z0-9_]+$/.test(usernameClean)) {
      return NextResponse.json(
        { ok: false, error: 'Username can only contain letters, numbers, and underscores.' },
        { status: 400 }
      );
    }

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

    if (password !== confirmPassword) {
      return NextResponse.json(
        { ok: false, error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { ok: false, error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Check duplicate username
    const existingUsername = await findUserByUsername(usernameClean);
    if (existingUsername) {
      return NextResponse.json(
        { ok: false, error: 'This username is already taken.' },
        { status: 409 }
      );
    }

    // Hash password securely with bcrypt
    const passwordHash = await hashPassword(password);

    // Save to persistent database
    await createUser({
      fullName: fullName.trim(),
      email: email.trim(),
      username: usernameClean,
      passwordHash,
    });

    return NextResponse.json(
      {
        ok: true,
        message: 'Registration successful! Redirecting to login...',
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { ok: false, error: 'An internal server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
