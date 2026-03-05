import { mockDeep } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";

export const prisma = mockDeep<PrismaClient>();
export default prisma;
