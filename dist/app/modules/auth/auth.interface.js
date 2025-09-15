"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["SUPERADMIN"] = "superadmin";
})(UserRole || (exports.UserRole = UserRole = {}));
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
