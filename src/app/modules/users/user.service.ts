import { IUser } from "./user.interface";
import { userModel } from "./user.model";

const registerUser = async (payload: IUser) => {
    const existingUser = await userModel.findOne({ email: payload.email });

    if (existingUser) {
        throw new Error("Email already exists. Please use a different email.");
    }

    const newUser = await userModel.create(payload);
    return newUser;
};

export const userServices = {
    registerUser,
};
