import { IUser } from "./user.interface";
import { userModel } from "./user.model";
import bcrypt from "bcrypt";

const registerUser = async (payload: IUser) => {
    const { email, provider } = payload;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        if (existingUser.provider === provider) {
            return existingUser;
        } else {
            throw new Error(`Email is already registered with ${existingUser.provider}.`);
        }
    }

    if (provider !== "Email") {
        delete payload.password;
    }

    const newUser = await userModel.create(payload);
    return newUser;
};

const loginUser = async (email: string, password: string) => {
    // Find user
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");

    if (user.provider === "Email") {
        if (!user.password) throw new Error("Password not set");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Wrong password");
    }

    return user;
};

const getUserById = async (id: string) => {
    const user = await userModel.findById(id).lean();
    if (!user) throw new Error("User not found");
    delete user.password;
    return user;
};

export const userServices = {
    registerUser,
    loginUser,
    getUserById,
};
