import { IMessage, PaginationOptions } from "./message.interface";
import messageModel from "./message.model";

const postMessage = async (payload: IMessage) => {
    const newMessage = await messageModel.create(payload);
    return newMessage;
};

const findAllMessages = async ({ page = 1, limit = 10 }: PaginationOptions = {}) => {
    const skip = (page - 1) * limit;

    const total = await messageModel.countDocuments();
    const messages = await messageModel.find().skip(skip).limit(limit);

    return {
        data: messages,
        meta: {
            page,
            limit,
            total,
        },
    };
};

export const messageServices = {
    postMessage,
    findAllMessages,
};
