import slugify from "slugify";
import { AuthModel } from "../app/modules/auth/auth.model";

export const generateUniqueUsername = async (fullName: string): Promise<string> => {
    const baseUsername = slugify(fullName, { lower: true, strict: true });
    let username = baseUsername;
    let counter = 1;

    while (await AuthModel.findOne({ username })) {
        username = `${baseUsername}-${counter}`;
        counter++;
    }

    return username;
};
