"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const contact_model_1 = require("./contact.model");
const emailTemplates_1 = require("../../../utils/emailTemplates");
const config_1 = __importDefault(require("../../config"));
const createContact = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contact_model_1.ContactModel.create(payload);
    // 1. Send Admin Notification Email
    const adminEmail = config_1.default.initialAdmin.email || "apponislamdev@gmail.com";
    const clientUrl = config_1.default.client_url || "https://www.apponislam.com";
    const replyUrl = `${clientUrl.replace(/\/$/, "")}/admin/reply/${result._id}`;
    (0, emailTemplates_1.sendContactNotificationEmail)(adminEmail, {
        name: result.name,
        email: result.email,
        message: result.message,
        social: result.social,
        replyUrl,
    });
    // 2. Send Auto Reply Email to User
    (0, emailTemplates_1.sendContactAutoReplyEmail)(result.email, {
        name: result.name,
    });
    return result;
});
const getAllContacts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20, status, search } = query;
    const filter = {};
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
    const [contacts, total] = yield Promise.all([
        contact_model_1.ContactModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        contact_model_1.ContactModel.countDocuments(filter),
    ]);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
            hasNext: Number(page) * Number(limit) < total,
            hasPrev: Number(page) > 1,
        },
        data: contacts,
    };
});
const getSingleContact = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield contact_model_1.ContactModel.findById(id);
    if (!contact) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Contact submission not found");
    }
    if (contact.status === "unread") {
        contact.status = "read";
        yield contact.save();
    }
    return contact;
});
const replyContact = (id, replyMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield contact_model_1.ContactModel.findById(id);
    if (!contact) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Contact submission not found");
    }
    const reply = {
        replyMessage,
        sentAt: new Date(),
    };
    contact.replies.push(reply);
    contact.status = "replied";
    contact.repliedAt = new Date();
    yield contact.save();
    // Send email response to user
    (0, emailTemplates_1.sendContactAdminReplyEmail)(contact.email, {
        recipientName: contact.name,
        replyMessage,
        originalMessage: contact.message,
    });
    return contact;
});
const updateContactStatus = (id, status, adminNotes) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = { status };
    if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
    }
    const contact = yield contact_model_1.ContactModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!contact) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Contact submission not found");
    }
    return contact;
});
const deleteContact = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield contact_model_1.ContactModel.findByIdAndDelete(id);
    if (!contact) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Contact submission not found");
    }
    return contact;
});
exports.contactServices = {
    createContact,
    getAllContacts,
    getSingleContact,
    replyContact,
    updateContactStatus,
    deleteContact,
};
