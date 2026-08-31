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
exports.contactControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const contact_services_1 = require("./contact.services");
const createContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ipAddress = req.ip || ((_a = req.headers["x-forwarded-for"]) === null || _a === void 0 ? void 0 : _a.toString());
    const userAgent = req.headers["user-agent"];
    const result = yield contact_services_1.contactServices.createContact(Object.assign(Object.assign({}, req.body), { ipAddress,
        userAgent }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Your message has been sent successfully",
        data: result,
    });
}));
const getAllContacts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contact_services_1.contactServices.getAllContacts(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contacts retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield contact_services_1.contactServices.getSingleContact(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contact retrieved successfully",
        data: result,
    });
}));
const replyContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { replyMessage } = req.body;
    const result = yield contact_services_1.contactServices.replyContact(id, replyMessage);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reply sent successfully",
        data: result,
    });
}));
const updateContactStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, adminNotes } = req.body;
    const result = yield contact_services_1.contactServices.updateContactStatus(id, status, adminNotes);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contact status updated successfully",
        data: result,
    });
}));
const deleteContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield contact_services_1.contactServices.deleteContact(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contact deleted successfully",
        data: result,
    });
}));
exports.contactControllers = {
    createContact,
    getAllContacts,
    getSingleContact,
    replyContact,
    updateContactStatus,
    deleteContact,
};
