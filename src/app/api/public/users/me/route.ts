import { auth } from '@/server/auth/auth';
import { getUserByEmail, updateUser } from '@/server/services/user.service';
import { NextResponse } from 'next/server';
import * as z from 'zod';
import bcrypt from 'bcryptjs';

const updateSchema = z
  .object({
    name: z.string().min(2).optional(),
    password: z.string().min(8).optional(),
    currentPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.currentPassword) return false;
      return true;
    },
    {
      message: 'Current password required to change password',
      path: ['currentPassword'],
    },
  );

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  });
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, password, currentPassword } = parsed.data;

    if (password && currentPassword) {
      const user = await getUserByEmail(session.user.email!);
      if (!user)
        return NextResponse.json(
          { message: 'User tidak ditemukan' },
          { status: 404 },
        );

      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { message: 'Password saat ini salah' },
          { status: 400 },
        );
      }
    }

    const updated = await updateUser(session.user.id, { name, password });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
