import { UserRole } from "@prisma/client";

// types.d.ts

export interface UserWithToken extends UserType {
    accessToken: string;
    refreshToken: string
}

export interface UserType {
    id: string;
    googleId: string;
    email: string;
    name: string;
    role: UserRole;
    department: string | null;
    createdAt: Date;
}

declare global {
    namespace Express {
        interface User extends UserType { }
    }
}