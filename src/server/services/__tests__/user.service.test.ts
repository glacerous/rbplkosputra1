import { describe, it, expect, vi, beforeEach } from "vitest";
import { listUsers, getUserByEmail, registerUser, updateUser } from "../user.service";
import { prismaMock } from "@/test/setup";
import bcrypt from "bcryptjs";

vi.mock("bcryptjs", () => ({
    default: {
        hash: vi.fn().mockResolvedValue("hashed_password"),
        compare: vi.fn(),
    },
}));

describe("User Service", () => {
    const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        passwordHash: "hashed_pw",
        role: "CUSTOMER" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    describe("listUsers", () => {
        it("should return a list of users", async () => {
            const userSummary = {
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                role: mockUser.role,
                createdAt: mockUser.createdAt,
            };
            prismaMock.user.findMany.mockResolvedValue([userSummary] as any);

            const result = await listUsers();

            expect(result).toEqual([userSummary]);
            expect(prismaMock.user.findMany).toHaveBeenCalled();
        });
    });

    describe("getUserByEmail", () => {
        it("should return user if found", async () => {
            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const result = await getUserByEmail("test@example.com");

            expect(result).toEqual(mockUser);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { email: "test@example.com" },
            });
        });

        it("should return null if user not found", async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const result = await getUserByEmail("notfound@example.com");

            expect(result).toBeNull();
        });
    });

    describe("registerUser", () => {
        it("should hash password and create user", async () => {
            prismaMock.user.create.mockResolvedValue(mockUser);

            const result = await registerUser({
                name: "Test User",
                email: "test@example.com",
                passwordHash: "plain_password",
            });

            expect(bcrypt.hash).toHaveBeenCalledWith("plain_password", 10);
            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: {
                    name: "Test User",
                    email: "test@example.com",
                    passwordHash: "hashed_password",
                    role: "CUSTOMER",
                },
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe("updateUser", () => {
        it("should update name only", async () => {
            prismaMock.user.update.mockResolvedValue({ ...mockUser, name: "New Name" });

            const result = await updateUser("user-1", { name: "New Name" });

            expect(prismaMock.user.update).toHaveBeenCalledWith({
                where: { id: "user-1" },
                data: { name: "New Name" },
            });
            expect(result.name).toBe("New Name");
        });

        it("should hash new password when updating password", async () => {
            prismaMock.user.update.mockResolvedValue({ ...mockUser, passwordHash: "hashed_password" });

            await updateUser("user-1", { password: "newpassword123" });

            expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
            expect(prismaMock.user.update).toHaveBeenCalledWith({
                where: { id: "user-1" },
                data: { passwordHash: "hashed_password" },
            });
        });
    });
});
