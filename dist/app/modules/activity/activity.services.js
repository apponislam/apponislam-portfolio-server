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
exports.activityServices = exports.parseActionOrTypeFilter = exports.ACTIVITY_CATEGORIES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const activity_model_1 = require("./activity.model");
const activity_interface_1 = require("./activity.interface");
exports.ACTIVITY_CATEGORIES = {
    AUTH: [activity_interface_1.ActivityType.REGISTER, activity_interface_1.ActivityType.LOGIN, activity_interface_1.ActivityType.EMAIL_VERIFY, activity_interface_1.ActivityType.PASSWORD_RESET, activity_interface_1.ActivityType.PROFILE_UPDATE, activity_interface_1.ActivityType.PASSWORD_CHANGE, activity_interface_1.ActivityType.EMAIL_UPDATE, activity_interface_1.ActivityType.USER_DELETE],
    USER: [activity_interface_1.ActivityType.REGISTER, activity_interface_1.ActivityType.LOGIN, activity_interface_1.ActivityType.EMAIL_VERIFY, activity_interface_1.ActivityType.PASSWORD_RESET, activity_interface_1.ActivityType.PROFILE_UPDATE, activity_interface_1.ActivityType.PASSWORD_CHANGE, activity_interface_1.ActivityType.EMAIL_UPDATE, activity_interface_1.ActivityType.USER_DELETE],
    CONTACT: [activity_interface_1.ActivityType.CONTACT_SUBMIT, activity_interface_1.ActivityType.CONTACT_REPLY],
};
const parseActionOrTypeFilter = (input) => {
    if (!input)
        return null;
    let items = [];
    if (Array.isArray(input)) {
        items = input.map((i) => String(i).trim());
    }
    else if (typeof input === "string") {
        items = input.split(",").map((i) => i.trim());
    }
    else {
        items = [String(input).trim()];
    }
    const resolvedTypes = new Set();
    for (const item of items) {
        if (!item)
            continue;
        const upper = item.toUpperCase();
        if (upper === "ALL") {
            return null;
        }
        if (exports.ACTIVITY_CATEGORIES[upper]) {
            exports.ACTIVITY_CATEGORIES[upper].forEach((act) => resolvedTypes.add(act));
        }
        else if (Object.values(activity_interface_1.ActivityType).includes(upper)) {
            resolvedTypes.add(upper);
        }
        else {
            const match = Object.values(activity_interface_1.ActivityType).find((act) => act.toUpperCase() === upper);
            if (match) {
                resolvedTypes.add(match);
            }
        }
    }
    const typesArray = Array.from(resolvedTypes);
    if (typesArray.length === 0) {
        return null;
    }
    if (typesArray.length === 1) {
        return typesArray[0];
    }
    return { $in: typesArray };
};
exports.parseActionOrTypeFilter = parseActionOrTypeFilter;
const logActivity = (userId, action, details, metadata) => {
    // Fire and forget: don't await model creation, handle errors internally
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            console.error("Invalid userId for activity logging:", userId);
            return;
        }
        const activityData = {
            user: new mongoose_1.default.Types.ObjectId(userId),
            action,
            details,
        };
        if (metadata) {
            activityData.metadata = metadata;
        }
        // Create without await
        activity_model_1.ActivityModel.create(activityData).catch((err) => {
            console.error("Failed to log activity in background:", err);
        });
    }
    catch (error) {
        console.error("Failed to initiate activity logging in background:", error);
    }
};
const getAllActivities = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20, action, type, userId, startDate, endDate } = query;
    const filter = { isDeleted: false };
    if (userId && mongoose_1.default.Types.ObjectId.isValid(userId)) {
        filter.user = new mongoose_1.default.Types.ObjectId(userId);
    }
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate)
            filter.createdAt.$gte = new Date(startDate);
        if (endDate)
            filter.createdAt.$lte = new Date(endDate);
    }
    const targetActionOrType = action || type;
    if (targetActionOrType) {
        const actionFilter = (0, exports.parseActionOrTypeFilter)(targetActionOrType);
        if (actionFilter) {
            filter.action = actionFilter;
        }
    }
    const skip = (Number(page) - 1) * Number(limit);
    const activities = yield activity_model_1.ActivityModel.find(filter).populate("user", "name email phone profileImage").sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = yield activity_model_1.ActivityModel.countDocuments(filter);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
            hasNext: Number(page) * Number(limit) < total,
            hasPrev: Number(page) > 1,
        },
        data: activities,
    };
});
const deleteActivity = (activityId) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = yield activity_model_1.ActivityModel.findOneAndUpdate({ _id: activityId, isDeleted: false }, { $set: { isDeleted: true } }, { returnDocument: "after" });
    if (!activity) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Activity log not found");
    }
    return activity;
});
const clearActivities = (optionsOrStartDate, endDateParam, actionParam, typeParam, userIdParam) => __awaiter(void 0, void 0, void 0, function* () {
    let startDate;
    let endDate;
    let action;
    let type;
    let userId;
    let clearAll;
    if (typeof optionsOrStartDate === "object" && optionsOrStartDate !== null) {
        ({ startDate, endDate, action, type, userId, clearAll } = optionsOrStartDate);
    }
    else {
        startDate = optionsOrStartDate;
        endDate = endDateParam;
        action = actionParam;
        type = typeParam;
        userId = userIdParam;
    }
    const targetActionOrType = action || type;
    const filter = { isDeleted: false };
    if (userId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid userId specified");
        }
        filter.user = new mongoose_1.default.Types.ObjectId(userId);
    }
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate)
            filter.createdAt.$gte = new Date(startDate);
        if (endDate)
            filter.createdAt.$lte = new Date(endDate);
    }
    if (targetActionOrType) {
        const actionFilter = (0, exports.parseActionOrTypeFilter)(targetActionOrType);
        if (actionFilter) {
            filter.action = actionFilter;
        }
    }
    const result = yield activity_model_1.ActivityModel.updateMany(filter, { $set: { isDeleted: true } });
    const detailsMsg = [];
    if (startDate && endDate)
        detailsMsg.push(`from ${startDate} to ${endDate}`);
    else if (startDate)
        detailsMsg.push(`from ${startDate}`);
    else if (endDate)
        detailsMsg.push(`until ${endDate}`);
    if (targetActionOrType) {
        if (typeof targetActionOrType === "string") {
            detailsMsg.push(`with type/action "${targetActionOrType}"`);
        }
        else if (Array.isArray(targetActionOrType)) {
            detailsMsg.push(`with actions [${targetActionOrType.join(", ")}]`);
        }
    }
    if (userId)
        detailsMsg.push(`for user "${userId}"`);
    const filterDetail = detailsMsg.length > 0 ? ` (${detailsMsg.join(", ")})` : "";
    return {
        message: `Activity log cleared successfully${filterDetail}`,
        count: result.modifiedCount,
    };
});
exports.activityServices = {
    logActivity,
    getAllActivities,
    deleteActivity,
    clearActivities,
    parseActionOrTypeFilter: exports.parseActionOrTypeFilter,
};
