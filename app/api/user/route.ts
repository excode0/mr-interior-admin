import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import * as z from 'zod';
// define schema for input validation

const userSchema = z.object({
  username: z.string().min(1, 'Username is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = userSchema.parse(body);

    // Cek apakah email sudah ada
    const existingEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingEmail) {
      return NextResponse.json(
        {
          user: null,
          message: 'User email already exists',
        },
        { status: 409 },
      );
    }

    // Cek apakah username sudah ada
    const existingUsername = await db.user.findUnique({
      where: { username: username },
    });
    if (existingUsername) {
      return NextResponse.json(
        {
          user: null,
          message: 'Username already exists',
        },
        { status: 409 },
      );
    }

    // Hash password
    const hashPassword = await hash(password, 10);

    // Simpan user baru ke database
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;
    return NextResponse.json(
      {
        user: rest,
        message: 'User created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    // console.error('Error creating user:', error);
    return NextResponse.json(
      {
        message: 'An error occurred during user creation',
      },
      { status: 500 },
    );
  }
}
