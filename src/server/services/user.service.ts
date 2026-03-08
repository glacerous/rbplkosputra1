import { prisma } from '@/server/db/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export async function listUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function registerUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      role: 'CUSTOMER', // Default role
    },
  });
}

export async function updateUser(
  id: string,
  data: { name?: string; password?: string },
) {
  const updateData: { name?: string; passwordHash?: string } = {};
  if (data.name) updateData.name = data.name;
  if (data.password)
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
}

export async function adminUpdateUser(
  id: string,
  data: { name?: string; role?: Role },
) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
}
