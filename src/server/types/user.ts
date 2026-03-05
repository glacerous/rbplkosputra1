import { Role } from "@prisma/client";

export interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: Role;
    createdAt: Date;
}
