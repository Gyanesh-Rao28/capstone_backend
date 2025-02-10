// types.ts
import { UserRole, ProjectDomain, ProjectStatus, CourseType, ApplicationStatus, MemberRole, Project } from "@prisma/client";

// Base User Type
export interface UserType {
    id: string;
    googleId: string;
    email: string;
    name: string;
    role: UserRole;
    profilePicture: string | null;
    createdAt: Date;
    updatedAt: Date;

    admin? : Admin | null
    faculty?: Faculty | null
    student? : Student | null
}

// User with Auth Tokens
export interface UserWithToken extends UserType {
    accessToken: string;
    refreshToken: string;
}

// Admin Type
export interface Admin {
    id: string;
    userId: string;
}

// Project Type (matching Prisma schema)
export interface ProjectType {
    id: string;
    facultyId: string;
    title: string;
    description: string;
    domain: ProjectDomain;
    status: ProjectStatus;
    course: CourseType;
    tags: string[];
    deadline: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// Faculty Type (matching Prisma schema)
export interface Faculty {
    id: string;
    userId: string;
    department: string;
    designation: string | null;
    projects?: ProjectType[];
}

// Student Type (matching Prisma schema)
export interface Student {
    id: string;
    userId: string;
    studentId: string;
    batch: string | null;
}

// Extended User Types with Role-Specific Data
export interface UserAdmin extends UserType {
    admin: Admin | null;
}

export interface UserFaculty extends UserType {
    faculty: Faculty | null;
}

export interface UserStudent extends UserType {
    student: Student | null;
}

// Group Type
export interface Group {
    id: string;
    projectId: string;
    name: string;
    inviteCode: string;
    maxMember: number;
    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Member Type
export interface Member {
    id: string;
    groupId: string;
    studentId: string;
    memberRole: MemberRole;
    joinedAt: Date;
}

// Project Application Type
export interface ProjectApplication {
    id: string;
    groupId: string;
    projectId: string;
    applicationStatus: ApplicationStatus;
}

// Type Guard Functions
export const isFaculty = (user: UserType): user is UserFaculty => {
    return user.role === 'faculty';
};

export const isAdmin = (user: UserType): user is UserAdmin => {
    return user.role === 'admin';
};

export const isStudent = (user: UserType): user is UserStudent => {
    return user.role === 'student';
};

// Express namespace extension
declare global {
    namespace Express {
        interface User extends UserType { }
    }
}