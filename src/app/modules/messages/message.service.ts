import { IMessage } from "./message.interface";
import messageModel from "./message.model";

const postMessage = async (payload: IMessage) => {
    const newMessage = await messageModel.create(payload);
    return newMessage;
};

const findAllMessages = async () => {
    const messages = await messageModel.find();
    return messages;
};

export const messageServices = {
    postMessage,
    findAllMessages,
};
