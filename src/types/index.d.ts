export interface UserType {
    id: String;
    googleId: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectType{
    id: String;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

declare global {
    namespace Express {
        interface User extends UserType { }
        interface Project extends ProjectType { }
    }
}