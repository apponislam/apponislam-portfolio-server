import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { ContactModel } from "./contact.model";
import { IContact } from "./contact.interface";
import { sendContactNotificationEmail, sendContactAutoReplyEmail, sendContactAdminReplyEmail } from "../../../utils/emailTemplates";
import config from "../../config";

const createContact = async (payload: Partial<IContact>) => {
    const result = await ContactModel.create(payload);

    // 1. Send Admin Notification Email
    const adminEmail = config.initialAdmin.email || "apponislamdev@gmail.com";
    const clientUrl = config.client_url || "https://www.apponislam.com";
    const replyUrl = `${clientUrl.replace(/\/$/, "")}/admin/reply/${result._id}`;

    sendContactNotificationEmail(adminEmail, {
        name: result.name,
        email: result.email,
        message: result.message,
        social: result.social,
        replyUrl,
    });

    // 2. Send Auto Reply Email to User
    sendContactAutoReplyEmail(result.email, {
        name: result.name,
    });

    return result;
};

const getAllContacts = async (query: Record<string, any>) => {
    const { page = 1, limit = 20, status, search } = query;

    const filter: Record<string, any> = {};

    if (status) {
        filter.status = status;
    }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { message: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const contacts = await ContactModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await ContactModel.countDocuments(filter);

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
        data: contacts,
    };
};

const getSingleContact = async (id: string) => {
    const contact = await ContactModel.findById(id);
    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact submission not found");
    }

    if (contact.status === "unread") {
        contact.status = "read";
        await contact.save();
    }

    return contact;
};

const replyContact = async (id: string, replyMessage: string) => {
    const contact = await ContactModel.findById(id);
    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact submission not found");
    }

    const reply = {
        replyMessage,
        sentAt: new Date(),
    };

    contact.replies.push(reply);
    contact.status = "replied";
    contact.repliedAt = new Date();
    await contact.save();

    // Send email response to user
    sendContactAdminReplyEmail(contact.email, {
        recipientName: contact.name,
        replyMessage,
        originalMessage: contact.message,
    });

    return contact;
};

const updateContactStatus = async (id: string, status: IContact["status"], adminNotes?: string) => {
    const updateData: Record<string, any> = { status };
    if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
    }

    const contact = await ContactModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact submission not found");
    }
    return contact;
};

const deleteContact = async (id: string) => {
    const contact = await ContactModel.findByIdAndDelete(id);
    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact submission not found");
    }
    return contact;
};

export const contactServices = {
    createContact,
    getAllContacts,
    getSingleContact,
    replyContact,
    updateContactStatus,
    deleteContact,
};
