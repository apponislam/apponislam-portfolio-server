import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { contactServices } from "./contact.services";

const createContact = catchAsync(async (req: Request, res: Response) => {
    const ipAddress = req.ip || req.headers["x-forwarded-for"]?.toString();
    const userAgent = req.headers["user-agent"];

    const result = await contactServices.createContact({
        ...req.body,
        ipAddress,
        userAgent,
    });

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Your message has been sent successfully",
        data: result,
    });
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
    const result = await contactServices.getAllContacts(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Contacts retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getSingleContact = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await contactServices.getSingleContact(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Contact retrieved successfully",
        data: result,
    });
});

const replyContact = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { replyMessage } = req.body;

    const result = await contactServices.replyContact(id, replyMessage);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Reply sent successfully",
        data: result,
    });
});

const updateContactStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const result = await contactServices.updateContactStatus(id, status, adminNotes);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Contact status updated successfully",
        data: result,
    });
});

const deleteContact = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await contactServices.deleteContact(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Contact deleted successfully",
        data: result,
    });
});

export const contactControllers = {
    createContact,
    getAllContacts,
    getSingleContact,
    replyContact,
    updateContactStatus,
    deleteContact,
};
