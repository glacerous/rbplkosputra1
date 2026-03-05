import { vi, beforeEach } from "vitest";
import { mockReset } from "vitest-mock-extended";
import prisma from "@/server/db/prisma";

vi.mock("@/server/db/prisma");

beforeEach(() => {
    mockReset(prisma);
});

export const prismaMock = prisma as any;
