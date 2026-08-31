import { Types } from "mongoose";

export enum ActivityType {
    REGISTER = "REGISTER",
    LOGIN = "LOGIN",
    EMAIL_VERIFY = "EMAIL_VERIFY",
    PASSWORD_RESET = "PASSWORD_RESET",
    PROFILE_UPDATE = "PROFILE_UPDATE",
    PASSWORD_CHANGE = "PASSWORD_CHANGE",
    EMAIL_UPDATE = "EMAIL_UPDATE",
    USER_DELETE = "USER_DELETE",
    CONTACT_SUBMIT = "CONTACT_SUBMIT",
    CONTACT_REPLY = "CONTACT_REPLY",
}

export interface Activity {
    user: Types.ObjectId;
    action: ActivityType;
    details: string;
    metadata?: Record<string, any>;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
