"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    var _a;
    const errorSources = err.issues.map((issue) => {
        const lastPath = issue.path[issue.path.length - 1];
        return {
            path: lastPath !== undefined ? String(lastPath) : "",
            message: issue.message,
        };
    });
    return {
        statusCode: 400,
        message: ((_a = err.issues[0]) === null || _a === void 0 ? void 0 : _a.message) || "Validation error",
        errorSources,
    };
};
exports.default = handleZodError;
