export enum UserRole {
    USER = "user",
    ADMIN = "admin",
    SUPERADMIN = "superadmin",
}

export interface IAuth {
    username: string;
    fullName: string;
    email: string;
    phone?: string;
    image?: string;
    password?: string;
    provider: "Google" | "GitHub" | "Email";
    role: UserRole;
    isVerified: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    deletedReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// export interface IUserProfile {
//     userId: string; // Reference to IUser._id
//     bio?: string;
//     location?: string;
//     phoneNumber?: string;
//     socialLinks?: {
//         github?: string;
//         linkedin?: string;
//         twitter?: string;
//         website?: string;
//     };
//     skills?: string[];
//     experience?: {
//         company: string;
//         title: string;
//         from: Date;
//         to?: Date;
//         description?: string;
//     }[];
//     updatedAt: Date;
// }
