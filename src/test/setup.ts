import { vi, beforeEach } from "vitest";
import { mockReset } from "vitest-mock-extended";
import prisma from "@/server/db/prisma";

vi.mock("@/server/db/prisma");

beforeEach(() => {
    mockReset(prisma);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prismaMock = prisma as any;
